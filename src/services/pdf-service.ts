import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeContent } from '@/types';
import { format } from 'date-fns';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ResumePreview from '@/components/resume-builder/resume-preview';

export interface PDFOptions {
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  filename?: string;
}

class PDFService {
  private defaultOptions: PDFOptions = {
    format: 'a4',
    orientation: 'portrait',
    quality: 1.0,
    filename: 'resume.pdf',
  };

  private async generatePdfFromOffscreenElement(
    content: ResumeContent,
    templateId: string,
    options: PDFOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.zIndex = '-1';
    container.style.backgroundColor = '#ffffff';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(ResumePreview, {
          content: content,
          templateId: templateId,
          scale: 1,
        })
      );
      setTimeout(resolve, 1000); // Allow time for rendering
    });

    try {
      await this.generatePDFFromHTML(container, opts);
    } finally {
      root.unmount();
      document.body.removeChild(container);
    }
  }

  /**
   * Generate PDF from resume content using direct PDF generation
   */
  async generatePDFFromContent(
    content: ResumeContent,
    options: PDFOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };
    const pdf = new jsPDF({
      orientation: opts.orientation,
      unit: 'mm',
      format: opts.format,
    });

    pdf.setFont('helvetica');
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    interface AddTextOptions {
      fontSize?: number;
      maxWidth?: number;
      lineHeight?: number;
      style?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    }

    const addText = (text: string, x: number, y: number, options: AddTextOptions = {}) => {
      const fontSize = options.fontSize || 10;
      const maxWidth = options.maxWidth || contentWidth;
      const lineHeight = options.lineHeight || fontSize * 0.35;

      pdf.setFontSize(fontSize);
      if (options.style) pdf.setFont('helvetica', options.style);

      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + lines.length * lineHeight;
    };

    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    try {
      // Header
      yPosition = addText(content.personalInfo.fullName || 'Your Name', margin, yPosition, {
        fontSize: 20,
        style: 'bold',
      });

      yPosition += 5;

      const contactInfo = [];
      if (content.personalInfo.email) contactInfo.push(content.personalInfo.email);
      if (content.personalInfo.phone) contactInfo.push(content.personalInfo.phone);
      if (content.personalInfo.linkedin) contactInfo.push(content.personalInfo.linkedin);

      if (contactInfo.length > 0) {
        yPosition = addText(contactInfo.join(' | '), margin, yPosition, { fontSize: 10 });
      }

      yPosition += 10;

      // Summary
      if (content.professionalSummary) {
        checkPageBreak(30);
        yPosition = addText('PROFESSIONAL SUMMARY', margin, yPosition, {
          fontSize: 12,
          style: 'bold',
        });
        yPosition += 3;
        yPosition = addText(content.professionalSummary, margin, yPosition, {
          fontSize: 10,
          lineHeight: 4,
        });
        yPosition += 8;
      }

      // Work Experience
      if (content.workExperience?.length) {
        checkPageBreak(40);
        yPosition = addText('PROFESSIONAL EXPERIENCE', margin, yPosition, {
          fontSize: 12,
          style: 'bold',
        });
        yPosition += 5;

        for (const exp of content.workExperience) {
          checkPageBreak(35);

          yPosition = addText(exp.jobTitle, margin, yPosition, {
            fontSize: 11,
            style: 'bold',
          });

          yPosition = addText(
            `${exp.company}${exp.location ? ` | ${exp.location}` : ''}`,
            margin,
            yPosition,
            { fontSize: 10 }
          );

          const startDate = exp.startDate ? format(new Date(exp.startDate), 'MM/yyyy') : '';
          const endDate = exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MM/yyyy') : '';
          yPosition = addText(`${startDate} - ${endDate}`, margin, yPosition, { fontSize: 9 });

          yPosition += 2;

          if (exp.description) {
            yPosition = addText(exp.description, margin, yPosition, {
              fontSize: 10,
              lineHeight: 4,
            });
          }

          yPosition += 6;
        }
      }

      // Education
      if (content.education?.length) {
        checkPageBreak(30);
        yPosition = addText('EDUCATION', margin, yPosition, {
          fontSize: 12,
          style: 'bold',
        });
        yPosition += 5;

        for (const edu of content.education) {
          checkPageBreak(20);

          yPosition = addText(edu.degree, margin, yPosition, {
            fontSize: 11,
            style: 'bold',
          });

          yPosition = addText(edu.school, margin, yPosition, { fontSize: 10 });

          const start = edu.startDate ? format(new Date(edu.startDate), 'yyyy') : '';
          const end = edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : '';
          yPosition = addText(`${start} - ${end}`, margin, yPosition, { fontSize: 9 });

          yPosition += 4;
        }
      }

      // Skills
      if (content.skills?.length) {
        checkPageBreak(25);
        yPosition = addText('CORE COMPETENCIES', margin, yPosition, {
          fontSize: 12,
          style: 'bold',
        });
        yPosition += 3;
        yPosition = addText(content.skills.join(' • '), margin, yPosition, {
          fontSize: 10,
          lineHeight: 4,
        });
        yPosition += 8;
      }

      // Projects
      if (content.projects?.length) {
        checkPageBreak(30);
        yPosition = addText('KEY PROJECTS', margin, yPosition, {
          fontSize: 12,
          style: 'bold',
        });
        yPosition += 5;

        for (const project of content.projects) {
          checkPageBreak(25);

          yPosition = addText(project.title, margin, yPosition, {
            fontSize: 11,
            style: 'bold',
          });

          yPosition = addText(project.description, margin, yPosition, {
            fontSize: 10,
            lineHeight: 4,
          });

          if (project.technologies?.length) {
            yPosition = addText(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition, {
              fontSize: 9,
            });
          }

          yPosition += 4;
        }
      }

      // Achievements
      if (content.achievements?.length) {
        checkPageBreak(25);
        yPosition = addText('ACHIEVEMENTS', margin, yPosition, {
          fontSize: 12,
          style: 'bold',
        });
        yPosition += 5;

        for (const achievement of content.achievements) {
          checkPageBreak(15);
          yPosition = addText(achievement.title, margin, yPosition, {
            fontSize: 11,
            style: 'bold',
          });

          yPosition = addText(achievement.description, margin, yPosition, {
            fontSize: 10,
            lineHeight: 4,
          });

          yPosition += 4;
        }
      }

      const filename = opts.filename || `${content.personalInfo.fullName?.replace(/\s+/g, '_') || 'resume'}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  /**
   * Generate PDF from HTML element (image-based)
   */
  async generatePDFFromHTML(element: HTMLElement, options: PDFOptions = {}): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };

    const clone = element.cloneNode(true) as HTMLElement;
    const a4WidthPx = 794;
    clone.style.width = `${a4WidthPx}px`;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.zIndex = '-1';

    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: opts.quality || 2,
        useCORS: true,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: opts.orientation,
        unit: 'mm',
        format: opts.format,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      let heightLeft = imgHeight - pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(opts.filename || 'resume.pdf');
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    } finally {
      if (clone && document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
    }
  }

  /**
   * Wrapper to generate and download resume PDF
   */
  async downloadResumePDF(
    content: ResumeContent,
    templateId: string,
    options: PDFOptions = {},
    onProgress?: (progress: number) => void,
    element?: HTMLElement | null
  ): Promise<void> {
    try {
      onProgress?.(10);
      const filename =
        options.filename ||
        `${content.personalInfo.fullName?.replace(/\s+/g, '_') || 'resume'}_${format(
          new Date(),
          'yyyy-MM-dd'
        )}.pdf`;

      onProgress?.(30);
      if (element) {
        await this.generatePDFFromHTML(element, { ...options, filename });
      } else {
        await this.generatePdfFromOffscreenElement(content, templateId, { ...options, filename });
      }

      onProgress?.(100);
    } catch (error) {
      console.error('PDF download error:', error);
      throw error;
    }
  }
}

export const pdfService = new PDFService();
