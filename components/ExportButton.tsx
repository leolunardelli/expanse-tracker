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
      className="flex items-center gap-2 px-4 py-2 bg-income-100 text-white rounded-montra-md hover:bg-income-80 disabled:opacity-50 font-medium text-sm transition"
      title="Export expenses to CSV"
    >
      {loading ? (
        <>
          <Loader size={16} className="animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download size={16} />
          Export CSV
        </>
      )}
    </button>
  );
}
