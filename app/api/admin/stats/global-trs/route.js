import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const resources = await prisma.ressource.findMany({
      include: {
        trs: {
          orderBy: { id: 'desc' }, // Getting the latest ID
          take: 1 
        }
      }
    });

    // Extract values, ensuring we don't crash if trs array is empty
    const validTrsValues = resources
      .filter(r => r.trs && r.trs.length > 0)
      .map(r => r.trs[0].valeur);

    const average = validTrsValues.length > 0 
      ? validTrsValues.reduce((a, b) => a + b, 0) / validTrsValues.length 
      : 0;

    return NextResponse.json({ averageTrs: parseFloat(average.toFixed(2)) });
  } catch (error) {
    console.error("TRS Stats Error:", error);
    return NextResponse.json({ error: "Failed to calculate global TRS" }, { status: 500 });
  }
}