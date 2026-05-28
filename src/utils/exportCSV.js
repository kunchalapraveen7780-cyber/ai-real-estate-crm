export function exportToCSV(calls, filename = 'call-history.csv') {
  if (!calls || calls.length === 0) {
    return;
  }

  // Define headers
  const headers = [
    'Date',
    'Customer Name',
    'Phone',
    'Call Type',
    'Interest Level',
    'Budget',
    'Location Interest',
    'Plot Size Preference',
    'Site Visit Requested',
    'Site Visit Date',
    'Next Action',
    'Next Follow-up Date',
    'Summary'
  ];

  // Map data to rows
  const rows = calls.map(c => [
    c.callDate || '',
    c.customerName || '',
    c.phone || '',
    c.callType || '',
    c.interestLevel || '',
    c.budgetMentioned || '',
    c.locationInterest || '',
    c.plotSizePreference || '',
    c.siteVisitRequested ? 'Yes' : 'No',
    c.siteVisitDate || '',
    c.nextAction || '',
    c.nextFollowUpDate || '',
    c.summary || ''
  ]);

  // Escape CSV strings
  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const stringified = String(str);
    if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
      return `"${stringified.replace(/"/g, '""')}"`;
    }
    return stringified;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
