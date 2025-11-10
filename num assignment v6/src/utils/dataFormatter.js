export function formatTableData(data) {
  return data.map(row => ({
    ...row,
    formatted: true
  }))
}

export function generateCSVContent(data) {
  const headers = Object.keys(data || {})
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header]
      return typeof value === 'string' ? `"${value}"` : value
    }).join(',')
  )

  return [csvHeaders, ...csvRows].join('\n')
}

export function downloadCSV(data, filename = 'data.csv') {
  const csvContent = generateCSVContent(data)
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
