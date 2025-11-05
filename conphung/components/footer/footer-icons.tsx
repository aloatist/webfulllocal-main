import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
};

export function getIcon(iconName: string): LucideIcon | null {
  return iconMap[iconName] || null;
}


