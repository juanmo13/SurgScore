export type {
  ChoiceQuestion,
  NumberQuestion,
  NumberRange,
  ScaleCategory,
  ScaleDefinition,
  ScaleOption,
  ScaleQuestion,
  ScoreInterpretation,
} from "./types";
export {
  categoryLabels,
  getQuestionLabel,
  isChoiceQuestion,
  isNumberQuestion,
} from "./types";
export {
  calculateScore,
  getInterpretation,
  getMaxScore,
  getQuestionScore,
  getScoreForNumberQuestion,
  isComplete,
  isScaleReady,
} from "./engine";
