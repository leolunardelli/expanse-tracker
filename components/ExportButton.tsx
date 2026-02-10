'use client';

import { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import { exportExpensesAsCSV } from '@/app/actions/export';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { csv, filename } = await exportExpensesAsCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch {
      alert('Failed to export');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition"
      title="Export expenses to CSV"
    >
      {loading ? (
        <>
          <Loader size={18} className="animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download size={18} />
          Export CSV
        </>
      )}
    </button>
  );
}
