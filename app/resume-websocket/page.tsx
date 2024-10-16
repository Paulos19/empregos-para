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
            <main>
                <h1 className='text-primary font-bold ml-4'>Pagamento</h1>
                <WebSocketComponent />
            </main>
        </div>
    );
};

export default Home;