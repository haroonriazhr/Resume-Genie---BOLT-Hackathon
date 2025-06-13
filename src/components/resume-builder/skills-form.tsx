import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AiAssistantButton from './ai-assistant-button';

interface SkillsFormProps {
  data: string[];
  onChange: (data: string[]) => void;
}

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [skills, setSkills] = useState<string[]>(data || []);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    
    // Avoid duplicates
    if (skills.includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }
    
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    onChange(updatedSkills);
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
    onChange(updatedSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Add your technical skills and competencies
          </CardDescription>
        </div>
        <AiAssistantButton
          section="skills"
          onSuggestion={(content) => {
            const skillsList = content
              .split(',')
              .map(skill => skill.trim())
              .filter(skill => skill && !skills.includes(skill));
            setSkills([...skills, ...skillsList]);
            onChange([...skills, ...skillsList]);
          }}
          description="Let AI help you identify relevant skills for your field."
          defaultPrompt="I am a [your role] working in [industry/field]. Help me list relevant technical and soft skills for my resume."
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., JavaScript, React, Project Management"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleAddSkill} type="button">
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No skills added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}