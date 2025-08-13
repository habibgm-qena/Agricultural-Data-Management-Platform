"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AssetData {
  customerId: string;
  land_ownership: string;
  land_area_ha: number;
  land_use: string;
  house_ownership: string;
  house_type: string;
  farm_equipment_ownership: string;
  equipment_quality: string;
  irrigation_infrastructure: string;
  storage_facilities: string;
  transportation_equipment: string;
  livestock_type: string;
  number_of_cattle: number;
  number_of_sheep: number;
  number_of_goats: number;
  number_of_poultry: number;
  livestock_productivity: string;
  animal_shelter: string;
  savings_account: string;
  credit_access: string;
  farm_insurance: string;
  monthly_ag_expenditure: number;
  communication_devices: string;
  shared_resources: string;
  electricity_availability: string;
  water_source: string;
  housing_durability: string;
  dependence_on_natural_resources: string;
}

const initialData: AssetData = {
  customerId: '',
  land_ownership: '',
  land_area_ha: 0,
  land_use: '',
  house_ownership: '',
  house_type: '',
  farm_equipment_ownership: '',
  equipment_quality: '',
  irrigation_infrastructure: '',
  storage_facilities: '',
  transportation_equipment: '',
  livestock_type: '',
  number_of_cattle: 0,
  number_of_sheep: 0,
  number_of_goats: 0,
  number_of_poultry: 0,
  livestock_productivity: '',
  animal_shelter: '',
  savings_account: '',
  credit_access: '',
  farm_insurance: '',
  monthly_ag_expenditure: 0,
  communication_devices: '',
  shared_resources: '',
  electricity_availability: '',
  water_source: '',
  housing_durability: '',
  dependence_on_natural_resources: '',
};

