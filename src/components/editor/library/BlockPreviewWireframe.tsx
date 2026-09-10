import React from 'react';
import { BlockType } from '../../../types';

interface BlockPreviewWireframeProps {
  type: BlockType;
  className?: string;
}

/**
 * Renderizador de wireframe conceitual/abstrato para a Biblioteca Visual de Blocos.
 * Exibe a representação gráfica do layout típico de cada um dos 15 blocos canônicos.
 */
export const BlockPreviewWireframe: React.FC<BlockPreviewWireframeProps> = ({
  type,
  className = 'w-full h-24',
}) => {
  switch (type) {
    case 'header':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden select-none`}>
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-amber-600/80" />
              <div className="w-12 h-2 rounded bg-stone-700" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1.5 rounded bg-stone-300" />
              <div className="w-6 h-1.5 rounded bg-stone-300" />
              <div className="w-10 h-3 rounded bg-amber-600/80" />
            </div>
          </div>
          <div className="text-[9px] text-stone-400 text-center font-mono">
            Navegação Principal & Menu
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className={`${className} bg-stone-900 rounded-lg p-2.5 flex flex-col justify-center items-center text-center relative overflow-hidden select-none`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          <div className="relative z-10 w-full flex flex-col items-center gap-1.5">
            <div className="w-3/4 h-2.5 rounded bg-white/90" />
            <div className="w-1/2 h-1.5 rounded bg-white/50" />
            <div className="w-16 h-3 rounded-full bg-amber-500 mt-1" />
          </div>
        </div>
      );

    case 'about':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2.5 flex items-center gap-2 overflow-hidden select-none`}>
          <div className="w-1/3 h-full rounded bg-stone-200 flex items-center justify-center text-[8px] text-stone-500 font-semibold">
            Foto
          </div>
          <div className="w-2/3 flex flex-col gap-1.5">
            <div className="w-3/4 h-2 rounded bg-stone-800" />
            <div className="w-full h-1.5 rounded bg-stone-300" />
            <div className="w-5/6 h-1.5 rounded bg-stone-300" />
            <div className="w-1/2 h-1.5 rounded bg-stone-300" />
          </div>
        </div>
      );

    case 'ministries':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2 flex flex-col justify-center gap-1.5 overflow-hidden select-none`}>
          <div className="w-1/3 h-1.5 rounded bg-stone-800 self-center" />
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-stone-200 rounded p-1 flex flex-col items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-100 border border-amber-300" />
                <div className="w-full h-1 rounded bg-stone-300" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'schedule':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2 flex flex-col justify-center gap-1.5 overflow-hidden select-none`}>
          <div className="w-1/2 h-1.5 rounded bg-stone-800 self-center" />
          <div className="grid grid-cols-2 gap-1.5 w-full">
            <div className="bg-white border border-amber-200 rounded p-1.5 flex flex-col gap-1">
              <div className="w-10 h-1.5 rounded bg-amber-600" />
              <div className="w-14 h-1 rounded bg-stone-400" />
            </div>
            <div className="bg-white border border-stone-200 rounded p-1.5 flex flex-col gap-1">
              <div className="w-10 h-1.5 rounded bg-stone-700" />
              <div className="w-14 h-1 rounded bg-stone-400" />
            </div>
          </div>
        </div>
      );

    case 'events':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2 flex items-center justify-center gap-2 overflow-hidden select-none`}>
          <div className="bg-white border border-stone-200 rounded p-1.5 flex flex-1 items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-500 text-white flex flex-col items-center justify-center font-bold text-[8px] leading-tight">
              <span>DOM</span>
              <span>18</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="w-3/4 h-2 rounded bg-stone-800" />
              <div className="w-1/2 h-1.5 rounded bg-stone-400" />
            </div>
          </div>
        </div>
      );

    case 'news':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2 flex items-center justify-center gap-1.5 overflow-hidden select-none`}>
          <div className="w-1/2 bg-white border border-stone-200 rounded p-1 flex flex-col gap-1">
            <div className="w-full h-8 rounded bg-stone-200" />
            <div className="w-3/4 h-1.5 rounded bg-stone-700" />
          </div>
          <div className="w-1/2 bg-white border border-stone-200 rounded p-1 flex flex-col gap-1">
            <div className="w-full h-8 rounded bg-stone-200" />
            <div className="w-3/4 h-1.5 rounded bg-stone-700" />
          </div>
        </div>
      );

    case 'sermons':
      return (
        <div className={`${className} bg-stone-900 rounded-lg p-2 flex items-center justify-between gap-2 overflow-hidden select-none`}>
          <div className="w-1/2 h-full rounded bg-stone-800 border border-stone-700 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <div className="w-0 h-0 border-t-3 border-t-transparent border-l-4 border-l-white border-b-3 border-b-transparent ml-0.5" />
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-1">
            <div className="w-10 h-1.5 rounded bg-amber-400" />
            <div className="w-full h-2 rounded bg-white" />
            <div className="w-2/3 h-1.5 rounded bg-stone-400" />
          </div>
        </div>
      );

    case 'live_stream':
      return (
        <div className={`${className} bg-black rounded-lg p-2 flex flex-col justify-between overflow-hidden relative select-none`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[7px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>AO VIVO</span>
            </div>
            <div className="w-10 h-2 rounded bg-stone-700" />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <div className="w-0 h-0 border-t-3 border-t-transparent border-l-4 border-l-white border-b-3 border-b-transparent ml-0.5" />
            </div>
          </div>
          <div className="w-1/2 h-1.5 rounded bg-stone-500 self-center" />
        </div>
      );

    case 'prayer_request':
      return (
        <div className={`${className} bg-amber-50/60 border border-amber-200 rounded-lg p-2 flex flex-col justify-center gap-1.5 overflow-hidden select-none`}>
          <div className="w-2/3 h-1.5 rounded bg-amber-800" />
          <div className="w-full h-3 rounded bg-white border border-amber-200" />
          <div className="flex justify-between items-center">
            <div className="w-14 h-1.5 rounded bg-stone-400" />
            <div className="w-12 h-2.5 rounded bg-amber-600" />
          </div>
        </div>
      );

    case 'donations':
      return (
        <div className={`${className} bg-emerald-50/60 border border-emerald-200 rounded-lg p-2 flex items-center justify-between gap-2 overflow-hidden select-none`}>
          <div className="flex-1 flex flex-col gap-1">
            <div className="w-12 h-2 rounded bg-emerald-800 font-bold" />
            <div className="w-full h-1.5 rounded bg-stone-400" />
            <div className="w-14 h-2.5 rounded bg-emerald-700" />
          </div>
          <div className="w-10 h-10 rounded border border-emerald-300 bg-white p-1 flex items-center justify-center">
            <div className="w-full h-full bg-emerald-800/20 rounded grid grid-cols-2 gap-0.5 p-0.5">
              <div className="bg-emerald-900 rounded-xs" />
              <div className="bg-emerald-900 rounded-xs" />
              <div className="bg-emerald-900 rounded-xs" />
              <div className="border border-emerald-900 rounded-xs" />
            </div>
          </div>
        </div>
      );

    case 'leadership':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2 flex items-center justify-around gap-2 overflow-hidden select-none`}>
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-stone-300 border-2 border-white shadow-2xs" />
              <div className="w-10 h-1.5 rounded bg-stone-700" />
              <div className="w-6 h-1 rounded bg-amber-600" />
            </div>
          ))}
        </div>
      );

    case 'gallery':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-1.5 grid grid-cols-3 gap-1 overflow-hidden select-none`}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-full rounded bg-stone-200 border border-stone-300" />
          ))}
        </div>
      );

    case 'contact':
      return (
        <div className={`${className} bg-stone-50 border border-stone-200 rounded-lg p-2 flex items-center gap-2 overflow-hidden select-none`}>
          <div className="w-1/2 h-full rounded bg-stone-200 border border-stone-300 flex items-center justify-center text-[7px] text-stone-500 font-bold">
            MAPA
          </div>
          <div className="w-1/2 flex flex-col gap-1">
            <div className="w-full h-2 rounded bg-stone-800" />
            <div className="w-3/4 h-1.5 rounded bg-stone-400" />
            <div className="w-1/2 h-1.5 rounded bg-stone-400" />
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className={`${className} bg-stone-900 rounded-lg p-2 flex flex-col justify-between overflow-hidden select-none`}>
          <div className="flex items-center justify-between border-b border-stone-800 pb-1">
            <div className="w-8 h-2 rounded bg-white" />
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-stone-600" />
              <div className="w-2 h-2 rounded-full bg-stone-600" />
            </div>
          </div>
          <div className="w-2/3 h-1 rounded bg-stone-700 self-center" />
        </div>
      );

    default:
      return (
        <div className={`${className} bg-stone-100 border border-stone-200 rounded-lg p-2 flex items-center justify-center text-stone-400 text-[10px]`}>
          Bloco
        </div>
      );
  }
};
