
import { Suspense } from 'react';
import { WorldMap } from '@/components/common/WorldMap';
import { getUserLocations, UserLocation } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

async function MapData() {
  let userLocations: UserLocation[] = [];
  let error = null;

  try {
    userLocations = await getUserLocations();
  } catch (e: any) {
    console.error(e);
    error = e.message || 'An unknown error occurred.';
  }

  if (error) {
    return (
        <Card className="text-center p-8 border-destructive">
            <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <CardTitle>Could Not Load Map Data</CardTitle>
            <CardDescription className="mt-2">
                There was a problem fetching member locations. This may be due to a server configuration issue. Please try again later.
            </CardDescription>
        </Card>
    )
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-[16/9] w-full">
            <WorldMap users={userLocations} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 font-headline">Recent Members</h2>
        {userLocations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userLocations.slice(0, 8).map((user, index) => (
                <Card key={user.id} className="p-4" style={{ animationDelay: `${index * 100}ms`}}>
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold">{user.fullName.split(' ')[0]}</p>
                            <p className="text-sm text-muted-foreground">{user.location}</p>
                            <p className="text-xs text-muted-foreground mt-1">Interested in {user.mainInterest}</p>
                        </div>
                    </div>
                </Card>
            ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground">No member locations to display yet.</p>
        )}
      </div>
    </>
  );
}

function MapSkeleton() {
  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Skeleton className="aspect-[16/9] w-full" />
        </CardContent>
      </Card>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 font-headline">Recent Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default async function MapPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">One Global Ecosystem</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Aether is a borderless community. See where our members are learning, building, and dreaming from.
        </p>
      </div>
      
      <Suspense fallback={<MapSkeleton />}>
        <MapData />
      </Suspense>
    </main>
  );
}
