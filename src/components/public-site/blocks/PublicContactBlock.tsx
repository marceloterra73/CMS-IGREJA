import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { BlockInstance, InstitutionalContent } from '../../../types';

export interface PublicContactBlockProps {
  block: BlockInstance;
  institutional?: InstitutionalContent;
}

export const PublicContactBlock: React.FC<PublicContactBlockProps> = ({
  block,
  institutional,
}) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Localização e Contato';
  const description =
    (data.description as string) ||
    'Estamos de portas abertas para receber você e sua família em nossa comunidade.';

  const address = institutional?.address;
  const contact = institutional?.contact;

  const phone = (data.phone as string) || contact?.phone || '(11) 3456-7890';
  const email = (data.email as string) || contact?.email || 'contato@igrejabatistacentral.com.br';
  const whatsapp = contact?.whatsapp || '(11) 98765-4321';

  const fullAddress = address
    ? `${address.street}, ${address.number || 'S/N'}${
        address.complement ? ` - ${address.complement}` : ''
      } - ${address.neighborhood || ''}, ${address.city} - ${address.state}`
    : 'Avenida das Nações, 1420 - Centro, São Paulo - SP';

  return (
    <div data-block-id={block.id} className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Visite Nossa Igreja</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
        {/* Informações de Contato e Endereço */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Endereço do Templo
                </h4>
                <p className="text-sm font-semibold text-stone-900 leading-snug">
                  {fullAddress}
                </p>
                {address?.postalCode && (
                  <p className="text-xs text-stone-500">CEP: {address.postalCode}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Secretaria Pastoral
                </h4>
                <p className="text-sm font-medium text-stone-800">{phone}</p>
                {whatsapp && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1 font-medium pt-0.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp: {whatsapp}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  E-mail Oficial
                </h4>
                <p className="text-xs text-stone-800 font-mono break-all">{email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa Estilizado ou Prévia Visual */}
        <div className="lg:col-span-7">
          <div className="h-full min-h-[260px] rounded-2xl bg-stone-100 border border-stone-200/90 shadow-sm relative overflow-hidden flex flex-col justify-center items-center p-6 text-center group">
            {/* Fundo simulando mapa elegante */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 space-y-3 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 mx-auto flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {institutional?.profile?.shortName || 'Templo Sede'}
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {fullAddress}
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Abrir no Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
