
import { redirect } from 'next/navigation';

export default function AdminRootPage() {
    // The root of the admin section should always redirect to the main dashboard.
    redirect('/admin/dashboard');
}
