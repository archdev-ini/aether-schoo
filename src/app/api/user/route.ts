
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = cookies();
    const aetherId = cookieStore.get('aether_user_id')?.value;
    const fullName = cookieStore.get('aether_user_name')?.value;
    const role = cookieStore.get('aether_user_role')?.value;

    if (aetherId && fullName && role) {
        return NextResponse.json({ aetherId, fullName, role });
    }

    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}
