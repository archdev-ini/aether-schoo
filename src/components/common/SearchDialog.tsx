
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { File, Book, Bot, Search as SearchIcon } from 'lucide-react';

// Mock Data - In a real app, this would come from a unified search API
const allContent = [
    { id: "1", title: "Parametric Design with Grasshopper", type: 'Primer', href: '/school/courses/1' },
    { id: "2", title: "Sustainable Materials in West Africa", type: 'Course', href: '/school/courses/2' },
    { id: "3", title: "BIM Fundamentals with Revit", type: 'Course', href: '/school/courses/3' },
    { id: "4", title: "AI for Site Analysis", type: 'Primer', href: '/school/courses/4' },
    { id: "5", title: "The Great Mosque of Djenné: An Archive", type: 'Archive', href: '/school/courses/5' },
    { id: "6", title: "Design Thinking for Architects", type: 'Primer', href: '/school/courses/6' },
];

const mainPages = [
    { title: 'Home', href: '/' },
    { title: 'Programs', href: '/programs' },
    { title: 'Community', href: '/community' },
    { title: 'Events', href: '/events' },
    { title: 'Impact', href: '/impact' },
    { title: 'About', href: '/about' },
    { title: 'Join', href: '/join' },
    { title: 'Discover', href: '/discover' },
]

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');

  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  const filteredContent = query ? allContent.filter(item => item.title.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for courses, pages, or anything..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {query.length > 0 && (
            <CommandGroup heading="Content">
                {filteredContent.map(item => (
                    <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => runCommand(() => router.push(item.href))}
                    >
                        <Book className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
        )}

        <CommandGroup heading="Pages">
            {mainPages.map(page => (
                 <CommandItem
                    key={page.href}
                    value={page.title}
                    onSelect={() => runCommand(() => router.push(page.href))}
                >
                    <File className="mr-2 h-4 w-4" />
                    <span>{page.title}</span>
                </CommandItem>
            ))}
        </CommandGroup>
        
        <CommandGroup heading="AI Tools">
             <CommandItem onSelect={() => runCommand(() => router.push('/discover'))}>
                <Bot className="mr-2 h-4 w-4" />
                <span>Discover Your Path</span>
             </CommandItem>
        </CommandGroup>
        
        {query.length > 0 && (
             <CommandGroup heading="Search">
                 <CommandItem onSelect={() => runCommand(() => router.push(`/search?q=${query}`))}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    <span>Search for "{query}"</span>
                </CommandItem>
            </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
