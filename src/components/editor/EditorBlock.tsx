import React from 'react';
import {
  BlockInstance,
  BlockType,
  SectionId,
  BlockId,
} from '../../types';
import { BLOCK_CATALOG } from '../../constants';
import { getBlockIcon } from './blockIcons';
import { BlockActions } from './BlockActions';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Video,
  Play,
  Heart,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  EyeOff,
} from 'lucide-react';

interface EditorBlockProps {
  block: BlockInstance;
  sectionId: SectionId;
  isSelected: boolean;
  isPreviewMode: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

export const EditorBlock: React.FC<EditorBlockProps> = ({
  block,
  sectionId,
  isSelected,
  isPreviewMode,
  isFirst,
  isLast,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleVisibility,
  onDelete,
}) => {
  const blockDef = BLOCK_CATALOG[block.type];
  const blockName = blockDef?.name || block.type;
  const config = block.config || {};
  const data = block.data || {};

  // Padding vertical mapeado
  const getPaddingClass = (paddingY?: string) => {
    switch (paddingY) {
      case 'none':
        return 'py-1';
      case 'small':
        return 'py-3';
      case 'large':
        return 'py-8 sm:py-12';
      case 'medium':
      default:
        return 'py-5 sm:py-7';
    }
  };

  // Alinhamento
  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'center':
        return 'text-center items-center';
      case 'right':
        return 'text-right items-end';
      case 'left':
      default:
        return 'text-left items-start';
    }
  };

  // Tema variante
  const getThemeClass = (variant?: string) => {
    switch (variant) {
      case 'dark':
        return 'bg-stone-900 text-white';
      case 'accent':
        return 'bg-amber-700 text-white';
      case 'neutral':
        return 'bg-stone-100 text-stone-900';
      case 'light':
      default:
        return 'bg-white text-stone-900';
    }
  };

  // Renderização visual de acordo com o tipo canônico
  const renderBlockContent = () => {
    switch (block.type) {
      case 'header':
        return (
          <div className="flex items-center justify-between px-4 py-3 bg-stone-900 text-white rounded-lg">
            <div className="flex items-center gap-2 font-bold text-xs">
              <div className="w-5 h-5 rounded bg-amber-600 flex items-center justify-center text-white text-[10px]">
                IBC
              </div>
              <span>Igreja Batista Central</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-stone-300">
              <span>Início</span>
              <span>Cultos</span>
              <span>Ministérios</span>
              <span>Contato</span>
            </div>
            <div className="text-[10px] bg-amber-600 text-white px-2.5 py-1 rounded font-semibold">
              Ao Vivo
            </div>
          </div>
        );

      case 'hero': {
        const primaryBtnLabel =
          typeof data.primaryButton === 'object' && data.primaryButton !== null && 'label' in data.primaryButton
            ? (data.primaryButton as any).label
            : (data.buttonText as string) || 'Planeje Sua Visita';
        const secondaryBtnLabel =
          typeof data.secondaryButton === 'object' && data.secondaryButton !== null && 'label' in data.secondaryButton
            ? (data.secondaryButton as any).label
            : 'Assistir Online';
        const bgImgUrl =
          typeof data.backgroundImage === 'object' && data.backgroundImage !== null && 'url' in data.backgroundImage
            ? (data.backgroundImage as any).url
            : typeof data.backgroundImage === 'string'
            ? data.backgroundImage
            : '';

        return (
          <div
            className={`flex flex-col ${getAlignmentClass(
              config.alignment
            )} p-6 sm:p-10 rounded-xl bg-gradient-to-b from-stone-900 to-stone-950 text-white relative overflow-hidden`}
          >
            {bgImgUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
                style={{ backgroundImage: `url(${bgImgUrl})` }}
              />
            )}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30 mb-3 relative z-10">
              <span>Cultos todos os Domingos às 10h e 18h</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight max-w-2xl relative z-10">
              {(data.title as string) ||
                'Uma Igreja Acolhedora, Viva e Relevante'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-xl relative z-10 leading-relaxed">
              {(data.subtitle as string) ||
                'Construindo vidas através da Palavra, do Amor Fraternal e da Comunhão Cristã.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-5 relative z-10">
              <span className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold shadow-xs">
                {primaryBtnLabel}
              </span>
              {secondaryBtnLabel && (
                <span className="px-4 py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-700">
                  {secondaryBtnLabel}
                </span>
              )}
            </div>
          </div>
        );
      }

      case 'schedule':
        return (
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Horários dos Nossos Cultos & Reuniões
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[11px] font-bold text-amber-700 block">
                  Domingo • 10h00
                </span>
                <span className="text-xs font-semibold text-stone-800">
                  Culto da Família & EBD
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Salas para crianças, jovens e adultos.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[11px] font-bold text-amber-700 block">
                  Domingo • 18h00
                </span>
                <span className="text-xs font-semibold text-stone-800">
                  Culto de Celebração
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Louvor, comunhão e mensagem inspiradora.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[11px] font-bold text-amber-700 block">
                  Quarta-feira • 20h00
                </span>
                <span className="text-xs font-semibold text-stone-800">
                  Oração & Estudo Bíblico
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Momento de intercessão comunitária.
                </p>
              </div>
            </div>
          </div>
        );

      case 'about': {
        const aboutContent =
          typeof data.content === 'object' && data.content !== null && 'rawText' in data.content
            ? (data.content as any).rawText
            : typeof data.content === 'string'
            ? data.content
            : (data.text as string) ||
              'Há mais de 35 anos servindo a comunidade com o Evangelho da Graça. Uma igreja comprometida com a sã doutrina bíblica, a oração e o cuidado pastoral integral.';
        const imgObj =
          typeof data.featuredImage === 'object' && data.featuredImage !== null && 'url' in data.featuredImage
            ? (data.featuredImage as any)
            : typeof data.featuredImage === 'string'
            ? { url: data.featuredImage, altText: 'Foto Institucional' }
            : null;

        return (
          <div className="p-5 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row gap-5 items-center">
            {imgObj?.url ? (
              <div className="w-full sm:w-1/3 h-36 rounded-lg overflow-hidden border border-stone-100 bg-stone-100 shrink-0">
                <img
                  src={imgObj.url}
                  alt={imgObj.altText || 'Foto Institucional'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-full sm:w-1/3 h-32 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-xs font-medium text-center p-3">
                Foto Institucional da Comunidade
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <h3 className="text-sm font-bold text-stone-900">
                {(data.title as string) || 'Quem Somos — Nossa História & Visão'}
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed whitespace-pre-line">
                {aboutContent}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-700">
                <span>Conheça nossa declaração de fé</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      }

      case 'ministries':
        return (
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Ministérios da Igreja
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Crianças & Juniores', 'Jovens Conectados', 'Casais & Família', 'Ação Social & Missões'].map((min, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-center">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1 text-[11px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-[11px] font-semibold text-stone-800 block">
                    {min}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Próximos Eventos & Conferências
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-amber-700">Ver Agenda Completa</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-amber-600 text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold uppercase">OUT</span>
                  <span className="text-xs font-black">18</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">Conferência da Família</h4>
                  <p className="text-[11px] text-stone-500">Sábado às 19h00 • Entrada Franca</p>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-stone-800 text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold uppercase">NOV</span>
                  <span className="text-xs font-black">02</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">Retiro de Jovens & Universitários</h4>
                  <p className="text-[11px] text-stone-500">Inscrições abertas na secretaria</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sermons':
        return (
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Últimas Mensagens & Sermões
              </h3>
              <span className="text-[11px] font-semibold text-amber-700">Canal YouTube</span>
            </div>
            <div className="p-3 rounded-lg bg-stone-900 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-600 flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-400">Último Domingo</span>
                <h4 className="text-xs font-bold text-white truncate">A Paz que Excede Todo Entendimento — Pr. Carlos</h4>
                <p className="text-[11px] text-stone-400 truncate">Série: Vivendo com Firmeza em Tempos Incertos • Filipenses 4:7</p>
              </div>
            </div>
          </div>
        );

      case 'live_stream':
        return (
          <div className="p-4 rounded-xl bg-stone-900 text-white text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[11px] font-semibold mb-2 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Transmissão Oficial</span>
            </div>
            <h4 className="text-xs font-bold">Culto ao Vivo aos Domingos às 10h e 18h</h4>
            <p className="text-[11px] text-stone-400 mt-1">Transmissão em alta definição com chat de oração integrado.</p>
          </div>
        );

      case 'prayer_request':
        return (
          <div className="p-4 rounded-xl border border-stone-200 bg-amber-50/40">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-900">Mural de Oração & Intercessão</h3>
            </div>
            <p className="text-xs text-stone-600">
              Envie seu pedido confidencial. Nossa equipe de pastores e intercessores orará por sua causa durante toda a semana.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Escreva seu pedido de oração aqui..."
                className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-white flex-1 text-stone-400"
              />
              <button
                type="button"
                disabled
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white"
              >
                Enviar
              </button>
            </div>
          </div>
        );

      case 'donations':
        return (
          <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-stone-900">Dízimos & Ofertas Missionárias</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Contribua com a expansão da obra através de PIX ou transferência bancária.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shrink-0">
              <span>Chave PIX: contato@igrejacentral.org.br</span>
            </div>
          </div>
        );

      case 'leadership':
        return (
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Pastores & Líderes
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Pr. Carlos Eduardo & Pra. Helena', 'Pr. Roberto Silva (Jovens)', 'Diác. Marcelo Santos (Ação Social)'].map((leader, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-stone-600 text-xs font-bold">
                    {leader.charAt(4)}
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-stone-800 truncate">{leader}</h5>
                    <span className="text-[10px] text-stone-500">Liderança Pastoral</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact': {
        const contactTitle = (data.title as string) || 'Localização e Contato';
        const contactDesc = (data.description as string) || '';
        const contactPhone = (data.phone as string) || '(11) 3456-7890';
        const contactEmail = (data.email as string) || 'contato@igrejacentral.org.br';
        const showMap = data.showMap !== false;

        return (
          <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">{contactTitle}</h3>
              {contactDesc && (
                <p className="text-xs text-stone-600 mt-1">{contactDesc}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Av. das Nações, 1420 — Centro</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{contactEmail}</span>
              </div>
            </div>
            {showMap && (
              <div className="h-28 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-xs gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Visualização do Mapa Integrado da Comunidade</span>
              </div>
            )}
          </div>
        );
      }

      case 'footer': {
        const copyright =
          (data.copyrightText as string) ||
          `© ${new Date().getFullYear()} Igreja Batista Central. Todos os direitos reservados.`;
        const showSocial = data.showSocialLinks !== false;

        return (
          <div className="p-5 rounded-lg bg-stone-950 text-white text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-stone-800 pb-3 mb-3">
              <div className="font-bold text-stone-200">Igreja Batista Central</div>
              <div className="text-stone-400 text-[11px]">Cultos • Ministérios • Notícias • Contato • Oração</div>
              {showSocial && (
                <div className="flex items-center gap-2 text-[10px] text-amber-400 font-semibold">
                  <span>YouTube</span>
                  <span>•</span>
                  <span>Instagram</span>
                  <span>•</span>
                  <span>Facebook</span>
                </div>
              )}
            </div>
            <div className="text-center sm:text-left text-[11px] text-stone-500">
              {copyright}
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="p-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 text-center">
            <span className="text-xs font-semibold text-stone-700">{blockName}</span>
            <p className="text-[11px] text-stone-500 mt-1">{blockDef?.description}</p>
          </div>
        );
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative transition-all ${
        isPreviewMode ? '' : 'cursor-pointer group/block'
      } ${
        !block.isVisible && !isPreviewMode ? 'opacity-50' : 'opacity-100'
      } ${
        isSelected && !isPreviewMode
          ? 'ring-2 ring-amber-500 ring-offset-2 rounded-xl shadow-xs'
          : ''
      }`}
    >
      {/* Barra flutuante de identificação e ações do bloco (no modo edição) */}
      {!isPreviewMode && (
        <div
          className={`absolute -top-3 left-3 z-20 flex items-center gap-2 transition-opacity ${
            isSelected
              ? 'opacity-100'
              : 'opacity-0 group-hover/block:opacity-100'
          }`}
        >
          {/* Badge de tipo de bloco */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold shadow-xs">
            {getBlockIcon(block.type, 'w-3 h-3')}
            <span>{blockName}</span>
            {!block.isVisible && (
              <span className="text-amber-200 ml-0.5">(Oculto)</span>
            )}
          </div>

          {/* Ações do Bloco */}
          <BlockActions
            blockId={block.id}
            isFirst={isFirst}
            isLast={isLast}
            isVisible={block.isVisible}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDuplicate={onDuplicate}
            onToggleVisibility={onToggleVisibility}
            onDelete={onDelete}
          />
        </div>
      )}

      {/* Conteúdo visual do Bloco */}
      <div className={`${getPaddingClass(config.paddingY)}`}>
        {renderBlockContent()}
      </div>
    </div>
  );
};
