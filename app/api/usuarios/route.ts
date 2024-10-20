import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Método GET: Para listar todos os usuários
export async function GET() {
  try {
    const users = await prisma.event.findMany(); // Busca todos os registros da tabela `event`
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

// Método POST: Para criar um novo usuário (fullName e email)
export async function POST(request: Request) {
  try {
    const { fullName, email } = await request.json();

    // Validação básica dos dados
    if (!fullName || !email) {
      return NextResponse.json({ error: 'Full name and email are required' }, { status: 400 });
    }

    // Cria um novo registro na tabela `event`
    const newUser = await prisma.event.create({
      data: {
        fullName,
        email,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}