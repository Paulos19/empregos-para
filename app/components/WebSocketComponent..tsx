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
  const [latestPayment, setLatestPayment] = useState<PaymentData | null>(null); // Armazena o último pagamento recebido

  useEffect(() => {
    const socket = new WebSocket('wss://pix.empregospara.com/ws/'); // Substitua pela sua URL de WebSocket

    socket.onopen = () => {
      console.log('Conexão WebSocket aberta');
    };

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log('Dados recebidos:', receivedData);

      if (receivedData.type === 'PAYMENT_RECEIVED' && receivedData.data) {
        const { txid, endToEndId, valor, horario, data } = receivedData.data;
        setPayments((prevPayments) => [
          ...prevPayments,
          { txid, endToEndId, valor, horario, data }
        ]);
        setLatestPayment({ txid, endToEndId, valor, horario, data }); // Atualiza o último pagamento recebido
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
      const response = await axios.get('https://pix.empregospara.com/pix');
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
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Gerar Pagamento PIX</h1>
        
        <button 
          type="button" 
          className="w-full h-12 text-white bg-primary rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          onClick={generateQrCode}
        >
          Gerar QR Code PIX
        </button>

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
          <div className="mt-6">
            <h2 className="text-xl font-bold">Último Pagamento Recebido:</h2>
            <p><strong>TxID:</strong> {latestPayment.txid}</p>
            <p><strong>End To End ID:</strong> {latestPayment.endToEndId}</p>
            <p><strong>Valor:</strong> R$ {latestPayment.valor.toFixed(2)}</p>
            <p><strong>Horário:</strong> {latestPayment.horario}</p>
            <p><strong>Data:</strong> {latestPayment.data}</p>
            <button 
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleConfirmPayment}
            >
              Confirmar Pagamento
            </button>
          </div>
        )}

        {/* Exibir todos os pagamentos recebidos */}
        {payments.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Todos os Pagamentos Recebidos:</h2>
            <ul>
              {payments.map((payment, index) => (
                <li key={index} className="mb-2">
                  <p><strong>TxID:</strong> {payment.txid}</p>
                  <p><strong>End To End ID:</strong> {payment.endToEndId}</p>
                  <p><strong>Valor:</strong> R$ {payment.valor.toFixed(2)}</p>
                  <p><strong>Horário:</strong> {payment.horario}</p>
                  <p><strong>Data:</strong> {payment.data}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebSocketComponent;
