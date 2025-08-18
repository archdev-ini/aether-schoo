
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { CourseCard, type Course } from '@/components/common/CourseCard';
import Link from 'next/link';

// Mock Data - In a real app, this would come from a unified search API
const allContent: Course[] = [
    { id: "1", title: "Parametric Design with Grasshopper", author: "Dr. Elena Vance", tags: ["Parametrics", "Computational Design"], difficulty: "Intermediate", format: "Primer", releaseDate: "2024-08-15", description: "An in-depth guide to visual programming in Rhino for complex architectural forms.", imageUrl: "https://images.unsplash.com/photo-1632426986596-e366916892a4?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "parametric architecture", rating: 4.8, recommendations: 124 },
    { id: "2", title: "Sustainable Materials in West Africa", author: "Kwame Addo", tags: ["Sustainability", "Materials"], difficulty: "Beginner", format: "Video Course", releaseDate: "2024-09-01", description: "Explore the use of laterite, bamboo, and recycled plastics in modern African construction.", imageUrl: "https://images.unsplash.com/photo-1517602302339-38541c888f40?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "sustainable materials", rating: 4.9, recommendations: 201 },
    { id: "3", title: "BIM Fundamentals with Revit", author: "Amina El-Sayed", tags: ["BIM", "Software"], difficulty: "Beginner", format: "Video Course", releaseDate: "2024-07-20", description: "Learn the basics of Building Information Modeling from scratch using Autodesk Revit.", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "architects planning", rating: 4.7, recommendations: 98 },
    { id: "4", title: "AI for Site Analysis", author: "Aether AI", tags: ["AI", "Urbanism"], difficulty: "Advanced", format: "Primer", releaseDate: "2024-08-22", description: "Use computer vision and data analysis to conduct comprehensive site studies.", imageUrl: "https://images.unsplash.com/photo-1698661033580-779d7d117a59?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "computer vision city", rating: 4.9, recommendations: 150 },
    { id: "5", title: "The Great Mosque of Djenné: An Archive", author: "Community Curated", tags: ["History", "Vernacular"], difficulty: "All Levels", format: "Archive", releaseDate: "2024-06-10", description: "A deep dive into the history, construction, and cultural significance of this iconic landmark.", imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "african architecture", rating: 4.6, recommendations: 82 },
];

const trendingTopics = ["Sustainability", "AI in Design", "Vernacular Architecture", "BIM", "Community Housing"];

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<Course[]>([]);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filtered = allContent.filter(item => 
        item.title.toLowerCase().includes(lowerCaseTerm) ||
        item.description.toLowerCase().includes(lowerCaseTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerCaseTerm))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUrl = `/search?q=${encodeURIComponent(searchTerm)}`;
    window.history.pushState({}, '', newUrl);
    // Trigger re-render to reflect URL change if needed, though useEffect on searchTerm handles filtering
  };

  return (
    <main className="container py-12 md:py-16 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-center">Search the Ecosystem</h1>
            <form onSubmit={handleSearch} className="relative mt-6 max-w-xl mx-auto">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for courses, primers, topics..."
                    className="w-full pl-12 h-12 text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
        </div>

        {query && results.length > 0 && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold font-headline mb-6">Courses, Primers & Archives</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(item => (
                  <CourseCard key={item.id} course={item} />
                ))}
              </div>
            </section>

             <section>
              <h2 className="text-2xl font-bold font-headline mb-6">Community & Events</h2>
               <Card>
                <CardHeader>
                  <CardTitle>Looking for Community Content?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Discussions, member projects, and events can be found in our dedicated community spaces.</p>
                  <Link href="/community" className="inline-flex items-center text-primary font-semibold">
                    Explore Community <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold font-headline">No Results Found for "{query}"</h3>
            <p className="text-muted-foreground mt-2">Try searching for another topic or check out our trending topics below.</p>
          </div>
        )}

        {!query && (
          <div>
            <h2 className="text-2xl font-bold font-headline mb-6 text-center">Trending Topics</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {trendingTopics.map(topic => (
                <Link key={topic} href={`/search?q=${encodeURIComponent(topic)}`}>
                  <div className="px-4 py-2 bg-muted hover:bg-primary/10 rounded-full cursor-pointer transition-colors">
                    {topic}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageComponent />
        </Suspense>
    )
}
