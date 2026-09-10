import React, { useState } from 'react';
import { Gift, Copy, Check, Heart, Building2, HelpCircle } from 'lucide-react';
import { BlockInstance, ChurchDonationInfo } from '../../../types';
import { INITIAL_DEMO_DONATION } from '../../donations/demoDonationData';

export interface PublicDonationsBlockProps {
  block: BlockInstance;
  donationInfo?: ChurchDonationInfo;
}

export const PublicDonationsBlock: React.FC<PublicDonationsBlockProps> = ({
  block,
  donationInfo = INITIAL_DEMO_DONATION,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = () => {
    if (!donationInfo.pixKey) return;
    navigator.clipboard.writeText(donationInfo.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div
      data-block-id={block.id}
      className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-sm space-y-8"
    >
      <div className="max-w-2xl mx-auto text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <Gift className="w-4 h-4" />
          <span>Generosidade & Missão</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {donationInfo.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {donationInfo.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Card Chave PIX */}
        {donationInfo.pixKey && (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Contribuição via PIX
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  Instantâneo
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Copie a chave oficial da igreja no aplicativo do seu banco:
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3 font-mono text-xs text-stone-800 break-all">
              <span className="select-all font-semibold">{donationInfo.pixKey}</span>
              <button
                type="button"
                onClick={handleCopyPix}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-sans shrink-0 transition-colors cursor-pointer"
              >
                {copiedPix ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Card Dados Bancários */}
        {donationInfo.bankAccountInfo && (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Transferência / Depósito Bancário</span>
              </div>
              <p className="text-xs text-stone-500">
                Dados institucionais da conta corrente da igreja:
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 font-mono text-xs text-stone-700 whitespace-pre-line leading-relaxed">
              {donationInfo.bankAccountInfo}
            </div>
          </div>
        )}
      </div>

      {donationInfo.instructions && (
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-white/80 border border-amber-200/60 text-xs text-stone-600 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{donationInfo.instructions}</p>
        </div>
      )}
    </div>
  );
};
