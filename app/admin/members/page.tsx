
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getMembers, type Member } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


async function MembersTable() {
    const members = await getMembers();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Aether ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined On</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => (
                    <TableRow key={member.aetherId}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member.aetherId}`} alt="Avatar" />
                                    <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5">
                                    <p className="font-medium">{member.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline" className="font-mono">{member.aetherId}</Badge>
                        </TableCell>
                         <TableCell>
                            <Badge variant={member.status === 'Prelaunch-Active' ? 'default' : 'secondary'} className={member.status === 'Prelaunch-Active' ? "bg-green-100 text-green-800" : ""}>
                                {member.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{member.location}</TableCell>
                        <TableCell>{format(new Date(member.createdTime), 'PPP')}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function MembersTableSkeleton() {
    return (
        <div className="space-y-4 p-6">
            {[...Array(10)].map((_, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            ))}
        </div>
    )
}


export default function MembersManagementPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Member Management</h1>
                <Button>
                    <Download className="mr-2" />
                    Export CSV
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Member Directory</CardTitle>
                    <CardDescription>View, search, and manage all members in the Aether ecosystem.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Suspense fallback={<MembersTableSkeleton />}>
                        <MembersTable />
                    </Suspense>
                </CardContent>
            </Card>
        </main>
    );
}
