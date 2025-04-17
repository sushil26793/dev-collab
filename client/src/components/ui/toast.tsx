'use client'

import React from 'react'
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ToasterProps,
} from 'sonner'

type ToastOptions = Parameters<typeof sonnerToast>[1]
type ToastPromiseOptions<T> = Parameters<typeof sonnerToast.promise<T>>[1]

/** Explicitly list the props we care about; everything else comes from `ToasterProps`. */
interface AppToasterProps {
  position?: ToasterProps['position']
  duration?: ToasterProps['duration']
  theme?: ToasterProps['theme']
}

export const Toaster: React.FC<AppToasterProps> = ({
  position = 'bottom-right',
  duration = 4000,
  theme = 'light',
}) => (
  <SonnerToaster
    position={position}
    duration={duration}
    theme={theme}
    closeButton
    toastOptions={{
      classNames: {
        toast:    'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        title:    'text-sm font-medium',
        description: 'text-sm opacity-90',
        actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
        cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80',
        closeButton:  'text-muted-foreground hover:bg-muted/80',
      },
    }}
  />
)


/** Wrap Sonner's toast with proper typing, no `any`! */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, {
      ...options,
      icon: <div className="h-4 w-4 bg-green-500 rounded-full" />,
    }),

  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, {
      ...options,
      icon: <div className="h-4 w-4 bg-red-500 rounded-full" />,
    }),

  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, {
      ...options,
      icon: <div className="h-4 w-4 bg-yellow-500 rounded-full" />,
    }),

  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, {
      ...options,
      icon: <div className="h-4 w-4 bg-blue-500 rounded-full" />,
    }),

  custom: (jsx: React.ReactNode, options?: ToastOptions) =>
    sonnerToast(jsx, options),

  /** 
   * `T` is the resolved value of the promise;
   * options must match Sonner's `ToastPromiseOptions<T>` signature.
   */
  promise: function<T>(promise: Promise<T>, options: ToastPromiseOptions<T>) {
    return sonnerToast.promise(promise, options)
  },
}
