"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  // Optimasi: Memastikan array bersifat Readonly agar lebih aman dan mencegah mutasi data yang tidak disengaja
  steps: ReadonlyArray<Step>;
  completedSteps: ReadonlyArray<number>;
}

export function StepIndicator({ currentStep, steps, completedSteps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="py-4">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.number} className="flex items-center gap-2 flex-1 last:flex-none">
              {/* Step Circle */}
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground",
                    isCompleted &&
                      !isCurrent &&
                      "border-primary bg-primary text-primary-foreground",
                    !isCurrent &&
                      !isCompleted &&
                      "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-px transition-colors",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}