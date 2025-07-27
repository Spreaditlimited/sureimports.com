// components/ExportToPDF.tsx
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportToPDF: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!sectionRef.current) {
      console.error('Section reference is null');
      return;
    }

    console.log(sectionRef.current); // Check if the element contains the expected content
    const canvas = await html2canvas(sectionRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('section.pdf');
  };

  return (
    <div>
      <button onClick={downloadPDF} style={{ marginBottom: '10px' }}>
        Download as PDF
      </button>
      <div
        ref={sectionRef}
        style={{
          padding: '20px',
          border: '1px solid #ccc',
          backgroundColor: '#fff', // Ensure background color is set
          color: '#000', // Ensure text is visible
        }}
      >
        <h1>Export This Section</h1>
        <p>
          This content will be converted into a PDF when you click the button
          above.
        </p>
      </div>
    </div>
  );
};

export default ExportToPDF;
