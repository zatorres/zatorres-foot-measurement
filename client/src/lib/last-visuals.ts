import { LucideIcon, Crown, Star, Award, Zap, Shield, Heart, Sparkles } from 'lucide-react';

export interface LastVisual {
  icon: LucideIcon;
  color: string;
  accent: string;
}

export const lastVisuals: Record<string, LastVisual> = {
  alhambra: {
    icon: Crown,
    color: "text-zatorres-gold",
    accent: "bg-zatorres-gold/10"
  },
  palazzo: {
    icon: Award,
    color: "text-zatorres-sage",
    accent: "bg-zatorres-sage/10"
  },
  santiago: {
    icon: Zap,
    color: "text-zatorres-gold",
    accent: "bg-zatorres-gold/10"
  },
  cadiz: {
    icon: Sparkles,
    color: "text-zatorres-green",
    accent: "bg-zatorres-green/10"
  },
  vizcaya: {
    icon: Shield,
    color: "text-zatorres-sage",
    accent: "bg-zatorres-sage/10"
  },
  prado: {
    icon: Heart,
    color: "text-zatorres-gold",
    accent: "bg-zatorres-gold/10"
  }
};

export const getLastVisual = (lastName: string): LastVisual | null => {
  return lastVisuals[lastName.toLowerCase()] || null;
}; 