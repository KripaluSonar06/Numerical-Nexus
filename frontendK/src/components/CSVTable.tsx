import { useState } from 'react';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CSVTableProps {
  data: string[][]; // 2D array of CSV data
  filename: string;
}

export const CSVTable = ({ data, filename }: CSVTableProps) => {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!data || data.length === 0) {
    return (
      <div className="glass-strong rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const headers = data[0];
  const rows = data.slice(1);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const sortedRows = sortColumn !== null
    ? [...rows].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const numA = parseFloat(aVal);
        const numB = parseFloat(bVal);
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        }
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      })
    : rows;

  const downloadCSV = () => {
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-lg overflow-hidden"
    >
      {/* Header with download button */}
      <div className="bg-card/20 border-b border-glass-border/20 px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{filename}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadCSV}
          className="glass"
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent">
        <table className="w-full text-sm">
          <thead className="bg-card/30 sticky top-0">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer hover:bg-accent/10 transition-colors"
                  onClick={() => handleSort(index)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{header}</span>
                    {sortColumn === index && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.02 }}
                className="border-b border-glass-border/10 hover:bg-accent/5 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
