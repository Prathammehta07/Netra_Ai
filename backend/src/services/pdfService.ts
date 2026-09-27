import PDFDocument from 'pdfkit';
import fs from 'fs';

export interface PDFReportData {
  reportNumber: string;
  patientName: string;
  patientAge: number | string;
  patientGender: string;
  patientId: string;
  scanDate: string;
  eye: string;
  screeningCategory: string;
  screeningConfidence: number;
  severity: string;
  explanation: string;
  clinicalNotes: string;
  findings: Array<{ type: string; count: number }>;
  reviewStatus: string;
  reviewerComments?: string;
  modelVersion: string;
  isDemo: boolean;
  imagePath?: string;
}

export function generatePDFReport(data: PDFReportData, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Primary Branding Header
    doc.fillColor('#1d4ed8')
       .fontSize(22)
       .text('Netra AI — AI Healthcare Assistant');

    doc.fillColor('#64748b')
       .fontSize(10)
       .text('Official AI Retinal Screening Report', { underline: true });

    doc.moveDown(0.5);
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.8);

    // Disclaimer Box
    const boxY = doc.y;
    doc.rect(40, boxY, 515, 36)
       .fill('#f8fafc')
       .stroke('#cbd5e1');
    doc.fillColor('#dc2626')
       .fontSize(8)
       .text('MEDICAL SAFETY NOTICE:', 48, boxY + 6);
    doc.fillColor('#475569')
       .fontSize(7.5)
       .text('This AI analysis is for screening and decision-support purposes only. It is NOT a definitive medical diagnosis. All findings should be reviewed by a qualified eye-care professional.', 48, boxY + 18, { width: 500 });

    doc.y = boxY + 46;

    // Patient & Scan Metadata Table Card
    doc.fillColor('#1e293b').fontSize(12).text('Patient & Scan Information');
    doc.moveDown(0.3);

    const startY = doc.y;
    doc.rect(40, startY, 515, 60).fill('#f1f5f9').stroke('#e2e8f0');

    doc.fillColor('#334155').fontSize(9);
    doc.text(`Patient Name: ${data.patientName}`, 50, startY + 10);
    doc.text(`Patient ID: ${data.patientId}`, 50, startY + 26);
    doc.text(`Age / Gender: ${data.patientAge} / ${data.patientGender}`, 50, startY + 42);

    doc.text(`Scan Date: ${data.scanDate}`, 300, startY + 10);
    doc.text(`Eye Examined: ${data.eye}`, 300, startY + 26);
    doc.text(`Report Ref: ${data.reportNumber}`, 300, startY + 42);

    doc.y = startY + 70;

    // Screening Result & Severity Level
    doc.fillColor('#1e293b').fontSize(12).text('AI Screening Result & Assessment');
    doc.moveDown(0.3);

    const resultY = doc.y;
    const sevColor = data.severity === 'No DR' ? '#16a34a' : data.severity === 'Mild' ? '#d97706' : '#dc2626';

    doc.rect(40, resultY, 515, 50).fill('#fafafa').stroke(sevColor);
    doc.fillColor('#0f172a').fontSize(11).text(data.screeningCategory, 50, resultY + 10);
    doc.fillColor(sevColor).fontSize(10).text(`Severity Level: ${data.severity}`, 50, resultY + 28);
    doc.fillColor('#475569').fontSize(9).text(`Confidence Score: ${(data.screeningConfidence * 100).toFixed(1)}%`, 350, resultY + 28);

    doc.y = resultY + 60;

    // Findings Breakdown
    doc.fillColor('#1e293b').fontSize(12).text('Detected Retinal Lesions');
    doc.moveDown(0.3);

    if (data.findings && data.findings.length > 0) {
      data.findings.forEach((f) => {
        doc.fillColor('#334155').fontSize(9).text(`• ${f.type.toUpperCase()}: ${f.count} instances detected`, 50);
      });
    } else {
      doc.fillColor('#334155').fontSize(9).text('• No significant lesions detected', 50);
    }

    doc.moveDown(1);

    // AI Explanation & Clinical Notes
    doc.fillColor('#1e293b').fontSize(11).text('AI Explanation:');
    doc.fillColor('#475569').fontSize(8.5).text(data.explanation, 50, doc.y, { width: 490 });

    doc.moveDown(0.8);
    doc.fillColor('#1e293b').fontSize(11).text('Clinical Notes for Ophthalmic Review:');
    doc.fillColor('#475569').fontSize(8.5).text(data.clinicalNotes, 50, doc.y, { width: 490 });

    doc.moveDown(1);

    // Professional Review Status
    doc.fillColor('#1e293b').fontSize(11).text('Professional Review Status:');
    doc.fillColor('#0284c7').fontSize(9).text(`Status: ${data.reviewStatus}`, 50);
    if (data.reviewerComments) {
      doc.fillColor('#475569').fontSize(8.5).text(`Comments: ${data.reviewerComments}`, 50);
    }

    // Footer
    doc.moveDown(2);
    doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    const footerText = data.isDemo
      ? 'DEMO AI MODE — FOR SOFTWARE DEMONSTRATION ONLY — NOT FOR CLINICAL DIAGNOSIS'
      : `Netra AI Retinal Engine (Model ${data.modelVersion}) • Generated on ${new Date().toLocaleDateString()}`;

    doc.fillColor('#94a3b8').fontSize(7.5).text(footerText, { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', (err) => reject(err));
  });
}
