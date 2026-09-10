import { BlockType, BlockDataRecord } from '../../../types';
import { BLOCK_CATALOG } from '../../../constants';

/**
 * Gera dados estruturados e seguros para a inicialização de uma instância de bloco.
 * 
 * DIRETRIZES ESTATUÁRIAS:
 * - Proibição absoluta de campos como: html, rawHtml, script, javascript, css, customClass, code.
 * - Todos os campos gerados são estritamente tipados e aderentes aos schemas canônicos.
 */
export const getSafeInitialBlockData = (blockType: BlockType): BlockDataRecord => {
  const definition = BLOCK_CATALOG[blockType];

  // Se o bloco possuir um dataSchema oficial registrado
  if (definition?.dataSchema?.fields) {
    const schemaData: BlockDataRecord = {};
    for (const field of definition.dataSchema.fields) {
      if (field.defaultValue !== undefined) {
        schemaData[field.id] = field.defaultValue;
      } else if (field.type === 'text') {
        schemaData[field.id] = field.placeholder || '';
      } else if (field.type === 'textarea') {
        schemaData[field.id] = field.placeholder || '';
      } else if (field.type === 'boolean') {
        schemaData[field.id] = false;
      } else if (field.type === 'button') {
        schemaData[field.id] = {
          label: field.defaultLabel || 'Saiba Mais',
          url: '#',
        };
      }
    }

    // Valores específicos conhecidos para os schemas estruturados
    if (blockType === 'hero') {
      return {
        title: 'Boas-vindas à nossa igreja',
        subtitle: 'Um lugar de comunhão, fé, esperança e transformação para toda a sua família.',
        buttonText: 'Conheça Nossos Cultos',
        ...schemaData,
      };
    }

    if (blockType === 'about') {
      return {
        title: 'Nossa História e Missão',
        subtitle: 'Conheça a trajetória e os valores cristãos que fundamentam nossa congregação.',
        content:
          'Somos uma comunidade de fé comprometida em proclamar as boas novas do Evangelho, acolher vidas e servir à nossa cidade com amor.',
        ...schemaData,
      };
    }

    if (blockType === 'contact') {
      return {
        title: 'Fale Conosco',
        description: 'Estamos de portas abertas para receber você e sua família.',
        phone: '(11) 3234-5678',
        email: 'contato@igreja.org.br',
        showMap: true,
        ...schemaData,
      };
    }

    if (blockType === 'footer') {
      return {
        copyrightText: '© Todos os direitos reservados. Igreja Batista Central.',
        showSocialLinks: true,
        ...schemaData,
      };
    }

    return schemaData;
  }

  // Valores canônicos seguros para blocos eclesiásticos sem schema externo
  switch (blockType) {
    case 'header':
      return {
        siteTitle: 'Igreja Batista Central',
        buttonText: 'Planeje Sua Visita',
      };
    case 'schedule':
      return {
        title: 'Agenda Semanal de Cultos',
        subtitle: 'Participe dos nossos encontros presenciais e online durante a semana.',
      };
    case 'events':
      return {
        title: 'Próximos Eventos',
        subtitle: 'Fique por dentro das conferências, retiros e encontros especiais da comunidade.',
      };
    case 'ministries':
      return {
        title: 'Nossos Ministérios',
        subtitle: 'Descubra como você e sua família podem se envolver e servir na obra.',
      };
    case 'sermons':
      return {
        title: 'Mensagens e Pregações',
        subtitle: 'Assista ou ouça aos ensinamentos bíblicos ministeriais mais recentes.',
      };
    case 'live_stream':
      return {
        title: 'Transmissão Ao Vivo',
        subtitle: 'Acompanhe nosso culto dominical ao vivo com oração e louvor.',
      };
    case 'prayer_request':
      return {
        title: 'Mural de Oração e Intercessão',
        subtitle: 'Envie seu pedido confidencial. Nossa equipe pastoral orará por você.',
      };
    case 'donations':
      return {
        title: 'Dízimos e Ofertas',
        subtitle: 'Contribua com alegria e apoie as missões e projetos sociais da congregação.',
      };
    case 'leadership':
      return {
        title: 'Corpo Pastoral e Liderança',
        subtitle: 'Conheça os pastores e líderes dedicados ao pastoreio da nossa igreja.',
      };
    case 'gallery':
      return {
        title: 'Galeria de Momentos',
        subtitle: 'Registros fotográficos dos batismos, cultos especiais e ações sociais.',
      };
    case 'news':
      return {
        title: 'Notícias e Comunicados',
        subtitle: 'Informativos pastorais e novidades da vida em comunidade.',
      };
    default:
      return {};
  }
};
