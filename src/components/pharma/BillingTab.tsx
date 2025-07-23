import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Plus, Search, Eye, Download, MessageCircle, CreditCard, Banknote } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Bill {
  id: string;
  billNo: string;
  patientName: string;
  paymentType: 'cash' | 'online';
  amount: number;
  date: string;
  items: Array<{
    medicine: string;
    quantity: number;
    price: number;
  }>;
}

interface NewBillItem {
  medicine: string;
  quantity: number;
  price: number;
}

const mockBills: Bill[] = [
  {
    id: '1',
    billNo: 'B001',
    patientName: 'John Doe',
    paymentType: 'cash',
    amount: 45.50,
    date: '2024-01-15',
    items: [
      { medicine: 'Paracetamol', quantity: 2, price: 5.00 },
      { medicine: 'Amoxicillin', quantity: 3, price: 12.50 }
    ]
  },
  {
    id: '2',
    billNo: 'B002',
    patientName: 'Jane Smith',
    paymentType: 'online',
    amount: 24.00,
    date: '2024-01-14',
    items: [
      { medicine: 'Ibuprofen', quantity: 3, price: 8.00 }
    ]
  }
];

const availableMedicines = [
  { name: 'Paracetamol', price: 5.00 },
  { name: 'Amoxicillin', price: 12.50 },
  { name: 'Ibuprofen', price: 8.00 },
  { name: 'Aspirin', price: 3.50 },
];

export const BillingTab: React.FC = () => {
  const [bills, setBills] = useState(mockBills);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBillDialog, setShowNewBillDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [newBillItems, setNewBillItems] = useState<NewBillItem[]>([]);
  const [patientName, setPatientName] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [currentBillTotal, setCurrentBillTotal] = useState(0);

  const filteredBills = bills.filter(bill =>
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItemToBill = () => {
    setNewBillItems(prev => [...prev, { medicine: '', quantity: 1, price: 0 }]);
  };

  const updateBillItem = (index: number, field: keyof NewBillItem, value: any) => {
    setNewBillItems(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const removeBillItem = (index: number) => {
    setNewBillItems(prev => prev.filter((_, i) => i !== index));
  };

  const selectMedicine = (index: number, medicineName: string) => {
    const medicine = availableMedicines.find(m => m.name === medicineName);
    if (medicine) {
      updateBillItem(index, 'medicine', medicine.name);
      updateBillItem(index, 'price', medicine.price);
    }
  };

  const calculateTotal = () => {
    return newBillItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleCreateBill = () => {
    if (!patientName || newBillItems.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter patient name and add items.",
        variant: "destructive",
      });
      return;
    }

    const total = calculateTotal();
    setCurrentBillTotal(total);
    setShowNewBillDialog(false);
    setShowPaymentDialog(true);
  };

  const handlePayment = (paymentType: 'cash' | 'online') => {
    const newBill: Bill = {
      id: Date.now().toString(),
      billNo: `B${String(bills.length + 1).padStart(3, '0')}`,
      patientName,
      paymentType,
      amount: currentBillTotal,
      date: new Date().toISOString().split('T')[0],
      items: newBillItems
    };

    setBills(prev => [...prev, newBill]);
    
    // Reset form
    setPatientName('');
    setNewBillItems([]);
    setCurrentBillTotal(0);
    setShowPaymentDialog(false);

    toast({
      title: "Payment Successful",
      description: `Bill ${newBill.billNo} created successfully.`,
    });
  };

  const handleDownload = (bill: Bill) => {
    toast({
      title: "Download Started",
      description: `Downloading bill ${bill.billNo}`,
    });
  };

  const handleWhatsApp = (bill: Bill) => {
    toast({
      title: "WhatsApp Message Sent",
      description: `Bill sent to ${bill.patientName}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Billing Management
              </CardTitle>
              <CardDescription>
                Create bills and manage payments
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewBillDialog(true)} className="bg-gradient-to-r from-primary to-primary-glow">
              <Plus className="h-4 w-4 mr-2" />
              New Bill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills by patient or bill number..."
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
                  <TableHead>Bill No</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.billNo}</TableCell>
                    <TableCell>{bill.patientName}</TableCell>
                    <TableCell>
                      <Badge variant={bill.paymentType === 'cash' ? 'secondary' : 'default'}>
                        {bill.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedBill(bill)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Bill Details - {bill.billNo}</DialogTitle>
                              <DialogDescription>
                                Patient: {bill.patientName} | Date: {bill.date}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Payment Type:</strong> {bill.paymentType}</div>
                                <div><strong>Total Amount:</strong> ${bill.amount.toFixed(2)}</div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Items</h4>
                                <div className="space-y-2">
                                  {bill.items.map((item, index) => (
                                    <div key={index} className="flex justify-between p-3 bg-muted rounded-lg">
                                      <div>
                                        <div className="font-medium">{item.medicine}</div>
                                        <div className="text-sm text-muted-foreground">
                                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                                        </div>
                                      </div>
                                      <div className="font-medium">
                                        ${(item.quantity * item.price).toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(bill)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleWhatsApp(bill)}>
                          <MessageCircle className="h-4 w-4" />
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

      {/* New Bill Dialog */}
      <Dialog open={showNewBillDialog} onOpenChange={setShowNewBillDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Bill</DialogTitle>
            <DialogDescription>
              Add medicines and quantities for walk-in patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input
                id="patient-name"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Items</Label>
                <Button variant="outline" size="sm" onClick={addItemToBill}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-2">
                {newBillItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                    <Select value={item.medicine} onValueChange={(value) => selectMedicine(index, value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select medicine" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMedicines.map((medicine) => (
                          <SelectItem key={medicine.name} value={medicine.name}>
                            {medicine.name} - ${medicine.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateBillItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    <div className="w-20 text-sm font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeBillItem(index)}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {newBillItems.length > 0 && (
              <div className="text-right">
                <div className="text-lg font-semibold">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
              </div>
            )}

            <Button onClick={handleCreateBill} className="w-full" disabled={newBillItems.length === 0}>
              Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment - ${currentBillTotal.toFixed(2)}</DialogTitle>
            <DialogDescription>
              Choose payment method for {patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handlePayment('cash')} 
                variant="outline"
                className="h-20 flex flex-col gap-2"
              >
                <Banknote className="h-6 w-6" />
                Cash Payment
              </Button>
              <Button 
                onClick={() => handlePayment('online')} 
                variant="outline"
                className="h-20 flex flex-col gap-2"
              >
                <CreditCard className="h-6 w-6" />
                Online Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};