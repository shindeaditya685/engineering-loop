import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin bookings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await deleteDoc(doc(db, 'bookings', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin bookings DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await updateDoc(doc(db, 'bookings', id), { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin bookings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}