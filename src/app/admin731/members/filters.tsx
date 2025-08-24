
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Loader2 } from "lucide-react";
import { Card } from '@/components/ui/card';

// These could be fetched dynamically, but hardcoding is fine for now
const ROLES = ['Student', 'Graduate', 'Professional'];
const INTERESTS = ['Courses', 'Studio', 'Community', 'Mentorship'];
const PLATFORMS = ['Discord', 'WhatsApp', 'Telegram'];

export function MemberFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [role, setRole] = useState(searchParams.get('role') || 'all');
    const [interest, setInterest] = useState(searchParams.get('interest') || 'all');
    const [platform, setPlatform] = useState(searchParams.get('platform') || 'all');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (searchTerm) params.set('search', searchTerm); else params.delete('search');
        if (role !== 'all') params.set('role', role); else params.delete('role');
        if (interest !== 'all') params.set('interest', interest); else params.delete('interest');
        if (platform !== 'all') params.set('platform', platform); else params.delete('platform');

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });

    }, [searchTerm, role, interest, platform, pathname, router]);

    const clearFilters = () => {
        setSearchTerm('');
        setRole('all');
        setInterest('all');
        setPlatform('all');
    }
    
    const activeFilterCount =
        (searchTerm ? 1 : 0) +
        (role !== 'all' ? 1 : 0) +
        (interest !== 'all' ? 1 : 0) +
        (platform !== 'all' ? 1 : 0);

    return (
        <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative">
                    <label htmlFor="search" className="text-sm font-medium text-muted-foreground">Search Name/Email/ID</label>
                    <Search className="absolute left-3 bottom-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="search"
                        placeholder="e.g. John Doe, AETH..." 
                        className="pl-9" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                     <label htmlFor="role" className="text-sm font-medium text-muted-foreground">Role</label>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="role"><SelectValue placeholder="All Roles" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <label htmlFor="interest" className="text-sm font-medium text-muted-foreground">Interest</label>
                    <Select value={interest} onValueChange={setInterest}>
                        <SelectTrigger id="interest"><SelectValue placeholder="All Interests" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Interests</SelectItem>
                            {INTERESTS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <label htmlFor="platform" className="text-sm font-medium text-muted-foreground">Platform</label>
                    <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger id="platform"><SelectValue placeholder="All Platforms" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="flex justify-between items-center mt-4 pt-4 border-t">
                {isPending ? <Loader2 className="animate-spin text-muted-foreground" /> : <div />}

                {activeFilterCount > 0 && (
                    <Button variant="ghost" onClick={clearFilters} className="text-sm text-muted-foreground">
                        <X className="mr-2 h-4 w-4" />
                        Clear {activeFilterCount} Filter{activeFilterCount > 1 && 's'}
                    </Button>
                )}
            </div>
        </Card>
    );
}
