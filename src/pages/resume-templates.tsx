import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, Edit, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { resumeService } from '@/services/resume-service';
import { ResumeTemplate } from '@/types';
import ResumePreview from '@/components/resume-builder/resume-preview';
import DownloadButton from '@/components/download-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const templates: ResumeTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and professional design perfect for corporate environments and traditional industries',
    category: 'Corporate',
    atsScore: 95,
    features: ['ATS Optimized', 'Clean Layout', 'Professional Fonts'],
    premium: false,
    popular: true,
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    description: 'Contemporary design with subtle accents for senior positions and leadership roles',
    category: 'Executive',
    atsScore: 92,
    features: ['Executive Style', 'Modern Design', 'Leadership Focus'],
    premium: false,
    popular: true,
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Stylish design for creative professionals, designers, and marketing roles',
    category: 'Creative',
    atsScore: 88,
    features: ['Creative Layout', 'Visual Appeal', 'Portfolio Ready'],
    premium: false,
    popular: false,
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Ultra-clean minimalist design with maximum focus on content and readability',
    category: 'Minimalist',
    atsScore: 98,
    features: ['Maximum ATS Score', 'Ultra Clean', 'Content Focus'],
    premium: false,
    popular: true,
  },
  {
    id: 'tech',
    name: 'Tech Professional',
    description: 'Modern design optimized for technology roles and software development positions',
    category: 'Technology',
    atsScore: 94,
    features: ['Tech Optimized', 'Skills Highlight', 'Project Focus'],
    premium: false,
    popular: false,
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Formal design perfect for academic positions, research roles, and educational institutions',
    category: 'Academic',
    atsScore: 96,
    features: ['Academic Format', 'Research Focus', 'Publication Ready'],
    premium: false,
    popular: false,
  },
  {
    id: 'executive',
    name: 'Executive Premium',
    description: 'Sophisticated design for C-level executives and senior management positions',
    category: 'Executive',
    atsScore: 90,
    features: ['Executive Premium', 'Leadership Style', 'Premium Design'],
    premium: false,
    popular: false,
  },
  {
    id: 'startup',
    name: 'Startup Innovator',
    description: 'Dynamic design for startup environments and innovative company cultures',
    category: 'Startup',
    atsScore: 89,
    features: ['Startup Culture', 'Innovation Focus', 'Dynamic Layout'],
    premium: false,
    popular: false,
  },
  {
    id: 'consultant',
    name: 'Business Consultant',
    description: 'Professional design tailored for consulting roles and business advisory positions',
    category: 'Consulting',
    atsScore: 93,
    features: ['Consulting Style', 'Business Focus', 'Client Ready'],
    premium: false,
    popular: false,
  },
];

const categories = ['All', 'Corporate', 'Executive', 'Creative', 'Technology', 'Academic', 'Minimalist', 'Startup', 'Consulting'];

