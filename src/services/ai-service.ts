import { supabase } from '@/lib/supabase';
import { addBreadcrumb, captureException } from '@/lib/sentry';

/**
 * Generate sample content based on section and prompt
 */
const generateSampleContent = (section: string, prompt: string): string => {
  const sampleContent: Record<string, string[]> = {
    summary: [
      "Experienced professional with a proven track record of delivering high-quality results in fast-paced environments. Strong analytical and problem-solving skills with excellent communication abilities.",
      "Results-driven professional with expertise in project management and team leadership. Passionate about innovation and continuous improvement with a focus on achieving organizational goals.",
      "Dedicated professional with strong technical skills and business acumen. Experienced in cross-functional collaboration and driving process improvements to enhance operational efficiency."
    ],
    experience: [
      "• Led cross-functional teams to deliver projects on time and within budget\n• Implemented process improvements that increased efficiency by 25%\n• Collaborated with stakeholders to define requirements and ensure alignment",
      "• Managed multiple projects simultaneously while maintaining high quality standards\n• Developed and executed strategic initiatives that drove business growth\n• Mentored junior team members and facilitated knowledge sharing sessions",
      "• Analyzed complex data sets to identify trends and provide actionable insights\n• Streamlined workflows and reduced processing time by 30%\n• Built strong relationships with clients and internal stakeholders"
    ],
    skills: [
      "Project Management, Data Analysis, Team Leadership, Strategic Planning, Process Improvement, Communication, Problem Solving, Microsoft Office, Agile Methodologies",
      "Leadership, Analytics, Strategic Thinking, Cross-functional Collaboration, Process Optimization, Stakeholder Management, Technical Writing, Presentation Skills",
      "Team Management, Business Analysis, Quality Assurance, Risk Management, Customer Relations, Documentation, Training, Performance Monitoring"
    ]
  };

  const templates = sampleContent[section.toLowerCase()] || sampleContent.summary;
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  return randomTemplate;
};

/**
 * Try Gemini API, fallback to sample content if it fails
 */
const generateContent = async (section: string, prompt: string) => {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  try {
    addBreadcrumb('Starting AI content generation', 'ai', 'info');
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    // If no API key, use sample content
    if (!geminiApiKey && !deepseekApiKey) {
      console.log('No API key configured, using sample content');
      addBreadcrumb('No API key configured, using sample content', 'ai', 'warning');
      return generateSampleContent(section, prompt);
    }

    // Try Gemini API first (if available)
    if (geminiApiKey) {
      const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

      for (const model of models) {
        try {
          console.log(`Using Gemini API (${model}) for content generation`);
          addBreadcrumb(`Trying Gemini API with model: ${model}`, 'ai');

          const systemPrompt = `You are a professional resume writer. Generate compelling resume content for the ${section} section. Focus on being concise, professional, and highlighting achievements with measurable results where possible. Return only the content without any additional formatting or explanations.`;

          const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

          const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: fullPrompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 500,
              }
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `Gemini API request failed with status ${response.status}`;

            // If model not found, try next model
            if (errorMessage.includes('not found') || errorMessage.includes('not supported')) {
              console.log(`Model ${model} not available, trying next model`);
              continue;
            }

            // If it's a quota issue, fall back to DeepSeek or sample content
            if (errorMessage.toLowerCase().includes('quota') ||
                errorMessage.toLowerCase().includes('limit') ||
                response.status === 429) {
              console.log('Gemini quota issue, trying fallback');
              throw new Error('QUOTA_EXCEEDED');
            }

            throw new Error(errorMessage);
          }

          const data = await response.json();
          const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!suggestion) {
            console.log(`No content from Gemini API (${model}), trying next model`);
            continue;
          }

          console.log(`Successfully generated content with Gemini API (${model})`);
          addBreadcrumb(`Successfully generated content with Gemini API (${model})`, 'ai', 'info');
          return suggestion.trim();
        } catch (error) {
          console.error(`Gemini API Error (${model}):`, error);
          addBreadcrumb(`Gemini API Error (${model}): ${error instanceof Error ? error.message : 'Unknown error'}`, 'ai', 'error');

          // If this is the last model and it failed, break out of loop
          if (model === models[models.length - 1]) {
            // If Gemini fails completely, try DeepSeek as fallback
            if (deepseekApiKey && error instanceof Error && !error.message.includes('Not authenticated')) {
              console.log('All Gemini models failed, trying DeepSeek as fallback');
              break; // Exit loop to try DeepSeek
            } else {
              // For quota/auth errors, go straight to sample content
              console.log('Gemini error, falling back to sample content:', error instanceof Error ? error.message : 'Unknown error');
              return generateSampleContent(section, prompt);
            }
          }
          // Continue to next model
        }
      }
    }

    // Fallback to DeepSeek API if Gemini failed or not available
    if (deepseekApiKey) {
      try {
        console.log('Using DeepSeek API as fallback');
        addBreadcrumb('Trying DeepSeek API as fallback', 'ai');

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `You are a professional resume writer. Generate compelling resume content for the ${section} section. Focus on being concise, professional, and highlighting achievements with measurable results where possible. Return only the content without any additional formatting or explanations.`,
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || `DeepSeek API request failed with status ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const suggestion = data.choices?.[0]?.message?.content;

        if (!suggestion) {
          throw new Error('No content from DeepSeek API');
        }

        console.log('Successfully generated content with DeepSeek API');
        addBreadcrumb('Successfully generated content with DeepSeek API', 'ai', 'info');
        return suggestion.trim();
      } catch (error) {
        console.error('DeepSeek API Error:', error);
        addBreadcrumb(`DeepSeek API Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'ai', 'error');
        captureException(error as Error, { section, prompt, service: 'deepseek' });
        console.log('DeepSeek failed, falling back to sample content');
      }
    }

    // Final fallback to sample content
    console.log('All APIs failed, using sample content');
    addBreadcrumb('All AI APIs failed, using sample content', 'ai', 'warning');
    return generateSampleContent(section, prompt);

  } catch (error) {
    console.error('AI service error:', error);
    captureException(error as Error, { section, prompt, operation: 'generateContent' });
    addBreadcrumb(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'ai', 'error');
    
    // Always fallback to sample content on any error
    return generateSampleContent(section, prompt);
  }
};

export const aiService = {
   generateContent,
};