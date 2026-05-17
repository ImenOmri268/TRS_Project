import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId");
    const type = searchParams.get("type");

    if (!workflowId) return NextResponse.json({ error: "workflowId requis" }, { status: 400 });

    const analyses = await prisma.analyse.findMany({
      where: {
        // CRITICAL FIX: Convert the URL string "2" into the integer 2
        workflowId: parseInt(workflowId),
        type: type || undefined,
      },
    });

    return NextResponse.json(analyses);
  } catch (error) {
    console.error("GET Analyse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const analysis = await prisma.analyse.create({
      data: {
        // CRITICAL FIX: Convert workflowId to Integer
        workflowId: parseInt(body.workflowId),
        type: body.type,
        contenu: body.contenu,
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("POST Analyse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}