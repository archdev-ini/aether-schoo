
'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { createCourse, type CreateCourseState } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Course
    </Button>
  );
}

export default function NewCoursePage() {
  const initialState: CreateCourseState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createCourse, initialState);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/content">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Create New Course
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Fill out the basic information for the new course.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 'Introduction to Sustainable Design'"
                aria-describedby="title-error"
              />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {state.errors?.title &&
                  state.errors.title.map((error: string) => (
                    <p className="mt-2 text-sm text-destructive" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                     <Select name="format" defaultValue="Primer">
                        <SelectTrigger id="format" aria-label="Select format">
                            <SelectValue placeholder="Select course format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Primer">Primer</SelectItem>
                            <SelectItem value="Video Course">Video Course</SelectItem>
                            <SelectItem value="Archive">Archive</SelectItem>
                        </SelectContent>
                    </Select>
                    <div id="format-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.format &&
                        state.errors.format.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>
                            {error}
                            </p>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                        id="slug"
                        name="slug"
                        placeholder="e.g., 'sustainable-design-intro'"
                         aria-describedby="slug-error"
                    />
                    <div id="slug-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.slug &&
                        state.errors.slug.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>
                            {error}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <div aria-live="polite" aria-atomic="true">
                {state.message ? (
                    <p className="mt-2 text-sm text-destructive">{state.message}</p>
                ) : null}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
