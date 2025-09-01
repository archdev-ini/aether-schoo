
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
import Link from 'next/link';

// In a real app, this would be fetched dynamically
const MOCK_COURSES = [
    { id: "1", title: "Parametric Design with Grasshopper", href: '/school/courses/1' },
    { id: "2", title: "Sustainable Materials in West Africa", href: '/school/courses/2' },
    { id: "3", title: "BIM Fundamentals with Revit", href: '/school/courses/3' },
    { id: "4", title: "AI for Site Analysis", href: '/school/courses/4' },
    { id: "5", title: "The Great Mosque of Djenné: An Archive", href: '/school/courses/5' },
];

const mainPages = [
    { title: 'Home', href: '/' },
    { title: 'Events', href: '/events' },
    { title: 'About', href: '/about' },
    { title: 'FAQ', href: '/faq' },
    { title: 'Join', href: '/join' },
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


  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for courses, pages, or anything..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Content">
            {MOCK_COURSES.map(item => (
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
             <CommandItem onSelect={() => runCommand(() => router.push('/coming-soon'))}>
                <Bot className="mr-2 h-4 w-4" />
                <span>Discover Your Path</span>
             </CommandItem>
        </CommandGroup>
        
        {query.length > 0 && (
             <CommandGroup heading="Search">
                 <CommandItem onSelect={() => runCommand(() => router.push(`/coming-soon`))}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    <span>Search for "{query}"</span>
                </CommandItem>
            </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
