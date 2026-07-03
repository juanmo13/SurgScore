export type ScaleCategory =
  | "preoperatorio"
  | "diagnostico"
  | "criticidad"
  | "anestesia";

export interface ScaleOption {
  id: string;
  label: string;
  score: number;
}

export interface NumberRange {
  min: number;
  max: number;
  score: number;
}

export interface ChoiceQuestion {
  id: string;
  type?: "choice";
  text: string;
  options: ScaleOption[];
}

export interface NumberQuestion {
  id: string;
  type: "number";
  label: string;
  ranges: NumberRange[];
}

export type ScaleQuestion = ChoiceQuestion | NumberQuestion;

export interface ScoreInterpretation {
  min: number;
  max: number;
  label: string;
  description: string;
  severity: "low" | "moderate" | "high" | "critical";
}

export interface ScaleDefinition {
  id: string;
  name: string;
  fullName: string;
  description: string;
  category: ScaleCategory;
  duration: string;
  questions: ScaleQuestion[];
  interpretation: ScoreInterpretation[];
}

export const categoryLabels: Record<ScaleCategory | "todas", string> = {
  todas: "Todas",
  preoperatorio: "Preoperatorio",
  diagnostico: "Diagnóstico",
  criticidad: "Criticidad",
  anestesia: "Anestesia",
};

export function isNumberQuestion(
  question: ScaleQuestion,
): question is NumberQuestion {
  return question.type === "number";
}

export function isChoiceQuestion(
  question: ScaleQuestion,
): question is ChoiceQuestion {
  return !isNumberQuestion(question);
}

export function getQuestionLabel(question: ScaleQuestion): string {
  return isNumberQuestion(question) ? question.label : question.text;
}
