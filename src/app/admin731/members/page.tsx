
import { Suspense } from 'react';
import { getMembers, type Member } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MemberFilters } from './filters';
import { MemberActions } from './MemberActions';

async function MembersTable({ search, role, interest, platform }: { search?: string, role?: string, interest?: string, platform?: string }) {
  const members = await getMembers({ search, role, interest, platform });

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
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
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
                <TableCell>
                    <Badge variant={member.status === 'Suspended' ? 'destructive' : 'default'}>
                        {member.status}
                    </Badge>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.location}</TableCell>
                <TableCell>{member.mainInterest}</TableCell>
                <TableCell>
                    <MemberActions memberId={member.id} currentStatus={member.status} />
                </TableCell>
              </TableRow>
            ))}
             {members.length === 0 && (
                <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                       No members found for the current filters.
                    </TableCell>
                </TableRow>
             )}
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
                             <TableHead>Status</TableHead>
                             <TableHead>Role</TableHead>
                             <TableHead>Location</TableHead>
                             <TableHead>Interest</TableHead>
                             <TableHead><span className="sr-only">Actions</span></TableHead>
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
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}

export default function MemberManagementPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const role = typeof searchParams.role === 'string' ? searchParams.role : undefined;
  const interest = typeof searchParams.interest === 'string' ? searchParams.interest : undefined;
  const platform = typeof searchParams.platform === 'string' ? searchParams.platform : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Member Management</h1>
        <p className="text-muted-foreground mt-1">View, search, and manage community members.</p>
      </div>
      <MemberFilters />
      <Suspense fallback={<MembersTableSkeleton />} key={`${search}-${role}-${interest}-${platform}`}>
        <MembersTable search={search} role={role} interest={interest} platform={platform} />
      </Suspense>
    </div>
  );
}
