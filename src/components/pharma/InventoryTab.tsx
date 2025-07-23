import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Plus, Search, RefreshCw, Edit, Trash2, ShoppingCart, Download, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  stock: number;
  price: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface RequestCartItem {
  medicine: Medicine;
  quantity: number;
}

const mockMedicines: Medicine[] = [
  { id: '1', name: 'Paracetamol', stock: 150, price: 5.00, status: 'in-stock' },
  { id: '2', name: 'Amoxicillin', stock: 25, price: 12.50, status: 'low-stock' },
  { id: '3', name: 'Ibuprofen', stock: 0, price: 8.00, status: 'out-of-stock' },
  { id: '4', name: 'Aspirin', stock: 200, price: 3.50, status: 'in-stock' },
];

export const InventoryTab: React.FC = () => {
  const [medicines, setMedicines] = useState(mockMedicines);
  const [requestCart, setRequestCart] = useState<RequestCartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', quantity: '', price: '' });

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'default';
      case 'low-stock': return 'secondary';
      case 'out-of-stock': return 'destructive';
      default: return 'default';
    }
  };

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.quantity || !newMedicine.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name,
      stock: parseInt(newMedicine.quantity),
      price: parseFloat(newMedicine.price),
      status: parseInt(newMedicine.quantity) > 50 ? 'in-stock' : 
              parseInt(newMedicine.quantity) > 0 ? 'low-stock' : 'out-of-stock'
    };

    setMedicines(prev => [...prev, medicine]);
    setNewMedicine({ name: '', quantity: '', price: '' });
    setShowAddDialog(false);
    
    toast({
      title: "Medicine Added",
      description: `${medicine.name} has been added to inventory.`,
    });
  };

  const handleRefill = (medicine: Medicine, quantity: number) => {
    setMedicines(prev => prev.map(m => 
      m.id === medicine.id 
        ? { ...m, stock: m.stock + quantity }
        : m
    ));

    const existingItem = requestCart.find(item => item.medicine.id === medicine.id);
    if (existingItem) {
      setRequestCart(prev => prev.map(item => 
        item.medicine.id === medicine.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setRequestCart(prev => [...prev, { medicine, quantity }]);
    }

    toast({
      title: "Stock Updated",
      description: `${medicine.name} refilled and added to request cart.`,
    });
  };

  const handleDeleteMedicine = (medicineId: string) => {
    setMedicines(prev => prev.filter(m => m.id !== medicineId));
    toast({
      title: "Medicine Deleted",
      description: "Medicine has been removed from inventory.",
    });
  };

  const removeFromCart = (medicineId: string) => {
    setRequestCart(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const updateCartQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    
    setRequestCart(prev => prev.map(item => 
      item.medicine.id === medicineId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const exportCart = () => {
    toast({
      title: "Export Started",
      description: "Downloading Excel file with request cart items.",
    });
  };

  const sendMailRequest = () => {
    toast({
      title: "Email Sent",
      description: "Medicine request has been sent via email.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
              <CardDescription>
                Manage medicine stock and requests
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCartDialog(true)}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart ({requestCart.length})
              </Button>
              <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-primary to-primary-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.stock}</TableCell>
                    <TableCell>${medicine.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(medicine.status)}>
                        {medicine.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Refill {medicine.name}</DialogTitle>
                              <DialogDescription>
                                Enter the quantity to add to stock
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Current Stock: {medicine.stock}</Label>
                              </div>
                              <div>
                                <Label htmlFor="refill-quantity">Refill Quantity</Label>
                                <Input
                                  id="refill-quantity"
                                  type="number"
                                  placeholder="Enter quantity"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const quantity = parseInt((e.target as HTMLInputElement).value);
                                      if (quantity > 0) {
                                        handleRefill(medicine, quantity);
                                        e.currentTarget.value = '';
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteMedicine(medicine.id)}>
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

      {/* Add Medicine Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Enter the details for the new medicine
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicine-name">Medicine Name</Label>
              <Input
                id="medicine-name"
                placeholder="Enter medicine name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="medicine-quantity">Initial Quantity</Label>
              <Input
                id="medicine-quantity"
                type="number"
                placeholder="Enter quantity"
                value={newMedicine.quantity}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="medicine-price">Price per Unit ($)</Label>
              <Input
                id="medicine-price"
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={newMedicine.price}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <Button onClick={handleAddMedicine} className="w-full">
              Add Medicine
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Cart Dialog */}
      <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Cart</DialogTitle>
            <DialogDescription>
              Manage items to be requested from suppliers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {requestCart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No items in request cart
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {requestCart.map((item) => (
                    <div key={item.medicine.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{item.medicine.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ${item.medicine.price.toFixed(2)} each
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.medicine.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeFromCart(item.medicine.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={exportCart} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button onClick={sendMailRequest} className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Mail
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};