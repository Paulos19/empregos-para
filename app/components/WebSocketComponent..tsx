import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface PaymentData {
  endToEndId: string;
  txid: string;
  valor: number;
  horario: string;
}

const WebSocketComponent: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [qrcodeUrl, setQrcodeUrl] = useState<string | null>(null);
  const [pixCopieECola, setPixCopieECola] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('wss://pix.empregospara.com/ws/'); // Substitua pela sua URL de WebSocket

    socket.onopen = () => {
      console.log('Conexão WebSocket aberta');
    };

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log('Dados recebidos:', receivedData);

      if (receivedData.type === 'PAYMENT_RECEIVED' && receivedData.data) {
        const { txid, endToEndId, valor, horario } = receivedData.data;
        setPayments((prevPayments) => [...prevPayments, receivedData.data]);

        if (txid && endToEndId) {
          setTimeout(() => {
            window.location.href = `/resume-builder?txid=${txid}&endToEndId=${endToEndId}`;
          }, 100);
        } else {
          console.error('txid ou endToEndId ausente nos dados:', receivedData.data);
        }
      } else {
        console.error('Tipo de mensagem inesperado ou dados ausentes:', receivedData);
      }
    };

    socket.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const generateQrCode = async () => {
    try {
      // Faz a chamada à API para gerar o QR Code e o código Pix
      const response = await axios.get('https://pix.empregospara.com/pix');
      
      // Armazena o QR Code e o código Pix no estado
      setQrcodeUrl(response.data.imageUrl); 
      setPixCopieECola(response.data.pixCopieECola); 
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleCopy = () => {
    if (pixCopieECola) {
      navigator.clipboard.writeText(pixCopieECola);
      setCopied(true);

      // Reverte o estado de "Copiado!" após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Gerar Pagamento PIX</h1>
        
        {/* Botão para gerar QR Code */}
        <button 
          type="button" 
          className="w-full h-12 text-white bg-primary rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          onClick={generateQrCode}
        >
          Gerar QR Code PIX
        </button>

        {/* Exibir o QR Code se ele estiver disponível */}
        {qrcodeUrl && (
          <div className="mt-6 flex flex-col items-center">
            <Image 
              src={qrcodeUrl} 
              alt="QR Code" 
              width={200} 
              height={200}
            />
            
            {/* Exibir o código Pix "Copie e Cole" */}
            {pixCopieECola && (
              <div className="mt-4 text-center">
                <p className="text-gray-700">Código Pix para copiar:</p>
                <p className="bg-gray-100 p-2 rounded-lg text-gray-900 break-all">{pixCopieECola}</p>
                <button
                  onClick={handleCopy}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? "Copiado!" : "Copiar Código Pix"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WebSocketComponent;
