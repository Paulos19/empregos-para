import Link from "next/link";
import { FlexboxSpacer } from "../components/FlexboxSpacer";
import { Marketing } from "./Marketing";


export const Hero = () => {
  return (
    <section className="lg:flex lg:h-[825px] lg:justify-center">
      <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
      <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <h1 className="text-primary pb-2 text-4xl font-semibold lg:text-5xl">
          CRIE SEU CURRÍCULO
          <br />
          PROFISSIONAL
        </h1>
        <p className="mt-3 text-grey-500 text-lg lg:mt-5 lg:text-xl">
          No conforto da sua casa
        </p>
        <Link href="/resume-import" className="btn-primary mt-6 lg:mt-14">
          Criar Currículo
        </Link>
        <p className="ml-1 mt-3 text-sm text-gray-500">Sem precisar de Registro</p>
        <p className="mt-3 text-sm text-gray-600 lg:mt-20">
          Você já possui um currículo? Teste o nosso{" "}
          <Link href="/resume-parser" className="underline underline-offset-2 text-primary">
            Currículo Parser
          </Link>
        </p>
      </div>
      <FlexboxSpacer maxWidth={100} minWidth={50} className="hidden lg:block" />{" "}
      
      <div className="justify-center lg:mt-4 lg:block lg:grow">
        <h1 className=" font-semibold text-primary mt-6">Anúncio</h1>
        <Marketing />
      </div>
      
    </section>
  );
};
