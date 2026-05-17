import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.nom || body.valeurTrsGlobal === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const workflow = await prisma.workflow.create({
      data: {
        nom: body.nom,
        description: body.description || "", // Fallback to empty string
        valeurTrsGlobal: parseFloat(body.valeurTrsGlobal),
        statut: "EN_COURS",
      }
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Workflow Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}