import React from 'react';
import styles from './ExportReport.module.css';
import { AiOutlineFileExcel } from 'react-icons/ai';
import * as XLSX from 'xlsx';

const ExportReport = ({ open, onClose, chartData }) => {
  if (!open) return null;

  // Export to real Excel file using SheetJS
  const handleExcelExport = () => {
    if (!chartData) return;
    const { labels, datasets } = chartData;
    // Format labels as Day 1, Day 2, ...
    const dayLabels = labels.map((_, i) => `Day ${i + 1}`);
    const header = ['Day', ...datasets.map(ds => ds.label || 'Data')];
    const rows = dayLabels.map((label, i) => [
      label,
      ...datasets.map(ds => ds.data[i])
    ]);
    // Add exported date/time row at the top
    const now = new Date();
    const exportedAt = `Exported at: ${now.toLocaleString()}`;
    const wsData = [[exportedAt], [], header, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    XLSX.writeFile(wb, 'sales_report.xlsx');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Export Sales Report</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.exportText}>Download your sales report as an Excel file for further analysis.</p>
          <div className={styles.exportOptions}>
            <button className={styles.excelBtn} onClick={handleExcelExport}>
              <AiOutlineFileExcel style={{ marginRight: 8, fontSize: '1.3em' }} />
              Download as Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReport;