export default function AssetsForm() {
  const [assets, setAssets] = useState<AssetData[]>([{ ...initialData }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const addAsset = () => {
    setAssets([...assets, { ...initialData, customerId: `CUST-${Date.now()}` }]);
  };

  const updateAsset = (index: number, field: keyof AssetData, value: any) => {
    const updated = [...assets];
    updated[index] = { ...updated[index], [field]: value };
    setAssets(updated);
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
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
      <Card className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">Assets Registration</CardTitle>
              <CardDescription className="text-teal-100">
                Register customer asset information
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
              ? 'Asset data submitted successfully!' 
              : 'Failed to submit data. Please try again.'
            }
          </AlertDescription>
        </Alert>
      )}

      {assets.map((asset, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-teal-100 text-teal-700">
                  Asset #{index + 1}
                </Badge>
                <CardTitle className="text-lg">Asset Information</CardTitle>
              </div>
              {assets.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeAsset(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`customerId-${index}`}>Customer ID *</Label>
                  <Input
                    id={`customerId-${index}`}
                    value={asset.customerId}
                    onChange={(e) => updateAsset(index, 'customerId', e.target.value)}
                    placeholder="CUST-002"
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Land Ownership *</Label>
                  <Select value={asset.land_ownership} onValueChange={(value) => updateAsset(index, 'land_ownership', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="leased">Leased</SelectItem>
                      <SelectItem value="community-shared">Community-shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Land Area (Ha) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={asset.land_area_ha}
                    onChange={(e) => updateAsset(index, 'land_area_ha', parseFloat(e.target.value) || 0)}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Land Use *</Label>
                  <Select value={asset.land_use} onValueChange={(value) => updateAsset(index, 'land_use', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop">Crop</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>House Ownership *</Label>
                  <Select value={asset.house_ownership} onValueChange={(value) => updateAsset(index, 'house_ownership', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="community-shared">Community-shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>House Type *</Label>
                  <Select value={asset.house_type} onValueChange={(value) => updateAsset(index, 'house_type', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mud_(hut)">Mud (Hut)</SelectItem>
                      <SelectItem value="brick">Brick</SelectItem>
                      <SelectItem value="multi-story">Multi-story</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Farm Equipment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Farm Equipment & Infrastructure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Farm Equipment *</Label>
                  <Select value={asset.farm_equipment_ownership} onValueChange={(value) => updateAsset(index, 'farm_equipment_ownership', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tractor">Tractor</SelectItem>
                      <SelectItem value="plow">Plow</SelectItem>
                      <SelectItem value="pump">Pump</SelectItem>
                      <SelectItem value="thresher">Thresher</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Equipment Quality *</Label>
                  <Select value={asset.equipment_quality} onValueChange={(value) => updateAsset(index, 'equipment_quality', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="old_but_functional">Old but Functional</SelectItem>
                      <SelectItem value="non-functional">Non-functional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Irrigation Infrastructure *</Label>
                  <Select value={asset.irrigation_infrastructure} onValueChange={(value) => updateAsset(index, 'irrigation_infrastructure', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select infrastructure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drip">Drip</SelectItem>
                      <SelectItem value="sprinkler">Sprinkler</SelectItem>
                      <SelectItem value="traditional/manual">Traditional/Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Storage Facilities *</Label>
                  <Select value={asset.storage_facilities} onValueChange={(value) => updateAsset(index, 'storage_facilities', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silo">Silo</SelectItem>
                      <SelectItem value="barn">Barn</SelectItem>
                      <SelectItem value="cold_storage">Cold Storage</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transportation Equipment *</Label>
                  <Select value={asset.transportation_equipment} onValueChange={(value) => updateAsset(index, 'transportation_equipment', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tractor">Tractor</SelectItem>
                      <SelectItem value="cart">Cart</SelectItem>
                      <SelectItem value="motorbike">Motorbike</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Livestock */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Livestock Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Livestock Type *</Label>
                  <Select value={asset.livestock_type} onValueChange={(value) => updateAsset(index, 'livestock_type', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cattle">Cattle</SelectItem>
                      <SelectItem value="goats">Goats</SelectItem>
                      <SelectItem value="sheep">Sheep</SelectItem>
                      <SelectItem value="poultry">Poultry</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Cattle *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={asset.number_of_cattle}
                    onChange={(e) => updateAsset(index, 'number_of_cattle', parseInt(e.target.value) || 0)}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of Sheep *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={asset.number_of_sheep}
                    onChange={(e) => updateAsset(index, 'number_of_sheep', parseInt(e.target.value) || 0)}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of Goats *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={asset.number_of_goats}
                    onChange={(e) => updateAsset(index, 'number_of_goats', parseInt(e.target.value) || 0)}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of Poultry *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={asset.number_of_poultry}
                    onChange={(e) => updateAsset(index, 'number_of_poultry', parseInt(e.target.value) || 0)}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Livestock Productivity *</Label>
                  <Select value={asset.livestock_productivity} onValueChange={(value) => updateAsset(index, 'livestock_productivity', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select productivity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milk">Milk</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="eggs">Eggs</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Animal Shelter *</Label>
                  <Select value={asset.animal_shelter} onValueChange={(value) => updateAsset(index, 'animal_shelter', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select shelter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="community-shared">Community-shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Financial & Utilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Financial & Utilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Savings Account *</Label>
                  <Select value={asset.savings_account} onValueChange={(value) => updateAsset(index, 'savings_account', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Credit Access *</Label>
                  <Select value={asset.credit_access} onValueChange={(value) => updateAsset(index, 'credit_access', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eligible">Eligible</SelectItem>
                      <SelectItem value="not_eligible">Not Eligible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Farm Insurance *</Label>
                  <Select value={asset.farm_insurance} onValueChange={(value) => updateAsset(index, 'farm_insurance', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select insurance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop">Crop</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Agricultural Expenditure *</Label>
                  <Input
                    type="number"
                    value={asset.monthly_ag_expenditure}
                    onChange={(e) => updateAsset(index, 'monthly_ag_expenditure', parseFloat(e.target.value) || 0)}
                    className="border-teal-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Communication Devices *</Label>
                  <Select value={asset.communication_devices} onValueChange={(value) => updateAsset(index, 'communication_devices', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select devices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radio">Radio</SelectItem>
                      <SelectItem value="mobile_phone">Mobile Phone</SelectItem>
                      <SelectItem value="tv">TV</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Electricity Availability *</Label>
                  <Select value={asset.electricity_availability} onValueChange={(value) => updateAsset(index, 'electricity_availability', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Water Source *</Label>
                  <Select value={asset.water_source} onValueChange={(value) => updateAsset(index, 'water_source', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piped">Piped</SelectItem>
                      <SelectItem value="borehole">Borehole</SelectItem>
                      <SelectItem value="river">River</SelectItem>
                      <SelectItem value="rainwater">Rainwater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Housing Durability *</Label>
                  <Select value={asset.housing_durability} onValueChange={(value) => updateAsset(index, 'housing_durability', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select durability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mud">Mud</SelectItem>
                      <SelectItem value="cement">Cement</SelectItem>
                      <SelectItem value="bricks">Bricks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dependence on Natural Resources *</Label>
                  <Select value={asset.dependence_on_natural_resources} onValueChange={(value) => updateAsset(index, 'dependence_on_natural_resources', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500">
                      <SelectValue placeholder="Select dependence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button onClick={addAsset} variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset Record
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isSubmitting ? (
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit Assets'}
        </Button>
      </div>
    </div>
  );
}