import React from 'react';
import { Radio, Video, Calendar, Clock, ExternalLink } from 'lucide-react';
import { BlockInstance, ChurchLiveStreamInfo } from '../../../types';
import { INITIAL_DEMO_LIVESTREAM } from '../../live-stream/demoLiveStreamData';

export interface PublicLiveStreamBlockProps {
  block: BlockInstance;
  liveStreamInfo?: ChurchLiveStreamInfo;
}

export const PublicLiveStreamBlock: React.FC<PublicLiveStreamBlockProps> = ({
  block,
  liveStreamInfo = INITIAL_DEMO_LIVESTREAM,
}) => {
  const isLive = liveStreamInfo.status === 'live';
  const isScheduled = liveStreamInfo.status === 'scheduled';

  return (
    <div
      data-block-id={block.id}
      className="p-6 sm:p-8 rounded-2xl bg-stone-900 text-white border border-stone-800 shadow-xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Transmissão ao Vivo
              </h3>
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500 text-white uppercase tracking-wider animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  No Ar
                </span>
              ) : isScheduled ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Clock className="w-3 h-3" />
                  Culto Agendado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-800 text-stone-400">
                  Offline
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              Cultos transmitidos diretamente do Templo Sede
            </p>
          </div>
        </div>

        {liveStreamInfo.streamUrl && (
          <a
            href={liveStreamInfo.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Assistir Transmissão</span>
            <ExternalLink className="w-3 h-3 text-red-200" />
          </a>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-base sm:text-lg font-bold text-stone-100 font-serif">
          {liveStreamInfo.title}
        </h4>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-3xl">
          {liveStreamInfo.description}
        </p>
      </div>

      {isScheduled && liveStreamInfo.scheduledAt && (
        <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Próxima transmissão programada para:</span>
          <span className="font-semibold text-white font-mono">
            {new Date(liveStreamInfo.scheduledAt).toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </span>
        </div>
      )}
    </div>
  );
};
