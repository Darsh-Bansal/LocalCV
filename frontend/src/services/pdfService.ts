/**
 * PDF generation service using html2pdf.js
 */

export async function generatePDF(element: HTMLElement, filename: string = 'resume.pdf'): Promise<void> {
  // Dynamically import html2pdf to avoid SSR issues
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default;

  const options = {
    margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  await html2pdf().set(options).from(element).save();
}
