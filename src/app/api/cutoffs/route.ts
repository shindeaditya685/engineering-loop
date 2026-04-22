/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const college = searchParams.get("college");
    const program = searchParams.get("program");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const year = searchParams.get("year");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const snapshot = await getDocs(collection(db, "cutoffs"));
    // eslint-disable-next-line prefer-const
    let allData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    const colleges = [...new Set(allData.map((d: any) => d.college))].sort();
    const programs = [...new Set(allData.map((d: any) => d.program))].sort();
    const categories = [...new Set(allData.map((d: any) => d.category))].sort();
    const types = [...new Set(allData.map((d: any) => d.type))].sort();
    const years = [...new Set(allData.map((d: any) => d.year))].sort(
      (a: any, b: any) => b - a,
    );
    let filtered = allData;
    if (college && college !== "All")
      filtered = filtered.filter((d: any) => d.college === college);
    if (program && program !== "All")
      filtered = filtered.filter((d: any) => d.program === program);
    if (category && category !== "All")
      filtered = filtered.filter((d: any) => d.category === category);
    if (type && type !== "All")
      filtered = filtered.filter((d: any) => d.type === type);
    if (year && year !== "All")
      filtered = filtered.filter((d: any) => String(d.year) === year);
    filtered.sort(
      (a: any, b: any) => (a.cutoff as number) - (b.cutoff as number),
    );
    const total = filtered.length;
    const start = (page - 1) * limit;
    return NextResponse.json({
      data: filtered.slice(start, start + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      filters: { colleges, programs, categories, types, years },
      stats: {
        total: allData.length,
        colleges: colleges.length,
        programs: programs.length,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
