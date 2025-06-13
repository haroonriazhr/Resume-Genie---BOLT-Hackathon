import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { resumeService } from '@/services/resume-service';
import { Resume } from '@/types';
import ResumePreview from '@/components/resume-builder/resume-preview';
import DownloadButton from '@/components/download-button';

export default function ResumeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedResume = await resumeService.getResume(id);
        setResume(fetchedResume);
      } catch (error) {
        console.error('Error fetching resume:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load resume',
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, toast, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await resumeService.deleteResume(id);
      toast({
        title: 'Resume deleted',
        description: 'Your resume has been deleted successfully',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete resume',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <h2 className="text-2xl font-bold mb-4">Resume not found</h2>
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{resume.title}</h1>
            <p className="text-muted-foreground text-sm">
              Last updated: {new Date(resume.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <DownloadButton
            resumeId={resume.id}
            templateId={resume.templateId}
            variant="outline"
            size="sm"
          />
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/builder?id=${resume.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="mx-auto max-w-3xl bg-white rounded-md shadow-md overflow-hidden">
        <ResumePreview 
          content={resume.content} 
          templateId={resume.templateId} 
          scale={1}
        />
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}