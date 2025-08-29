
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const cookieStore = cookies();
        cookieStore.delete('aether_user_id');
        cookieStore.delete('aether_user_name');
        cookieStore.delete('aether_user_role');
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 });
    }
}
