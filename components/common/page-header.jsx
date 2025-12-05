'use client';

import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export function PageHeader({ 
  title, 
  description, 
  infoContent,
  actions,
  breadcrumbs 
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="mb-6 md:mb-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-3">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {crumb.href ? (
                    <a 
                      href={crumb.href} 
                      className="hover:text-gray-700 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
            
            {/* Info Icon */}
            {infoContent && (
              <button
                onClick={() => setShowInfo(true)}
                className="cursor-pointer group relative mt-1 p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all animate-pulse hover:animate-none"
                aria-label="Show information"
              >
                <Info className="w-5 h-5" />
                <span className="absolute -top-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Click for info
                </span>
              </button>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex flex-wrap gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Info Dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Info className="w-6 h-6 text-blue-500" />
              </div>
              {title} - Information
            </DialogTitle>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="text-sm text-gray-700">
              {infoContent}
            </div>
          </DialogDescription>

          <DialogFooter>
            <Button onClick={() => setShowInfo(false)} className="w-full sm:w-auto">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
