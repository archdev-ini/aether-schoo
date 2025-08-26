
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getCourses, type Course } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

async function CoursesTable() {
    const courses = await getCourses();

    if (!courses || courses.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="font-semibold">No Courses Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Start by creating a new course to see it here.</p>
            </div>
        )
    }
    
    return (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {courses.map((course) => (
                    <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{course.format}</Badge>
                        </TableCell>
                        <TableCell>
                             <Badge variant={course.isPublished ? 'default' : 'secondary'} className={course.isPublished ? "bg-green-100 text-green-800" : ""}>
                                {course.isPublished ? <CheckCircle className="mr-2 h-4 w-4" /> : <Clock className="mr-2 h-4 w-4" />}
                                {course.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(course.createdTime), 'PPP')}</TableCell>
                         <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                     <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function CoursesTableSkeleton() {
    return (
        <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                     <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function ContentManagementPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Content Control</h1>
                <Button>
                    <PlusCircle className="mr-2" />
                    Create New Course
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Course Library</CardTitle>
                    <CardDescription>Upload, edit, and release primers and resources.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Suspense fallback={<CoursesTableSkeleton />}>
                        <CoursesTable />
                    </Suspense>
                </CardContent>
            </Card>
        </main>
    );
}
