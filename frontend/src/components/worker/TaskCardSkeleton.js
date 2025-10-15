import React from "react";
import { MapPin, Clock, Phone } from "lucide-react";

export default function TaskCardSkeleton() {
  return (
    <div className="bg-white shadow rounded overflow-hidden animate-pulse">
      <div className="flex justify-between items-start p-4 border-b">
        {/* Header Skeleton */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>

      <div className="p-4 grid md:grid-cols-2 gap-4 items-center">
        {/* Details Skeleton */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-300" />
            <div className="w-full space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-300" />
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-2 pt-1">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
        {/* Map Skeleton */}
        <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="p-4 border-t flex justify-end">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}