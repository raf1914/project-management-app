"use client";

import { useState } from "react";
import { NewTaskForm } from "./new-task-form";
import { MetricTile } from "./metric-tile";
import { ProgressBar } from "./ui";
import {
  PlusIcon,
  CheckIcon,
  ClockIcon,
  FireIcon,
  TrendingUpIcon,
} from "./icons";

interface Props {
  projectId: string;
  progress: number;
  doneCount: number;
  total: number;
  projectedHours: number;
  currentHours: number;
  overdueCount: number;
  overBudget: boolean;
  budgetHours: number;
  barClass: string;
}

export function ProjectCompletionSection({
  projectId,
  progress,
  doneCount,
  total,
  projectedHours,
  currentHours,
  overdueCount,
  overBudget,
  budgetHours,
  barClass,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <section className="panel p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Overall Completion
          </h2>
          <button
            type="button"
            onClick={() => setFormOpen((o) => !o)}
            aria-expanded={formOpen}
            className={`btn-neon flex-shrink-0 transition-all ${
              formOpen
                ? "bg-neon-cyan/10 text-neon-cyan ring-neon-cyan/50"
                : ""
            }`}
          >
            <PlusIcon
              width={15}
              height={15}
              className={`transition-transform duration-200 ${formOpen ? "rotate-45" : ""}`}
            />
            {formOpen ? "Cancel" : "Add task"}
          </button>
        </div>

        <p className="mt-2 font-display text-6xl font-bold leading-none holo-text">
          {progress}
          <span className="text-3xl">%</span>
        </p>
        <p className="mt-1.5 text-xs uppercase tracking-wider text-ink-muted">
          {doneCount}/{total} tasks
        </p>
        <div className="mt-5">
          <ProgressBar value={progress} barClass={barClass} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricTile
            icon={<TrendingUpIcon width={16} height={16} />}
            value={`${projectedHours}h`}
            label="Projected billable"
            tone="text-neon-cyan"
          />
          <MetricTile
            icon={<CheckIcon width={16} height={16} />}
            value={`${currentHours}h`}
            label="Current billable"
            tone="text-neon-green"
          />
          <MetricTile
            icon={<ClockIcon width={16} height={16} />}
            value={overdueCount}
            label="Overdue"
            tone="text-neon-orange"
          />
          <MetricTile
            icon={<FireIcon width={16} height={16} />}
            value={`${projectedHours}/${budgetHours}h`}
            label="Budget"
            tone={overBudget ? "text-neon-red" : "text-neon-purple"}
          />
        </div>
      </section>

      {/* Collapsible task form — animates in below the completion panel */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          formOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <NewTaskForm projectId={projectId} onSuccess={() => setFormOpen(false)} />
        </div>
      </div>
    </>
  );
}
