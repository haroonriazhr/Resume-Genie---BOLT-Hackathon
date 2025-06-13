import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Edit, 
  FileText, 
  Loader2, 
  PlusCircle, 
  Trash2 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useAuth } from '@/context/auth-context';
import { resumeService } from '@/services/resume-service';
import { Resume } from '@/types';
import { isFetchError } from '@/lib/supabase';
import DownloadButton from '@/components/download-button';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        if (user) {
          const userResumes = await resumeService.getUserResumes(user.id);
          setResumes(userResumes);
        }
      } catch (error) {
        console.error('Error fetching resumes:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: isFetchError(error) 
            ? 'Unable to connect to the server. Please check your internet connection.'
            : 'Failed to load your resumes',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [user, toast]);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    
    try {
      await resumeService.deleteResume(resumeToDelete);
      setResumes(resumes.filter(resume => resume.id !== resumeToDelete));
      toast({
        title: 'Resume deleted',
        description: 'Your resume has been deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: isFetchError(error)
          ? 'Unable to connect to the server. Please check your internet connection.'
          : 'Failed to delete resume',
      });
    } finally {
      setResumeToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
      
      if (diffInHours < 24) {
        // If less than 24 hours ago, show relative time
        if (diffInHours < 1) {
          const minutes = Math.floor(diffInHours * 60);
          return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }
        return `${Math.floor(diffInHours)} hour${diffInHours !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      return 'Date not available';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your resumes and create new ones
          </p>
        </div>
        <Link to="/builder">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Resume
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : resumes.length > 0 ? (
          resumes.map((resume) => (
            <Card key={resume.id} className="group overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold truncate">
                    {resume.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                          <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/resume/${resume.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/builder?id=${resume.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setResumeToDelete(resume.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-xs flex items-center mt-1">
                  <Clock className="mr-1 h-3 w-3" />
                  Updated {formatDate(resume.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="h-32 bg-muted rounded-md overflow-hidden">
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    <FileText className="h-10 w-10 opacity-20" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/resume/${resume.id}`}>
                    Preview
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <DownloadButton
                    resumeId={resume.id}
                    templateId={resume.templateId}
                    variant="outline"
                    size="sm"
                  >
                    Download
                  </DownloadButton>
                  <Button size="sm" asChild>
                    <Link to={`/builder?id=${resume.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-dashed">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-60">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <CardTitle className="mb-2">No resumes yet</CardTitle>
                <CardDescription className="mb-4">
                  Create your first resume to get started
                </CardDescription>
                <Link to="/builder">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <AlertDialog open={!!resumeToDelete} onOpenChange={(open) => !open && setResumeToDelete(null)}>
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
              onClick={handleDeleteResume}
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