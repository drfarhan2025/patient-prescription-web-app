import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, FileText, X, Type, Image, FileUp } from 'lucide-react';

interface LetterheadUploaderProps {
  headerContent: string;
  footerContent: string;
  onHeaderChange: (content: string) => void;
  onFooterChange: (content: string) => void;
}

interface TextFormData {
  doctorName: string;
  qualifications: string;
  specialty: string;
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  registrationNumber: string;
  footerText: string;
  emergencyContact: string;
  website: string;
}

export const LetterheadUploader: React.FC<LetterheadUploaderProps> = ({
  headerContent,
  footerContent,
  onHeaderChange,
  onFooterChange
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [headerImageUrl, setHeaderImageUrl] = useState<string>('');
  const [footerImageUrl, setFooterImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [textFormData, setTextFormData] = useState<TextFormData>({
    doctorName: '',
    qualifications: '',
    specialty: '',
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    registrationNumber: '',
    footerText: '',
    emergencyContact: '',
    website: ''
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type === 'text/html' || file.name.endsWith('.html')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          // Simple check to determine if it's header or footer content
          if (content.toLowerCase().includes('header') || content.toLowerCase().includes('doctor')) {
            onHeaderChange(content);
          } else {
            onFooterChange(content);
          }
        };
        reader.readAsText(file);
      }
    });
  };

  const handleImageFiles = (files: File[], isHeader: boolean = true) => {
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (isHeader) {
            setHeaderImageUrl(imageUrl);
            const imageHtml = file.type === 'application/pdf' 
              ? `<div style="text-align: center; padding: 20px; border: 1px solid #ccc;"><p>PDF Letterhead: ${file.name}</p><p style="font-size: 12px; color: #666;">PDF files will be displayed properly when printed</p></div>`
              : `<div style="text-align: center;"><img src="${imageUrl}" alt="Header Letterhead" style="max-width: 100%; height: auto;" /></div>`;
            onHeaderChange(imageHtml);
          } else {
            setFooterImageUrl(imageUrl);
            const imageHtml = file.type === 'application/pdf'
              ? `<div style="text-align: center; padding: 20px; border: 1px solid #ccc;"><p>PDF Footer: ${file.name}</p></div>`
              : `<div style="text-align: center;"><img src="${imageUrl}" alt="Footer Letterhead" style="max-width: 100%; height: auto;" /></div>`;
            onFooterChange(imageHtml);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const convertTextToHtml = () => {
    const headerHtml = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        ${textFormData.doctorName ? `<h1 style="font-size: 28px; margin-bottom: 8px; color: #2563eb; font-weight: bold;">${textFormData.doctorName}</h1>` : ''}
        ${textFormData.qualifications ? `<p style="font-size: 16px; margin-bottom: 4px; font-weight: 500;">${textFormData.qualifications}${textFormData.specialty ? ` - ${textFormData.specialty}` : ''}</p>` : ''}
        ${textFormData.clinicName ? `<p style="margin-bottom: 4px; font-weight: 500;">${textFormData.clinicName}</p>` : ''}
        ${textFormData.address ? `<p style="margin-bottom: 4px;">${textFormData.address}</p>` : ''}
        <div style="margin-bottom: 4px;">
          ${textFormData.phone ? `Phone: ${textFormData.phone}` : ''}
          ${textFormData.phone && textFormData.email ? ' | ' : ''}
          ${textFormData.email ? `Email: ${textFormData.email}` : ''}
        </div>
        ${textFormData.registrationNumber ? `<p style="margin-bottom: 0;">Reg. No: ${textFormData.registrationNumber}</p>` : ''}
      </div>
    `;

    const footerHtml = `
      <div style="text-align: center; font-family: Arial, sans-serif; font-size: 14px;">
        ${textFormData.footerText ? `<p style="margin-bottom: 4px;">${textFormData.footerText}</p>` : '<p style="margin-bottom: 4px;">This prescription is computer generated and does not require signature</p>'}
        ${textFormData.emergencyContact ? `<p style="margin-bottom: 4px;">For emergencies, call: ${textFormData.emergencyContact}</p>` : ''}
        ${textFormData.website ? `<p style="margin-bottom: 0;">Visit us at: ${textFormData.website}</p>` : ''}
      </div>
    `;

    onHeaderChange(headerHtml);
    onFooterChange(footerHtml);
  };

  const updateTextFormField = (field: keyof TextFormData, value: string) => {
    setTextFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const useDefaultTemplate = () => {
    const defaultHeader = `
      <div>
        <h1 style="font-size: 28px; margin-bottom: 8px; color: #2563eb;">Dr. Sarah Johnson</h1>
        <p style="font-size: 16px; margin-bottom: 4px;">MBBS, MD - Internal Medicine</p>
        <p style="margin-bottom: 4px;">Johnson Medical Center | 123 Healthcare Ave, Medical City</p>
        <p style="margin-bottom: 4px;">Phone: +1 (555) 123-4567 | Email: dr.sarah@healthcenter.com</p>
        <p>Reg. No: MC/2020/12345</p>
      </div>
    `;
    
    const defaultFooter = `
      <div>
        <p style="margin-bottom: 4px;">This prescription is computer generated and does not require signature</p>
        <p style="margin-bottom: 4px;">For emergencies, call: +1 (555) 911-HELP</p>
        <p>Visit us at: www.johnsonmedicalcenter.com</p>
      </div>
    `;
    
    onHeaderChange(defaultHeader);
    onFooterChange(defaultFooter);
  };

  const clearTemplate = () => {
    onHeaderChange('');
    onFooterChange('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Letterhead Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Form
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Upload Images
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                HTML Code
              </TabsTrigger>
            </TabsList>

            {/* Text Form Tab */}
            <TabsContent value="text" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg mb-4">Doctor Information</h3>
                  <div>
                    <Label htmlFor="doctorName">Doctor Name</Label>
                    <Input
                      id="doctorName"
                      value={textFormData.doctorName}
                      onChange={(e) => updateTextFormField('doctorName', e.target.value)}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Input
                      id="qualifications"
                      value={textFormData.qualifications}
                      onChange={(e) => updateTextFormField('qualifications', e.target.value)}
                      placeholder="MBBS, MD"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      value={textFormData.specialty}
                      onChange={(e) => updateTextFormField('specialty', e.target.value)}
                      placeholder="Internal Medicine"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={textFormData.registrationNumber}
                      onChange={(e) => updateTextFormField('registrationNumber', e.target.value)}
                      placeholder="MC/2020/12345"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg mb-4">Clinic Information</h3>
                  <div>
                    <Label htmlFor="clinicName">Clinic Name</Label>
                    <Input
                      id="clinicName"
                      value={textFormData.clinicName}
                      onChange={(e) => updateTextFormField('clinicName', e.target.value)}
                      placeholder="Smith Medical Center"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={textFormData.address}
                      onChange={(e) => updateTextFormField('address', e.target.value)}
                      placeholder="123 Healthcare Ave, Medical City"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={textFormData.phone}
                      onChange={(e) => updateTextFormField('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={textFormData.email}
                      onChange={(e) => updateTextFormField('email', e.target.value)}
                      placeholder="dr.smith@clinic.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg mb-4">Footer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={textFormData.emergencyContact}
                      onChange={(e) => updateTextFormField('emergencyContact', e.target.value)}
                      placeholder="+1 (555) 911-HELP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={textFormData.website}
                      onChange={(e) => updateTextFormField('website', e.target.value)}
                      placeholder="www.smithmedical.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Textarea
                    id="footerText"
                    value={textFormData.footerText}
                    onChange={(e) => updateTextFormField('footerText', e.target.value)}
                    placeholder="This prescription is computer generated and does not require signature"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <Button onClick={convertTextToHtml}>
                  Generate Letterhead
                </Button>
                <Button onClick={clearTemplate} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </TabsContent>

            {/* Image Upload Tab */}
            <TabsContent value="image" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Header Image Upload */}
                <div>
                  <h3 className="text-lg mb-4">Header Image/PDF</h3>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload header letterhead (PNG, JPG, PDF)
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleImageFiles(files, true);
                      }}
                      className="hidden"
                      id="headerImageInput"
                    />
                    <Button 
                      onClick={() => document.getElementById('headerImageInput')?.click()}
                      variant="outline" 
                      size="sm"
                    >
                      Choose File
                    </Button>
                  </div>
                  {headerImageUrl && (
                    <div className="mt-3 p-3 border rounded bg-gray-50">
                      <p className="text-sm mb-2">Header Preview:</p>
                      {headerImageUrl.includes('data:application/pdf') ? (
                        <div className="text-center p-4 border">PDF file uploaded</div>
                      ) : (
                        <img src={headerImageUrl} alt="Header preview" className="max-w-full h-auto" />
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Image Upload */}
                <div>
                  <h3 className="text-lg mb-4">Footer Image/PDF</h3>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload footer letterhead (PNG, JPG, PDF)
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleImageFiles(files, false);
                      }}
                      className="hidden"
                      id="footerImageInput"
                    />
                    <Button 
                      onClick={() => document.getElementById('footerImageInput')?.click()}
                      variant="outline" 
                      size="sm"
                    >
                      Choose File
                    </Button>
                  </div>
                  {footerImageUrl && (
                    <div className="mt-3 p-3 border rounded bg-gray-50">
                      <p className="text-sm mb-2">Footer Preview:</p>
                      {footerImageUrl.includes('data:application/pdf') ? (
                        <div className="text-center p-4 border">PDF file uploaded</div>
                      ) : (
                        <img src={footerImageUrl} alt="Footer preview" className="max-w-full h-auto" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* HTML Code Tab */}
            <TabsContent value="html" className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg mb-2">Upload HTML Template</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop HTML files here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,text/html"
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
                <div className="flex justify-center gap-2">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Browse Files
                  </Button>
                  <Button 
                    onClick={useDefaultTemplate}
                    variant="outline"
                  >
                    Use Default Template
                  </Button>
                </div>
              </div>

              {/* Header Content */}
              <div>
                <Label htmlFor="headerContent">Header Content (HTML)</Label>
                <Textarea
                  id="headerContent"
                  value={headerContent}
                  onChange={(e) => onHeaderChange(e.target.value)}
                  placeholder="Enter HTML content for letterhead header (doctor info, clinic details, etc.)"
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Include doctor name, qualifications, clinic information, contact details
                </p>
              </div>

              {/* Footer Content */}
              <div>
                <Label htmlFor="footerContent">Footer Content (HTML)</Label>
                <Textarea
                  id="footerContent"
                  value={footerContent}
                  onChange={(e) => onFooterChange(e.target.value)}
                  placeholder="Enter HTML content for letterhead footer (contact info, disclaimers, etc.)"
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Include additional contact information, disclaimers, or legal text
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          {(headerContent || footerContent) && (
            <div className="border rounded-lg p-4 bg-muted/20 mt-6">
              <h4 className="mb-3">Preview:</h4>
              
              {headerContent && (
                <div className="mb-4 p-3 border rounded bg-white">
                  <p className="text-sm text-muted-foreground mb-2">Header:</p>
                  <div dangerouslySetInnerHTML={{ __html: headerContent }} />
                </div>
              )}
              
              {footerContent && (
                <div className="p-3 border rounded bg-white">
                  <p className="text-sm text-muted-foreground mb-2">Footer:</p>
                  <div dangerouslySetInnerHTML={{ __html: footerContent }} />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};