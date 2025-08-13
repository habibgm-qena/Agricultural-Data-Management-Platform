'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function FiscoScore() {
  const [customerId, setCustomerId] = useState('');
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
      const res = await fetch('/api/fisco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: id }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch FISCO score');
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
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-emerald-700">FISCO Score Lookup</CardTitle>
        <CardDescription>Enter a Customer ID to fetch and visualize the FISCO score</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              placeholder="e.g., CUST-00123"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>
          <div className="flex md:justify-end">
            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Get FISCO Score'
              )}
            </Button>
          </div>
        </form>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

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
      </CardContent>
    </Card>
  );
}
