
import { Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { getCourses, type Course } from './actions';
import { CourseCard } from '@/components/common/CourseCard';
import { CourseFilters } from './_components/CourseFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const metadata = {
    title: 'Course Library | Aether School',
    description: 'Browse all available courses, primers, and archives in the Aether ecosystem.',
};

async function CoursesGrid({ search, topic, level, format, sort }: { search?: string, topic?: string, level?: string, format?: string, sort?: string }) {
  const courses = await getCourses();

  const filteredCourses = courses.filter(course => {
    const searchMatch = !search || course.title.toLowerCase().includes(search.toLowerCase()) || course.description.toLowerCase().includes(search.toLowerCase());
    const topicMatch = !topic || topic === 'all' || course.tags?.includes(topic);
    const levelMatch = !level || level === 'all' || course.difficulty === level;
    const formatMatch = !format || format === 'all' || course.format === format;
    return searchMatch && topicMatch && levelMatch && formatMatch;
  });

  if (sort === 'recommended') {
    // This is a placeholder for a real recommendation system
    filteredCourses.sort((a, b) => (b.id > a.id ? 1 : -1));
  } else {
    filteredCourses.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }

  if (filteredCourses.length === 0) {
    return (
        <div className="text-center py-16 col-span-full">
            <h3 className="text-2xl font-semibold font-headline">No Courses Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
        </div>
    );
  }

  return (
    <>
      {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
      ))}
    </>
  );
}

function CoursesSkeleton() {
  return (
    <>
        {[...Array(6)].map((_, i) => (
             <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                </div>
            </Card>
        ))}
    </>
  )
}

export default async function CoursesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const topic = typeof searchParams.topic === 'string' ? searchParams.topic : undefined;
    const level = typeof searchParams.level === 'string' ? searchParams.level : undefined;
    const format = typeof searchParams.format === 'string' ? searchParams.format : undefined;
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;

    // These need to be fetched for the filter dropdowns.
    // In a real app, you might optimize this to avoid re-fetching if not needed.
    const allCourses = await getCourses();
    const allTopics = Array.from(new Set(allCourses.flatMap(c => c.tags || [])));
    const allLevels = Array.from(new Set(allCourses.map(c => c.difficulty)));
    const allFormats = Array.from(new Set(allCourses.map(c => c.format)));

    return (
        <main className="container py-12 md:py-16 animate-in fade-in duration-500">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Course Library</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                    Browse all available courses, primers, and archives. Filter by topic, level, or format to find what you need.
                </p>
            </div>

            <CourseFilters 
                topics={allTopics}
                levels={allLevels}
                formats={allFormats}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
                <Suspense fallback={<CoursesSkeleton />}>
                    <CoursesGrid search={search} topic={topic} level={level} format={format} sort={sort} />
                </Suspense>
            </div>
        </main>
    )
}
