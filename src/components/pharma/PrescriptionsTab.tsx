import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Search, Eye, Download, MessageCircle, Trash2, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Prescription {
  id: string;
  pid: string;
  patient: string;
  doctor: string;
  date: string;
  status: 'pending' | 'dispensed';
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    pid: 'P001',
    patient: 'John Doe',
    doctor: 'Dr. Smith',
    date: '2024-01-15',
    status: 'pending',
    medicines: [
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '5 days' },
      { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily', duration: '7 days' }
    ]
  },
  {
    id: '2',
    pid: 'P002',
    patient: 'Jane Smith',
    doctor: 'Dr. Johnson',
    date: '2024-01-14',
    status: 'dispensed',
    medicines: [
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '3 days' }
    ]
  }
];

export const PrescriptionsTab: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [manualPID, setManualPID] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQRScan = () => {
    setShowQRDialog(true);
  };

  const handleManualPIDSubmit = () => {
    if (!manualPID) return;
    
    // Simulate finding prescription by PID
    const foundPrescription = mockPrescriptions.find(p => p.pid === manualPID);
    
    if (foundPrescription) {
      toast({
        title: "Prescription Found",
        description: `Added prescription for ${foundPrescription.patient}`,
      });
      setShowQRDialog(false);
      setManualPID('');
    } else {
      toast({
        title: "No Patient Found",
        description: "No prescription found for this PID.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (prescription: Prescription) => {
    toast({
      title: "Download Started",
      description: `Downloading prescription for ${prescription.patient}`,
    });
  };

  const handleWhatsApp = (prescription: Prescription) => {
    toast({
      title: "WhatsApp Message Sent",
      description: `Prescription sent to ${prescription.patient}`,
    });
  };

  const handleDelete = (prescriptionId: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
    toast({
      title: "Prescription Deleted",
      description: "Prescription has been removed from the system.",
    });
  };

  const handleDispense = (prescription: Prescription) => {
    toast({
      title: "Redirecting to Billing",
      description: "Opening billing section for dispensing...",
    });
    // Here you would redirect to billing tab with prescription data
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Prescriptions Management
              </CardTitle>
              <CardDescription>
                Manage patient prescriptions and QR code scanning
              </CardDescription>
            </div>
            <Button onClick={handleQRScan} className="bg-gradient-to-r from-primary to-primary-glow">
              <Scan className="h-4 w-4 mr-2" />
              Scan QR Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, PID, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">{prescription.pid}</TableCell>
                    <TableCell>{prescription.patient}</TableCell>
                    <TableCell>{prescription.doctor}</TableCell>
                    <TableCell>{prescription.date}</TableCell>
                    <TableCell>
                      <Badge variant={prescription.status === 'pending' ? 'destructive' : 'default'}>
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(prescription)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Prescription Details</DialogTitle>
                              <DialogDescription>
                                Patient: {prescription.patient} | Doctor: {prescription.doctor}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>PID:</strong> {prescription.pid}</div>
                                <div><strong>Date:</strong> {prescription.date}</div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Prescribed Medicines</h4>
                                <div className="space-y-2">
                                  {prescription.medicines.map((medicine, index) => (
                                    <div key={index} className="p-3 bg-muted rounded-lg">
                                      <div className="font-medium">{medicine.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {prescription.status === 'pending' && (
                                <Button 
                                  onClick={() => handleDispense(prescription)}
                                  className="w-full bg-gradient-to-r from-secondary to-accent"
                                >
                                  Dispense
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(prescription)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleWhatsApp(prescription)}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(prescription.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan the patient's QR code or enter PID manually
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
              <Scan className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Camera scanning will be implemented here
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              OR
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter PID Manually</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Patient ID"
                  value={manualPID}
                  onChange={(e) => setManualPID(e.target.value)}
                />
                <Button onClick={handleManualPIDSubmit}>Submit</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};