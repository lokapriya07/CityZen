"use client"

import React from "react";

export function EnhancedProgressTracker({ steps, estimatedDate }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      {estimatedDate && (
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 font-medium">
            Estimated Completion Date: <span className="text-gray-900">{estimatedDate}</span>
          </p>
        </div>
      )}

      <div className="relative">
        {/* Horizontal progress line */}
        <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${(steps.filter((s) => s.completed).length / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Timeline steps */}
        <div className="flex justify-between items-start relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center" style={{ flex: "1" }}>
              <div
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-300
                  ${
                    step.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : step.current
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                `}
              >
                {step.completed ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : step.icon ? (
                  step.icon
                ) : (
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                )}
              </div>

              <div className="mt-4 space-y-1 max-w-[100px]">
                <h4
                  className={`text-sm font-semibold leading-tight ${
                    step.completed ? "text-gray-900" : step.current ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-xs font-medium ${
                    step.completed ? "text-emerald-600" : step.current ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.date}
                </p>
                <p
                  className={`text-xs ${
                    step.completed ? "text-gray-600" : step.current ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}