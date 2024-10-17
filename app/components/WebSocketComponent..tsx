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

  useEffect(() => {
    const newSocket = new WebSocket('wss://pix.empregospara.com/ws/'); // Substitua pela sua URL de WebSocket

    newSocket.onopen = () => {
      console.log('Conexão WebSocket aberta');
      setIsConnected(true);

      // Abre um popup invisível
      const popup = window.open('https://pix.empregospara.com/', '_blank', 'width=1,height=1,left=-1000,top=-1000');
      if (popup) {
        popup.close(); // Fecha o popup imediatamente
      }
    };

    newSocket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log('Dados recebidos:', receivedData);

      if (receivedData.type === 'PAYMENT_RECEIVED' && receivedData.data) {
        const { txid, endToEndId, valor, horario, data } = receivedData.data;
        setPayments((prevPayments) => [
          ...prevPayments,
          { txid, endToEndId, valor, horario, data }
        ]);
        setLatestPayment({ txid, endToEndId, valor, horario, data });
      } else {
        console.error('Tipo de mensagem inesperado ou dados ausentes:', receivedData);
      }
    };

    newSocket.onclose = () => {
      console.log('Conexão WebSocket fechada');
      setIsConnected(false);
    };

    newSocket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      setIsConnected(false);
    };

    setSocket(newSocket);

    // Limpeza da conexão ao desmontar o componente
    return () => {
      newSocket.close();
    };
  }, []);
  const generateQrCode = async () => {
    try {
      const response = await axios.get('https://pix.empregospara.com/');
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmPayment = () => {
    if (latestPayment) {
      const { txid, endToEndId } = latestPayment;
      window.location.href = `/resume-builder?txid=${txid}&endToEndId=${endToEndId}`;
    } else {
      console.error('Nenhum pagamento recente para confirmar.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white text-primary shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Gerar Pagamento PIX</h1>
        
        {/* Exibir o status da conexão */}
        <div className="text-center mb-4">
          {isConnected ? (
            <span className="text-green-600 font-bold">Conectado</span>
          ) : (
            <span className="text-red-600 font-bold">Desconectado</span>
          )}
        </div>

        {/* Exibir o botão de gerar QR Code apenas se conectado */}
        {isConnected && (
          <button 
            type="button" 
            className="w-full h-12 text-white bg-primary rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            onClick={generateQrCode}
          >
            Gerar QR Code PIX
          </button>
        )}

        {qrcodeUrl && (
          <div className="mt-6 flex flex-col items-center">
            <Image 
              src={qrcodeUrl} 
              alt="QR Code" 
              width={200} 
              height={200}
            />
            
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

        {/* Exibir o último pagamento recebido */}
        {latestPayment && (
          <div className="mt-6 text-black">
            <h2 className="text-xl font-bold">Último Pagamento Recebido:</h2>
            <p><strong className='text-primary'>TxID:</strong> {latestPayment.txid}</p>
            <p><strong className='text-primary'>End To End ID:</strong> {latestPayment.endToEndId}</p>
            <p><strong className='text-primary'>Valor:</strong> R$ {latestPayment.valor.toFixed(2)}</p>
            <p><strong className='text-primary'>Horário:</strong> {latestPayment.horario}</p>
            <button 
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleConfirmPayment}
            >
              Confirmar Pagamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebSocketComponent;
