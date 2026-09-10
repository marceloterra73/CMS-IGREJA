import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  Building2,
  QrCode,
  Info,
  ShieldCheck,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { ChurchDonationInfo } from '../../types';

interface DonationPublicPreviewProps {
  donation: ChurchDonationInfo;
}

export const DonationPublicPreview: React.FC<DonationPublicPreviewProps> = ({
  donation,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = () => {
    if (!donation.pixKey) return;
    navigator.clipboard?.writeText(donation.pixKey).catch(() => {});
    setCopiedPix(true);
    setTimeout(() => {
      setCopiedPix(false);
    }, 2000);
  };

  return (
    <div
      id="donation-public-preview-container"
      className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Pré-Visualização do Site Público
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            donation.status === 'active'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-stone-200 text-stone-600'
          }`}
        >
          {donation.status === 'active' ? 'Visível no Site' : 'Oculto no Site'}
        </span>
      </div>

      {donation.status === 'inactive' && (
        <div
          id="donation-preview-inactive-alert"
          className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            O módulo de doações está atualmente com status{' '}
            <strong>Inativo</strong>. No site público, esta seção não será
            renderizada para os visitantes enquanto permanecer desativada.
          </p>
        </div>
      )}

      {/* Card simulador do site público */}
      <div
        id="donation-public-card"
        className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden"
      >
        {/* Cabeçalho do Bloco Público */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-stone-50/80 to-white border-b border-stone-100 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 mb-3 shadow-xs">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {donation.title || 'Dízimos e Ofertas'}
          </h3>
          {donation.description && (
            <p className="mt-2 text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
              {donation.description}
            </p>
          )}
        </div>

        {/* Corpo com PIX e Contas Bancárias */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Bloco PIX em destaque */}
          {donation.pixKey ? (
            <div
              id="donation-preview-pix-block"
              className="p-5 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/50 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Chave PIX Oficial
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded">
                      Instantâneo
                    </span>
                  </div>
                  <p className="font-mono text-sm sm:text-base font-bold text-emerald-900 truncate mt-0.5 select-all">
                    {donation.pixKey}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="donation-preview-copy-pix-btn"
                onClick={handleCopyPix}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                {copiedPix ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Chave Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Chave PIX</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50 text-center text-xs text-stone-500">
              Nenhuma chave PIX configurada no momento.
            </div>
          )}

          {/* Bloco de Dados Bancários */}
          {donation.bankAccountInfo && (
            <div
              id="donation-preview-bank-block"
              className="p-5 rounded-xl border border-stone-200 bg-stone-50/70"
            >
              <div className="flex items-center gap-2 mb-2 text-stone-900 font-bold text-xs">
                <Building2 className="w-4 h-4 text-stone-700" />
                <span>Transferência ou Depósito Bancário</span>
              </div>
              <pre className="font-mono text-xs text-stone-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-stone-200">
                {donation.bankAccountInfo}
              </pre>
            </div>
          )}

          {/* Instruções Adicionais */}
          {donation.instructions && (
            <div
              id="donation-preview-instructions-block"
              className="p-4 rounded-xl border border-stone-200 bg-amber-50/50 text-xs text-stone-700 flex items-start gap-2.5"
            >
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block mb-0.5">
                  Orientações para Comprovantes & Destinação:
                </span>
                <p className="text-stone-600 leading-relaxed">
                  {donation.instructions}
                </p>
              </div>
            </div>
          )}

          {/* Rodapé de Confiança e Segurança */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contribuição direta para a conta institucional da igreja</span>
            </div>
            <span className="text-stone-400">Sem taxas de intermediação</span>
          </div>
        </div>
      </div>
    </div>
  );
};
