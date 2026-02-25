'use client';

import { useState } from 'react';
import { Download, Printer, Loader2 } from 'lucide-react';
import { MonthlyReport } from '@/app/actions/reports';

type MonthlyExportButtonProps = {
  report: MonthlyReport;
};

export default function MonthlyExportButton({ report }: MonthlyExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  function handleExportCSV() {
    setExporting(true);
    try {
      const headers = ['Date', 'Description', 'Category', 'Amount'];
      const rows = report.topExpenses.map((e) =>
        [
          `"${e.date}"`,
          `"${e.description.replace(/"/g, '""')}"`,
          `"${e.category}"`,
          e.amount.toFixed(2),
        ].join(',')
      );

      // Add summary section
      const summary = [
        '',
        'Summary',
        `"Month","${report.monthLabel}"`,
        `"Total Spent","${report.totalSpent.toFixed(2)}"`,
        `"Transactions","${report.transactionCount}"`,
        `"Avg/Transaction","${report.avgPerTransaction.toFixed(2)}"`,
        `"Avg/Day","${report.avgPerDay.toFixed(2)}"`,
        '',
        'Category Breakdown',
        'Category,Amount,Percentage,Transactions',
        ...report.categoryBreakdown.map((c) =>
          [`"${c.name}"`, c.amount.toFixed(2), `${c.percentage}%`, c.count].join(',')
        ),
      ];

      const csv = [headers.join(','), ...rows, ...summary].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${report.month}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportCSV}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
      >
        {exporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export CSV
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
    </div>
  );
}
