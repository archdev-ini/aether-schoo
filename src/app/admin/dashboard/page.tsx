
import { Suspense } from 'react';
import Link from "next/link";
import { ArrowUpRight, BookOpen, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { getSignupCount } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';


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

function PlaceholderCard({ title, description }: { title: string, description: string}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
             <CardContent>
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
        <PlaceholderCard title="Recent Signups" description="A list of the newest members to join." />
        <PlaceholderCard title="Feedback Inbox" description="Collect user feedback on the dashboard experience." />
      </div>
    </main>
  )
}
