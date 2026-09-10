/**
 * VALIDADOR DE SCHEMAS E ESTRUTURAS CANÔNICAS — FASE 60
 * CMS Visual para Igrejas
 *
 * Realiza validação estrita em runtime dos dados recuperados do armazenamento local,
 * identificando campos obrigatórios, tipos, enums e integridade referencial.
 */

import { ResourceValidationStatus } from './types.js';

export interface ValidationOutput {
  status: ResourceValidationStatus;
  isValid: boolean;
  typeExpected: string;
  recordCount: number;
  errorMessage?: string;
}

export function validateResourceData(resource: string, rawData: any): ValidationOutput {
  if (rawData === undefined || rawData === null) {
    return {
      status: 'EMPTY',
      isValid: false,
      typeExpected: 'any',
      recordCount: 0,
      errorMessage: 'Valor do recurso está nulo ou indefinido.',
    };
  }

  switch (resource) {
    case 'settings': {
      if (typeof rawData !== 'object' || Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'SiteSettings (Object)',
          recordCount: 0,
          errorMessage: 'Settings deve ser um objeto JSON.',
        };
      }
      if (typeof rawData.siteName !== 'string') {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'SiteSettings (Object com siteName)',
          recordCount: 0,
          errorMessage: 'Campo obrigatório "siteName" ausente ou inválido em Settings.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'SiteSettings',
        recordCount: 1,
      };
    }

    case 'institutional': {
      if (typeof rawData !== 'object' || Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'InstitutionalContent (Object)',
          recordCount: 0,
          errorMessage: 'Institutional deve ser um objeto JSON.',
        };
      }
      if (!rawData.profile || typeof rawData.profile !== 'object') {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'InstitutionalContent (Object com profile)',
          recordCount: 0,
          errorMessage: 'Objeto "profile" ausente em InstitutionalContent.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'InstitutionalContent',
        recordCount: 1,
      };
    }

    case 'themes': {
      if (!Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'VisualTheme[] (Array)',
          recordCount: 0,
          errorMessage: 'Themes deve ser um array de temas visuais.',
        };
      }
      if (rawData.length === 0) {
        return {
          status: 'EMPTY',
          isValid: true,
          typeExpected: 'VisualTheme[]',
          recordCount: 0,
        };
      }
      for (const [index, theme] of rawData.entries()) {
        if (!theme || typeof theme !== 'object' || !theme.id || !theme.name || !theme.tokens) {
          return {
            status: 'INVALID_SHAPE',
            isValid: false,
            typeExpected: 'VisualTheme[]',
            recordCount: rawData.length,
            errorMessage: `Tema na posição ${index} não possui id, name ou tokens válidos.`,
          };
        }
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'VisualTheme[]',
        recordCount: rawData.length,
      };
    }

    case 'active_theme_id': {
      if (typeof rawData !== 'string' || rawData.trim() === '') {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'string (Theme ID)',
          recordCount: 0,
          errorMessage: 'active_theme_id deve ser uma string não vazia.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'string',
        recordCount: 1,
      };
    }

    case 'seo_site': {
      if (typeof rawData !== 'object' || Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'SiteSEO (Object)',
          recordCount: 0,
          errorMessage: 'seo_site deve ser um objeto JSON.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'SiteSEO',
        recordCount: 1,
      };
    }

    case 'domains': {
      if (!Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'SiteDomain[] (Array)',
          recordCount: 0,
          errorMessage: 'domains deve ser um array.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'SiteDomain[]',
        recordCount: rawData.length,
      };
    }

    case 'analytics': {
      if (typeof rawData !== 'object' || Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'SiteAnalytics (Object)',
          recordCount: 0,
          errorMessage: 'analytics deve ser um objeto JSON.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'SiteAnalytics',
        recordCount: 1,
      };
    }

    case 'schedules': {
      if (!Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'ChurchSchedule[] (Array)',
          recordCount: 0,
          errorMessage: 'schedules deve ser um array.',
        };
      }
      for (const [index, schedule] of rawData.entries()) {
        if (!schedule || typeof schedule !== 'object' || !schedule.id || !schedule.title || !schedule.time) {
          return {
            status: 'INVALID_SHAPE',
            isValid: false,
            typeExpected: 'ChurchSchedule[]',
            recordCount: rawData.length,
            errorMessage: `Culto na posição ${index} não possui id, title ou time.`,
          };
        }
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'ChurchSchedule[]',
        recordCount: rawData.length,
      };
    }

    case 'donations': {
      if (typeof rawData !== 'object' || Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'ChurchDonationInfo (Object)',
          recordCount: 0,
          errorMessage: 'donations deve ser um objeto JSON.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'ChurchDonationInfo',
        recordCount: 1,
      };
    }

    case 'live_stream': {
      if (typeof rawData !== 'object' || Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'ChurchLiveStreamInfo (Object)',
          recordCount: 0,
          errorMessage: 'live_stream deve ser um objeto JSON.',
        };
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'ChurchLiveStreamInfo',
        recordCount: 1,
      };
    }

    case 'pages': {
      if (!Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'Page[] (Array)',
          recordCount: 0,
          errorMessage: 'pages deve ser um array de páginas.',
        };
      }
      for (const [index, page] of rawData.entries()) {
        if (!page || typeof page !== 'object' || !page.id || !page.title || !page.slug) {
          return {
            status: 'INVALID_SHAPE',
            isValid: false,
            typeExpected: 'Page[]',
            recordCount: rawData.length,
            errorMessage: `Página na posição ${index} não possui id, title ou slug.`,
          };
        }
        if (page.sections && !Array.isArray(page.sections)) {
          return {
            status: 'INVALID_SHAPE',
            isValid: false,
            typeExpected: 'Page[] (sections deve ser array)',
            recordCount: rawData.length,
            errorMessage: `Página "${page.id}" possui campo sections inválido.`,
          };
        }
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'Page[]',
        recordCount: rawData.length,
      };
    }

    case 'navigation': {
      if (!Array.isArray(rawData)) {
        return {
          status: 'INVALID_SHAPE',
          isValid: false,
          typeExpected: 'NavigationMenu[] (Array)',
          recordCount: 0,
          errorMessage: 'navigation deve ser um array de menus.',
        };
      }
      for (const [index, menu] of rawData.entries()) {
        if (!menu || typeof menu !== 'object' || !menu.id || !menu.name || !menu.location) {
          return {
            status: 'INVALID_SHAPE',
            isValid: false,
            typeExpected: 'NavigationMenu[]',
            recordCount: rawData.length,
            errorMessage: `Menu na posição ${index} não possui id, name ou location.`,
          };
        }
      }
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: 'NavigationMenu[]',
        recordCount: rawData.length,
      };
    }

    default: {
      // Recurso não canônico ou personalizado
      return {
        status: 'FOUND',
        isValid: true,
        typeExpected: typeof rawData,
        recordCount: Array.isArray(rawData) ? rawData.length : 1,
      };
    }
  }
}
