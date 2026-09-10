import React from 'react';
import {
  BlockInstance,
  BlockType,
  ChurchDonationInfo,
  ChurchLiveStreamInfo,
  ChurchSchedule,
  InstitutionalContent,
  SectionInstance,
  VisualTheme,
} from '../../types';
import { PublicHeroBlock } from './blocks/PublicHeroBlock';
import { PublicAboutBlock } from './blocks/PublicAboutBlock';
import { PublicScheduleBlock } from './blocks/PublicScheduleBlock';
import { PublicEventsBlock } from './blocks/PublicEventsBlock';
import { PublicSermonsBlock } from './blocks/PublicSermonsBlock';
import { PublicLiveStreamBlock } from './blocks/PublicLiveStreamBlock';
import { PublicDonationsBlock } from './blocks/PublicDonationsBlock';
import { PublicContactBlock } from './blocks/PublicContactBlock';
import { PublicMinistriesBlock } from './blocks/PublicMinistriesBlock';
import { PublicLeadershipBlock } from './blocks/PublicLeadershipBlock';
import { PublicNewsBlock } from './blocks/PublicNewsBlock';
import { PublicPrayerBlock } from './blocks/PublicPrayerBlock';
import { PublicGalleryBlock } from './blocks/PublicGalleryBlock';

export interface PublicBlockRendererProps {
  block: BlockInstance;
  section: SectionInstance;
  theme?: VisualTheme;
  institutional?: InstitutionalContent;
  schedules?: ChurchSchedule[];
  donationInfo?: ChurchDonationInfo;
  liveStreamInfo?: ChurchLiveStreamInfo;
  onNavigatePage?: (pageIdOrSlug: string) => void;
}

/**
 * Registro técnico de renderizadores de blocos do site público (Fase 50).
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Camada puramente técnica de mapeamento.
 * - Não cria novo contrato de dados nem catálogo paralelo.
 * - Consome exclusivamente BlockType oficial.
 */
export const PUBLIC_BLOCK_REGISTRY: Record<
  string,
  React.FC<PublicBlockRendererProps>
> = {
  hero: (props) => (
    <PublicHeroBlock
      block={props.block}
      institutional={props.institutional}
      onNavigatePage={props.onNavigatePage}
    />
  ),
  about: (props) => (
    <PublicAboutBlock
      block={props.block}
      institutional={props.institutional}
      onNavigatePage={props.onNavigatePage}
    />
  ),
  schedule: (props) => (
    <PublicScheduleBlock
      block={props.block}
      schedules={props.schedules}
    />
  ),
  events: (props) => <PublicEventsBlock block={props.block} />,
  sermons: (props) => <PublicSermonsBlock block={props.block} />,
  live_stream: (props) => (
    <PublicLiveStreamBlock
      block={props.block}
      liveStreamInfo={props.liveStreamInfo}
    />
  ),
  donations: (props) => (
    <PublicDonationsBlock
      block={props.block}
      donationInfo={props.donationInfo}
    />
  ),
  contact: (props) => (
    <PublicContactBlock
      block={props.block}
      institutional={props.institutional}
    />
  ),
  ministries: (props) => <PublicMinistriesBlock block={props.block} />,
  leadership: (props) => (
    <PublicLeadershipBlock
      block={props.block}
      institutional={props.institutional}
    />
  ),
  news: (props) => <PublicNewsBlock block={props.block} />,
  prayer_request: (props) => <PublicPrayerBlock block={props.block} />,
  gallery: (props) => <PublicGalleryBlock block={props.block} />,
};
