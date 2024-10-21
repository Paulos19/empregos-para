import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Obtém a URL do banco de dados a partir da variável de ambiente
const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não está definida no arquivo .env');
}

const pool = new Pool({
  connectionString,
});

export default pool;