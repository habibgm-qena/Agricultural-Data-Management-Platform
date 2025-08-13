"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Plus, Send, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LivestockData {
  Livestock_Type: string;
  Animal_Breed: string;
  Number_of_Animals: number;
  Feed_Source: string;
  Health_Management_Plan: string;
  Professionals: string;
  Training: string;
  Animal_Acquisition_Source: string;
  Years_of_Experience: number;
  Temperature: number;
  Humidity: number;
  Waste_Management: string;
  Mortality_Rate: number;
  Market_Channels: string;
  Land_Area: number;
  Proximity_to_Market: number;
  Fattening_Duration: number;
  Price_per_Item: number;
}

interface VegetableData {
  land_area: number;
  vegetable_type: string;
  agriculture_practice: string;
  harvest_frequency: string;
  price_per_Kg: number;
  proximity_to_market: number;
  production_period: number;
  yield_kg_per_hec: number;
  market_channel: string;
}

interface AgtechData {
  customerId: string;
  latitude: number;
  longitude: number;
  livestock: LivestockData[];
  vegetable_production: VegetableData[];
}

const initialLivestockData: LivestockData = {
  Livestock_Type: '',
  Animal_Breed: '',
  Number_of_Animals: 0,
  Feed_Source: '',
  Health_Management_Plan: '',
  Professionals: '',
  Training: '',
  Animal_Acquisition_Source: '',
  Years_of_Experience: 0,
  Temperature: 0,
  Humidity: 0,
  Waste_Management: '',
  Mortality_Rate: 0,
  Market_Channels: '',
  Land_Area: 0,
  Proximity_to_Market: 0,
  Fattening_Duration: 0,
  Price_per_Item: 0,
};

const initialVegetableData: VegetableData = {
  land_area: 0,
  vegetable_type: '',
  agriculture_practice: '',
  harvest_frequency: '',
  price_per_Kg: 0,
  proximity_to_market: 0,
  production_period: 0,
  yield_kg_per_hec: 0,
  market_channel: '',
};

const initialData: AgtechData = {
  customerId: '',
  latitude: 0,
  longitude: 0,
  livestock: [],
  vegetable_production: [],
};

