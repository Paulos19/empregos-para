import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { useSetDefaultScale } from "./hooks";
import { usePDF } from '@react-pdf/renderer';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Funções auxiliares para lidar com o pagamento
const fetchPaymentStatus = async (userId: string) => {
  try {
    const response = await fetch(`/api/check-charge-status?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.status;
    } else {
      console.error('Failed to fetch charge status');
      return 'unknown';
    }
  } catch (error) {
    console.error('Error fetching charge status:', error);
    return 'error';
  }
};

const updateDownloadStatus = async (userId: string) => {
  try {
    const response = await fetch(`/api/update-download-status?userId=${userId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      console.error('Failed to update download status');
    }
  } catch (error) {
    console.error('Error updating download status:', error);
  }
};

// Componente Principal
const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });
  const [buttonVisible, setButtonVisible] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false); // Estado para monitorar se o download foi concluído
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('userId');
  const txid = searchParams.get('txid');

  useEffect(() => {
    update(document);
  }, [update, document]);

  // Verifica o status de download do pagamento
  useEffect(() => {
    const checkDownloadStatus = async () => {
      if (txid) {
        const status = await fetchPaymentStatus(txid);
        setButtonVisible(status !== 'downloaded'); // Exibe o botão se o status não for 'downloaded'
      } else {
        setButtonVisible(false);
      }
    };

    checkDownloadStatus();
  }, [txid]);

  // Ação para download
  const handleDownload = async () => {
    if (txid) {
      await updateDownloadStatus(txid);
      setButtonVisible(false); // Esconde o botão após o download
      setDownloadComplete(true); // Marca o download como completo
    }
  };

  // Redireciona após o download ser concluído
  useEffect(() => {
    if (downloadComplete) {
      router.push('/resume-builder'); // Substitua pela rota desejada
    }
  }, [downloadComplete, router]);

  // Verifica a presença de txid e endToEndId na URL


  return (
    <div className="flex-row bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={true}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      {buttonVisible && ( // Renderiza o botão se txid e endToEndId estiverem presentes
        <button onClick={handleDownload}>
          <a
            className="ml-1 flex items-center gap-1 rounded-lg bg-primary px-3 py-0.5 hover:bg-gray-100 lg:ml-8"
            href={instance.url!}
            download={fileName}
          >
            <ArrowDownTrayIcon className="h-4 w-4 text-white" />
            <span className="whitespace-nowrap">Baixar Currículo</span>
          </a>
        </button>
      )}   
    </div>
  );
};

// Habilitando CSR para esse componente
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);
