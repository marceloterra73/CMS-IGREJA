import React, { useState } from 'react';
import { HeartHandshake, Send, CheckCircle2, Shield } from 'lucide-react';
import { BlockInstance } from '../../../types';

export interface PublicPrayerBlockProps {
  block: BlockInstance;
}

export const PublicPrayerBlock: React.FC<PublicPrayerBlockProps> = ({ block }) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Pedidos de Oração e Intercessão';
  const subtitle =
    (data.subtitle as string) ||
    'Nossa equipe pastoral e ministério de intercessão oram diariamente pelas necessidades apresentadas.';

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      data-block-id={block.id}
      className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>Cuidado Pastoral</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-emerald-900">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold">Pedido Recebido com Carinho</h4>
          <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
            Seu motivo de oração foi encaminhado com sigilo pastoral para o nosso grupo de intercessores. Que a paz de Deus conforte o seu coração.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName('');
              setRequest('');
            }}
            className="mt-3 text-xs font-semibold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
          >
            Enviar outro pedido
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Seu Nome (opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isAnonymous}
              placeholder={isAnonymous ? 'Pedido Anônimo' : 'Digite seu nome...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 disabled:bg-stone-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="chk-anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            <label
              htmlFor="chk-anonymous"
              className="text-stone-600 cursor-pointer select-none"
            >
              Manter meu pedido totalmente anônimo
            </label>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Motivo de Oração <span className="text-amber-700">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Descreva seu motivo de clamor, saúde, família ou agradecimento..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2 text-[11px] text-stone-500">
            <Shield className="w-4 h-4 text-stone-400 shrink-0" />
            <span>Seus dados e motivos são tratados com confidencialidade e zelo pastoral.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Pedido à Equipe de Oração</span>
          </button>
        </form>
      )}
    </div>
  );
};
