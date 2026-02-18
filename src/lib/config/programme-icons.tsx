import { GiCakeSlice } from "react-icons/gi";
import { PiWineThin } from "react-icons/pi";
import { CiLogin, CiMusicNote1, CiCamera, CiForkAndKnife, CiGlass } from "react-icons/ci";
import { ReactNode } from "react";
import { LiaRingSolid } from "react-icons/lia";

/**
 * Options d'icônes disponibles pour les événements du programme
 */
export const PROGRAMME_ICON_OPTIONS = [
  { value: "arrival", label: "Arrivée", icon: CiLogin },
  { value: "ceremony", label: "Cérémonie", icon: LiaRingSolid },
  { value: "cocktail", label: "Cocktail", icon: PiWineThin },
  { value: "dinner", label: "Dîner", icon: CiForkAndKnife },
  { value: "party", label: "Danse", icon: CiMusicNote1 },
  { value: "photo", label: "Photos", icon: CiCamera },
  { value: "cake", label: "Gâteau", icon: GiCakeSlice },
];

/**
 * Retourne l'icône React correspondante à un type d'événement
 */
export function getProgrammeIcon(iconType: string | null): ReactNode {
  const option = PROGRAMME_ICON_OPTIONS.find(opt => opt.value === iconType);
  
  if (!option) {
    // Par défaut, retourner l'icône de cérémonie
    const defaultIcon = PROGRAMME_ICON_OPTIONS.find(opt => opt.value === "ceremony");
    if (!defaultIcon) return null;
    const Icon = defaultIcon.icon;
    return <Icon />;
  }
  
  const Icon = option.icon;
  return <Icon />;
}
