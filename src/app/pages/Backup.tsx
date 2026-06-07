import { useState } from 'react';
import { exportDatabase, importDatabase } from '../utils/db';
import { useAuth } from '../contexts/AuthContext';
import { Download, Upload, Database, AlertTriangle } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function Backup() {
  const [importing, setImporting] = useState(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addAuditLog } = useAuth();

  const handleExport = async () => {
    try {
      const data = await exportDatabase();
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      await addAuditLog('Export Database', 'Database backup created');
      alert('Backup created successfully!');
    } catch (error) {
      alert('Error creating backup: ' + error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowConfirmRestore(true);
    e.target.value = '';
  };

  const confirmRestore = async () => {
    if (!selectedFile) return;

    setImporting(true);
    try {
      const text = await selectedFile.text();
      await importDatabase(text);
      await addAuditLog('Import Database', 'Database restored from backup', selectedFile.name);
      alert('Database restored successfully! Please refresh the page.');
      window.location.reload();
    } catch (error) {
      alert('Error restoring backup: ' + error);
    } finally {
      setImporting(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Database className="w-8 h-8 text-green-500 mr-3" />
          <h1 className="text-3xl text-white">Backup & Restore</h1>
        </div>
        <p className="text-slate-400">Manage database backups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Download className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <h2 className="text-xl text-white">Export Backup</h2>
              <p className="text-sm text-slate-400">Download complete database backup</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-slate-700 rounded">
            <h3 className="text-white mb-2">What will be exported:</h3>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• All inventory items</li>
              <li>• All issuance records</li>
              <li>• All user accounts</li>
              <li>• Complete audit log history</li>
            </ul>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            <Download className="w-5 h-5 mr-2" />
            Create Backup
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Upload className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <h2 className="text-xl text-white">Restore Backup</h2>
              <p className="text-sm text-slate-400">Import database from backup file</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-red-300 mb-2">Warning!</h3>
                <p className="text-sm text-slate-300">
                  Restoring a backup will completely replace all current data with the backup data. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="backup-file"
              disabled={importing}
            />
            <label
              htmlFor="backup-file"
              className={`w-full flex items-center justify-center px-4 py-3 ${
                importing ? 'bg-slate-600' : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded cursor-pointer`}
            >
              <Upload className="w-5 h-5 mr-2" />
              {importing ? 'Restoring...' : 'Select Backup File'}
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl text-white mb-4">Best Practices</h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Create regular backups of your database, especially before major changes</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Store backup files in a secure location outside of the browser</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Test your backups periodically to ensure they can be restored</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Keep multiple backup copies from different dates</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Backup files are in JSON format and can be viewed in any text editor</span>
          </li>
        </ul>
      </div>

      <ConfirmDialog
        isOpen={showConfirmRestore}
        title="Restore Backup"
        message="This will replace ALL existing data. Are you sure?"
        onConfirm={confirmRestore}
        onCancel={() => {
          setShowConfirmRestore(false);
          setSelectedFile(null);
        }}
        confirmText="Restore"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
}
