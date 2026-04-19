import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    // DEBUG: Remove this after confirming
    console.log('TYPED PASSWORD:', password);
    console.log('ENV PASSWORD:', process.env.ADMIN_PASSWORD);
    console.log('MATCH:', password === process.env.ADMIN_PASSWORD);

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ 
        error: 'Invalid password',
        debug: process.env.ADMIN_PASSWORD ? 'ENV is set but mismatch' : 'ENV is MISSING' 
      }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'fallback_secret');
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.json({ success: true });
}