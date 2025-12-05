"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Confirm Dialog Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Control dialog visibility
 * @param {function} props.onClose - Callback when dialog is closed
 * @param {function} props.onConfirm - Callback when confirm button is clicked
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message/description
 * @param {string} props.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} props.variant - Dialog variant: "danger", "warning", "info", "success" (default: "info")
 * @param {boolean} props.loading - Show loading state on confirm button
 * @param {boolean} props.closeOnOverlayClick - Close dialog when clicking overlay (default: true)
 */
export function ConfirmDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  loading = false,
  closeOnOverlayClick = true,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Delay removal to allow animation
      const timeout = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timeout);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, loading, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && !loading) {
      onClose?.();
    }
  };

  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm?.();
  };

  const handleCancel = () => {
    if (loading) return;
    onClose?.();
  };

  // Icon and color based on variant
  const variantConfig = {
    danger: {
      icon: AlertCircle,
      iconColor: "text-red-500",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-500",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
    },
  };

  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.icon;

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleOverlayClick}
    >
      {/* Overlay Background */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dialog Content */}
      <div
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-200 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        {!loading && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:rounded-full transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Dialog Body */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100">
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-colors"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 text-white ${config.buttonColor}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for using Confirm Dialog
 * 
 * Example usage:
 * 
 * const { ConfirmDialog, showConfirm } = useConfirmDialog();
 * 
 * const handleDelete = async () => {
 *   const confirmed = await showConfirm({
 *     title: "Delete Item",
 *     message: "Are you sure you want to delete this item?",
 *     variant: "danger",
 *     confirmText: "Delete",
 *   });
 *   
 *   if (confirmed) {
 *     // Do delete action
 *   }
 * };
 * 
 * return (
 *   <>
 *     <button onClick={handleDelete}>Delete</button>
 *     <ConfirmDialog />
 *   </>
 * );
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "info",
    loading: false,
    resolve: null,
  });

  const showConfirm = ({
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "info",
  } = {}) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        variant,
        loading: false,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    dialogState.resolve?.(true);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleClose = () => {
    dialogState.resolve?.(false);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      variant={dialogState.variant}
      loading={dialogState.loading}
    />
  );

  return {
    ConfirmDialog: ConfirmDialogComponent,
    showConfirm,
  };
}