export default function AgtechForm() {
  const [agtechData, setAgtechData] = useState<AgtechData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const updateBasicData = (field: keyof Pick<AgtechData, 'customerId' | 'latitude' | 'longitude'>, value: any) => {
    setAgtechData(prev => ({ ...prev, [field]: value }));
  };

  const addLivestock = () => {
    setAgtechData(prev => ({
      ...prev,
      livestock: [...prev.livestock, { ...initialLivestockData }]
    }));
  };

  const updateLivestock = (index: number, field: keyof LivestockData, value: any) => {
    setAgtechData(prev => {
      const updated = [...prev.livestock];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, livestock: updated };
    });
  };

  const removeLivestock = (index: number) => {
    setAgtechData(prev => ({
      ...prev,
      livestock: prev.livestock.filter((_, i) => i !== index)
    }));
  };

  const addVegetable = () => {
    setAgtechData(prev => ({
      ...prev,
      vegetable_production: [...prev.vegetable_production, { ...initialVegetableData }]
    }));
  };

  const updateVegetable = (index: number, field: keyof VegetableData, value: any) => {
    setAgtechData(prev => {
      const updated = [...prev.vegetable_production];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, vegetable_production: updated };
    });
  };

  const removeVegetable = (index: number) => {
    setAgtechData(prev => ({
      ...prev,
      vegetable_production: prev.vegetable_production.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">Agricultural Data Registration</CardTitle>
              <CardDescription className="text-green-100">
                Register detailed agricultural activity data with location information
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
              ? 'Agricultural data submitted successfully!' 
              : 'Failed to submit data. Please try again.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Basic Information & Location</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Customer ID *</Label>
            <Input
              value={agtechData.customerId}
              onChange={(e) => updateBasicData('customerId', e.target.value)}
              placeholder="CUST-003"
              className="border-green-200 focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Latitude (-90 to 90) *</Label>
            <Input
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              value={agtechData.latitude}
              onChange={(e) => updateBasicData('latitude', parseFloat(e.target.value) || 0)}
              placeholder="9.145"
              className="border-green-200 focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude (-180 to 180) *</Label>
            <Input
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              value={agtechData.longitude}
              onChange={(e) => updateBasicData('longitude', parseFloat(e.target.value) || 0)}
              placeholder="40.4897"
              className="border-green-200 focus:border-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Agricultural Activities */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Agricultural Activities</CardTitle>
          <CardDescription>Add livestock and vegetable production information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="livestock" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="livestock">Livestock Management</TabsTrigger>
              <TabsTrigger value="vegetables">Vegetable Production</TabsTrigger>
            </TabsList>

            <TabsContent value="livestock" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Livestock Records</h3>
                <Button onClick={addLivestock} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Livestock
                </Button>
              </div>

              {agtechData.livestock.map((livestock, index) => (
                <Card key={index} className="border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          Livestock #{index + 1}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeLivestock(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Livestock Type *</Label>
                        <Select 
                          value={livestock.Livestock_Type} 
                          onValueChange={(value) => updateLivestock(index, 'Livestock_Type', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cattle">Cattle</SelectItem>
                            <SelectItem value="Goats">Goats</SelectItem>
                            <SelectItem value="Sheep">Sheep</SelectItem>
                            <SelectItem value="Poultry">Poultry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Animal Breed *</Label>
                        <Select 
                          value={livestock.Animal_Breed} 
                          onValueChange={(value) => updateLivestock(index, 'Animal_Breed', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select breed" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Local">Local</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Improved">Improved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Number of Animals *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={livestock.Number_of_Animals}
                          onChange={(e) => updateLivestock(index, 'Number_of_Animals', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Feed Source *</Label>
                        <Select 
                          value={livestock.Feed_Source} 
                          onValueChange={(value) => updateLivestock(index, 'Feed_Source', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Grazing">Grazing</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Health Management Plan *</Label>
                        <Select 
                          value={livestock.Health_Management_Plan} 
                          onValueChange={(value) => updateLivestock(index, 'Health_Management_Plan', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Professionals *</Label>
                        <Select 
                          value={livestock.Professionals} 
                          onValueChange={(value) => updateLivestock(index, 'Professionals', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Training *</Label>
                        <Select 
                          value={livestock.Training} 
                          onValueChange={(value) => updateLivestock(index, 'Training', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Animal Acquisition Source *</Label>
                        <Select 
                          value={livestock.Animal_Acquisition_Source} 
                          onValueChange={(value) => updateLivestock(index, 'Animal_Acquisition_Source', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Purchase">Purchase</SelectItem>
                            <SelectItem value="Breeding">Breeding</SelectItem>
                            <SelectItem value="Gift">Gift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Years of Experience *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={livestock.Years_of_Experience}
                          onChange={(e) => updateLivestock(index, 'Years_of_Experience', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Temperature (°C) *</Label>
                        <Input
                          type="number"
                          value={livestock.Temperature}
                          onChange={(e) => updateLivestock(index, 'Temperature', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Humidity (%) *</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={livestock.Humidity}
                          onChange={(e) => updateLivestock(index, 'Humidity', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Waste Management *</Label>
                        <Select 
                          value={livestock.Waste_Management} 
                          onValueChange={(value) => updateLivestock(index, 'Waste_Management', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Mortality Rate (%) *</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={livestock.Mortality_Rate}
                          onChange={(e) => updateLivestock(index, 'Mortality_Rate', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Market Channels *</Label>
                        <Select 
                          value={livestock.Market_Channels} 
                          onValueChange={(value) => updateLivestock(index, 'Market_Channels', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Local Market">Local Market</SelectItem>
                            <SelectItem value="Regional Market">Regional Market</SelectItem>
                            <SelectItem value="Export">Export</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Land Area (Ha) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          value={livestock.Land_Area}
                          onChange={(e) => updateLivestock(index, 'Land_Area', parseFloat(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Proximity to Market (km) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={livestock.Proximity_to_Market}
                          onChange={(e) => updateLivestock(index, 'Proximity_to_Market', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fattening Duration (months) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={livestock.Fattening_Duration}
                          onChange={(e) => updateLivestock(index, 'Fattening_Duration', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Price per Item *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={livestock.Price_per_Item}
                          onChange={(e) => updateLivestock(index, 'Price_per_Item', parseFloat(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="vegetables" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vegetable Production Records</h3>
                <Button onClick={addVegetable} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vegetable Production
                </Button>
              </div>

              {agtechData.vegetable_production.map((vegetable, index) => (
                <Card key={index} className="border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          Vegetable #{index + 1}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeVegetable(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Land Area (Ha) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          value={vegetable.land_area}
                          onChange={(e) => updateVegetable(index, 'land_area', parseFloat(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Vegetable Type *</Label>
                        <Select 
                          value={vegetable.vegetable_type} 
                          onValueChange={(value) => updateVegetable(index, 'vegetable_type', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select vegetable" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                            <SelectItem value="Onions">Onions</SelectItem>
                            <SelectItem value="Cabbage">Cabbage</SelectItem>
                            <SelectItem value="Carrots">Carrots</SelectItem>
                            <SelectItem value="Peppers">Peppers</SelectItem>
                            <SelectItem value="Lettuce">Lettuce</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Agriculture Practice *</Label>
                        <Select 
                          value={vegetable.agriculture_practice} 
                          onValueChange={(value) => updateVegetable(index, 'agriculture_practice', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select practice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Irrigation">Irrigation</SelectItem>
                            <SelectItem value="Rain-fed">Rain-fed</SelectItem>
                            <SelectItem value="Greenhouse">Greenhouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Harvest Frequency *</Label>
                        <Select 
                          value={vegetable.harvest_frequency} 
                          onValueChange={(value) => updateVegetable(index, 'harvest_frequency', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Bi-annually">Bi-annually</SelectItem>
                            <SelectItem value="Annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Price per Kg *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={vegetable.price_per_Kg}
                          onChange={(e) => updateVegetable(index, 'price_per_Kg', parseFloat(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Proximity to Market (km) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={vegetable.proximity_to_market}
                          onChange={(e) => updateVegetable(index, 'proximity_to_market', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Production Period (months) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={vegetable.production_period}
                          onChange={(e) => updateVegetable(index, 'production_period', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Yield (kg/hectare) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={vegetable.yield_kg_per_hec}
                          onChange={(e) => updateVegetable(index, 'yield_kg_per_hec', parseInt(e.target.value) || 0)}
                          className="border-green-200 focus:border-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Market Channel *</Label>
                        <Select 
                          value={vegetable.market_channel} 
                          onValueChange={(value) => updateVegetable(index, 'market_channel', value)}
                        >
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Local Markets">Local Markets</SelectItem>
                            <SelectItem value="Wholesale Markets">Wholesale Markets</SelectItem>
                            <SelectItem value="Retail Stores">Retail Stores</SelectItem>
                            <SelectItem value="Direct to Consumer">Direct to Consumer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? (
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit Agricultural Data'}
        </Button>
      </div>
    </div>
  );
}