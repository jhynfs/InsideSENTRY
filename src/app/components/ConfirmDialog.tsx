import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl text-white">{title}</h2>
          <button onClick={onCancel}>
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6">
          {danger && (
            <div className="flex items-center mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-slate-300 text-sm">This action cannot be undone.</p>
            </div>
          )}
          <p className="text-slate-300">{message}</p>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white rounded`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
