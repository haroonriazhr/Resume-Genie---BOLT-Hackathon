import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types';

const achievementSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  date: z.date().optional(),
  description: z.string().min(1, { message: 'Description is required' }),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

interface AchievementsFormProps {
  data: Achievement[];
  onChange: (data: Achievement[]) => void;
}

export default function AchievementsForm({
  data,
  onChange,
}: AchievementsFormProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(data || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  
  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      date: undefined,
      description: '',
    },
  });

  const resetForm = () => {
    form.reset({
      title: '',
      date: undefined,
      description: '',
    });
  };

  const handleAddAchievement = () => {
    setIsAdding(true);
    setEditIndex(null);
    resetForm();
  };

  const handleEditAchievement = (index: number) => {
    const achievement = achievements[index];
    form.reset({
      title: achievement.title,
      date: achievement.date ? new Date(achievement.date) : undefined,
      description: achievement.description,
    });
    setEditIndex(index);
    setIsAdding(true);
  };

  const handleDeleteAchievement = (index: number) => {
    const updatedAchievements = [...achievements];
    updatedAchievements.splice(index, 1);
    setAchievements(updatedAchievements);
    onChange(updatedAchievements);
  };

  const onSubmit = (values: AchievementFormValues) => {
    const newAchievement: Achievement = {
      ...values,
      date: values.date?.toISOString(),
    };

    let updatedAchievements = [...achievements];
    
    if (editIndex !== null) {
      updatedAchievements[editIndex] = newAchievement;
    } else {
      updatedAchievements = [...updatedAchievements, newAchievement];
    }
    
    setAchievements(updatedAchievements);
    onChange(updatedAchievements);
    setIsAdding(false);
    setEditIndex(null);
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          Add your notable achievements and accomplishments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {achievements.length > 0 ? (
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="flex justify-between items-start p-4 border rounded-md bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  {achievement.date && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(achievement.date), 'MMM yyyy')}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditAchievement(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="h-4 w-4">
                      <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteAchievement(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border rounded-md border-dashed">
            <p className="text-muted-foreground">No achievements added yet</p>
          </div>
        )}

        {isAdding ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-md p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {editIndex !== null ? 'Edit Achievement' : 'Add Achievement'}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAdding(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Achievement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown-buttons"
                          fromYear={1990}
                          toYear={2030}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your achievement..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editIndex !== null ? 'Update' : 'Add'} Achievement
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Button onClick={handleAddAchievement}>
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        )}
      </CardContent>
    </Card>
  );
}