import React, { useState, useEffect } from "react";

interface CSVViewerProps {
  fileUrl: string;
}

const CSVViewer: React.FC<CSVViewerProps> = ({ fileUrl }) => {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/fullcsv/${fileUrl}`);
        if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
        const json = await res.json();
        if (json.rows) setRows(json.rows);
        else setError("No data found in CSV");
      } catch (err) {
        setError("Failed to load CSV");
      }
    };
    fetchCSV();
  }, [fileUrl]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!rows.length) return <p>Loading CSV...</p>;

  return (
    <div className="max-h-[70vh] overflow-auto border border-gray-700 rounded-lg bg-gray-900 p-2">
      <table className="text-sm text-gray-200 w-full border-collapse">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-gray-800">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-gray-700 p-1 text-center min-w-[80px]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSVViewer;
