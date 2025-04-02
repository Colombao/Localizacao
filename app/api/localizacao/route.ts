import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude } = await req.json();

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Latitude e longitude são obrigatórios" },
        { status: 400 }
      );
    }

    const localizacao = await prisma.localizacao.create({
      data: { latitude, longitude },
    });

    return NextResponse.json(localizacao, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
