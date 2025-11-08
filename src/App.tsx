import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { PrescriptionForm, PrescriptionData, Medicine, Test, DiagnosisItem } from './components/PrescriptionForm';
import { PrescriptionPreview } from './components/PrescriptionPreview';
import { LetterheadUploader } from './components/LetterheadUploader';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { FileText, Eye, Settings, TestTube, Trash2 } from 'lucide-react';

export default function App() {
  // Initialize with empty prescription data
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    patientName: '',
    patientAge: '',
    patientGender: '',
    mrNumber: '',
    diagnosisType: 'definitive',
    diagnosisList: [],
    medicines: [],
    tests: [],
    generalInstructions: '',
    followUpDate: '',
    followUpInstructions: ''
  });

  // Letterhead content state
  const [letterheadHeader, setLetterheadHeader] = useState('');
  const [letterheadFooter, setLetterheadFooter] = useState('');

  const handlePrescriptionChange = (data: PrescriptionData) => {
    setPrescriptionData(data);
  };

  const loadSampleData = () => {
    const sampleData: PrescriptionData = {
      patientName: 'John Smith',
      patientAge: '45',
      patientGender: 'Male',
      mrNumber: 'MR-2024-001234',
      diagnosisType: 'definitive',
      diagnosisList: [
        { id: '1', text: 'Hypertension (Essential)' },
        { id: '2', text: 'Type 2 Diabetes Mellitus with poor glycemic control' },
        { id: '3', text: 'Dyslipidemia' }
      ],
      medicines: [
        {
          id: '1',
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '3 months',
          instructions: 'Take with meals to reduce stomach upset'
        },
        {
          id: '2',
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '3 months',
          instructions: 'Take in the morning, monitor blood pressure daily'
        },
        {
          id: '3',
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily at bedtime',
          duration: '3 months',
          instructions: 'Take at night, avoid grapefruit juice'
        }
      ],
      tests: [
        {
          id: '1',
          name: 'HbA1c (Glycated Hemoglobin)',
          instructions: 'No fasting required, can be done at any time'
        },
        {
          id: '2',
          name: 'Lipid Profile',
          instructions: '12-hour fasting required before blood collection'
        },
        {
          id: '3',
          name: 'Kidney Function Test (Creatinine & BUN)',
          instructions: 'No special preparation needed'
        }
      ],
      generalInstructions: 'Follow a low-sodium, diabetic diet. Exercise for at least 30 minutes daily (walking, swimming). Monitor blood pressure and blood sugar levels as instructed. Avoid smoking and limit alcohol consumption. Take medications at the same time each day.',
      followUpDate: '2024-01-15',
      followUpInstructions: 'Bring all medication bottles and blood pressure log'
    };
    
    setPrescriptionData(sampleData);
  };

  const clearData = () => {
    setPrescriptionData({
      patientName: '',
      patientAge: '',
      patientGender: '',
      mrNumber: '',
      diagnosisType: 'definitive',
      diagnosisList: [],
      medicines: [],
      tests: [],
      generalInstructions: '',
      followUpDate: '',
      followUpInstructions: ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                Medical Prescription System
              </CardTitle>
              <p className="text-muted-foreground mb-4">
                Create professional medical prescriptions with customizable letterheads
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={loadSampleData} variant="outline" size="sm">
                  <TestTube className="w-4 h-4 mr-2" />
                  Load Sample Data
                </Button>
                <Button onClick={clearData} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Patient Details
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Prescription Preview
            </TabsTrigger>
            <TabsTrigger value="letterhead" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Letterhead Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <PrescriptionForm 
              data={prescriptionData} 
              onChange={handlePrescriptionChange} 
            />
          </TabsContent>

          <TabsContent value="preview">
            <PrescriptionPreview 
              data={prescriptionData}
              letterheadHeader={letterheadHeader}
              letterheadFooter={letterheadFooter}
            />
          </TabsContent>

          <TabsContent value="letterhead">
            <LetterheadUploader
              headerContent={letterheadHeader}
              footerContent={letterheadFooter}
              onHeaderChange={setLetterheadHeader}
              onFooterChange={setLetterheadFooter}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {prescriptionData.medicines.length}
              </div>
              <div className="text-sm text-muted-foreground">Medicines Added</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {prescriptionData.tests.length}
              </div>
              <div className="text-sm text-muted-foreground">Tests Prescribed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {prescriptionData.diagnosisList.length}
              </div>
              <div className="text-sm text-muted-foreground">Diagnoses Added</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}