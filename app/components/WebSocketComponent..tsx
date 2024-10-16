import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const WebSocketComponent = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [qrcodeUrl, setQrcodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket('wss://pix.empregospara.com/ws/'); // Substitua pela sua URL de WebSocket

    socket.onopen = () => {
      console.log('Conexão WebSocket aberta');
    };

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log('Dados recebidos:', receivedData);

      // Acesse o txid e endToEndId dentro do receivedData.data
      if (receivedData.type === 'PAYMENT_RECEIVED' && receivedData.data) {
        const { txid, endToEndId, valor, horario } = receivedData.data;

        console.log('Pagamento recebido:', receivedData.data);

        // Atualize o estado com os novos pagamentos recebidos
        setPayments((prevPayments) => [...prevPayments, receivedData.data]);

        // Verifique se txid e endToEndId estão presentes para redirecionar
        if (txid && endToEndId) {
          console.log('Redirecionando para /resume-builder com txid e endToEndId');
          setTimeout(() => {
            window.location.href = `/resume-builder?txid=${txid}&endToEndId=${endToEndId}`;
          }, 100); // Pequeno atraso de 100 ms
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
      socket.close(); // Fecha o WebSocket ao desmontar o componente
    };
  }, []);

  const generateQrCode = async () => {
    try {
      const response = await axios.get('https://pix.empregospara.com/pix');
      setQrcodeUrl(response.data.imageUrl); // Armazena a URL do QR Code no estado
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Pagamento Recebido</h1>
        {payments.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum pagamento recebido ainda.</p>
        ) : (
          <ul className="space-y-4">
            {payments.map((payment, index) => (
              <li key={index} className="border-b border-gray-200 pb-4">
                <p><strong>EndToEndId:</strong> {payment.endToEndId}</p>
                <p><strong>TxID:</strong> {payment.txid}</p>
                <p><strong>Valor:</strong> R$ {payment.valor}</p>
                <p><strong>Horário:</strong> {new Date(payment.horario).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Botão para gerar QR Code */}
        <button 
          type="button" 
          className="mt-6 w-full h-12 text-white bg-primary rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          onClick={generateQrCode}
        >
          Gerar QR Code PIX
        </button>

        {/* Exibir o QR Code se ele estiver disponível */}
        {qrcodeUrl && (
          <div className="mt-6 flex justify-center">
            <Image 
              src={qrcodeUrl} 
              alt="QR Code" 
              width={200} 
              height={200}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default WebSocketComponent;
