
import { WorldMap } from '@/components/common/WorldMap';
import { getUserLocations, UserLocation } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

export default async function MapPage() {
  const userLocations = await getUserLocations();

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">One Global Ecosystem</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Aether is a borderless community. See where our members are learning, building, and dreaming from.
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-[16/9] w-full">
            <WorldMap users={userLocations} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 font-headline">Recent Members</h2>
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
      </div>
    </main>
  );
}
