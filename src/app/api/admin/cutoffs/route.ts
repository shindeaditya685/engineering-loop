import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const college = searchParams.get('college');
    const program = searchParams.get('program');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const year = searchParams.get('year');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const snapshot = await getDocs(collection(db, 'cutoffs'));
    let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    if (college && college !== 'All') data = data.filter((d: any) => d.college === college);
    if (program && program !== 'All') data = data.filter((d: any) => d.program === program);
    if (category && category !== 'All') data = data.filter((d: any) => d.category === category);
    if (type && type !== 'All') data = data.filter((d: any) => d.type === type);
    if (year && year !== 'All') data = data.filter((d: any) => String(d.year) === year);
    data.sort((a: any, b: any) => (a.cutoff as number) - (b.cutoff as number));
    const total = data.length;
    const start = (page - 1) * limit;
    return NextResponse.json({ data: data.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const { college, type, program, category, cutoff, year } = await req.json();
    if (!college || !program || !category || cutoff === undefined || !year) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    await addDoc(collection(db, 'cutoffs'), { college, type: type || 'IIT', program, category, cutoff: Number(cutoff), year: Number(year), createdAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const updateData: Record<string, any> = {};
    if (fields.college) updateData.college = fields.college;
    if (fields.type) updateData.type = fields.type;
    if (fields.program) updateData.program = fields.program;
    if (fields.category) updateData.category = fields.category;
    if (fields.cutoff !== undefined) updateData.cutoff = Number(fields.cutoff);
    if (fields.year !== undefined) updateData.year = Number(fields.year);
    await updateDoc(doc(db, 'cutoffs', id), updateData);
    return NextResponse.json({ success: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    if (ids) { const batch = writeBatch(db); JSON.parse(ids).forEach((i: string) => batch.delete(doc(db, 'cutoffs', i))); await batch.commit(); return NextResponse.json({ success: true }); }
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await deleteDoc(doc(db, 'cutoffs', id));
    return NextResponse.json({ success: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
