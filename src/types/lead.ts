export type LeadStatus = "nouveau" | "contacté" | "converti";
export type LeadSource = "site_web" | "linkedin" | "referral" | "publicité" | "autre";

export interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: "Nouveau",
  contacté: "Contacté",
  converti: "Converti",
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  site_web: "Site Web",
  linkedin: "LinkedIn",
  referral: "Référence",
  publicité: "Publicité",
  autre: "Autre",
};

export const STATUS_FLOW: LeadStatus[] = ["nouveau", "contacté", "converti"];
