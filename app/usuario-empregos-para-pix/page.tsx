'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
    id: string;
    fullName: string;
    email: string;
    createdAt: string; // Adicione esta linha
  }

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUsuarios = async () => {
        try {
          const response = await axios.get('/api/usuarios');
          const data = response.data;
  
          if (Array.isArray(data)) {
            setUsuarios(data);
          } else {
            setError('Os dados recebidos não são uma lista');
          }
        } catch (error) {
          setError('Erro ao buscar usuários');
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsuarios();
    }, []);
  
    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-primary mb-4 text-center">Lista de Usuários</h1>
          
          <table className="table-auto w-full bg-gray-100 rounded-lg">
            <thead>
              <tr className="text-center bg-primary">
                <th className="px-4 py-2">Nome Completo</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Data e Hora</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="text-center border-t">
                    <td className="px-4 py-2">{usuario.fullName}</td>
                    <td className="px-4 py-2">{usuario.email}</td>
                    <td className="px-4 py-2">{new Date(usuario.createdAt).toLocaleString()}</td> {/* Exibe a data e hora */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  

export default Usuarios;
