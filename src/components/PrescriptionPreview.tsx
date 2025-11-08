import React, { useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Printer, Download } from 'lucide-react';
import { PrescriptionData, DiagnosisItem } from './PrescriptionForm';

interface PrescriptionPreviewProps {
  data: PrescriptionData;
  letterheadHeader?: string;
  letterheadFooter?: string;
}

export const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({ 
  data, 
  letterheadHeader,
  letterheadFooter 
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleDownload = () => {
    if (printRef.current) {
      const content = printRef.current.innerHTML;
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Prescription</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .prescription { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .footer { text-align: center; border-top: 1px solid #000; padding-top: 20px; margin-top: 30px; }
            .section { margin-bottom: 25px; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .medicine-item, .test-item { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; }
            .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            @media print { body { margin: 0; padding: 15px; } }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `], { type: 'text/html' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${data.patientName || 'patient'}.html`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end gap-2 mb-6">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div ref={printRef} className="prescription bg-white p-8">
            {/* Header */}
            <div className="header text-center border-b-2 border-black pb-5 mb-8">
              {letterheadHeader ? (
                <div dangerouslySetInnerHTML={{ __html: letterheadHeader }} />
              ) : (
                <div>
                  <h1 className="text-2xl mb-2">Dr. [Doctor Name]</h1>
                  <p className="text-lg">MBBS, MD - [Specialization]</p>
                  <p>[Clinic Name] | [Address]</p>
                  <p>Phone: [Phone] | Email: [Email]</p>
                  <p>Reg. No: [Registration Number]</p>
                </div>
              )}
            </div>

            {/* Prescription Content */}
            <div className="prescription-content">
              {/* Date */}
              <div className="text-right mb-6">
                <p><strong>Date:</strong> {currentDate}</p>
              </div>

              {/* Patient Information */}
              <div className="section">
                <h2 className="section-title">Patient Information</h2>
                <div className="patient-info grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Name:</strong> {data.patientName || '[Patient Name]'}</p>
                    <p><strong>Age:</strong> {data.patientAge || '[Age]'}</p>
                    <p><strong>Gender:</strong> {data.patientGender || '[Gender]'}</p>
                  </div>
                  <div>
                    <p><strong>MR/No.:</strong> {data.mrNumber || '[Medical Record Number]'}</p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              {(data.diagnosisList.length > 0 || data.diagnosisType) && (
                <div className="section">
                  <h2 className="section-title">
                    {data.diagnosisType === 'definitive' && 'Definitive Diagnosis'}
                    {data.diagnosisType === 'provisional' && 'Provisional Diagnosis'}
                    {data.diagnosisType === 'differential' && 'Differential Diagnosis'}
                    {!data.diagnosisType && 'Diagnosis'}
                  </h2>
                  {data.diagnosisList.length > 0 ? (
                    <div className="space-y-2">
                      {data.diagnosisList.map((diagnosis, index) => (
                        <p key={diagnosis.id}>
                          <strong>{index + 1}.</strong> {diagnosis.text}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No diagnoses added</p>
                  )}
                </div>
              )}

              {/* Medicines */}
              <div className="section">
                <h2 className="section-title">Rx (Medicines)</h2>
                {data.medicines.length > 0 ? (
                  <div className="space-y-4">
                    {data.medicines.map((medicine, index) => (
                      <div key={medicine.id} className="medicine-item bg-gray-50 p-4 rounded">
                        <p><strong>{index + 1}. {medicine.name}</strong></p>
                        {medicine.dosage && <p><strong>Dosage:</strong> {medicine.dosage}</p>}
                        {medicine.frequency && <p><strong>Frequency:</strong> {medicine.frequency}</p>}
                        {medicine.duration && <p><strong>Duration:</strong> {medicine.duration}</p>}
                        {medicine.instructions && <p><strong>Instructions:</strong> {medicine.instructions}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No medicines prescribed</p>
                )}
              </div>

              {/* Tests */}
              {data.tests.length > 0 && (
                <div className="section">
                  <h2 className="section-title">Tests & Investigations</h2>
                  <div className="space-y-3">
                    {data.tests.map((test, index) => (
                      <div key={test.id} className="test-item bg-gray-50 p-3 rounded">
                        <p><strong>{index + 1}. {test.name}</strong></p>
                        {test.instructions && <p><strong>Instructions:</strong> {test.instructions}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Instructions */}
              {data.generalInstructions && (
                <div className="section">
                  <h2 className="section-title">General Instructions</h2>
                  <p>{data.generalInstructions}</p>
                </div>
              )}

              {/* Follow-up */}
              {(data.followUpDate || data.followUpInstructions) && (
                <div className="section">
                  <h2 className="section-title">Follow-up</h2>
                  {data.followUpDate && (
                    <p><strong>Next Visit:</strong> {new Date(data.followUpDate).toLocaleDateString()}</p>
                  )}
                  {data.followUpInstructions && (
                    <p><strong>Instructions:</strong> {data.followUpInstructions}</p>
                  )}
                </div>
              )}

              {/* Signature */}
              <div className="mt-12 text-right">
                <div className="inline-block">
                  <div className="w-48 border-t border-black pt-2">
                    <p>Doctor's Signature</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer text-center border-t border-black pt-5 mt-8">
              {letterheadFooter ? (
                <div dangerouslySetInnerHTML={{ __html: letterheadFooter }} />
              ) : (
                <div>
                  <p>This prescription is computer generated and does not require signature</p>
                  <p>For any queries, please contact: [Contact Information]</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};