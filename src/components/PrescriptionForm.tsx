import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Trash2, X } from 'lucide-react';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Test {
  id: string;
  name: string;
  instructions: string;
}

export interface DiagnosisItem {
  id: string;
  text: string;
}

export interface PrescriptionData {
  patientName: string;
  patientAge: string;
  patientGender: string;
  mrNumber: string;
  diagnosisType: 'definitive' | 'provisional' | 'differential';
  diagnosisList: DiagnosisItem[];
  medicines: Medicine[];
  tests: Test[];
  generalInstructions: string;
  followUpDate: string;
  followUpInstructions: string;
}

interface PrescriptionFormProps {
  data: PrescriptionData;
  onChange: (data: PrescriptionData) => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ data, onChange }) => {
  const [newDiagnosis, setNewDiagnosis] = useState('');

  const updateField = (field: keyof PrescriptionData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addMedicine = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    updateField('medicines', [...data.medicines, newMedicine]);
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    const updatedMedicines = data.medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    );
    updateField('medicines', updatedMedicines);
  };

  const removeMedicine = (id: string) => {
    const filteredMedicines = data.medicines.filter(med => med.id !== id);
    updateField('medicines', filteredMedicines);
  };

  const addTest = () => {
    const newTest: Test = {
      id: Date.now().toString(),
      name: '',
      instructions: ''
    };
    updateField('tests', [...data.tests, newTest]);
  };

  const updateTest = (id: string, field: keyof Test, value: string) => {
    const updatedTests = data.tests.map(test => 
      test.id === id ? { ...test, [field]: value } : test
    );
    updateField('tests', updatedTests);
  };

  const removeTest = (id: string) => {
    const filteredTests = data.tests.filter(test => test.id !== id);
    updateField('tests', filteredTests);
  };

  const addDiagnosis = () => {
    if (newDiagnosis.trim()) {
      const newDiagnosisItem: DiagnosisItem = {
        id: Date.now().toString(),
        text: newDiagnosis.trim()
      };
      updateField('diagnosisList', [...data.diagnosisList, newDiagnosisItem]);
      setNewDiagnosis('');
    }
  };

  const removeDiagnosis = (id: string) => {
    const filteredDiagnoses = data.diagnosisList.filter(diagnosis => diagnosis.id !== id);
    updateField('diagnosisList', filteredDiagnoses);
  };

  const handleDiagnosisKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDiagnosis();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={data.patientName}
                onChange={(e) => updateField('patientName', e.target.value)}
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <Label htmlFor="patientAge">Age</Label>
              <Input
                id="patientAge"
                value={data.patientAge}
                onChange={(e) => updateField('patientAge', e.target.value)}
                placeholder="Enter age"
              />
            </div>
            <div>
              <Label htmlFor="patientGender">Gender</Label>
              <Select
                value={data.patientGender}
                onValueChange={(value) => updateField('patientGender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mrNumber">MR/No.</Label>
              <Input
                id="mrNumber"
                value={data.mrNumber}
                onChange={(e) => updateField('mrNumber', e.target.value)}
                placeholder="Enter medical record number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="diagnosisType">Diagnosis Type</Label>
            <Select
              value={data.diagnosisType}
              onValueChange={(value: 'definitive' | 'provisional' | 'differential') => 
                updateField('diagnosisType', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diagnosis type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="definitive">Definitive Diagnosis</SelectItem>
                <SelectItem value="provisional">Provisional Diagnosis</SelectItem>
                <SelectItem value="differential">Differential Diagnosis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="newDiagnosis">Add Diagnosis</Label>
            <div className="flex gap-2">
              <Input
                id="newDiagnosis"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                onKeyPress={handleDiagnosisKeyPress}
                placeholder="Enter diagnosis and press Enter"
              />
              <Button
                type="button"
                onClick={addDiagnosis}
                size="sm"
                disabled={!newDiagnosis.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Diagnosis Tags */}
          <div className="space-y-2">
            <Label>Current Diagnoses</Label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-muted/20">
              {data.diagnosisList.length > 0 ? (
                data.diagnosisList.map((diagnosis) => (
                  <Badge
                    key={diagnosis.id}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {diagnosis.text}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDiagnosis(diagnosis.id)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  No diagnoses added. Enter diagnosis above and press Enter.
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medicines</CardTitle>
          <Button onClick={addMedicine} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.medicines.map((medicine) => (
            <div key={medicine.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  <div>
                    <Label>Medicine Name</Label>
                    <Input
                      value={medicine.name}
                      onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                      placeholder="Enter medicine name"
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(medicine.id, 'frequency', e.target.value)}
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                      placeholder="e.g., 7 days"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedicine(medicine.id)}
                  className="ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label>Instructions</Label>
                <Textarea
                  value={medicine.instructions}
                  onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                  placeholder="e.g., Take after meals"
                  rows={2}
                />
              </div>
            </div>
          ))}
          {data.medicines.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No medicines added. Click "Add Medicine" to start.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tests & Investigations</CardTitle>
          <Button onClick={addTest} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Test
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.tests.map((test) => (
            <div key={test.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  <div>
                    <Label>Test Name</Label>
                    <Input
                      value={test.name}
                      onChange={(e) => updateTest(test.id, 'name', e.target.value)}
                      placeholder="Enter test name"
                    />
                  </div>
                  <div>
                    <Label>Instructions</Label>
                    <Input
                      value={test.instructions}
                      onChange={(e) => updateTest(test.id, 'instructions', e.target.value)}
                      placeholder="e.g., Fasting required"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTest(test.id)}
                  className="mt-6"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {data.tests.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No tests added. Click "Add Test" to start.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follow-up & Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="generalInstructions">General Instructions</Label>
            <Textarea
              id="generalInstructions"
              value={data.generalInstructions}
              onChange={(e) => updateField('generalInstructions', e.target.value)}
              placeholder="Enter general instructions for the patient"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={data.followUpDate}
                onChange={(e) => updateField('followUpDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="followUpInstructions">Follow-up Instructions</Label>
              <Input
                id="followUpInstructions"
                value={data.followUpInstructions}
                onChange={(e) => updateField('followUpInstructions', e.target.value)}
                placeholder="e.g., Come on empty stomach"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};