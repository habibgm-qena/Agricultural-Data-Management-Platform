'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartArea, ChartBar, ChartBarIcon, Loader2, Send } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function FiscoScore() {
  const [customerId, setCustomerId] = useState('');
  const [productType, setProductType] = useState('MICRO');
  const [fiscoData, setFiscoData] = useState<Array<{ name: string; score: number }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFiscoData(null);

    const id = customerId.trim();
    if (!id) {
      setError('Please enter a valid Customer ID.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/fico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: id }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch FICO score');
      }
      const data: Array<{ name: string; score: number }> = await res.json();
      setFiscoData(data);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">FICO Score Lookup</CardTitle>
              <CardDescription className="text-emerald-100">
                Enter a Customer ID and product type to fetch and visualize the FICO score
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    <Card className="bg-white/80 backdrop-blur-sm p-6">

      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4  items-end">
          <div className='md:col-span-3 space-y-2'>
            <div className="">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                id="customerId"
                placeholder="e.g., CUST-00123"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                />
            </div>
            <div className="">
                <Label htmlFor="customerId">Customer ID</Label>
                <Label>Product Type *</Label>
                    <Select 
                    value={productType} 
                    onValueChange={(value) => setProductType(value)}
                    >
                    <SelectTrigger className="border-purple-200 focus:border-purple-500">
                        <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MICRO">MICRO</SelectItem>
                        <SelectItem value="NANO">NANO</SelectItem>
                        <SelectItem value="INVENTORY">INVENTORY</SelectItem>
                        <SelectItem value="IFB">IFB</SelectItem>
                        <SelectItem value="DEVICE_ASSET">DEVICE_ASSET</SelectItem>
                        <SelectItem value="AGRICULTURE">AGRICULTURE</SelectItem>
                        <SelectItem value="INVOICE">INVOICE</SelectItem>
                    </SelectContent>
                    </Select>
            </div>
          </div>

          <div className="justify-self-end self-center">
            <Button type="submit" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <span className='flex items-center'>
                    <Send className="h-4 w-4 mr-2" />
                    <>Get FICO Score</>
                </span>
              )}
            </Button> 
          </div>
        </form>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        
      </CardContent>
    </Card>
    {fiscoData && (
          <div className="mt-6">
            <div className="mb-3 text-sm text-gray-600">
              Results for: <span className="font-medium text-gray-800">{customerId}</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={fiscoData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
    </div>

  );
}
