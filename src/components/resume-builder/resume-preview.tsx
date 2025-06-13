import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ResumeContent } from '@/types';

interface ResumePreviewProps {
  content: ResumeContent;
  templateId: string;
  scale?: number;
}

export default function ResumePreview({ content, templateId, scale = 0.8 }: ResumePreviewProps) {
  const [template, setTemplate] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    // Render different templates based on templateId
    switch (templateId) {
      case 'modern':
        setTemplate(<ModernTemplate content={content} />);
        break;
      case 'creative':
        setTemplate(<CreativeTemplate content={content} />);
        break;
      case 'minimal':
        setTemplate(<MinimalTemplate content={content} />);
        break;
      case 'tech':
        setTemplate(<TechTemplate content={content} />);
        break;
      case 'academic':
        setTemplate(<AcademicTemplate content={content} />);
        break;
      case 'executive':
        setTemplate(<ExecutiveTemplate content={content} />);
        break;
      case 'startup':
        setTemplate(<StartupTemplate content={content} />);
        break;
      case 'consultant':
        setTemplate(<ConsultantTemplate content={content} />);
        break;
      default:
        setTemplate(<ProfessionalTemplate content={content} />);
    }
  }, [content, templateId]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: `${100 / scale}%`,
        marginLeft: `-${(100 - 100 * scale) / 2 / scale}%`,
      }}
    >
      {template}
    </div>
  );
}

