
import { ContentForm } from '../ContentForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewContentPage() {
    return (
        <div className="space-y-8">
            <Button variant="ghost" asChild>
                <Link href="/admin731/content">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Content List
                </Link>
            </Button>
            <ContentForm />
        </div>
    )
}
