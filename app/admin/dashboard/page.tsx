
import { Suspense } from 'react';
import Link from "next/link";
import { ArrowUpRight, BookOpen, UserCheck, Users, HardHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { getSignupCount } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { getMembers } from '../members/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


async function StatCards() {
    const signupCount = await getSignupCount();
    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{signupCount}</div>
                    <p className="text-xs text-muted-foreground">Founding members in the ecosystem.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">Analytics coming soon</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Primer Completions</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">Course analytics coming soon</p>
                </CardContent>
            </Card>
        </div>
    )
}

function StatCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card><CardHeader><Skeleton className="h-6 w-3/4"/></CardHeader><CardContent><Skeleton className="h-8 w-1/2"/><Skeleton className="h-4 w-full mt-2"/></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-3/4"/></CardHeader><CardContent><Skeleton className="h-8 w-1/2"/><Skeleton className="h-4 w-full mt-2"/></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-3/4"/></CardHeader><CardContent><Skeleton className="h-8 w-1/2"/><Skeleton className="h-4 w-full mt-2"/></CardContent></Card>
        </div>
    )
}

async function RecentSignups() {
    const members = await getMembers();
    const recentMembers = members.slice(0, 5);

    return (
         <Card>
            <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                 <CardDescription>The newest members to join the Aether ecosystem.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentMembers.map((member) => (
                        <div key={member.aetherId} className="flex items-center gap-4">
                             <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member.aetherId}`} alt="Avatar" />
                                <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">{member.fullName}</p>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                             <div className="ml-auto font-medium text-sm text-muted-foreground">{member.location}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function RecentSignupsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <CardDescription>The newest members to join the Aether ecosystem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function PlaceholderCard({ title, description }: { title: string, description: string}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
             <CardContent className="flex flex-col items-center justify-center text-center py-12">
                <HardHat className="w-12 h-12 text-muted-foreground mb-4"/>
                <p className="text-sm text-muted-foreground">This feature is in development and will be available soon.</p>
            </CardContent>
        </Card>
    )
}


export default function AdminDashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      
      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCards />
      </Suspense>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Suspense fallback={<RecentSignupsSkeleton />}>
            <RecentSignups />
        </Suspense>
        <PlaceholderCard title="Feedback Inbox" description="Collect user feedback on the dashboard experience." />
      </div>
    </main>
  )
}
