import React from 'react';
import {
  Navigation,
  Sparkles,
  Info,
  Users,
  Calendar,
  CalendarDays,
  Newspaper,
  BookOpen,
  Radio,
  HeartHandshake,
  Gift,
  Award,
  Image,
  MapPin,
  PanelBottom,
  Box,
} from 'lucide-react';
import { BlockType } from '../../types';

export const getBlockIcon = (type: BlockType, className: string = 'w-4 h-4'): React.ReactNode => {
  switch (type) {
    case 'header':
      return <Navigation className={className} />;
    case 'hero':
      return <Sparkles className={className} />;
    case 'about':
      return <Info className={className} />;
    case 'ministries':
      return <Users className={className} />;
    case 'schedule':
      return <Calendar className={className} />;
    case 'events':
      return <CalendarDays className={className} />;
    case 'news':
      return <Newspaper className={className} />;
    case 'sermons':
      return <BookOpen className={className} />;
    case 'live_stream':
      return <Radio className={className} />;
    case 'prayer_request':
      return <HeartHandshake className={className} />;
    case 'donations':
      return <Gift className={className} />;
    case 'leadership':
      return <Award className={className} />;
    case 'gallery':
      return <Image className={className} />;
    case 'contact':
      return <MapPin className={className} />;
    case 'footer':
      return <PanelBottom className={className} />;
    default:
      return <Box className={className} />;
  }
};
