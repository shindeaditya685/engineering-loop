import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "This route is not implemented. Session state is handled on the client." },
    { status: 501 },
  );
}
