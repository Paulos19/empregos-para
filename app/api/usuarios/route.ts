import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const usuarios = await prisma.userPayment.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { fullName, email } = await request.json();

  if (!fullName || !email) {
    return NextResponse.json({ error: 'Nome completo e email são obrigatórios' }, { status: 400 });
  }

  try {
    const user = await prisma.userPayment.create({
      data: {
        fullName,
        email,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 });
  }
}
