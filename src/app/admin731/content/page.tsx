
import { Suspense } from 'react';
import { getContent, type ContentData } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { ContentActions } from './ContentActions';

async function ContentTable() {
  const content = await getContent();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>All Content</CardTitle>
                <CardDescription>A list of all primers, courses, and archives in the system. Found {content.length} items.</CardDescription>
            </div>
             <Button asChild>
                <Link href="/admin731/content/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Content
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>URL</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.format}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.contentUrl ? (
                    <Link href={item.contentUrl} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      Link
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                    <ContentActions contentId={item.id} />
                </TableCell>
              </TableRow>
            ))}
             {content.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No content found. Add your first piece of content to get started.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ContentTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>All Content</CardTitle>
                        <CardDescription><Skeleton className="h-4 w-64 mt-1" /></CardDescription>
                    </div>
                     <Skeleton className="h-10 w-36" />
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}

export default function ContentManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Content Management</h1>
        <p className="text-muted-foreground mt-1">Create, edit, and manage all educational content.</p>
      </div>
      <Suspense fallback={<ContentTableSkeleton />}>
        <ContentTable />
      </Suspense>
    </div>
  );
}
