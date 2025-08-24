
'use client';

import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContent, updateContent } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { type ContentData, type ContentFormValues, ContentFormSchema } from '@/types/content';


const FORMATS = ['Primer', 'Course', 'Video Course', 'Archive'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

interface ContentFormProps {
  initialData?: ContentData;
}

function FormSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-24 w-full" /></div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                </div>
                <Skeleton className="h-11 w-32" />
            </CardContent>
        </Card>
    );
}

export function ContentForm({ initialData }: ContentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!initialData?.id;

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(ContentFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      author: initialData?.author || 'Aether',
      format: initialData?.format || undefined,
      difficulty: initialData?.difficulty || undefined,
      status: initialData?.status || 'Draft',
      contentUrl: initialData?.contentUrl || '',
      tags: initialData?.tags || '',
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  const onSubmit: SubmitHandler<ContentFormValues> = async (data) => {
    try {
      let result;
      if (isEditMode) {
        result = await updateContent(initialData.id!, data);
      } else {
        result = await createContent(data);
      }

      if (result.success) {
        toast({
          title: 'Success!',
          description: `Content has been ${isEditMode ? 'updated' : 'created'}.`,
        });
        router.push('/admin731/content');
      } else {
        throw new Error(result.error || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };
  
  if (isEditMode && !initialData.title) {
    return <FormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Content' : 'Create New Content'}</CardTitle>
            <CardDescription>Fill out the details for your content item. All fields are required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., 'Primer on Traditional Yoruba Architecture'" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief summary of the content..." className="resize-none" rows={4} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem><FormLabel>Author</FormLabel><FormControl><Input placeholder="e.g., 'David Tetteh'" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="contentUrl" render={({ field }) => (
                <FormItem><FormLabel>Content URL <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Input placeholder="https://aether.substack.com/p/..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <FormField control={form.control} name="format" render={({ field }) => (
                <FormItem><FormLabel>Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a format" /></SelectTrigger></FormControl>
                    <SelectContent>{FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="difficulty" render={({ field }) => (
                <FormItem><FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a difficulty" /></SelectTrigger></FormControl>
                    <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Input placeholder="sustainability, bim, ..." {...field} /></FormControl><FormDescription>Comma-separated list.</FormDescription><FormMessage /></FormItem>
              )} />
            </div>
             <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Status</FormLabel>
                  <FormDescription>
                    Published content will be visible on the public site.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 'Published'}
                    onCheckedChange={(checked) => field.onChange(checked ? 'Published' : 'Draft')}
                  />
                </FormControl>
              </FormItem>
            )} />
          </CardContent>
        </Card>
        <Button type="submit" disabled={isSubmitting || !isDirty} size="lg">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isEditMode ? 'Save Changes' : 'Create Content'}
        </Button>
      </form>
    </Form>
  );
}
