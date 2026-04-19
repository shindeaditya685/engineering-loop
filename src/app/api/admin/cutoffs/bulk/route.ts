import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = Array.isArray(body) ? body : [body];
    if (data.length === 0) return NextResponse.json({ error: 'No data' }, { status: 400 });
    if (!data[0].college || !data[0].program || !data[0].category || data[0].cutoff === undefined || !data[0].year) return NextResponse.json({ error: 'Each item needs: college, program, category, cutoff, year' }, { status: 400 });
    const batch = writeBatch(db);
    const colRef = collection(db, 'cutoffs');
    data.forEach((item: any) => { batch.set(doc(colRef), { college: item.college, type: item.type || 'IIT', program: item.program, category: item.category, cutoff: Number(item.cutoff), year: Number(item.year), createdAt: new Date().toISOString() }); });
    await batch.commit();
    return NextResponse.json({ success: true, imported: data.length });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Import failed' }, { status: 500 }); }
}
