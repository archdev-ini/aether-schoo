
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookText } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome! Manage your community and content from here.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View, search, and manage all members of the Aether ecosystem.</p>
            <Button asChild>
                <Link href="/admin731/members">
                    <Users className="mr-2 h-4 w-4" />
                    Go to Members
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Create, edit, and publish courses, primers, and other content.</p>
             <Button asChild>
                <Link href="/admin731/content">
                    <BookText className="mr-2 h-4 w-4" />
                    Go to Content
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
