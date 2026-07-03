import Link from "next/link";
import { notFound } from "next/navigation";
import { ScaleCalculator } from "@/components/scale-calculator";
import { categoryLabels, isScaleReady } from "@/lib/scales";
import { getAllScales, getScaleById } from "@/lib/scales/loader";

interface ScalePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllScales().map((scale) => ({ id: scale.id }));
}

export async function generateMetadata({ params }: ScalePageProps) {
  const { id } = await params;
  const scale = getScaleById(id);

  if (!scale) return { title: "Escala no encontrada — SurgScore" };

  return {
    title: `${scale.name} — SurgScore`,
    description: scale.description,
  };
}

export default async function ScalePage({ params }: ScalePageProps) {
  const { id } = await params;
  const scale = getScaleById(id);

  if (!scale) notFound();

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Volver al inicio"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">
                {scale.name}
              </h1>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                {categoryLabels[scale.category]}
              </span>
            </div>
            <p className="truncate text-sm text-slate-500">{scale.fullName}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate-600">
          {scale.description}
        </p>

        {isScaleReady(scale) ? (
          <ScaleCalculator scale={scale} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-medium text-slate-700">Próximamente</p>
            <p className="mt-2 text-sm text-slate-500">
              La calculadora de {scale.name} estará disponible en breve.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
