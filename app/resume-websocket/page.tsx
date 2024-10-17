'use client';

import Head from 'next/head';
import WebSocketComponent from '../components/WebSocketComponent.';

const Home = () => {
  return (
    <div>
      <Head>
        <title>WebSocket com Next.js</title>
        <meta name="description" content="Exemplo de WebSocket em Next.js" />
      </Head>
      <main className="flex flex-col gap-10 bg-gray-100 p-6 md:p-10 text-primary">
        <section>
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-primary font-bold text-xl md:text-2xl mb-4">
              Atenção:
            </h2>
            <p className="font-semibold text-sm md:text-base">
             1.{' '}
              <strong className="text-primary">Se Conecte</strong>
            </p>
            <p className="font-semibold text-sm md:text-base">
             2.{' '}
              <strong className="text-primary">Gerar QR Code PIX</strong>
            </p>
            <p className="font-semibold text-sm md:text-base">
             3.{' '}
              <strong className="text-primary">Efetuar o Pagamento</strong>
            </p>
            <p className="font-semibold text-sm md:text-base">
             4.{' '}
              <strong className="text-primary">Verificar o recebimento e confirmar</strong>
            </p>
          </div>
        </section>

        <section className="flex justify-center">
          <div className="w-full max-w-lg">
            <WebSocketComponent />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
