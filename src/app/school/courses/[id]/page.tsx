
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Clock, MessageSquare, ArrowUpRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getCourseById, type Course } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

function CourseContent({ courseData }: { courseData: Course }) {
  const hasExternalLink = !!courseData.contentUrl;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="mb-2">{courseData.format}</Badge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mt-2">{courseData.title}</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-2"><User className="w-4 h-4" /> <span>{courseData.author}</span></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>Published on {new Date(courseData.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span></div>
        </div>
        {courseData.tags && courseData.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
                {courseData.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
        )}
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={courseData.imageUrl || 'https://placehold.co/1200x600.png'}
          alt={courseData.title}
          fill
          data-ai-hint="design course"
          className="object-cover"
        />
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <p className="lead !text-xl !text-muted-foreground">{courseData.description}</p>
        <p>This is where the main body of the primer or course description would go. For now, it's placeholder text. If this were a full course with lessons, they would be listed here.</p>
      </article>

      {hasExternalLink ? (
          <Button asChild size="lg">
              <Link href={courseData.contentUrl!} target="_blank">
                  {courseData.format === 'Video Course' ? 'Watch on YouTube' : 'Read on Substack'}
                  <ArrowUpRight className="ml-2" />
              </Link>
          </Button>
      ) : (
          <Card className="bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200">
              <CardHeader className="flex-row items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                  <div>
                    <CardTitle className="text-amber-900 dark:text-amber-100">Content Not Available</CardTitle>
                    <p>The content for this {courseData.format.toLowerCase()} is not yet available online.</p>
                  </div>
              </CardHeader>
          </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Community Discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center text-muted-foreground">
          <p>Community notes and discussion features are coming soon.</p>
          <Button variant="outline" asChild>
            <Link href="/community">Join the Conversation</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Skeleton className="h-6 w-24 mb-2 rounded-full" />
                <Skeleton className="h-12 w-full max-w-lg mb-2" />
                <Skeleton className="h-10 w-full max-w-md" />
                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-48" />
                </div>
                 <div className="mt-4 flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </div>
             <Skeleton className="w-full aspect-video rounded-lg" />
             <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
            </div>
            <Skeleton className="h-12 w-48" />
        </div>
    )
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const courseData = await getCourseById(params.id);

  if (!courseData) {
    notFound();
  }

  return (
    <main className="container py-12 md:py-16 animate-in fade-in duration-500">
       <Suspense fallback={<CourseSkeleton />}>
        <CourseContent courseData={courseData} />
      </Suspense>
    </main>
  );
}
