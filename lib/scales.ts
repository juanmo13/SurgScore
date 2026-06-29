export type ScaleCategory =
  | "preoperatorio"
  | "diagnostico"
  | "criticidad"
  | "anestesia";

export interface Scale {
  id: string;
  name: string;
  fullName: string;
  description: string;
  category: ScaleCategory;
  items: number;
  duration: string;
}

export const categoryLabels: Record<ScaleCategory | "todas", string> = {
  todas: "Todas",
  preoperatorio: "Preoperatorio",
  diagnostico: "Diagnóstico",
  criticidad: "Criticidad",
  anestesia: "Anestesia",
};

export const scales: Scale[] = [
  {
    id: "alvarado",
    name: "Alvarado",
    fullName: "Escala de Alvarado",
    description:
      "Evalúa la probabilidad de apendicitis aguda mediante signos clínicos y laboratorio.",
    category: "diagnostico",
    items: 8,
    duration: "~2 min",
  },
  {
    id: "sofa",
    name: "SOFA",
    fullName: "Sequential Organ Failure Assessment",
    description:
      "Cuantifica la disfunción orgánica en pacientes críticos y monitoriza la evolución de la sepsis.",
    category: "criticidad",
    items: 6,
    duration: "~5 min",
  },
  {
    id: "asa",
    name: "ASA",
    fullName: "American Society of Anesthesiologists",
    description:
      "Clasifica el riesgo anestésico preoperatorio según el estado físico del paciente.",
    category: "anestesia",
    items: 6,
    duration: "~1 min",
  },
  {
    id: "caprini",
    name: "Caprini",
    fullName: "Escala de Caprini",
    description:
      "Estima el riesgo de tromboembolismo venoso en pacientes quirúrgicos para guiar la profilaxis.",
    category: "preoperatorio",
    items: 40,
    duration: "~3 min",
  },
];
