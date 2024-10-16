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
              Ao efetuar o pagamento, verifique se o botão{' '}
              <strong className="text-primary">Confirmar Pagamento</strong> se
              encontra.
            </p>
            <p className="font-semibold text-sm md:text-base">
              Caso contrário, entre em contato conosco, com o{' '}
              <strong className="text-primary">comprovante</strong>, que iremos
              autorizar o download.
            </p>
            <p className="font-semibold text-sm md:text-base">
              Não <strong className="text-primary">atualize</strong> a página
              até o botão ser gerado.
            </p>
            <p className="font-semibold text-sm md:text-base">
              Não <strong className="text-primary">gerar o QRCode</strong> se
              estiver <strong className="text-red-600">desconectado.</strong>{' '}
              Sendo assim, atualize a página.
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
