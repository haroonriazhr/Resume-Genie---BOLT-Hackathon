import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AiAssistantButton from './ai-assistant-button';

const summarySchema = z.object({
  summary: z.string().min(1, { message: 'Professional summary is required' }),
});

interface ProfessionalSummaryFormProps {
  data: string;
  onChange: (data: string) => void;
}

export default function ProfessionalSummaryForm({
  data,
  onChange,
}: ProfessionalSummaryFormProps) {
  const form = useForm<{ summary: string }>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: data || '',
    },
  });

  function onSubmit(values: { summary: string }) {
    onChange(values.summary);
  }

  // Update parent component when form values change
  const handleFieldChange = () => {
    const values = form.getValues();
    onChange(values.summary);
  };

  const handleAiSuggestion = (content: string) => {
    form.setValue('summary', content);
    onChange(content);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Professional Summary</CardTitle>
          <CardDescription>
            Write a short summary highlighting your experience, skills, and career goals
          </CardDescription>
        </div>
        <AiAssistantButton
          section="summary"
          onSuggestion={handleAiSuggestion}
          description="Let AI help you write a professional summary that highlights your key qualifications and career goals."
          defaultPrompt="I am a [your role] with [X] years of experience in [industry/field]. My key skills include [list main skills]. Help me write a professional summary that highlights my expertise and career goals."
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onChange={handleFieldChange} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Experienced software engineer with 5+ years of experience..."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Keep your summary concise and focused on your most relevant qualifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}