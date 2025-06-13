import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeService } from '@/services/resume-service';
import LoadingScreen from '@/components/loading-screen';
import { useToast } from '@/hooks/use-toast';
import { Resume } from '@/types';
import ResumePreview from '@/components/resume-builder/resume-preview';
import DownloadButton from '@/components/download-button';
import { Button } from '@/components/ui/button';

export default function DownloadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      setError('No resume ID provided.');
      setLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        const fetchedResume = await resumeService.getResumeById(id);
        if (fetchedResume) {
          setResume(fetchedResume);
        } else {
          setError('Resume not found.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Failed to load resume',
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, toast]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">Resume Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested resume could not be found.</p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Download Resume</h1>
        <DownloadButton
          resumeContent={resume.content}
          templateId={resume.templateId}
          filename={`${resume.title}.pdf`}
          targetRef={resumePreviewRef}
        />
      </div>
      <div ref={resumePreviewRef}>
        <ResumePreview
          resumeData={resume.content}
          templateId={resume.templateId}
        />
      </div>
    </div>
  );
}