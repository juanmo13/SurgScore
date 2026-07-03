import {
  isChoiceQuestion,
  isNumberQuestion,
  type NumberQuestion,
  type ScaleDefinition,
} from "./types";

export function isScaleReady(scale: ScaleDefinition): boolean {
  return scale.questions.length > 0 && scale.interpretation.length > 0;
}

function getQuestionMaxScore(
  question: ScaleDefinition["questions"][number],
): number {
  if (isNumberQuestion(question)) {
    return Math.max(...question.ranges.map((range) => range.score));
  }
  return Math.max(...question.options.map((option) => option.score));
}

export function getScoreForNumberQuestion(
  question: NumberQuestion,
  value: number,
): number | undefined {
  const range = question.ranges.find(
    (entry) => value >= entry.min && value <= entry.max,
  );
  return range?.score;
}

export function getMaxScore(scale: ScaleDefinition): number {
  return scale.questions.reduce(
    (max, question) => max + getQuestionMaxScore(question),
    0,
  );
}

export function calculateScore(
  scale: ScaleDefinition,
  answers: Record<string, string>,
): number {
  return scale.questions.reduce((total, question) => {
    const answer = answers[question.id];
    if (answer === undefined || answer === "") return total;

    if (isNumberQuestion(question)) {
      const value = Number.parseFloat(answer);
      if (Number.isNaN(value)) return total;
      return total + (getScoreForNumberQuestion(question, value) ?? 0);
    }

    const option = question.options.find((entry) => entry.id === answer);
    return total + (option?.score ?? 0);
  }, 0);
}

export function getInterpretation(
  scale: ScaleDefinition,
  score: number,
): ScaleDefinition["interpretation"][number] | undefined {
  return scale.interpretation.find(
    (range) => score >= range.min && score <= range.max,
  );
}

function isNumberAnswerComplete(
  question: NumberQuestion,
  answer: string | undefined,
): boolean {
  if (answer === undefined || answer === "") return false;

  const value = Number.parseFloat(answer);
  if (Number.isNaN(value)) return false;

  return question.ranges.some(
    (range) => value >= range.min && value <= range.max,
  );
}

export function isComplete(
  scale: ScaleDefinition,
  answers: Record<string, string>,
): boolean {
  return scale.questions.every((question) => {
    const answer = answers[question.id];

    if (isNumberQuestion(question)) {
      return isNumberAnswerComplete(question, answer);
    }

    if (answer === undefined || answer === "") return false;
    return isChoiceQuestion(question)
      ? question.options.some((option) => option.id === answer)
      : false;
  });
}

export function getQuestionScore(
  question: ScaleDefinition["questions"][number],
  answer: string | undefined,
): number | undefined {
  if (answer === undefined || answer === "") return undefined;

  if (isNumberQuestion(question)) {
    const value = Number.parseFloat(answer);
    if (Number.isNaN(value)) return undefined;
    return getScoreForNumberQuestion(question, value);
  }

  const option = question.options.find((entry) => entry.id === answer);
  return option?.score;
}
