'use client';

import { useEffect } from 'react';
import { TemplateType } from '@/lib/templates/types';
import { 
  ecologicalTemplate, 
  applyEcologicalStyles 
} from '@/lib/templates/ecological';
import { 
  modernTemplate, 
  applyModernStyles 
} from '@/lib/templates/modern';
import { 
  traditionalTemplate, 
  applyTraditionalStyles 
} from '@/lib/templates/traditional';
import { 
  geometricTemplate, 
  applyGeometricStyles 
} from '@/lib/templates/geometric';

interface TemplateWrapperProps {
  template: TemplateType;
  children: React.ReactNode;
}

export function TemplateWrapper({ template, children }: TemplateWrapperProps) {
  useEffect(() => {
    // Apply CSS variables based on template
    const root = document.documentElement;
    
    let cssVars: Record<string, string> = {};

    switch (template) {
      case TemplateType.ECOLOGICAL:
        cssVars = ecologicalTemplate.cssVariables;
        break;
      case TemplateType.MODERN:
        cssVars = modernTemplate.cssVariables;
        break;
      case TemplateType.TRADITIONAL:
        cssVars = traditionalTemplate.cssVariables;
        break;
      case TemplateType.GEOMETRIC:
        cssVars = geometricTemplate.cssVariables;
        break;
    }

    // Apply CSS variables
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Add template class to body
    document.body.className = document.body.className
      .replace(/template-ecological|template-modern|template-traditional|template-geometric/g, '');
    document.body.classList.add(`template-${template.toLowerCase()}`);

    return () => {
      // Cleanup: remove template class on unmount
      document.body.classList.remove(`template-${template.toLowerCase()}`);
    };
  }, [template]);

  return <>{children}</>;
}

// Helper to get styles based on template
export function getTemplateStyles(template: TemplateType, element: string): string {
  switch (template) {
    case TemplateType.ECOLOGICAL:
      return applyEcologicalStyles(element);
    case TemplateType.MODERN:
      return applyModernStyles(element);
    case TemplateType.TRADITIONAL:
      return applyTraditionalStyles(element);
    case TemplateType.GEOMETRIC:
      return applyGeometricStyles(element);
    default:
      return applyEcologicalStyles(element);
  }
}

