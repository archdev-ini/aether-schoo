
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import type { LearningItem } from '@/app/profile/actions';

interface LearningProgressProps {
  learningData: LearningItem[];
}

export function LearningProgress({ learningData }: LearningProgressProps) {
  const primers = learningData.filter(item => item.format === 'Primer');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Access</CardTitle>
        <CardDescription>Start with our foundational primers to get up to speed on key topics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {primers.length > 0 ? (
          <div className="space-y-3">
            {primers.map(primer => (
              <Link key={primer.id} href={`/school/courses/${primer.slug}`} passHref>
                <div className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                        <p className="font-semibold">{primer.title}</p>
                    </div>
                    {primer.isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No primers available at the moment. Check back soon!
          </p>
        )}
        
        <div className="pt-4">
            <Button asChild variant="outline" className="w-full">
                <Link href="/school/courses">
                    Browse Full Course Library <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
