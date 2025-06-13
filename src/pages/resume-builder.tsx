import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { resumeService } from '@/services/resume-service';
import { Resume, ResumeContent } from '@/types';
import PersonalInfoForm from '@/components/resume-builder/personal-info-form';
import ProfessionalSummaryForm from '@/components/resume-builder/professional-summary-form';
import WorkExperienceForm from '@/components/resume-builder/work-experience-form';
import EducationForm from '@/components/resume-builder/education-form';
import SkillsForm from '@/components/resume-builder/skills-form';
import AchievementsForm from '@/components/resume-builder/achievements-form';
import ProjectsForm from '@/components/resume-builder/projects-form';
import ResumePreview from '@/components/resume-builder/resume-preview';
import DownloadButton from '@/components/download-button';

const defaultResumeContent: ResumeContent = {
  personalInfo: {
    fullName: '',
    email: '',
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
};

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeContent, setResumeContent] = useState<ResumeContent>(defaultResumeContent);
  const [activeTab, setActiveTab] = useState('personal-info');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (resumeId) {
        try {
          setLoading(true);
          const fetchedResume = await resumeService.getResume(resumeId);
          setResume(fetchedResume);
          setResumeContent(fetchedResume.content);
          setResumeTitle(fetchedResume.title);
        } catch (error) {
          console.error('Error fetching resume:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load resume data',
          });
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResume();
  }, [resumeId, toast, navigate]);

  // Setup auto-save
  useEffect(() => {
    // Clear previous timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new timer for auto-save
    if (resume && !saving) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 30000); // Auto-save every 30 seconds
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [resumeContent, resumeTitle, resume]);

  const updateResumeContent = <K extends keyof ResumeContent>(
    section: K,
    data: ResumeContent[K]
  ) => {
    setResumeContent((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSave = async (isAutoSave = false) => {
    if (!resume && !resumeId) {
      // Create new resume
      try {
        setSaving(true);
        const newResume = await resumeService.createResume('professional', {
          title: resumeTitle,
          content: resumeContent,
        });
        setResume(newResume);
        navigate(`/builder?id=${newResume.id}`, { replace: true });
        
        if (!isAutoSave) {
          toast({
            title: 'Resume created',
            description: 'Your resume has been created successfully',
          });
        }
      } catch (error) {
        console.error('Error creating resume:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create resume',
        });
      } finally {
        setSaving(false);
      }
    } else if (resume) {
      // Update existing resume
      try {
        setSaving(true);
        const updatedResume = await resumeService.updateResume(resume.id, {
          title: resumeTitle,
          content: resumeContent,
        });
        setResume(updatedResume);
        
        if (!isAutoSave) {
          toast({
            title: 'Resume saved',
            description: 'Your changes have been saved',
          });
        }
      } catch (error) {
        console.error('Error updating resume:', error);
        if (!isAutoSave) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to save resume',
          });
        }
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="resume-title" className="text-muted-foreground text-sm">Resume Title</Label>
          <Input
            id="resume-title"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="h-10 text-lg font-semibold"
            placeholder="Resume Title"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleSave()} 
            disabled={saving}
            className="min-w-24"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
          
          <DownloadButton
            resumeContent={resumeContent}
            templateId={resume?.templateId || 'professional'}
            filename={`${resumeTitle.replace(/\s+/g, '_')}.pdf`}
            variant="outline"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
              <TabsTrigger value="professional-summary">Summary</TabsTrigger>
              <TabsTrigger value="work-experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <div className="mt-6 space-y-6">
              <TabsContent value="personal-info" className="m-0">
                <PersonalInfoForm
                  data={resumeContent.personalInfo}
                  onChange={(data) => updateResumeContent('personalInfo', data)}
                />
              </TabsContent>
              <TabsContent value="professional-summary" className="m-0">
                <ProfessionalSummaryForm
                  data={resumeContent.professionalSummary}
                  onChange={(data) => updateResumeContent('professionalSummary', data)}
                />
              </TabsContent>
              <TabsContent value="work-experience" className="m-0">
                <WorkExperienceForm
                  data={resumeContent.workExperience}
                  onChange={(data) => updateResumeContent('workExperience', data)}
                />
              </TabsContent>
              <TabsContent value="education" className="m-0">
                <EducationForm
                  data={resumeContent.education}
                  onChange={(data) => updateResumeContent('education', data)}
                />
              </TabsContent>
              <TabsContent value="skills" className="m-0">
                <SkillsForm
                  data={resumeContent.skills}
                  onChange={(data) => updateResumeContent('skills', data)}
                />
              </TabsContent>
              <TabsContent value="projects" className="m-0">
                <ProjectsForm
                  data={resumeContent.projects}
                  onChange={(data) => updateResumeContent('projects', data)}
                />
              </TabsContent>
              <TabsContent value="achievements" className="m-0">
                <AchievementsForm
                  data={resumeContent.achievements}
                  onChange={(data) => updateResumeContent('achievements', data)}
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ['personal-info', 'professional-summary', 'work-experience', 'education', 'skills', 'projects', 'achievements'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={activeTab === 'personal-info'}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                const tabs = ['personal-info', 'professional-summary', 'work-experience', 'education', 'skills', 'projects', 'achievements'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                } else {
                  handleSave();
                }
              }}
            >
              {activeTab === 'achievements' ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-20">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="font-semibold">Preview</h3>
                <DownloadButton
                  resumeContent={resumeContent}
                  templateId={resume?.templateId || 'professional'}
                  filename={`${resumeTitle.replace(/\s+/g, '_')}.pdf`}
                  variant="outline"
                  size="sm"
                />
              </div>
              <div className="p-0 overflow-hidden">
                <div ref={resumePreviewRef} className="bg-white mx-auto max-h-[calc(100vh-12rem)] overflow-y-auto">
                  <ResumePreview content={resumeContent} templateId={resume?.templateId || 'professional'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}