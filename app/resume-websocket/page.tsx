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
          <div className="mb-8 text-center items-center md:text-left space-y-4 md:space-y-6">
            <h2 className="text-primary font-bold text-xl md:text-2xl mb-4">
              Atenção:
            </h2>
            {/* Container flex para alinhar os números e textos */}
            <div className="flex flex-col space-y-2">
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
              <p className="font-semibold text-sm md:text-base">
                5.{' '}
                <strong className="text-primary">Após confirmar o pagamento, você será redirecionado à página anterior, com o{' '}
                  <button className="ml-1 cursor-default flex items-center gap-1 rounded-lg bg-primary px-3 py-0.5 hover:bg-gray-100 lg:ml-8">
                    Baixar Currículo
                  </button>{' '}
                  ativo, no final</strong>
              </p>
            </div>
          </div>
        </section>

        <section className="flex justify-center mt-8 sm:mt-10">
          <div className="w-full max-w-md md:max-w-lg">
            <WebSocketComponent />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;