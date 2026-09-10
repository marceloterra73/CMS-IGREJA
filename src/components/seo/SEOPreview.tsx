import React, { useState } from 'react';
import {
  Search,
  Share2,
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ShieldAlert,
} from 'lucide-react';
import { RobotsDirective } from '../../types';

interface SEOPreviewProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  siteName?: string;
  robots?: RobotsDirective;
  noIndex?: boolean;
  scopeLabel: string;
}

export const SEOPreview: React.FC<SEOPreviewProps> = ({
  title,
  description,
  url,
  imageUrl,
  siteName = 'Igreja Batista Central',
  robots,
  noIndex,
  scopeLabel,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'social'>('google');

  // Metadados sanitizados para exibição
  const displayTitle = title || 'Título não definido';
  const displayDescription =
    description || 'Nenhuma descrição informada para este recurso.';
  const displayUrl = url || 'https://www.igrejabatistacentral.com.br';

  // Contadores recomendados de boas práticas para mecanismos de busca
  const titleLength = (title || '').length;
  const descLength = (description || '').length;

  const isTitleIdeal = titleLength >= 30 && titleLength <= 65;
  const isDescIdeal = descLength >= 80 && descLength <= 165;

  const isNoIndexActive = noIndex || robots?.index === false;

  return (
    <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 sm:p-5 space-y-4">
      {/* Topo do Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
            SEO
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 block">
              Simulador Visual de Indexação & Compartilhamento
            </span>
            <span className="text-[11px] text-stone-500">
              Escopo ativo: <strong className="text-stone-700">{scopeLabel}</strong>
            </span>
          </div>
        </div>

        {/* Alternador de Modo de Prévia */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'google'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Search className="w-3 h-3" />
            <span>Google SERP</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'social'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Share2 className="w-3 h-3" />
            <span>Card Social (OG)</span>
          </button>
        </div>
      </div>

      {/* Alerta de NoIndex caso ativo */}
      {isNoIndexActive && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Atenção:</strong> A diretiva <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">noindex</code> está ativa. Este conteúdo instruirá os robôs de busca a <strong>não</strong> exibirem esta URL nos resultados públicos.
          </span>
        </div>
      )}

      {/* 1. MODO GOOGLE SERP */}
      {activeTab === 'google' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-1.5">
            {/* Linha do Domínio e Favicon */}
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <div className="w-5 h-5 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0 text-[10px] text-amber-800 font-bold">
                †
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 truncate">
                <span className="font-medium text-stone-800">{siteName}</span>
                <span className="hidden sm:inline text-stone-400">•</span>
                <span className="text-[11px] text-stone-500 truncate">{displayUrl}</span>
              </div>
            </div>

            {/* Título Estilo Google */}
            <h3 className="text-base sm:text-lg font-medium text-blue-700 hover:underline cursor-pointer leading-snug break-words">
              {displayTitle}
            </h3>

            {/* Snippet / Meta Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed break-words">
              {displayDescription}
            </p>
          </div>

          {/* Dicas e Contadores de Caracteres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-500 pt-1">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
              <span>Caracteres do Título:</span>
              <span className={`font-mono font-bold ${isTitleIdeal ? 'text-emerald-700' : 'text-stone-700'}`}>
                {titleLength} / 65 recomendados
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
              <span>Caracteres da Descrição:</span>
              <span className={`font-mono font-bold ${isDescIdeal ? 'text-emerald-700' : 'text-stone-700'}`}>
                {descLength} / 160 recomendados
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODO CARD SOCIAL (OPEN GRAPH / TWITTER) */}
      {activeTab === 'social' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs max-w-lg mx-auto">
            {/* Imagem do Card */}
            <div className="aspect-video w-full bg-stone-100 relative flex items-center justify-center overflow-hidden border-b border-stone-200">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-stone-400 space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto text-stone-300" />
                  <span className="text-xs font-medium block">
                    Nenhuma imagem social vinculada
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    Será utilizada a imagem padrão do site
                  </span>
                </div>
              )}
            </div>

            {/* Conteúdo textual do Card Social */}
            <div className="p-4 space-y-1.5 bg-stone-50/50">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">
                {displayUrl.replace(/^https?:\/\//, '').split('/')[0]}
              </span>
              <h4 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                {displayTitle}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {displayDescription}
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-stone-400">
            Aparência estimada ao compartilhar este link no WhatsApp, Facebook, LinkedIn ou Telegram.
          </p>
        </div>
      )}

      {/* Rodapé Informativo dos Robôs */}
      <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] gap-2">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium">Diretivas Técnicas:</span>
          <span
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold ${
              isNoIndexActive
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isNoIndexActive ? 'noindex' : 'index'}
          </span>
          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            {robots?.follow === false ? 'nofollow' : 'follow'}
          </span>
          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            {robots?.archive === false ? 'noarchive' : 'archive'}
          </span>
        </div>

        <span className="text-stone-400 font-mono text-[10px]">
          Fase 16 & Fase 44
        </span>
      </div>
    </div>
  );
};
