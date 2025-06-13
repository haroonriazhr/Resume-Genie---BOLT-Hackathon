import { useState, RefObject, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { resumeService } from '@/services/resume-service';
import { pdfService } from '@/services/pdf-service';
import { ResumeContent } from '@/types';

interface DownloadButtonProps {
  resumeId?: string;
  resumeContent?: ResumeContent;
  templateId?: string;
  filename?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
  targetRef?: RefObject<HTMLElement>;
}

export default function DownloadButton({
  resumeId,
  resumeContent,
  templateId = 'professional',
  filename,
  variant = 'default',
  size = 'default',
  className,
  children,
  targetRef
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const downloadInProgress = useRef(false);

  const handleDownload = async () => {
    if (downloadInProgress.current) return;
    downloadInProgress.current = true;
    setIsDownloading(true);
    setProgress(0);

    try {
      let contentToDownload = resumeContent;

      if (!contentToDownload && resumeId) {
        const resume = await resumeService.getResume(resumeId);
        if (resume) {
          contentToDownload = resume.content;
          if (!templateId) {
            templateId = resume.templateId;
          }
        }
      }

      if (!contentToDownload) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No resume data available for download.',
        });
        return;
      }

      await pdfService.downloadResumePDF(
        contentToDownload,
        templateId,
        { filename },
        (progressValue) => setProgress(progressValue),
        targetRef?.current
      );

      toast({
        title: 'Download complete',
        description: 'Your resume has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to download resume. Please try again.',
      });
    } finally {
      setIsDownloading(false);
      setProgress(0);
      downloadInProgress.current = false;
    }
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={isDownloading}
        className={className}
      >
        {isDownloading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            {children || 'Download PDF'}
          </>
        )}
      </Button>
      
      {isDownloading && progress > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}
