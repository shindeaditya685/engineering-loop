import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This route is not implemented. Use Firebase client auth instead." },
    { status: 501 },
  );
}
