"use client";

import { useMemo, useState } from "react";
import {
  categoryLabels,
  scales,
  type ScaleCategory,
} from "@/lib/scales";
import { ScaleCard } from "@/components/scale-card";

type FilterCategory = ScaleCategory | "todas";

const categories: FilterCategory[] = [
  "todas",
  "preoperatorio",
  "diagnostico",
  "criticidad",
  "anestesia",
];

export function ScaleSearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("todas");

  const filteredScales = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return scales.filter((scale) => {
      const matchesCategory =
        activeCategory === "todas" || scale.category === activeCategory;

      if (!normalizedQuery) return matchesCategory;

      const searchable = [
        scale.name,
        scale.fullName,
        scale.description,
        categoryLabels[scale.category],
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [query, activeCategory]);

  return (
    <div>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar escalas quirúrgicas..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          aria-label="Buscar escalas quirúrgicas"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {categoryLabels[category]}
            </button>
          );
        })}
      </div>

      {filteredScales.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {filteredScales.map((scale) => (
            <ScaleCard key={scale.id} scale={scale} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-slate-600">No se encontraron escalas.</p>
          <p className="mt-1 text-sm text-slate-400">
            Prueba con otro término o categoría.
          </p>
        </div>
      )}
    </div>
  );
}
