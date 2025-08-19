
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        cookies().delete('aether_user_id');
        cookies().delete('aether_user_name');
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 });
    }
}