// Professional Template (Default)
function ProfessionalTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto p-8 font-sans text-gray-900">
      {/* Header */}
      <div className="mb-8 border-b-2 border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {content.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {content.personalInfo.email && <span>📧 {content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>📱 {content.personalInfo.phone}</span>}
          {content.personalInfo.linkedin && <span>🔗 {content.personalInfo.linkedin}</span>}
          {content.personalInfo.website && <span>🌐 {content.personalInfo.website}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {content.professionalSummary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{content.professionalSummary}</p>
        </div>
      )}

      {/* Work Experience */}
      {content.workExperience && content.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {content.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                </div>
                <div className="text-gray-600 text-sm text-right">
                  <p>{exp.location}</p>
                  <p>
                    {exp.startDate ? format(new Date(exp.startDate), 'MM/yyyy') : ''} - {' '}
                    {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MM/yyyy') : ''}
                  </p>
                </div>
              </div>
              <div className="text-gray-700 mt-2 whitespace-pre-line">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            EDUCATION
          </h2>
          {content.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.school}</p>
                  {edu.fieldOfStudy && <p className="text-gray-600">{edu.fieldOfStudy}</p>}
                </div>
                <div className="text-gray-600 text-sm">
                  {edu.startDate ? format(new Date(edu.startDate), 'MM/yyyy') : ''} - {' '}
                  {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'MM/yyyy') : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            CORE COMPETENCIES
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            KEY PROJECTS
          </h2>
          {content.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                <div className="text-gray-600 text-sm">
                  {project.startDate ? format(new Date(project.startDate), 'MM/yyyy') : ''} - {' '}
                  {project.current ? 'Present' : project.endDate ? format(new Date(project.endDate), 'MM/yyyy') : ''}
                </div>
              </div>
              <p className="text-gray-700 mt-1">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {content.achievements && content.achievements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            ACHIEVEMENTS
          </h2>
          {content.achievements.map((achievement, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                {achievement.date && (
                  <div className="text-gray-600 text-sm">
                    {format(new Date(achievement.date), 'MM/yyyy')}
                  </div>
                )}
              </div>
              <p className="text-gray-700 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Modern Template
function ModernTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto font-sans text-gray-900">
      {/* Header with accent */}
      <div className="bg-blue-600 text-white p-8 mb-0">
        <h1 className="text-4xl font-light mb-2">
          {content.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-6 text-blue-100">
          {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
          {content.personalInfo.linkedin && <span>{content.personalInfo.linkedin}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {content.professionalSummary && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-blue-700 mb-4 border-l-4 border-blue-600 pl-4">
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{content.professionalSummary}</p>
          </div>
        )}

        {/* Experience */}
        {content.workExperience && content.workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-blue-700 mb-6 border-l-4 border-blue-600 pl-4">
              Professional Experience
            </h2>
            {content.workExperience.map((exp, index) => (
              <div key={index} className="mb-6 pl-4 border-l-2 border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 text-right">
                    <p>{exp.location}</p>
                    <p className="font-medium">
                      {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : ''} - {' '}
                      {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills and Education in two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-blue-700 mb-4 border-l-4 border-blue-600 pl-4">
                Core Skills
              </h2>
              <div className="space-y-2">
                {content.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-blue-700 mb-4 border-l-4 border-blue-600 pl-4">
                Education
              </h2>
              {content.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.school}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                    {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Creative Template
function CreativeTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto font-sans">
      <div className="grid grid-cols-3 min-h-screen">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-purple-600 to-purple-800 text-white p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {content.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="space-y-2 text-purple-100 text-sm">
              {content.personalInfo.email && <p>{content.personalInfo.email}</p>}
              {content.personalInfo.phone && <p>{content.personalInfo.phone}</p>}
              {content.personalInfo.linkedin && <p>{content.personalInfo.linkedin}</p>}
            </div>
          </div>

          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-purple-100">Skills</h2>
              <div className="space-y-2">
                {content.skills.slice(0, 8).map((skill, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>{skill}</span>
                    </div>
                    <div className="w-full bg-purple-700 rounded-full h-1">
                      <div className="bg-white h-1 rounded-full" style={{ width: `${85 + Math.random() * 15}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-purple-100">Education</h2>
              {content.education.map((edu, index) => (
                <div key={index} className="mb-4 text-sm">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-purple-200">{edu.school}</p>
                  <p className="text-purple-300 text-xs">
                    {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                    {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-8">
          {/* Professional Summary */}
          {content.professionalSummary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{content.professionalSummary}</p>
            </div>
          )}

          {/* Experience */}
          {content.workExperience && content.workExperience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Experience</h2>
              {content.workExperience.map((exp, index) => (
                <div key={index} className="mb-6 relative">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div className="ml-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-purple-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-gray-500 text-sm text-right">
                        <p>{exp.location}</p>
                        <p>
                          {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : ''} - {' '}
                          {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm whitespace-pre-line">
                      {exp.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {content.projects && content.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Projects</h2>
              {content.projects.map((project, index) => (
                <div key={index} className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Minimal Template
function MinimalTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto p-12 font-serif text-gray-900">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light mb-4 tracking-wide">
          {content.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-8 text-sm text-gray-600">
          {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
          {content.personalInfo.linkedin && <span>{content.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {content.professionalSummary && (
        <div className="mb-10">
          <p className="text-center text-gray-700 leading-relaxed text-lg italic">
            {content.professionalSummary}
          </p>
        </div>
      )}

      {/* Experience */}
      {content.workExperience && content.workExperience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-light text-center mb-8 tracking-widest uppercase">
            Experience
          </h2>
          {content.workExperience.map((exp, index) => (
            <div key={index} className="mb-8 text-center">
              <h3 className="text-lg font-medium mb-1">{exp.jobTitle}</h3>
              <p className="text-gray-600 mb-1">{exp.company} • {exp.location}</p>
              <p className="text-gray-500 text-sm mb-3">
                {exp.startDate ? format(new Date(exp.startDate), 'MMMM yyyy') : ''} - {' '}
                {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMMM yyyy') : ''}
              </p>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line max-w-2xl mx-auto">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-light text-center mb-8 tracking-widest uppercase">
            Education
          </h2>
          {content.education.map((edu, index) => (
            <div key={index} className="text-center mb-6">
              <h3 className="text-lg font-medium">{edu.degree}</h3>
              <p className="text-gray-600">{edu.school}</p>
              <p className="text-gray-500 text-sm">
                {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <div>
          <h2 className="text-xl font-light text-center mb-8 tracking-widest uppercase">
            Skills
          </h2>
          <div className="text-center">
            <p className="text-gray-700 leading-relaxed">
              {content.skills.join(' • ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Tech Template
function TechTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-gray-50 w-full max-w-[800px] mx-auto font-mono">
      {/* Header */}
      <div className="bg-gray-900 text-green-400 p-6">
        <div className="border border-green-400 p-4">
          <h1 className="text-2xl font-bold mb-2">
            $ whoami: {content.personalInfo.fullName || 'developer'}
          </h1>
          <div className="space-y-1 text-sm">
            {content.personalInfo.email && <p>📧 {content.personalInfo.email}</p>}
            {content.personalInfo.phone && <p>📱 {content.personalInfo.phone}</p>}
            {content.personalInfo.linkedin && <p>🔗 {content.personalInfo.linkedin}</p>}
            {content.personalInfo.website && <p>🌐 {content.personalInfo.website}</p>}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white">
        {/* Professional Summary */}
        {content.professionalSummary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-green-500 pl-3">
              // About
            </h2>
            <div className="bg-gray-100 p-4 rounded border-l-4 border-blue-500">
              <p className="text-gray-700">{content.professionalSummary}</p>
            </div>
          </div>
        )}

        {/* Skills */}
        {content.skills && content.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-green-500 pl-3">
              // Tech Stack
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {content.skills.map((skill, index) => (
                <div key={index} className="bg-gray-900 text-green-400 px-3 py-1 rounded text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {content.workExperience && content.workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-green-500 pl-3">
              // Work Experience
            </h2>
            {content.workExperience.map((exp, index) => (
              <div key={index} className="mb-4 bg-gray-50 p-4 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-blue-600">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 text-sm text-right">
                    <p>{exp.location}</p>
                    <p>
                      {exp.startDate ? format(new Date(exp.startDate), 'MM/yyyy') : ''} - {' '}
                      {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MM/yyyy') : ''}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {content.projects && content.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-green-500 pl-3">
              // Projects
            </h2>
            {content.projects.map((project, index) => (
              <div key={index} className="mb-4 bg-gray-50 p-4 rounded border">
                <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {content.education && content.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-green-500 pl-3">
              // Education
            </h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-3 bg-gray-50 p-3 rounded">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600">{edu.school}</p>
                <p className="text-gray-500 text-sm">
                  {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                  {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Academic Template
function AcademicTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto p-8 font-serif text-gray-900">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-3xl font-bold mb-3">
          {content.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          {content.personalInfo.email && <p>{content.personalInfo.email}</p>}
          {content.personalInfo.phone && <p>{content.personalInfo.phone}</p>}
          {content.personalInfo.linkedin && <p>{content.personalInfo.linkedin}</p>}
        </div>
      </div>

      {/* Professional Summary */}
      {content.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center uppercase tracking-wide">
            Research Interests
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{content.professionalSummary}</p>
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center uppercase tracking-wide">
            Education
          </h2>
          {content.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700 italic">{edu.school}</p>
                  {edu.fieldOfStudy && <p className="text-gray-600">Concentration: {edu.fieldOfStudy}</p>}
                </div>
                <div className="text-gray-600 text-sm">
                  {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                  {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
                </div>
              </div>
              {edu.description && (
                <p className="text-gray-700 mt-2 text-sm">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {content.workExperience && content.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center uppercase tracking-wide">
            Academic & Professional Experience
          </h2>
          {content.workExperience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-700 italic">{exp.company}</p>
                </div>
                <div className="text-gray-600 text-sm text-right">
                  <p>{exp.location}</p>
                  <p>
                    {exp.startDate ? format(new Date(exp.startDate), 'MMMM yyyy') : ''} - {' '}
                    {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMMM yyyy') : ''}
                  </p>
                </div>
              </div>
              <div className="text-gray-700 whitespace-pre-line text-justify">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects/Research */}
      {content.projects && content.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center uppercase tracking-wide">
            Research Projects
          </h2>
          {content.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-900">{project.title}</h3>
              <p className="text-gray-700 text-justify">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">Methods/Tools:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center uppercase tracking-wide">
            Technical Skills
          </h2>
          <p className="text-gray-700 text-justify">
            {content.skills.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

// Executive Template
function ExecutiveTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto font-sans">
      {/* Header */}
      <div className="bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-light mb-3">
          {content.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-gray-300 mb-4">Executive Leader</p>
        <div className="flex flex-wrap gap-6 text-gray-300">
          {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
          {content.personalInfo.linkedin && <span>{content.personalInfo.linkedin}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Executive Summary */}
        {content.professionalSummary && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-800 mb-4 border-b-2 border-gray-800 pb-2">
              Executive Profile
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{content.professionalSummary}</p>
          </div>
        )}

        {/* Core Competencies */}
        {content.skills && content.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-800 mb-4 border-b-2 border-gray-800 pb-2">
              Core Competencies
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {content.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {content.workExperience && content.workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-800 mb-6 border-b-2 border-gray-800 pb-2">
              Executive Experience
            </h2>
            {content.workExperience.map((exp, index) => (
              <div key={index} className="mb-8">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-lg text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-gray-600 text-right">
                    <p className="font-medium">{exp.location}</p>
                    <p>
                      {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : ''} - {' '}
                      {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {content.education && content.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-light text-gray-800 mb-4 border-b-2 border-gray-800 pb-2">
              Education & Credentials
            </h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.school}</p>
                    {edu.fieldOfStudy && <p className="text-gray-600">{edu.fieldOfStudy}</p>}
                  </div>
                  <div className="text-gray-600">
                    {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                    {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Startup Template
function StartupTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {content.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-xl text-orange-100 mb-3">Innovation Catalyst</p>
          <div className="flex flex-wrap gap-4 text-orange-100">
            {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
            {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
            {content.personalInfo.linkedin && <span>{content.personalInfo.linkedin}</span>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Mission Statement */}
        {content.professionalSummary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              Mission Statement
            </h2>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-gray-700 leading-relaxed italic">{content.professionalSummary}</p>
            </div>
          </div>
        )}

        {/* Superpowers */}
        {content.skills && content.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              Superpowers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {content.skills.map((skill, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg text-center">
                  <span className="text-gray-800 font-medium text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journey */}
        {content.workExperience && content.workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              The Journey
            </h2>
            {content.workExperience.map((exp, index) => (
              <div key={index} className="mb-6 relative">
                <div className="absolute left-0 top-2 w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="ml-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-orange-600 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-gray-500 text-sm text-right">
                      <p>{exp.location}</p>
                      <p>
                        {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : ''} - {' '}
                        {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Side Projects */}
        {content.projects && content.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              Side Hustles
            </h2>
            <div className="grid gap-4">
              {content.projects.map((project, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning */}
        {content.education && content.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              Learning Adventures
            </h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-orange-600">{edu.school}</p>
                <p className="text-gray-500 text-sm">
                  {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                  {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Consultant Template
function ConsultantTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white w-full max-w-[800px] mx-auto font-sans text-gray-900">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {content.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-blue-600 font-semibold mb-4">Management Consultant</p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            {content.personalInfo.email && <p>📧 {content.personalInfo.email}</p>}
            {content.personalInfo.phone && <p>📱 {content.personalInfo.phone}</p>}
          </div>
          <div>
            {content.personalInfo.linkedin && <p>🔗 {content.personalInfo.linkedin}</p>}
            {content.personalInfo.website && <p>🌐 {content.personalInfo.website}</p>}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {content.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Executive Summary
          </h2>
          <div className="bg-blue-50 p-4 border-l-4 border-blue-600">
            <p className="text-gray-700 leading-relaxed">{content.professionalSummary}</p>
          </div>
        </div>
      )}

      {/* Core Competencies */}
      {content.skills && content.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {content.skills.map((skill, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded">
                <span className="text-gray-800 font-medium text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {content.workExperience && content.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">
            Professional Experience
          </h2>
          {content.workExperience.map((exp, index) => (
            <div key={index} className="mb-6 border-l-4 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-blue-600 font-semibold">{exp.company}</p>
                </div>
                <div className="text-gray-600 text-sm text-right">
                  <p className="font-medium">{exp.location}</p>
                  <p>
                    {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : ''} - {' '}
                    {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                  </p>
                </div>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Projects */}
      {content.projects && content.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Key Engagements
          </h2>
          {content.projects.map((project, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded border-l-4 border-blue-600">
              <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Education & Certifications
          </h2>
          {content.education.map((edu, index) => (
            <div key={index} className="mb-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600">{edu.school}</p>
                {edu.fieldOfStudy && <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>}
              </div>
              <div className="text-gray-600 text-sm">
                {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} - {' '}
                {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}