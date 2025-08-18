
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, ArrowRight, X } from "lucide-react";
import { CourseCard, type Course } from '@/components/common/CourseCard';

// Mock Data - In a real app, this would come from an API
const allCourses: Course[] = [
    {
        id: "1",
        title: "Parametric Design with Grasshopper",
        author: "Dr. Elena Vance",
        tags: ["Parametrics", "Computational Design"],
        difficulty: "Intermediate",
        format: "Video Course",
        releaseDate: "2024-08-15",
        description: "An in-depth guide to visual programming in Rhino for complex architectural forms.",
        imageUrl: "https://images.unsplash.com/photo-1632426986596-e366916892a4?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "parametric architecture",
        rating: 4.8,
        recommendations: 124,
    },
    {
        id: "2",
        title: "Sustainable Materials in West Africa",
        author: "Kwame Addo",
        tags: ["Sustainability", "Materials"],
        difficulty: "Beginner",
        format: "Video Course",
        releaseDate: "2024-09-01",
        description: "Explore the use of laterite, bamboo, and recycled plastics in modern African construction.",
        imageUrl: "https://images.unsplash.com/photo-1517602302339-38541c888f40?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "sustainable materials",
        rating: 4.9,
        recommendations: 201,
    },
    {
        id: "3",
        title: "BIM Fundamentals with Revit",
        author: "Amina El-Sayed",
        tags: ["BIM", "Software"],
        difficulty: "Beginner",
        format: "Video Course",
        releaseDate: "2024-07-20",
        description: "Learn the basics of Building Information Modeling from scratch using Autodesk Revit.",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "architects planning",
        rating: 4.7,
        recommendations: 98,
    },
    {
        id: "4",
        title: "AI for Site Analysis",
        author: "Aether AI",
        tags: ["AI", "Urbanism"],
        difficulty: "Advanced",
        format: "Primer",
        releaseDate: "2024-08-22",
        description: "Use computer vision and data analysis to conduct comprehensive site studies.",
        imageUrl: "https://images.unsplash.com/photo-1698661033580-779d7d117a59?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "computer vision city",
        rating: 4.9,
        recommendations: 150,
    },
    {
        id: "5",
        title: "The Great Mosque of Djenné: An Archive",
        author: "Community Curated",
        tags: ["History", "Vernacular"],
        difficulty: "All Levels",
        format: "Archive",
        releaseDate: "2024-06-10",
        description: "A deep dive into the history, construction, and cultural significance of this iconic landmark.",
        imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "african architecture",
        rating: 4.6,
        recommendations: 82,
    },
    {
        id: "6",
        title: "Design Thinking for Architects",
        author: "Inioluwa Oladipupo",
        tags: ["Design Theory"],
        difficulty: "Beginner",
        format: "Primer",
        releaseDate: "2024-09-05",
        description: "A framework for creative problem-solving tailored to architectural challenges.",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "team collaboration",
        rating: 4.8,
        recommendations: 180,
    },
    {
        id: "7",
        title: "Advanced Facade Detailing",
        author: "Dr. Elena Vance",
        tags: ["Construction", "BIM"],
        difficulty: "Advanced",
        format: "Video Course",
        releaseDate: "2024-08-01",
        description: "Master the art and science of high-performance building envelopes.",
        imageUrl: "https://images.unsplash.com/photo-1617964642571-6279e8c751a4?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "modern facade",
        rating: 4.9,
        recommendations: 112,
    },
    {
        id: "8",
        title: "Intro to Urban Planning",
        author: "Amina El-Sayed",
        tags: ["Urbanism"],
        difficulty: "Beginner",
        format: "Video Course",
        releaseDate: "2024-09-10",
        description: "Understand the principles that shape our cities, from zoning to public space.",
        imageUrl: "https://images.unsplash.com/photo-1549472539-b2760b2f45b7?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "city map",
        rating: 4.7,
        recommendations: 95,
    },
];

const allTopics = Array.from(new Set(allCourses.flatMap(c => c.tags)));
const allLevels = Array.from(new Set(allCourses.map(c => c.difficulty)));
const allFormats = Array.from(new Set(allCourses.map(c => c.format)));

const ITEMS_PER_PAGE = 6;

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        topic: 'all',
        level: 'all',
        format: 'all',
    });
    const [showRecommended, setShowRecommended] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredCourses = useMemo(() => {
        let courses = allCourses.filter(course => {
            const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());
            const topicMatch = filters.topic === 'all' || course.tags.includes(filters.topic);
            const levelMatch = filters.level === 'all' || course.difficulty === filters.level;
            const formatMatch = filters.format === 'all' || course.format === filters.format;
            return searchMatch && topicMatch && levelMatch && formatMatch;
        });

        if (showRecommended) {
            courses.sort((a, b) => (b.recommendations || 0) - (a.recommendations || 0));
        } else {
             courses.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        }

        return courses;
    }, [searchTerm, filters, showRecommended]);

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleFilterChange = (filterName: keyof typeof filters) => (value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ topic: 'all', level: 'all', format: 'all' });
        setShowRecommended(false);
        setSearchTerm('');
        setCurrentPage(1);
    }

    const activeFilterCount =
        (filters.topic !== 'all' ? 1 : 0) +
        (filters.level !== 'all' ? 1 : 0) +
        (filters.format !== 'all' ? 1 : 0) +
        (showRecommended ? 1 : 0) +
        (searchTerm ? 1 : 0);

    return (
        <main className="container py-12 md:py-16 animate-in fade-in duration-500">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Course Library</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                    Browse all available courses, primers, and archives. Filter by topic, level, or format to find what you need.
                </p>
            </div>

            {/* Filter Section */}
            <Card className="p-4 sm:p-6 mb-8 sticky top-16 z-30 bg-background/90 backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search courses..." 
                            className="pl-9" 
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                     <Select value={filters.topic} onValueChange={handleFilterChange('topic')}>
                        <SelectTrigger><SelectValue placeholder="All Topics" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Topics</SelectItem>
                            {allTopics.map(topic => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={filters.level} onValueChange={handleFilterChange('level')}>
                        <SelectTrigger><SelectValue placeholder="All Levels" /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Levels</SelectItem>
                            {allLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={filters.format} onValueChange={handleFilterChange('format')}>
                        <SelectTrigger><SelectValue placeholder="All Formats" /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Formats</SelectItem>
                            {allFormats.map(format => <SelectItem key={format} value={format}>{format}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="recommended-filter" checked={showRecommended} onCheckedChange={setShowRecommended} />
                        <Label htmlFor="recommended-filter">Show Most Recommended</Label>
                    </div>
                     {activeFilterCount > 0 && (
                        <Button variant="ghost" onClick={clearFilters} className="text-sm">
                            <X className="mr-2 h-4 w-4" />
                            Clear {activeFilterCount} Filter{activeFilterCount > 1 && 's'}
                        </Button>
                    )}
                </div>
            </Card>

            {/* Courses Grid */}
            {paginatedCourses.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {paginatedCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-semibold font-headline">No Courses Found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
                     <Button variant="outline" onClick={clearFilters} className="mt-4">
                        Clear All Filters
                    </Button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <Button 
                        variant="outline" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                     <Button 
                        variant="outline" 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </main>
    )
}
