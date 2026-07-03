import Link from "next/link";
import { categoryLabels, isScaleReady, type ScaleDefinition } from "@/lib/scales";

const categoryColors: Record<
  ScaleDefinition["category"],
  { bg: string; text: string; dot: string }
> = {
  preoperatorio: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
  },
  diagnostico: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  criticidad: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  anestesia: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
};

interface ScaleCardProps {
  scale: ScaleDefinition;
}

export function ScaleCard({ scale }: ScaleCardProps) {
  const colors = categoryColors[scale.category];

  return (
    <Link
      href={`/escalas/${scale.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-teal-200 hover:shadow-md hover:shadow-teal-100/50"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}
        >
          <span className={`text-lg font-bold ${colors.text}`}>
            {scale.name.charAt(0)}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {categoryLabels[scale.category]}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-800">
        {scale.name}
      </h3>
      <p className="mt-0.5 text-sm text-slate-500">{scale.fullName}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {scale.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
        <span>
          {isScaleReady(scale)
            ? `${scale.questions.length} criterios`
            : "Próximamente"}
        </span>
        <span>{scale.duration}</span>
      </div>
    </Link>
  );
}
