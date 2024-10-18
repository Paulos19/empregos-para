import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Inicialize diretamente

export async function GET(request: NextRequest) {
  try {
    const usuarios = await prisma.userPayment.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email } = await request.json();

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Nome completo e email são obrigatórios' }, { status: 400 });
    }

    if (fullName.length < 7) {
      return NextResponse.json({ error: 'O nome completo deve ter pelo menos 7 caracteres' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Forneça um email válido' }, { status: 400 });
    }

    const user = await prisma.userPayment.create({
      data: {
        fullName,
        email,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao salvar usuário:', error); // Log do erro
    return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 });
  }
}
