"use client";

import { useMemo, useState } from "react";
import {
  calculateScore,
  getInterpretation,
  getMaxScore,
  getQuestionLabel,
  getQuestionScore,
  isComplete,
  isNumberQuestion,
  type ScaleDefinition,
  type ScaleQuestion,
} from "@/lib/scales";

const severityStyles = {
  low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-700",
  },
  moderate: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    badge: "bg-amber-100 text-amber-700",
  },
  high: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-800",
    badge: "bg-orange-100 text-orange-700",
  },
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    badge: "bg-red-100 text-red-700",
  },
};

interface ScaleCalculatorProps {
  scale: ScaleDefinition;
}

function ChoiceQuestionField({
  question,
  answer,
  onSelect,
}: {
  question: Extract<ScaleQuestion, { options: unknown }>;
  answer: string | undefined;
  onSelect: (optionId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {question.options.map((option) => {
        const selected = answer === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              selected
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {option.label}
            {option.score > 0 && (
              <span
                className={`ml-1.5 ${selected ? "text-teal-100" : "text-slate-400"}`}
              >
                +{option.score}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function NumberQuestionField({
  question,
  answer,
  onChange,
}: {
  question: Extract<ScaleQuestion, { type: "number" }>;
  answer: string | undefined;
  onChange: (value: string) => void;
}) {
  const questionScore = getQuestionScore(question, answer);
  const hasValue = answer !== undefined && answer !== "";
  const isValid = questionScore !== undefined;

  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          value={answer ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
          aria-label={question.label}
        />
        {isValid && (
          <span className="shrink-0 text-sm font-medium text-teal-700">
            +{questionScore} pts
          </span>
        )}
      </div>
      {hasValue && !isValid && (
        <p className="mt-2 text-xs text-amber-600">
          Introduce un valor dentro de los rangos definidos.
        </p>
      )}
    </div>
  );
}

export function ScaleCalculator({ scale }: ScaleCalculatorProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const maxScore = getMaxScore(scale);
  const score = calculateScore(scale, answers);
  const complete = isComplete(scale, answers);
  const interpretation = complete ? getInterpretation(scale, score) : undefined;

  const answeredCount = useMemo(
    () =>
      scale.questions.filter((question) => {
        const answer = answers[question.id];
        if (answer === undefined || answer === "") return false;
        if (isNumberQuestion(question)) {
          return getQuestionScore(question, answer) !== undefined;
        }
        return question.options.some((option) => option.id === answer);
      }).length,
    [scale.questions, answers],
  );

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function handleNumberChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleReset() {
    setAnswers({});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {scale.questions.map((question, index) => (
          <fieldset
            key={question.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <legend className="mb-3 text-sm font-medium text-slate-900">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                {index + 1}
              </span>
              {getQuestionLabel(question)}
            </legend>

            {isNumberQuestion(question) ? (
              <NumberQuestionField
                question={question}
                answer={answers[question.id]}
                onChange={(value) => handleNumberChange(question.id, value)}
              />
            ) : (
              <ChoiceQuestionField
                question={question}
                answer={answers[question.id]}
                onSelect={(optionId) => handleSelect(question.id, optionId)}
              />
            )}
          </fieldset>
        ))}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Puntuación</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums text-slate-900">
            {score}
            <span className="text-lg font-normal text-slate-400">
              {" "}
              / {maxScore}
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {answeredCount} de {scale.questions.length} criterios respondidos
          </p>

          {interpretation ? (
            <div
              className={`mt-5 rounded-xl border p-4 ${severityStyles[interpretation.severity].bg} ${severityStyles[interpretation.severity].border}`}
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${severityStyles[interpretation.severity].badge}`}
              >
                {interpretation.label}
              </span>
              <p
                className={`mt-2 text-sm leading-relaxed ${severityStyles[interpretation.severity].text}`}
              >
                {interpretation.description}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Responde todos los criterios para ver la interpretación.
            </p>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Reiniciar
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Rangos de interpretación
          </p>
          <ul className="mt-3 space-y-2">
            {scale.interpretation.map((range) => (
              <li
                key={`${range.min}-${range.max}`}
                className="flex items-baseline justify-between gap-2 text-sm"
              >
                <span className="text-slate-600">{range.label}</span>
                <span className="shrink-0 tabular-nums text-slate-400">
                  {range.min}–{range.max}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
