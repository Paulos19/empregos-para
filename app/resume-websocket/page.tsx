'use client'

import Head from 'next/head';
import WebSocketComponent from '../components/WebSocketComponent.';

const Home = () => {
    return (
        <div>
            <Head>
                <title>WebSocket com Next.js</title>
                <meta name="description" content="Exemplo de WebSocket em Next.js" />
            </Head>
            <main className=' gap-10 bg-gray-100" mb-9 text-primary'>
                <section>
                <div className='ml-12 mb-10'>
                    <h2 className='text-primary font-bold'>Atenção:</h2>
                    <p className='font-semibold'>Ao efetuar o pagamento, verifique se o botão <strong className='text-primary'>Confirmar Pagamento</strong> se encontra</p>
                    <p className='font-semibold'>Caso contrário, entre em contato conosco, com o <strong className='text-primary'>comprovante</strong>, que iremos autorizar o download</p>
                    <p className='font-semibold'>Não <strong className='text-primary'>atualize</strong> a página até o botão ser gerado</p>
                    <p className='font-semibold'>Não <strong className='text-primary'>gerar o QRCode</strong> se estiver <strong className='text-red-600'>desconectado.</strong> Sendo assim, atualize a página</p>
                </div>
            </section>
                <WebSocketComponent />
            </main>
        </div>
    );
};

export default Home;