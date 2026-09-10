import React from 'react';
import {
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { NavigationKey } from '../layout/Sidebar';
import { InstitutionalContent } from '../../types';

interface InstitutionalSummaryProps {
  onNavigate: (section: NavigationKey) => void;
}

// Dados demonstrativos locais de apresentação respeitando estritamente o contrato canônico InstitutionalContent
const DEMO_INSTITUTIONAL_CONTENT: InstitutionalContent = {
  tenantId: 'ib_central',
  profile: {
    name: 'Igreja Batista Central',
    shortName: 'IBC Central',
    description: 'Uma igreja viva levando a mensagem do Evangelho a todas as famílias e gerando impacto espiritual e social na cidade.',
    tagline: 'Comunhão, Adoração e Missão',
    denomination: 'Batista',
    leadPastor: 'Pr. Alexandre Mendes',
    foundingYear: 1984,
  },
  address: {
    street: 'Avenida das Nações',
    number: '1420',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    country: 'Brasil',
  },
  contact: {
    email: 'contato@igrejabatistacentral.com.br',
    phone: '(11) 3456-7890',
    whatsapp: '(11) 98765-4321',
  },
  socialLinks: {
    instagram: 'https://instagram.com/ibcentral',
    youtube: 'https://youtube.com/@ibcentral',
    facebook: 'https://facebook.com/ibcentral',
    spotify: 'https://spotify.com/show/ibcpodcast',
  },
  updatedAt: '2026-09-01T14:30:00Z',
};

export const InstitutionalSummary: React.FC<InstitutionalSummaryProps> = ({ onNavigate }) => {
  const { profile, address, contact, socialLinks } = DEMO_INSTITUTIONAL_CONTENT;

  return (
    <div
      id="church-institutional-summary-card"
      className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 tracking-tight">
            Resumo Institucional
          </h2>
          <p className="text-xs text-stone-500">
            Identidade, liderança pastoral e canais da congregação
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editar</span>
        </button>
      </div>

      {/* Header Institucional com Brasão/Logo e Liderança */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100 mb-4">
        <div className="w-11 h-11 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900 truncate">
              {profile.name}
            </h3>
            <span className="text-[10px] font-semibold text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">
              Desde {profile.foundingYear}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
            <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium text-stone-800">{profile.leadPastor}</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500">{profile.denomination}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed italic mb-4">
        "{profile.description}"
      </p>

      {/* Dados de Endereço e Contato */}
      <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
        {address && (
          <div className="flex items-start gap-2 text-stone-600">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>
              {address.street}, {address.number} • {address.neighborhood}, {address.city}-{address.state}
            </span>
          </div>
        )}

        {contact && (
          <>
            <div className="flex items-center gap-2 text-stone-600">
              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>

            <div className="flex items-center gap-2 text-stone-600">
              <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{contact.phone} • WhatsApp: {contact.whatsapp}</span>
            </div>
          </>
        )}
      </div>

      {/* Redes Sociais */}
      {socialLinks && (
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-stone-400">Redes Oficiais:</span>
          <div className="flex items-center gap-1.5">
            {socialLinks.instagram && (
              <span
                title="Instagram @ibcentral"
                className="w-7 h-7 rounded-md bg-stone-100 hover:bg-amber-50 hover:text-amber-700 text-stone-600 flex items-center justify-center border border-stone-200 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </span>
            )}
            {socialLinks.youtube && (
              <span
                title="YouTube @ibcentral"
                className="w-7 h-7 rounded-md bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-600 flex items-center justify-center border border-stone-200 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </span>
            )}
            {socialLinks.facebook && (
              <span
                title="Facebook @ibcentral"
                className="w-7 h-7 rounded-md bg-stone-100 hover:bg-blue-50 hover:text-blue-700 text-stone-600 flex items-center justify-center border border-stone-200 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </span>
            )}
            {socialLinks.spotify && (
              <span
                title="Spotify Podcasts"
                className="w-7 h-7 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 flex items-center justify-center border border-stone-200 transition-colors"
              >
                <Music2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
