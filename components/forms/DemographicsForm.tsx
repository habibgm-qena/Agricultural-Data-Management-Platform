"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGenericMethod } from '@/app/api/useGeneric';
import { createDemography } from '@/app/api/injestion/demography';

interface DemographicData {
  customerId: string;
  age: number;
  gender: string;
  marital_status: string;
  education_level: string;
  household_size: number;
  household_composition: number;
  monthly_household_income: number;
  dependents_education: number;
  region: string;
  migration_status: string;
  employment_status: string;
  employment_type: string;
  digital_literacy: string;
  access_to_extension: string;
  cooperative_membership: string;
  proximity_to_markets: number;
}

const initialData: DemographicData = {
  customerId: '',
  age: 18,
  gender: '',
  marital_status: '',
  education_level: '',
  household_size: 1,
  household_composition: 0,
  monthly_household_income: 0,
  dependents_education: 0,
  region: '',
  migration_status: '',
  employment_status: '',
  employment_type: '',
  digital_literacy: '',
  access_to_extension: '',
  cooperative_membership: '',
  proximity_to_markets: 1,
};

export default function DemographicsForm() {
  const [customers, setCustomers] = useState<DemographicData[]>([{ ...initialData }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const demographyData = useGenericMethod({
    method: "POST",
    apiMethod: createDemography,
    // errorMessage: "Could not create demographics, please try again",
    onSuccess: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus('idle'), 3000);
    },
    onError: async (error) => {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    },
  });

  const addCustomer = () => {
    setCustomers([...customers, { ...initialData, customerId: `CUST-${Date.now()}` }]);
  };

  const updateCustomer = (index: number, field: keyof DemographicData, value: any) => {
    const updated = [...customers];
    updated[index] = { ...updated[index], [field]: value };
    setCustomers(updated);
  };

  const removeCustomer = (index: number) => {
    setCustomers(customers.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await demographyData.handleAction(customers)
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">Demographics Registration</CardTitle>
              <CardDescription className="text-emerald-100">
                Register demographic information for customers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {submitStatus !== 'idle' && (
        <Alert className={submitStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {submitStatus === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}>
            {submitStatus === 'success' 
              ? 'Demographics data submitted successfully!' 
              : 'Failed to submit data. Please try again.'
            }
          </AlertDescription>
        </Alert>
      )}

      {customers.map((customer, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-emerald-100 text-emerald-700">
                  Customer #{index + 1}
                </Badge>
                <CardTitle className="text-lg">Demographic Information</CardTitle>
              </div>
              {customers.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeCustomer(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`customerId-${index}`}>Customer ID *</Label>
                <Input
                  id={`customerId-${index}`}
                  value={customer.customerId}
                  onChange={(e) => updateCustomer(index, 'customerId', e.target.value)}
                  placeholder="CUST-001"
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`age-${index}`}>Age (18-67) *</Label>
                <Input
                  id={`age-${index}`}
                  type="number"
                  min="18"
                  max="67"
                  value={customer.age}
                  onChange={(e) => updateCustomer(index, 'age', parseInt(e.target.value) || 18)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`gender-${index}`}>Gender *</Label>
                <Select value={customer.gender} onValueChange={(value) => updateCustomer(index, 'gender', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`marital-${index}`}>Marital Status *</Label>
                <Select value={customer.marital_status} onValueChange={(value) => updateCustomer(index, 'marital_status', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`education-${index}`}>Education Level *</Label>
                <Select value={customer.education_level} onValueChange={(value) => updateCustomer(index, 'education_level', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_formal_education">No Formal Education</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelor's">Bachelor&apos;s</SelectItem>
                    <SelectItem value="master's">Master&apos;s</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`household-size-${index}`}>Household Size (1-10) *</Label>
                <Input
                  id={`household-size-${index}`}
                  type="number"
                  min="1"
                  max="10"
                  value={customer.household_size}
                  onChange={(e) => updateCustomer(index, 'household_size', parseInt(e.target.value) || 1)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`household-composition-${index}`}>Household Composition *</Label>
                <Input
                  id={`household-composition-${index}`}
                  type="number"
                  step="0.1"
                  value={customer.household_composition}
                  onChange={(e) => updateCustomer(index, 'household_composition', parseFloat(e.target.value) || 0)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`income-${index}`}>Monthly Household Income *</Label>
                <Input
                  id={`income-${index}`}
                  type="number"
                  value={customer.monthly_household_income}
                  onChange={(e) => updateCustomer(index, 'monthly_household_income', parseInt(e.target.value) || 0)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dependents-${index}`}>Dependents in Education (0-5) *</Label>
                <Input
                  id={`dependents-${index}`}
                  type="number"
                  min="0"
                  max="5"
                  value={customer.dependents_education}
                  onChange={(e) => updateCustomer(index, 'dependents_education', parseInt(e.target.value) || 0)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`region-${index}`}>Region *</Label>
                <Select value={customer.region} onValueChange={(value) => updateCustomer(index, 'region', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oromia">Oromia</SelectItem>
                    <SelectItem value="addis_ababa">Addis Ababa</SelectItem>
                    <SelectItem value="amhara">Amhara</SelectItem>
                    <SelectItem value="tigray">Tigray</SelectItem>
                    <SelectItem value="sidama">Sidama</SelectItem>
                    <SelectItem value="snnp">SNNP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`migration-${index}`}>Migration Status *</Label>
                <Select value={customer.migration_status} onValueChange={(value) => updateCustomer(index, 'migration_status', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idp">IDP</SelectItem>
                    <SelectItem value="refugee">Refugee</SelectItem>
                    <SelectItem value="non-migrant">Non-migrant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`employment-status-${index}`}>Employment Status *</Label>
                <Select value={customer.employment_status} onValueChange={(value) => updateCustomer(index, 'employment_status', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`employment-type-${index}`}>Employment Type *</Label>
                <Select value={customer.employment_type} onValueChange={(value) => updateCustomer(index, 'employment_type', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private_sector">Private Sector</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`digital-literacy-${index}`}>Digital Literacy *</Label>
                <Select value={customer.digital_literacy} onValueChange={(value) => updateCustomer(index, 'digital_literacy', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="basic_mobile">Basic Mobile</SelectItem>
                    <SelectItem value="smartphone_user">Smartphone User</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`extension-${index}`}>Access to Extension *</Label>
                <Select value={customer.access_to_extension} onValueChange={(value) => updateCustomer(index, 'access_to_extension', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`cooperative-${index}`}>Cooperative Membership *</Label>
                <Select value={customer.cooperative_membership} onValueChange={(value) => updateCustomer(index, 'cooperative_membership', value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="non-member">Non-member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`proximity-${index}`}>Proximity to Markets (1-30 km) *</Label>
                <Input
                  id={`proximity-${index}`}
                  type="number"
                  min="1"
                  max="30"
                  value={customer.proximity_to_markets}
                  onChange={(e) => updateCustomer(index, 'proximity_to_markets', parseInt(e.target.value) || 1)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button onClick={addCustomer} variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isSubmitting ? (
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit Demographics'}
        </Button>
      </div>
    </div>
  );
}