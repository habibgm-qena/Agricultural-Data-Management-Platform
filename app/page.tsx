"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Database, Leaf, Brain, TrendingUp, MapPin, DollarSign, Activity, Gauge } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import DemographicsForm from '@/components/forms/DemographicsForm';
import AssetsForm from '@/components/forms/AssetsForm';
import AgtechForm from '@/components/forms/AgtechForm';
import PsychometricForm from '@/components/forms/PsychometricForm';
import ApiDocumentation from '@/components/ApiDocumentation';
import FiscoScore from '@/components/fiscoScore';

const demographicsData = [
  { name: 'Oromia', value: 450, percentage: 35 },
  { name: 'Addis Ababa', value: 320, percentage: 25 },
  { name: 'Amhara', value: 280, percentage: 22 },
  { name: 'Tigray', value: 180, percentage: 14 },
  { name: 'Others', value: 50, percentage: 4 },
];

const assetData = [
  { month: 'Jan', owned: 65, leased: 35, community: 20 },
  { month: 'Feb', owned: 70, leased: 40, community: 25 },
  { month: 'Mar', owned: 75, leased: 38, community: 22 },
  { month: 'Apr', owned: 80, leased: 45, community: 28 },
  { month: 'May', owned: 85, leased: 42, community: 30 },
  { month: 'Jun', owned: 90, leased: 48, community: 32 },
];

const agriculturalProductivity = [
  { name: 'Vegetable', value: 2400 },
  { name: 'Livestock', value: 1800 },
  { name: 'Poultry', value: 1200 },
  { name: 'Apiculture', value: 800 },
  { name: 'Fishery', value: 600 },
  { name: 'Seeds', value: 400 },
];

const psychometricScores = [
  { category: 'Risk Tolerance', score: 75 },
  { category: 'Innovation', score: 68 },
  { category: 'Planning', score: 82 },
  { category: 'Collaboration', score: 70 },
  { category: 'Adaptability', score: 78 },
];

const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Customer Data API</h1>
                <p className="text-sm text-gray-500">Agricultural Data Management Platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              v1.0.0
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="sticky top-[4.5rem] z-40 grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="demographics" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Demographics
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="agtech" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Leaf className="h-4 w-4 mr-2" />
              Agricultural
            </TabsTrigger>
            <TabsTrigger value="psychometric" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              Psychometric
            </TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Database className="h-4 w-4 mr-2" />
              API Docs
            </TabsTrigger>
            <TabsTrigger value="fisco" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Gauge className="h-4 w-4 mr-2" />
              FISCO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,280</div>
                  <p className="text-xs text-emerald-100">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
                  <MapPin className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">11</div>
                  <p className="text-xs text-teal-100">Across Ethiopia</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agricultural Activities</CardTitle>
                  <Leaf className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-green-100">Different sectors</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Points</CardTitle>
                  <Activity className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">50K+</div>
                  <p className="text-xs text-emerald-100">Collected this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-emerald-700">Regional Distribution</CardTitle>
                  <CardDescription>Customer distribution across Ethiopian regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demographicsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-emerald-700">Asset Ownership Trends</CardTitle>
                  <CardDescription>Land ownership patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={assetData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="owned" stackId="1" stroke="#10b981" fill="#10b981" />
                      <Area type="monotone" dataKey="leased" stackId="1" stroke="#059669" fill="#059669" />
                      <Area type="monotone" dataKey="community" stackId="1" stroke="#047857" fill="#047857" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-emerald-700">Agricultural Productivity</CardTitle>
                  <CardDescription>Production values by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={agriculturalProductivity}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-emerald-700">Psychometric Scores</CardTitle>
                  <CardDescription>Average scores by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {psychometricScores.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{item.category}</span>
                        <span className="text-emerald-600 font-semibold">{item.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded">
                        <div
                          className="h-2 bg-emerald-500 rounded"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics">
            <DemographicsForm />
          </TabsContent>

          <TabsContent value="assets">
            <AssetsForm />
          </TabsContent>

          <TabsContent value="agtech">
            <AgtechForm />
          </TabsContent>

          <TabsContent value="psychometric">
            <PsychometricForm />
          </TabsContent>

          <TabsContent value="docs">
            <ApiDocumentation />
          </TabsContent>

          <TabsContent value="fisco" className="space-y-6">
            <FiscoScore />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}