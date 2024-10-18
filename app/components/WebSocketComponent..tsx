import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface PaymentData {
  endToEndId: string;
  txid: string;
  valor: number;
  horario: string;
  data: string;
}

const WebSocketComponent: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [qrcodeUrl, setQrcodeUrl] = useState<string | null>(null);
  const [pixCopieECola, setPixCopieECola] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [latestPayment, setLatestPayment] = useState<PaymentData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const initWebSocket = () => {
      const newSocket = new WebSocket('wss://pix.empregospara.com/ws/');
      newSocket.onopen = () => setIsConnected(true);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        if (receivedData.type === 'PAYMENT_RECEIVED' && receivedData.data) {
          const { txid, endToEndId, valor, horario, data } = receivedData.data;
          setPayments((prevPayments) => [
            ...prevPayments,
            { txid, endToEndId, valor, horario, data }
          ]);
          setLatestPayment({ txid, endToEndId, valor, horario, data });
        }
      };
      newSocket.onclose = () => setIsConnected(false);
      newSocket.onerror = () => setIsConnected(false);
      setSocket(newSocket);
    };
    initWebSocket();
    return () => socket?.close();
  }, []);

  const generateQrCode = async () => {
    if (!fullName || !email) {
      setFormError('Nome completo e email são obrigatórios');
      return;
    }
    if (fullName.length < 7) {
      setFormError('O nome completo deve ter pelo menos 7 caracteres');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Forneça um email válido ');
      return;
    }
    try {
      await axios.post('/api/usuarios', { fullName, email }); // Salva os dados do usuário
      const response = await axios.get('https://pix.empregospara.com/');
      setQrcodeUrl(response.data.imageUrl);
      setPixCopieECola(response.data.pixCopieECola);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white text-primary shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Gerar Pagamento PIX</h1>
        
        <form className="space-y-4 text-primary">
          <div>
            <label className="block text-sm font-medium">Nome Completo</label>
            <input
              type="text"
              className="w-full border rounded-lg text-black p-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder='Nome Completo'
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border text-black rounded-lg p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              required
            />
          </div>
          {formError && <p className="text-red-500">{formError}</p>}
          <button
            type="button"
            className="w-full h-12 text-white bg-primary rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            onClick={generateQrCode}
          >
            Gerar QR Code PIX
          </button>
        </form>

        {qrcodeUrl && (
          <div className="mt-6 flex flex-col items-center">
            <Image src={qrcodeUrl} alt="QR Code" width={200} height={200} />
            {pixCopieECola && (
              <div className="mt-4 text-center">
                <p className="text-gray-700">Código Pix para copiar:</p>
                <p className="bg-gray-100 p-2 rounded-lg text-gray-900 break-all">{pixCopieECola}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WebSocketComponent;