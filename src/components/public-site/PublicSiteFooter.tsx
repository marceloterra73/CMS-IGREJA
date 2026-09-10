import React from 'react';
import {
  Church,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  Heart,
  Calendar,
  Gift,
} from 'lucide-react';
import { InstitutionalContent } from '../../types';

interface PublicSiteFooterProps {
  institutional?: InstitutionalContent;
  onNavigatePage?: (pageIdOrSlug: string) => void;
}

export const PublicSiteFooter: React.FC<PublicSiteFooterProps> = ({
  institutional,
  onNavigatePage,
}) => {
  const profile = institutional?.profile;
  const address = institutional?.address;
  const contact = institutional?.contact;
  const social = institutional?.socialLinks;

  const churchName = profile?.name || 'Igreja Batista Central';
  const tagline = profile?.tagline || 'Comunhão, Adoração e Missão';
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Identidade Institucional */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-700/80 text-white flex items-center justify-center shadow-xs">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-serif tracking-tight">
                  {churchName}
                </h3>
                <p className="text-xs text-stone-400">{tagline}</p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {profile?.description ||
                'Uma comunidade acolhedora comprometida com a sã doutrina, o amor fraterno e a proclamação das boas novas do Evangelho de Cristo.'}
            </p>

            {/* Redes Sociais */}
            <div className="flex items-center gap-3 pt-2">
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram da Igreja"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-red-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Canal do YouTube da Igreja"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-blue-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Página do Facebook da Igreja"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage && onNavigatePage('page_home')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage && onNavigatePage('page_about')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Quem Somos & História
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage && onNavigatePage('page_schedule')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Horários dos Cultos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage && onNavigatePage('page_ministries')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Ministérios & Células
                </button>
              </li>
            </ul>
          </div>

          {/* Informações de Localização e Horário */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Onde Estamos
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {address
                    ? `${address.street}, ${address.number || 'S/N'} - ${
                        address.city
                      } - ${address.state}`
                    : 'Av. das Nações, 1420 - Centro, São Paulo - SP'}
                </span>
              </div>
              {contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-mono text-[11px]">{contact.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé inferior / Direitos */}
        <div className="pt-8 mt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            © {year} {churchName}. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido com</span>
            <Heart className="w-3 h-3 text-amber-600 fill-amber-600 inline" />
            <span>para o Reino de Deus</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
