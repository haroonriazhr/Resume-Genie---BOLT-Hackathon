import { Resume } from '@/types';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { pdfService } from './pdf-service';
import { addBreadcrumb, captureException } from '@/lib/sentry';

export const resumeService = {
  // Get all resumes for a user
  getUserResumes: async (userId: string): Promise<Resume[]> => {
    try {
      addBreadcrumb('Fetching user resumes', 'resume');
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      addBreadcrumb(`Fetched ${data.length} resumes`, 'resume');
      return data.map(resume => ({
        id: resume.id,
        userId: resume.user_id,
        title: resume.title,
        templateId: resume.template_id || 'professional', // Use stored template_id
        content: JSON.parse(resume.content),
        createdAt: resume.created_at,
        updatedAt: resume.updated_at || resume.created_at,
      }));
    } catch (error) {
      console.error('Error fetching resumes:', error);
      captureException(error as Error, { userId, operation: 'getUserResumes' });
      throw handleSupabaseError(error);
    }
  },
  
  // Get a specific resume by ID
  getResume: async (id: string): Promise<Resume> => {
    try {
      addBreadcrumb('Fetching resume', 'resume');
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      addBreadcrumb('Resume fetched successfully', 'resume');
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        templateId: data.template_id || 'professional', // Use stored template_id
        content: JSON.parse(data.content),
        createdAt: data.created_at,
        updatedAt: data.updated_at || data.created_at,
      };
    } catch (error) {
      console.error('Error fetching resume:', error);
      captureException(error as Error, { resumeId: id, operation: 'getResume' });
      throw handleSupabaseError(error);
    }
  },
  
  // Create a new resume
  createResume: async (templateId: string, data?: Partial<Resume>): Promise<Resume> => {
    try {
      addBreadcrumb('Creating new resume', 'resume');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw authError;
      }
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const resumeData = {
        user_id: user.id,
        title: data?.title || 'Untitled Resume',
        template_id: templateId, // Store the template ID
        content: JSON.stringify(data?.content || {
          personalInfo: {
            fullName: '',
            email: user.email || '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            linkedin: '',
            website: '',
          },
          professionalSummary: '',
          workExperience: [],
          education: [],
          skills: [],
          certifications: [],
          languages: [],
          achievements: [],
          projects: [],
        }),
      };
      
      const { data: resume, error } = await supabase
        .from('resumes')
        .insert(resumeData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      addBreadcrumb('Resume created successfully', 'resume');
      return {
        id: resume.id,
        userId: resume.user_id,
        title: resume.title,
        templateId: resume.template_id || templateId,
        content: JSON.parse(resume.content),
        createdAt: resume.created_at,
        updatedAt: resume.updated_at || resume.created_at,
      };
    } catch (error) {
      console.error('Error creating resume:', error);
      captureException(error as Error, { templateId, operation: 'createResume' });
      throw handleSupabaseError(error);
    }
  },
  
  // Update an existing resume
  updateResume: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    try {
      addBreadcrumb('Updating resume', 'resume');
      const updateData: { [key: string]: string | undefined } = {};

      // Map camelCase to snake_case for database
      if (data.title !== undefined) updateData.title = data.title;
      if (data.templateId !== undefined) updateData.template_id = data.templateId;
      if (data.content !== undefined) updateData.content = JSON.stringify(data.content);
      
      const { data: resume, error } = await supabase
        .from('resumes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      addBreadcrumb('Resume updated successfully', 'resume');
      return {
        id: resume.id,
        userId: resume.user_id,
        title: resume.title,
        templateId: resume.template_id || 'professional',
        content: JSON.parse(resume.content),
        createdAt: resume.created_at,
        updatedAt: resume.updated_at || resume.created_at,
      };
    } catch (error) {
      console.error('Error updating resume:', error);
      captureException(error as Error, { resumeId: id, operation: 'updateResume' });
      throw handleSupabaseError(error);
    }
  },
  
  // Delete a resume
  deleteResume: async (id: string): Promise<void> => {
    try {
      addBreadcrumb('Deleting resume', 'resume');
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      addBreadcrumb('Resume deleted successfully', 'resume');
    } catch (error) {
      console.error('Error deleting resume:', error);
      captureException(error as Error, { resumeId: id, operation: 'deleteResume' });
      throw handleSupabaseError(error);
    }
  },
  
  // Download resume as PDF
  downloadResume: async (id: string): Promise<void> => {
    try {
      addBreadcrumb('Starting resume download', 'resume');
      // Get the resume data
      const resume = await resumeService.getResume(id);
      
      // Generate and download PDF
      await pdfService.downloadResumePDF(
        resume.content,
        resume.templateId,
        {
          filename: `${resume.title.replace(/\s+/g, '_')}.pdf`
        }
      );
      
      addBreadcrumb('Resume download completed', 'resume');
    } catch (error) {
      console.error('Error downloading resume:', error);
      captureException(error as Error, { resumeId: id, operation: 'downloadResume' });
      throw new Error('Failed to download resume. Please try again.');
    }
  },

  // Download resume with progress callback
  downloadResumeWithProgress: async (
    id: string, 
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    try {
      addBreadcrumb('Starting resume download with progress', 'resume');
      if (onProgress) onProgress(0);
      
      // Get the resume data
      const resume = await resumeService.getResume(id);
      if (onProgress) onProgress(30);
      
      // Generate and download PDF with progress
      await pdfService.downloadResumePDF(
        resume.content,
        resume.templateId,
        {
          filename: `${resume.title.replace(/\s+/g, '_')}.pdf`
        },
        (pdfProgress) => {
          // Map PDF progress to overall progress (30-100%)
          const overallProgress = 30 + (pdfProgress * 0.7);
          if (onProgress) onProgress(overallProgress);
        }
      );
      
      addBreadcrumb('Resume download with progress completed', 'resume');
    } catch (error) {
      console.error('Error downloading resume:', error);
      captureException(error as Error, { resumeId: id, operation: 'downloadResumeWithProgress' });
      throw new Error('Failed to download resume. Please try again.');
    }
  },
};