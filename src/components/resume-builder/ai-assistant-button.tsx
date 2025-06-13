import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/ai-service';

interface AiAssistantButtonProps {
  section: string;
  onSuggestion: (content: string) => void;
  description?: string;
  defaultPrompt?: string;
}

export default function AiAssistantButton({
  section,
  onSuggestion,
  description,
  defaultPrompt,
}: AiAssistantButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt || '');
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const suggestion = await aiService.generateContent(section, prompt);
      onSuggestion(suggestion);
      setOpen(false);

      // Check if this looks like sample content (fallback was used)
      const isSampleContent = suggestion.includes('•') ||
                             suggestion.includes('Experienced professional') ||
                             suggestion.includes('Results-driven professional');

      // Determine which AI service was likely used based on console logs
      const hasGeminiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
      const hasDeepSeekKey = !!import.meta.env.VITE_DEEPSEEK_API_KEY;

      let description = 'AI-generated content has been added to your resume.';

      if (isSampleContent) {
        description = 'Sample content has been added. For AI-generated content, please check your API configuration.';
      } else if (hasGeminiKey) {
        description = 'Content generated using Google Gemini AI and added to your resume.';
      } else if (hasDeepSeekKey) {
        description = 'Content generated using DeepSeek AI and added to your resume.';
      }

      toast({
        title: 'Content generated',
        description,
      });
    } catch (error) {
      console.error('Generate content error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate content. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Resume Assistant</DialogTitle>
          <DialogDescription>
            {description || 'Let AI help you write professional resume content.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Describe your experience, skills, or what you'd like to highlight..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}