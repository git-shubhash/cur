import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Download } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const statsData: StatCard[] = [
  {
    title: 'Total Revenue',
    value: '$12,543',
    change: '+12.5%',
    trend: 'up',
    icon: <DollarSign className="h-5 w-5" />
  },
  {
    title: 'Total Sales',
    value: '1,247',
    change: '+8.2%',
    trend: 'up',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    title: 'Medicines in Stock',
    value: '425',
    change: '-3.1%',
    trend: 'down',
    icon: <Package className="h-5 w-5" />
  },
  {
    title: 'Patients Served',
    value: '892',
    change: '+15.3%',
    trend: 'up',
    icon: <Users className="h-5 w-5" />
  }
];

const recentSales = [
  { medicine: 'Paracetamol', quantity: 45, revenue: 225.00, date: '2024-01-15' },
  { medicine: 'Amoxicillin', quantity: 32, revenue: 400.00, date: '2024-01-15' },
  { medicine: 'Ibuprofen', quantity: 28, revenue: 224.00, date: '2024-01-14' },
  { medicine: 'Aspirin', quantity: 52, revenue: 182.00, date: '2024-01-14' },
  { medicine: 'Omeprazole', quantity: 18, revenue: 270.00, date: '2024-01-13' },
];

const topMedicines = [
  { name: 'Paracetamol', sales: 156, revenue: 780.00 },
  { name: 'Amoxicillin', sales: 98, revenue: 1225.00 },
  { name: 'Ibuprofen', sales: 87, revenue: 696.00 },
  { name: 'Aspirin', sales: 142, revenue: 497.00 },
  { name: 'Omeprazole', sales: 64, revenue: 960.00 },
];

export const AnalyticsTab: React.FC = () => {
  const exportData = (type: string) => {
    // In a real app, this would export actual data
    console.log(`Exporting ${type} data...`);
    // Simulated export functionality
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${type}_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-sm">
                <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'}>
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Sales
                </CardTitle>
                <CardDescription>
                  Latest medicine sales activity
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportData('sales')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{sale.medicine}</div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {sale.quantity} • {sale.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      ${sale.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Medicines */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Medicines
                </CardTitle>
                <CardDescription>
                  Best performing medicines by sales
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportData('top-medicines')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMedicines.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {medicine.sales} units sold
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      ${medicine.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Trends
              </CardTitle>
              <CardDescription>
                Monthly revenue and sales statistics
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('revenue-trends')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-primary/5 via-primary-glow/5 to-secondary/5 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Interactive charts will be implemented here
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Revenue trends, sales patterns, and analytics visualizations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export All Data */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Export all analytics data to Excel format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => exportData('revenue-data')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Revenue Data
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportData('sales-stats')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Sales Statistics
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportData('all-analytics')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Complete Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};