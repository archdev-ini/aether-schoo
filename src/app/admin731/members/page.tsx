
import { Suspense } from 'react';
import { getMembers, type Member } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

async function MembersTable() {
  const members = await getMembers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Members</CardTitle>
        <CardDescription>A list of all members in the Aether ecosystem. Found {members.length} members.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Aether ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Platform</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell className="font-medium text-muted-foreground">{member.entryNumber}</TableCell>
                <TableCell>
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{member.aetherId}</Badge>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.location}</TableCell>
                <TableCell>{member.mainInterest}</TableCell>
                <TableCell>{member.preferredPlatform}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MembersTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Members</CardTitle>
                <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                             <TableHead>#</TableHead>
                             <TableHead>Name</TableHead>
                             <TableHead>Aether ID</TableHead>
                             <TableHead>Role</TableHead>
                             <TableHead>Location</TableHead>
                             <TableHead>Interest</TableHead>
                             <TableHead>Platform</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(10)].map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-24 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}

export default function MemberManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Member Management</h1>
        <p className="text-muted-foreground mt-1">View and manage community members.</p>
      </div>
      <Suspense fallback={<MembersTableSkeleton />}>
        <MembersTable />
      </Suspense>
    </div>
  );
}
