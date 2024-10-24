const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDFReport = (reportData) => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Stream the PDF to a file
    const writeStream = fs.createWriteStream('report.pdf');
    doc.pipe(writeStream);

    // Add title
    doc.fontSize(25).text('EzyMetrics Report', { align: 'center' });
    doc.moveDown();

    // Add metrics to the PDF
    reportData.forEach((item) => {
        doc.fontSize(12).text(`${item.Metric}: ${item.Value}`);
        doc.moveDown();
    });

    // Finalize the PDF and end the stream
    doc.end();
    
    // Return a promise to resolve when the write is complete
    return new Promise((resolve) => {
        writeStream.on('finish', () => {
            resolve();
        });
    });
};

module.exports = {generatePDFReport}