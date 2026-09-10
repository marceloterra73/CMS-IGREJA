import React, { useState } from 'react';
import {
  Radio,
  Play,
  Calendar,
  Clock,
  Copy,
  Check,
  Eye,
  AlertCircle,
  VideoOff,
  ShieldCheck,
  Tv,
} from 'lucide-react';
import { ChurchLiveStreamInfo } from '../../types';

interface LiveStreamPreviewProps {
  liveStream: ChurchLiveStreamInfo;
}

export const LiveStreamPreview: React.FC<LiveStreamPreviewProps> = ({
  liveStream,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    if (!liveStream.streamUrl) return;
    navigator.clipboard?.writeText(liveStream.streamUrl).catch(() => {});
    setCopiedUrl(true);
    setTimeout(() => {
      setCopiedUrl(false);
    }, 2000);
  };

  const formatScheduledDate = (isoString?: string) => {
    if (!isoString) return 'Data não definida';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      id="livestream-preview-container"
      className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-6 space-y-6"
    >
      {/* Barra superior de identificação */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Pré-Visualização do Player no Site Público
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            liveStream.status === 'live'
              ? 'bg-red-100 text-red-800'
              : liveStream.status === 'scheduled'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-stone-200 text-stone-700'
          }`}
        >
          {liveStream.status === 'live' && (
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          )}
          {liveStream.status === 'live'
            ? 'Transmissão Ao Vivo'
            : liveStream.status === 'scheduled'
            ? 'Transmissão Agendada'
            : 'Transmissão Offline'}
        </span>
      </div>

      {/* Alerta de status quando não está ao vivo */}
      {liveStream.status === 'offline' && (
        <div
          id="livestream-preview-offline-alert"
          className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 flex items-start gap-2.5 text-xs"
        >
          <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p>
            A transmissão está configurada como <strong>Offline</strong>. No site
            público, os visitantes verão a mensagem orientativa de que não há
            transmissão ativa no momento.
          </p>
        </div>
      )}

      {liveStream.status === 'scheduled' && (
        <div
          id="livestream-preview-scheduled-alert"
          className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5 text-xs"
        >
          <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            Transmissão <strong>Agendada</strong> para:{' '}
            <strong>{formatScheduledDate(liveStream.scheduledAt)}</strong>. Os
            visitantes verão a programação e o horário de início da exibição.
          </p>
        </div>
      )}

      {/* Simulação Visual do Player Público (Totalmente local e estático — Sem iframes ou vídeo externo) */}
      <div
        id="livestream-simulated-player-card"
        className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-800"
      >
        {/* Janela de Proporção 16:9 */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Badge superior esquerda no player */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {liveStream.status === 'live' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                AO VIVO
              </div>
            ) : liveStream.status === 'scheduled' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                <Calendar className="w-3.5 h-3.5" />
                AGENDADO
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-700 text-stone-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                <VideoOff className="w-3.5 h-3.5" />
                OFFLINE
              </div>
            )}
          </div>

          {/* Conteúdo central do player simulado */}
          {liveStream.status === 'live' ? (
            <div className="flex flex-col items-center max-w-md px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/20 border-2 border-red-500/50 flex items-center justify-center text-red-400 mb-4 shadow-inner">
                <Radio className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
              </div>
              <h4 className="text-white text-lg sm:text-2xl font-bold tracking-tight line-clamp-2">
                {liveStream.title || 'Transmissão ao Vivo'}
              </h4>
              <p className="text-stone-400 text-xs sm:text-sm mt-2 line-clamp-2">
                {liveStream.description || 'Culto da igreja transmitido em tempo real.'}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 text-xs">
                <Play className="w-3 h-3 text-red-500 fill-red-500" />
                <span>Simulação do Player Oficial da Igreja</span>
              </div>
            </div>
          ) : liveStream.status === 'scheduled' ? (
            <div className="flex flex-col items-center max-w-md px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4">
                <Clock className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h4 className="text-white text-base sm:text-xl font-bold tracking-tight">
                {liveStream.title || 'Próxima Transmissão'}
              </h4>
              <p className="text-blue-300 font-semibold text-xs sm:text-sm mt-1.5">
                Início: {formatScheduledDate(liveStream.scheduledAt)}
              </p>
              <p className="text-stone-400 text-xs mt-2 line-clamp-2">
                {liveStream.description || 'Defina um lembrete para acompanhar o culto no horário programado.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center max-w-md px-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 mb-3">
                <Tv className="w-7 h-7" />
              </div>
              <h4 className="text-stone-200 text-base sm:text-lg font-bold">
                Nenhuma transmissão ativa no momento
              </h4>
              <p className="text-stone-400 text-xs mt-1.5 max-w-sm">
                Consulte nossa agenda de cultos presenciais ou assista aos sermões e
                mensagens gravadas disponíveis no site.
              </p>
            </div>
          )}

          {/* Barra inferior simulada de controles */}
          <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-xs px-4 py-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/80">
            <span className="truncate max-w-[200px] sm:max-w-xs font-mono">
              {liveStream.streamUrl ? liveStream.streamUrl : 'URL não configurada'}
            </span>
            <span className="shrink-0 text-stone-500">Player Visual Estático</span>
          </div>
        </div>

        {/* Detalhes complementares abaixo do player simulado */}
        <div className="p-4 sm:p-6 bg-white text-stone-900 border-t border-stone-200">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                {liveStream.title || 'Título da Transmissão'}
              </h3>
              {liveStream.description && (
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  {liveStream.description}
                </p>
              )}
            </div>

            {liveStream.streamUrl && (
              <button
                type="button"
                id="livestream-preview-copy-btn"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 active:bg-stone-200 text-xs font-bold text-stone-700 shrink-0 transition-colors cursor-pointer"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Copiar Link do Stream</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dados declarativos gerenciados pelo CMS Visual da congregação</span>
            </div>
            <span className="font-mono text-[10px]">Tenant: {liveStream.tenantId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
