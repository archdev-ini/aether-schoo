
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ManageEventsDashboardPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Events Manager</h1>
                 <Button>
                    <PlusCircle className="mr-2" />
                    Create New Event
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Event Calendar</CardTitle>
                    <CardDescription>Create and manage early design challenges and events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Event management tools coming soon...</p>
                </CardContent>
            </Card>
        </main>
    );
}
