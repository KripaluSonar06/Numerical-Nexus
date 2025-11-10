import { useState } from 'react'
import './CSVTable.css'

export default function CSVTable({ data = [], title = 'Data Table' }) {
  const [sortBy, setSortBy] = useState(null)

  if (!data || data.length === 0) {
    return <div className="csv-table-empty">No data available</div>
  }

  const columns = Object.keys(data || {})

  const handleDownload = () => {
    const csv = [
      columns.join(','),
      ...data.map(row => columns.map(col => row[col]).join(','))
    ].join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    element.setAttribute('download', `${title}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="csv-table-container">
      <div className="csv-table-header">
        <h3>{title}</h3>
        <button className="csv-download-btn" onClick={handleDownload}>
          📥 Download CSV
        </button>
      </div>
      <div className="csv-table-wrapper">
        <table className="csv-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={`${idx}-${col}`}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
