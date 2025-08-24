
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { Card } from '@/components/ui/card';

interface CourseFiltersProps {
    topics: string[];
    levels: string[];
    formats: string[];
}

export function CourseFilters({ topics, levels, formats }: CourseFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || 'all');
    const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
    const [selectedFormat, setSelectedFormat] = useState(searchParams.get('format') || 'all');
    const [showRecommended, setShowRecommended] = useState(searchParams.get('sort') === 'recommended');

    const updateURL = () => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) params.set('search', searchTerm); else params.delete('search');
        if (selectedTopic !== 'all') params.set('topic', selectedTopic); else params.delete('topic');
        if (selectedLevel !== 'all') params.set('level', selectedLevel); else params.delete('level');
        if (selectedFormat !== 'all') params.set('format', selectedFormat); else params.delete('format');
        if (showRecommended) params.set('sort', 'recommended'); else params.delete('sort');
        router.replace(`${pathname}?${params.toString()}`);
    };
    
    // Use a debounce effect for search input
    useEffect(() => {
        const handler = setTimeout(() => {
            updateURL();
        }, 500); // 500ms debounce
        return () => clearTimeout(handler);
    }, [searchTerm, selectedTopic, selectedLevel, selectedFormat, showRecommended]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTopic('all');
        setSelectedLevel('all');
        setSelectedFormat('all');
        setShowRecommended(false);
        router.replace(pathname);
    }
    
    const activeFilterCount =
        (searchTerm ? 1 : 0) +
        (selectedTopic !== 'all' ? 1 : 0) +
        (selectedLevel !== 'all' ? 1 : 0) +
        (selectedFormat !== 'all' ? 1 : 0) +
        (showRecommended ? 1 : 0);

    return (
        <Card className="p-4 sm:p-6 mb-8 sticky top-16 z-30 bg-background/90 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search courses..." 
                        className="pl-9" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger><SelectValue placeholder="All Topics" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        {topics.map(topic => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger><SelectValue placeholder="All Levels" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger><SelectValue placeholder="All Formats" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Formats</SelectItem>
                        {formats.map(format => <SelectItem key={format} value={format}>{format}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t gap-4">
                <div className="flex items-center space-x-2">
                    <Switch id="recommended-filter" checked={showRecommended} onCheckedChange={setShowRecommended} />
                    <Label htmlFor="recommended-filter">Sort by Recommended</Label>
                </div>
                {activeFilterCount > 0 && (
                    <Button variant="ghost" onClick={clearFilters} className="text-sm">
                        <X className="mr-2 h-4 w-4" />
                        Clear {activeFilterCount} Filter{activeFilterCount > 1 && 's'}
                    </Button>
                )}
            </div>
        </Card>
    );
}
