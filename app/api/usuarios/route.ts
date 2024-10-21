
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.cbks4c60gizg.us-east-2.rds.amazonaws.com',
  database: 'event',
  password: 'password123',
  port: 5432,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT * FROM userpayment'); // Consulta na tabela userpayment
    client.release();

    return NextResponse.json(res.rows, { status: 200 });
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

    const client = await pool.connect();
    const query = 'INSERT INTO userpayment (full_name, email, create_at) VALUES ($1, $2, NOW()) RETURNING *';
    const values = [fullName, email];
    const res = await client.query(query, values);
    client.release();

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}