// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

// Resume types
export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  projects: Project[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface WorkExperience {
  company: string;
  jobTitle: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  language: string;
  proficiency: 'Elementary' | 'Limited Working' | 'Professional Working' | 'Full Professional' | 'Native';
}

export interface Achievement {
  title: string;
  date?: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  atsScore: number;
  features: string[];
  premium: boolean;
  popular: boolean;
}