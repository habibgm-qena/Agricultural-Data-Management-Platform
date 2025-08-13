"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Key, Globe, Code, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const apiEndpoints = [
  {
    id: 'demographics',
    method: 'POST',
    path: '/demographics/',
    title: 'Demographics Registration',
    description: 'Register demographic information for one or more customers.',
    requestBody: {
      demographics: [
        {
          customerId: "CUST-001",
          age: 35,
          gender: "female",
          marital_status: "married",
          education_level: "bachelor's",
          household_size: 4,
          household_composition: 2.5,
          monthly_household_income: 15000,
          dependents_education: 2,
          region: "oromia",
          migration_status: "non-migrant",
          employment_status: "self-employed",
          employment_type: "agriculture",
          digital_literacy: "smartphone_user",
          access_to_extension: "regular",
          cooperative_membership: "member",
          proximity_to_markets: 10
        }
      ]
    }
  },
  {
    id: 'assets',
    method: 'POST',
    path: '/assets/',
    title: 'Assets Registration',
    description: 'Register a customer\'s asset information. Data is stored and pushed to feature store.',
    requestBody: {
      asset_info: [
        {
          customerId: "CUST-002",
          land_ownership: "owned",
          land_area_ha: 5.5,
          land_use: "mixed",
          house_ownership: "owned",
          house_type: "brick",
          farm_equipment_ownership: "tractor",
          equipment_quality: "old_but_functional",
          irrigation_infrastructure: "drip",
          storage_facilities: "barn",
          transportation_equipment: "pickup",
          livestock_type: "cattle",
          number_of_cattle: 10,
          number_of_sheep: 0,
          number_of_goats: 0,
          number_of_poultry: 50,
          livestock_productivity: "milk",
          animal_shelter: "owned",
          savings_account: "yes",
          credit_access: "eligible",
          farm_insurance: "crop",
          monthly_ag_expenditure: 5000,
          communication_devices: "mobile_phone",
          shared_resources: "none",
          electricity_availability: "grid",
          water_source: "borehole",
          housing_durability: "bricks",
          dependence_on_natural_resources: "medium"
        }
      ]
    }
  },
  {
    id: 'agtech',
    method: 'POST',
    path: '/agtech_safe/',
    title: 'Agricultural Data Registration',
    description: 'Register detailed agricultural activity data. Backend fetches NDVI and soil data based on coordinates.',
    requestBody: {
      customerId: "CUST-003",
      latitude: 9.145,
      longitude: 40.4897,
      livestock: [
        {
          Livestock_Type: "Cattle",
          Animal_Breed: "Hybrid",
          Number_of_Animals: 20,
          Feed_Source: "Both",
          Health_Management_Plan: "Yes",
          Professionals: "Yes",
          Training: "Yes",
          Animal_Acquisition_Source: "Purchase",
          Years_of_Experience: 5,
          Temperature: 25,
          Humidity: 60,
          Waste_Management: "Yes",
          Mortality_Rate: 5,
          Market_Channels: "Local Market",
          Land_Area: 10,
          Proximity_to_Market: 15,
          Fattening_Duration: 6,
          Price_per_Item: 20000
        }
      ],
      vegetable_production: [
        {
          land_area: 2,
          vegetable_type: "Tomatoes",
          agriculture_practice: "Irrigation",
          harvest_frequency: "Quarterly",
          price_per_Kg: 30,
          proximity_to_market: 15,
          production_period: 3,
          yield_kg_per_hec: 5000,
          market_channel: "Wholesale Markets"
        }
      ]
    }
  },
  {
    id: 'psychometric',
    method: 'POST',
    path: '/psychometric_info/',
    title: 'Psychometric Assessment',
    description: 'Register customer responses to psychometric assessments.',
    requestBody: {
      psychometric_info: [
        {
          customerId: "CUST-004",
          product_type: "AGRICULTURE",
          question_category: "cat1",
          response: [
            {
              question_id: "q1_risk_aversion",
              answer: "option_b"
            },
            {
              question_id: "q2_future_orientation",
              answer: "option_c"
            }
          ]
        }
      ]
    }
  }
];

export default function ApiDocumentation() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const authHeader = "Authorization: Basic " + btoa("fast_name:fast_password");
  const baseUrl = "http://a551937d589ef4c34871b54a8a65e5be-1186892383.us-east-1.elb.amazonaws.com";

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">API Documentation</CardTitle>
              <CardDescription className="text-blue-100">
                Complete guide to Customer Data API endpoints and authentication
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-emerald-600" />
                <span>API Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Base URL</h3>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">{baseUrl}</code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(baseUrl, 'baseUrl')}
                    >
                      {copiedItem === 'baseUrl' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Swagger Documentation</h3>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(`${baseUrl}/docs`, '_blank')}
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Swagger Docs</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Supported Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiEndpoints.map((endpoint) => (
                    <div key={endpoint.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.path}</code>
                      </div>
                      <h4 className="font-medium">{endpoint.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-emerald-600" />
                <span>Authentication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  All API endpoints use HTTP Basic Authentication. Include the Authorization header with your requests.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Username</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">fast_name</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard('fast_name', 'username')}
                        >
                          {copiedItem === 'username' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Password</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">fast_password</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard('fast_password', 'password')}
                        >
                          {copiedItem === 'password' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Authorization Header</h3>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">{authHeader}</code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(authHeader, 'authHeader')}
                    >
                      {copiedItem === 'authHeader' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">cURL Example</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    <pre>{`curl -X POST "${baseUrl}/demographics/" \\
  -H "Content-Type: application/json" \\
  -H "${authHeader}" \\
  -d '{"demographics": [...]}'`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          {apiEndpoints.map((endpoint) => (
            <Card key={endpoint.id} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {endpoint.method}
                    </Badge>
                    <code className="text-lg font-mono">{endpoint.path}</code>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(endpoint.requestBody, null, 2), `example-${endpoint.id}`)}
                  >
                    {copiedItem === `example-${endpoint.id}` ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <CardTitle>{endpoint.title}</CardTitle>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Request Body Example</h4>
                  <ScrollArea className="h-64 w-full rounded-md border">
                    <pre className="bg-gray-50 p-4 text-xs">
                      <code>{JSON.stringify(endpoint.requestBody, null, 2)}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-emerald-600" />
                <span>Integration Examples</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">JavaScript/Fetch Example</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{`const baseUrl = '${baseUrl}';
const authHeader = '${authHeader}';

const submitDemographics = async (data) => {
  try {
    const response = await fetch(\`\${baseUrl}/demographics/\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ demographics: [data] })
    });
    
    if (response.ok) {
      console.log('Success:', await response.json());
    } else {
      console.error('Error:', await response.json());
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};`}</pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Python/Requests Example</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{`import requests
import json

base_url = '${baseUrl}'
auth = ('fast_name', 'fast_password')

def submit_demographics(data):
    url = f'{base_url}/demographics/'
    payload = {'demographics': [data]}
    
    response = requests.post(
        url,
        json=payload,
        auth=auth,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 201:
        print('Success:', response.json())
    else:
        print('Error:', response.status_code, response.json())`}</pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Response Codes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">201</Badge>
                      <span className="font-medium">Created</span>
                    </div>
                    <p className="text-sm text-gray-600">Request successful, data created</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="bg-red-100 text-red-700">422</Badge>
                      <span className="font-medium">Validation Error</span>
                    </div>
                    <p className="text-sm text-gray-600">Invalid data format or missing required fields</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ className, children, ...props }: any) {
  return <label className={`text-sm font-medium ${className || ''}`} {...props}>{children}</label>;
}