export default function ResumeTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'All' || template.category === selectedCategory
  );

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handlePreviewTemplate = (templateId: string) => {
    setPreviewTemplate(templateId);
  };

  const handleCreateResume = async () => {
    if (!selectedTemplate) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a template first',
      });
      return;
    }

    try {
      const template = templates.find(t => t.id === selectedTemplate);
      
      // Create resume with the selected template ID
      const resume = await resumeService.createResume(selectedTemplate);
      navigate(`/builder?id=${resume.id}`);
      
      toast({
        title: 'Resume created',
        description: `Your new resume using the ${template?.name} template has been created.`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create resume. Please try again.',
      });
    }
  };

  const sampleContent = {
    personalInfo: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      linkedin: 'linkedin.com/in/johnsmith',
      website: 'johnsmith.dev',
    },
    professionalSummary: 'Experienced professional with 8+ years of expertise in project management and team leadership. Proven track record of delivering complex projects on time and within budget while maintaining high quality standards.',
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        jobTitle: 'Senior Project Manager',
        location: 'New York, NY',
        startDate: '2020-01-01',
        endDate: null,
        current: true,
        description: '• Led cross-functional teams of 15+ members to deliver enterprise software solutions\n• Increased project delivery efficiency by 35% through process optimization\n• Managed $2M+ project budgets and maintained 98% client satisfaction rate'
      },
      {
        company: 'Digital Innovations LLC',
        jobTitle: 'Project Coordinator',
        location: 'New York, NY',
        startDate: '2018-03-01',
        endDate: '2019-12-31',
        current: false,
        description: '• Coordinated multiple concurrent projects with budgets up to $500K\n• Implemented agile methodologies resulting in 25% faster delivery times\n• Collaborated with stakeholders to define project requirements and scope'
      }
    ],
    education: [
      {
        school: 'New York University',
        degree: 'Master of Business Administration',
        fieldOfStudy: 'Project Management',
        location: 'New York, NY',
        startDate: '2016-09-01',
        endDate: '2018-05-31',
        current: false,
        description: 'Concentration in Operations Management and Leadership'
      }
    ],
    skills: ['Project Management', 'Team Leadership', 'Agile Methodologies', 'Budget Management', 'Stakeholder Communication', 'Risk Assessment', 'Process Optimization', 'Strategic Planning'],
    achievements: [
      {
        title: 'Project Manager of the Year',
        date: '2023-12-01',
        description: 'Recognized for outstanding performance in delivering complex enterprise projects'
      }
    ],
    projects: [
      {
        title: 'Enterprise CRM Implementation',
        description: 'Led the implementation of a company-wide CRM system serving 500+ users',
        technologies: ['Salesforce', 'Data Migration', 'Change Management'],
        startDate: '2023-01-01',
        endDate: '2023-08-31',
        current: false
      }
    ],
    certifications: [],
    languages: []
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Professional Resume Templates
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose from our collection of ATS-optimized, professionally designed templates. 
          All templates are completely free and crafted to help you stand out while ensuring compatibility with applicant tracking systems.
        </p>
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
          <Check className="h-4 w-4" />
          All Templates 100% Free
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 overflow-hidden h-[600px] flex flex-col",
              selectedTemplate === template.id
                ? "border-primary shadow-lg scale-[1.02]"
                : "border-transparent hover:border-muted-foreground/20"
            )}
            onClick={() => handleSelectTemplate(template.id)}
          >
            {/* Template Preview - Now takes up most of the card */}
            <div className="flex-1 bg-card relative overflow-hidden">
              <div className="absolute inset-0 p-2">
                <div className="w-full h-full overflow-hidden rounded border">
                  <div className="transform scale-[0.28] origin-top-left w-[357%] h-[357%]">
                    <ResumePreview 
                      content={sampleContent} 
                      templateId={template.id}
                      scale={1}
                    />
                  </div>
                </div>
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewTemplate(template.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template.id);
                    handleCreateResume();
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {template.popular && (
                  <Badge variant="default" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Free
                </Badge>
              </div>

              {/* ATS Score */}
              <div className="absolute top-3 right-3">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-semibold",
                    template.atsScore >= 95 ? "bg-green-50 text-green-700 border-green-200" :
                    template.atsScore >= 90 ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-yellow-50 text-yellow-700 border-yellow-200"
                  )}
                >
                  ATS {template.atsScore}%
                </Badge>
              </div>

              {/* Selection indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground rounded-full p-2">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </div>

            {/* Card Content - Compact info section */}
            <CardContent className="p-4 bg-card border-t">
              <div className="space-y-3">
                <div>
                  <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.features.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewTemplate(template.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DownloadButton
                      resumeContent={sampleContent}
                      templateId={template.id}
                      filename={`${template.name}_Sample.pdf`}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Download Sample</span>
                    </DownloadButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        <Button
          variant="outline"
          size="lg"
          disabled={!selectedTemplate}
          onClick={() => selectedTemplate && handlePreviewTemplate(selectedTemplate)}
        >
          <Eye className="mr-2 h-5 w-5" />
          Preview Selected
        </Button>
        <Button
          size="lg"
          onClick={handleCreateResume}
          disabled={!selectedTemplate}
          className="min-w-[200px]"
        >
          <Edit className="mr-2 h-5 w-5" />
          Create Resume
        </Button>
      </div>

      {/* Template Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {templates.find(t => t.id === previewTemplate)?.name} Template Preview
           </DialogTitle>
           <DialogDescription>
             This is a preview of the {templates.find(t => t.id === previewTemplate)?.name} template. You can scroll to see the full resume.
           </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[calc(80vh-120px)]">
            {previewTemplate && (
              <div ref={previewRef} className="bg-background rounded-lg">
                <ResumePreview
                  content={sampleContent}
                  templateId={previewTemplate}
                  scale={0.7}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setPreviewTemplate(null)}
            >
              Close
            </Button>
            <DownloadButton
              resumeContent={sampleContent}
              templateId={previewTemplate || 'professional'}
              filename={`${templates.find(t => t.id === previewTemplate)?.name}_Sample.pdf`}
              variant="outline"
              targetRef={previewRef}
            >
              Download Sample
            </DownloadButton>
            <Button
              onClick={() => {
                if (previewTemplate) {
                  setSelectedTemplate(previewTemplate);
                  setPreviewTemplate(null);
                  handleCreateResume();
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Use This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}