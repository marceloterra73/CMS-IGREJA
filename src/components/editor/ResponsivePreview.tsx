import React from 'react';
import { EditorViewport } from './types';

interface ResponsivePreviewProps {
  viewport: EditorViewport;
  children: React.ReactNode;
}

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  viewport,
  children,
}) => {
  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-full';
      case 'tablet':
        return 'w-[768px] max-w-full';
      case 'desktop':
      default:
        return 'w-full max-w-5xl';
    }
  };

  const getViewportLabel = () => {
    switch (viewport) {
      case 'mobile':
        return 'Mobile • 375px';
      case 'tablet':
        return 'Tablet • 768px';
      case 'desktop':
      default:
        return 'Desktop • Fluido';
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-full py-4 sm:py-6 px-2 sm:px-4">
      {/* Indicador sutil de viewport */}
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-600 bg-stone-200/80 px-2.5 py-0.5 rounded-full select-none">
        {getViewportLabel()}
      </div>

      {/* Frame responsivo do Canvas */}
      <div
        className={`transition-all duration-300 ease-out bg-white shadow-xl rounded-2xl border border-stone-200 overflow-hidden min-h-[500px] ${getContainerWidth()}`}
      >
        {children}
      </div>
    </div>
  );
};
