import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma'

// Fetch analysis data (used by Pareto & 5 Whys to get previous data)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId");
  const type = searchParams.get("type");

  try {
    const analyse = await prisma.analyse.findFirst({
      where: { workflowId, type },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(analyse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Save or Update analysis data
export async function POST(req) {
  try {
    const { workflowId, type, contenu } = await req.json();

    // We use upsert-like logic: If an analysis of this type exists for this workflow, update it.
    const existing = await prisma.analyse.findFirst({
      where: { workflowId, type }
    });

    let result;
    if (existing) {
      result = await prisma.analyse.update({
        where: { id: existing.id },
        data: { contenu }
      });
    } else {
      result = await prisma.analyse.create({
        data: { workflowId, type, contenu }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}