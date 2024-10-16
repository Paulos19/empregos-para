import Image from "next/image";
import { Hero } from "./home/Hero";
import { Steps } from "./home/Steps";
import { auth } from "./services/auth";

export default async function Home() {
  const session = await auth()
  return (
    <main className="mx-auto max-w-screen-2xl bg-dot px-8 text-gray-900 lg:px-12">
      <Hero />
      <Steps />
    </main>
  );
}
