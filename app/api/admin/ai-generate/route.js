import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })

    verifyToken(token)

    const { prompt, planId } = await request.json()

    if (!prompt || !planId) {
      return NextResponse.json({ message: 'Prompt et planId requis' }, { status: 400 })
    }

    // Récupérer les données du plan et workflow
    const plan = await prisma.planAction.findUnique({
      where: { id: parseInt(planId) },
      include: {
        workflow: {
          include: { analyses: true }
        },
        actions: true
      }
    })

    if (!plan) {
      return NextResponse.json({ message: 'Plan non trouvé' }, { status: 404 })
    }

    // Construire le contexte depuis les analyses du workflow
    const analysesContext = plan.workflow?.analyses?.map(a =>
      `- ${a.type}: ${a.contenu}`
    ).join('\n') || 'Aucune analyse disponible'

    // Prompt enrichi avec le contexte
    const fullPrompt = `
Tu es un expert en amélioration industrielle TRS (Taux de Rendement Synthétique).

Contexte du workflow d'amélioration :
${analysesContext}

Question/Demande de l'utilisateur :
${prompt}

Génère des actions correctives concrètes et pratiques.
Réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "actions": [
    {
      "description": "Action concrète et détaillée à effectuer"
    }
  ]
}

Génère entre 3 et 6 actions pertinentes et réalisables.
`

    // Appeler Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(fullPrompt)
    const rawText = result.response.text()

    // Parser la réponse JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { message: 'Réponse IA invalide' },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Sauvegarder le prompt en DB
    await prisma.promptIA.upsert({
      where: { planId: parseInt(planId) },
      update: { contenu: prompt, reponse: rawText },
      create: { contenu: prompt, reponse: rawText, planId: parseInt(planId) }
    })

    return NextResponse.json({
      actions: parsed.actions
    })

  } catch (error) {
    console.error('[AI GENERATE ERROR]', error)
    return NextResponse.json(
      { message: 'Erreur lors de la génération IA' },
      { status: 500 }
    )
  }
}