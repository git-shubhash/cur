import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Pill, FlaskConical, Scan, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to login page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medical">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-white shadow-medical">
            <Building2 className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">MediDash Flow</CardTitle>
          <CardDescription>
            Hospital Department Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Pill className="h-5 w-5 text-primary" />
              <span className="text-sm">Pharmacy Management</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FlaskConical className="h-5 w-5 text-primary" />
              <span className="text-sm">Laboratory Services</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Scan className="h-5 w-5 text-primary" />
              <span className="text-sm">Radiology Department</span>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-primary to-primary-glow"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
