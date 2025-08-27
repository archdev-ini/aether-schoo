
import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, CheckCircle, Clock, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAdminEvents, type AdminEvent } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

async function EventsTable() {
    const events = await getAdminEvents();

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="font-semibold">No Events Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Create a new event to get started.</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">RSVPs</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map((event) => (
                    <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{event.type}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
                        <TableCell>
                            <Badge variant={event.isPublished ? 'default' : 'secondary'} className={event.isPublished ? "bg-green-100 text-green-800" : ""}>
                                {event.isPublished ? <CheckCircle className="mr-2 h-4 w-4" /> : <Clock className="mr-2 h-4 w-4" />}
                                {event.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {event.rsvpCount}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                    <DropdownMenuItem>View Registrations</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function EventsTableSkeleton() {
    return (
        <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                     <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function ManageEventsDashboardPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Events Manager</h1>
                 <Button asChild>
                    <Link href="/admin/manage-events/new">
                        <PlusCircle className="mr-2" />
                        Create New Event
                    </Link>
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Event Calendar</CardTitle>
                    <CardDescription>Create and manage early design challenges and events.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                     <Suspense fallback={<EventsTableSkeleton />}>
                        <EventsTable />
                    </Suspense>
                </CardContent>
            </Card>
        </main>
    );
}
