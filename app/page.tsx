import { ScaleSearch } from "@/components/scale-search";
import { isScaleReady } from "@/lib/scales";
import { getAllScales } from "@/lib/scales/loader";

export default function Home() {
  const scales = getAllScales();
  const readyCount = scales.filter(isScaleReady).length;

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
              SS
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">
                SurgScore
              </p>
              <p className="text-xs text-slate-500">
                Escalas clínicas quirúrgicas
              </p>
            </div>
          </div>
          <span className="hidden rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 sm:inline">
            {scales.length} escalas · {readyCount} disponibles
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Calculadoras clínicas
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Herramientas validadas para la valoración preoperatoria, diagnóstico
            y monitorización de pacientes quirúrgicos.
          </p>
        </section>

        <ScaleSearch scales={scales} />
      </main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-slate-400">
            SurgScore — Apoyo a la decisión clínica. No sustituye el criterio
            médico.
          </p>
        </div>
      </footer>
    </div>
  );
}
