
import { ContentForm } from '../../ContentForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getContentById } from '../../actions';

export default async function EditContentPage({ params }: { params: { id: string } }) {
    const content = await getContentById(params.id);

    return (
        <div className="space-y-8">
            <Button variant="ghost" asChild>
                <Link href="/admin731/content">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Content List
                </Link>
            </Button>
            <ContentForm initialData={{...content, id: params.id}} />
        </div>
    )
}
