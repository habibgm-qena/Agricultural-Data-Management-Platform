"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useFormik, FieldArray, getIn, FormikProvider } from "formik";
import * as yup from "yup";
import type { InferType } from "yup";

import { FormInput } from "@/components/forms/inputs/FormInput";
import { FormSelect, SelectItem } from "@/components/forms/inputs/FormSelect";

// Hook + API (match your project paths/names)
import { useGenericMethod } from "@/app/api/useGeneric";
import { createAssets } from "@/app/api/injestion/assets";

// -----------------------
// Validation Schema (Yup)
// -----------------------
const AssetDataSchema = yup.object({
  customerId: yup.string().required("Customer ID is required"),

  land_ownership: yup
    .mixed<"owned" | "leased" | "community-shared">()
    .oneOf(["owned", "leased", "community-shared"], "Land ownership is required")
    .required(),
  land_area_ha: yup
    .number()
    .typeError("Land area must be a number")
    .min(0, "Must be ≥ 0")
    .required("Land area is required"),
  land_use: yup
    .mixed<"crop" | "livestock" | "mixed">()
    .oneOf(["crop", "livestock", "mixed"], "Land use is required")
    .required(),

  house_ownership: yup
    .mixed<"owned" | "rented" | "community-shared">()
    .oneOf(["owned", "rented", "community-shared"], "House ownership is required")
    .required(),
  house_type: yup
    .mixed<"mud_(hut)" | "brick" | "multi-story" | "other">()
    .oneOf(["mud_(hut)", "brick", "multi-story", "other"], "House type is required")
    .required(),

  farm_equipment_ownership: yup
    .mixed<"tractor" | "plow" | "pump" | "thresher" | "none">()
    .oneOf(["tractor", "plow", "pump", "thresher", "none"], "Farm equipment is required")
    .required(),
  equipment_quality: yup
    .mixed<"new" | "old_but_functional" | "non-functional">()
    .oneOf(["new", "old_but_functional", "non-functional"], "Equipment quality is required")
    .required(),
  irrigation_infrastructure: yup
    .mixed<"drip" | "sprinkler" | "traditional/manual">()
    .oneOf(["drip", "sprinkler", "traditional/manual"], "Irrigation infrastructure is required")
    .required(),
  storage_facilities: yup
    .mixed<"silo" | "barn" | "cold_storage" | "none">()
    .oneOf(["silo", "barn", "cold_storage", "none"], "Storage facilities is required")
    .required(),
  transportation_equipment: yup
    .mixed<"tractor" | "cart" | "motorbike" | "pickup" | "none">()
    .oneOf(["tractor", "cart", "motorbike", "pickup", "none"], "Transportation equipment is required")
    .required(),

  livestock_type: yup
    .mixed<"cattle" | "goats" | "sheep" | "poultry" | "none">()
    .oneOf(["cattle", "goats", "sheep", "poultry", "none"], "Livestock type is required")
    .required(),
  number_of_cattle: yup.number().typeError("Must be a number").min(0, "Must be ≥ 0").required(),
  number_of_sheep: yup.number().typeError("Must be a number").min(0, "Must be ≥ 0").required(),
  number_of_goats: yup.number().typeError("Must be a number").min(0, "Must be ≥ 0").required(),
  number_of_poultry: yup.number().typeError("Must be a number").min(0, "Must be ≥ 0").required(),
  livestock_productivity: yup
    .mixed<"milk" | "meat" | "eggs" | "other">()
    .oneOf(["milk", "meat", "eggs", "other"], "Livestock productivity is required")
    .required(),
  animal_shelter: yup
    .mixed<"owned" | "community-shared">()
    .oneOf(["owned", "community-shared"], "Animal shelter is required")
    .required(),

  savings_account: yup.mixed<"yes" | "no">().oneOf(["yes", "no"], "Savings account is required").required(),
  credit_access: yup
    .mixed<"eligible" | "not_eligible">()
    .oneOf(["eligible", "not_eligible"], "Credit access is required")
    .required(),
  farm_insurance: yup
    .mixed<"crop" | "livestock" | "none">()
    .oneOf(["crop", "livestock", "none"], "Farm insurance is required")
    .required(),
  monthly_ag_expenditure: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Must be ≥ 0")
    .required("Monthly agricultural expenditure is required"),

  communication_devices: yup
    .mixed<"radio" | "mobile_phone" | "tv" | "none">()
    .oneOf(["radio", "mobile_phone", "tv", "none"], "Communication devices is required")
    .required(),
  shared_resources: yup.string().required("Shared resources is required"),

  electricity_availability: yup
    .mixed<"grid" | "solar" | "none">()
    .oneOf(["grid", "solar", "none"], "Electricity availability is required")
    .required(),
  water_source: yup
    .mixed<"piped" | "borehole" | "river" | "rainwater">()
    .oneOf(["piped", "borehole", "river", "rainwater"], "Water source is required")
    .required(),
  housing_durability: yup
    .mixed<"mud" | "cement" | "bricks">()
    .oneOf(["mud", "cement", "bricks"], "Housing durability is required")
    .required(),
  dependence_on_natural_resources: yup
    .mixed<"high" | "medium" | "low">()
    .oneOf(["high", "medium", "low"], "Dependence on natural resources is required")
    .required(),
});

const AssetsSubmissionSchema = yup.object({
  // 👇 root key must be asset_info to match your API
  asset_info: yup.array().of(AssetDataSchema).min(1, "At least one asset record is required"),
});

type AssetData = InferType<typeof AssetDataSchema>;

// -----------------------
// Initial Values
// -----------------------
const initialAsset: AssetData = {
  customerId: "",
  land_ownership: "owned",
  land_area_ha: 0,
  land_use: "crop",
  house_ownership: "owned",
  house_type: "mud_(hut)",
  farm_equipment_ownership: "none",
  equipment_quality: "new",
  irrigation_infrastructure: "traditional/manual",
  storage_facilities: "none",
  transportation_equipment: "none",
  livestock_type: "none",
  number_of_cattle: 0,
  number_of_sheep: 0,
  number_of_goats: 0,
  number_of_poultry: 0,
  livestock_productivity: "milk",
  animal_shelter: "owned",
  savings_account: "no",
  credit_access: "not_eligible",
  farm_insurance: "none",
  monthly_ag_expenditure: 0,
  communication_devices: "none",
  shared_resources: "none",
  electricity_availability: "none",
  water_source: "piped",
  housing_durability: "mud",
  dependence_on_natural_resources: "medium",
};

// -----------------------
// Component
// -----------------------
export default function AssetsForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const assetsSubmit = useGenericMethod({
    method: "POST",
    apiMethod: createAssets, // ensure this endpoint expects { asset_info: [...] }
    onSuccess: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    },
    onError: async () => {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    },
  });

  const formik = useFormik({
    initialValues: { asset_info: [{ ...initialAsset }] },
    validateOnMount: true,
    validationSchema: AssetsSubmissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await assetsSubmit.handleAction(values);
      } catch {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // -----------------------
  // Helpers (same style as DemographicsForm)
  // -----------------------
  const errorAt = (name: string) => {
    const touched = getIn(formik.touched, name);
    const error = getIn(formik.errors, name) as string | undefined;
    if (error && (touched || formik.submitCount > 0)) return error;
    return undefined;
  };

  const toInt = (v: string, fallback = 0) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? fallback : n;
  };
  const toFloat = (v: string, fallback = 0) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? fallback : n;
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
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

        {submitStatus !== "idle" && (
          <Alert className={submitStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {submitStatus === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={submitStatus === "success" ? "text-green-700" : "text-red-700"}>
              {submitStatus === "success"
                ? "Asset data submitted successfully!"
                : "Failed to submit data. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <FieldArray
          name="asset_info"
          render={(arrayHelpers) => (
            <>
              {formik.values.asset_info.map((asset, index) => {
                const base = `asset_info.${index}`;
                return (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-teal-100 text-teal-700">
                            Asset #{index + 1}
                          </Badge>
                          <CardTitle className="text-lg">Asset Information</CardTitle>
                        </div>
                        {formik.values.asset_info.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => arrayHelpers.remove(index)}
                            className="text-red-600 hover:text-red-800"
                            type="button"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                      {/* Basic Information */}
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FormInput
                            id={`customerId-${index}`}
                            label="Customer ID"
                            required
                            value={asset.customerId}
                            placeholder="CUST-002"
                            onChange={(v) => formik.setFieldValue(`${base}.customerId`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.customerId`, true, false)}
                            error={errorAt(`${base}.customerId`)}
                          />

                          <FormSelect
                            id={`land-ownership-${index}`}
                            label="Land Ownership"
                            required
                            value={asset.land_ownership}
                            onValueChange={(v) => formik.setFieldValue(`${base}.land_ownership`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.land_ownership`, true, false)}
                            error={errorAt(`${base}.land_ownership`)}
                          >
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="leased">Leased</SelectItem>
                            <SelectItem value="community-shared">Community-shared</SelectItem>
                          </FormSelect>

                          <FormInput
                            id={`land-area-${index}`}
                            label="Land Area (Ha)"
                            required
                            type="number"
                            step={0.1}
                            value={asset.land_area_ha}
                            onChange={(v) => formik.setFieldValue(`${base}.land_area_ha`, toFloat(v, 0))}
                            onBlur={() => formik.setFieldTouched(`${base}.land_area_ha`, true, false)}
                            error={errorAt(`${base}.land_area_ha`)}
                          />

                          <FormSelect
                            id={`land-use-${index}`}
                            label="Land Use"
                            required
                            value={asset.land_use}
                            onValueChange={(v) => formik.setFieldValue(`${base}.land_use`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.land_use`, true, false)}
                            error={errorAt(`${base}.land_use`)}
                          >
                            <SelectItem value="crop">Crop</SelectItem>
                            <SelectItem value="livestock">Livestock</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`house-ownership-${index}`}
                            label="House Ownership"
                            required
                            value={asset.house_ownership}
                            onValueChange={(v) => formik.setFieldValue(`${base}.house_ownership`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.house_ownership`, true, false)}
                            error={errorAt(`${base}.house_ownership`)}
                          >
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="community-shared">Community-shared</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`house-type-${index}`}
                            label="House Type"
                            required
                            value={asset.house_type}
                            onValueChange={(v) => formik.setFieldValue(`${base}.house_type`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.house_type`, true, false)}
                            error={errorAt(`${base}.house_type`)}
                          >
                            <SelectItem value="mud_(hut)">Mud (Hut)</SelectItem>
                            <SelectItem value="brick">Brick</SelectItem>
                            <SelectItem value="multi-story">Multi-story</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </FormSelect>
                        </div>
                      </section>

                      {/* Farm Equipment & Infrastructure */}
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Farm Equipment & Infrastructure</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FormSelect
                            id={`farm-equipment-${index}`}
                            label="Farm Equipment"
                            required
                            value={asset.farm_equipment_ownership}
                            onValueChange={(v) => formik.setFieldValue(`${base}.farm_equipment_ownership`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.farm_equipment_ownership`, true, false)}
                            error={errorAt(`${base}.farm_equipment_ownership`)}
                          >
                            <SelectItem value="tractor">Tractor</SelectItem>
                            <SelectItem value="plow">Plow</SelectItem>
                            <SelectItem value="pump">Pump</SelectItem>
                            <SelectItem value="thresher">Thresher</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`equipment-quality-${index}`}
                            label="Equipment Quality"
                            required
                            value={asset.equipment_quality}
                            onValueChange={(v) => formik.setFieldValue(`${base}.equipment_quality`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.equipment_quality`, true, false)}
                            error={errorAt(`${base}.equipment_quality`)}
                          >
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="old_but_functional">Old but Functional</SelectItem>
                            <SelectItem value="non-functional">Non-functional</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`irrigation-${index}`}
                            label="Irrigation Infrastructure"
                            required
                            value={asset.irrigation_infrastructure}
                            onValueChange={(v) => formik.setFieldValue(`${base}.irrigation_infrastructure`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.irrigation_infrastructure`, true, false)}
                            error={errorAt(`${base}.irrigation_infrastructure`)}
                          >
                            <SelectItem value="drip">Drip</SelectItem>
                            <SelectItem value="sprinkler">Sprinkler</SelectItem>
                            <SelectItem value="traditional/manual">Traditional/Manual</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`storage-${index}`}
                            label="Storage Facilities"
                            required
                            value={asset.storage_facilities}
                            onValueChange={(v) => formik.setFieldValue(`${base}.storage_facilities`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.storage_facilities`, true, false)}
                            error={errorAt(`${base}.storage_facilities`)}
                          >
                            <SelectItem value="silo">Silo</SelectItem>
                            <SelectItem value="barn">Barn</SelectItem>
                            <SelectItem value="cold_storage">Cold Storage</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`transportation-${index}`}
                            label="Transportation Equipment"
                            required
                            value={asset.transportation_equipment}
                            onValueChange={(v) => formik.setFieldValue(`${base}.transportation_equipment`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.transportation_equipment`, true, false)}
                            error={errorAt(`${base}.transportation_equipment`)}
                          >
                            <SelectItem value="tractor">Tractor</SelectItem>
                            <SelectItem value="cart">Cart</SelectItem>
                            <SelectItem value="motorbike">Motorbike</SelectItem>
                            <SelectItem value="pickup">Pickup</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </FormSelect>
                        </div>
                      </section>

                      {/* Livestock Information */}
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Livestock Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <FormSelect
                            id={`livestock-type-${index}`}
                            label="Livestock Type"
                            required
                            value={asset.livestock_type}
                            onValueChange={(v) => formik.setFieldValue(`${base}.livestock_type`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.livestock_type`, true, false)}
                            error={errorAt(`${base}.livestock_type`)}
                          >
                            <SelectItem value="cattle">Cattle</SelectItem>
                            <SelectItem value="goats">Goats</SelectItem>
                            <SelectItem value="sheep">Sheep</SelectItem>
                            <SelectItem value="poultry">Poultry</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </FormSelect>

                          <FormInput
                            id={`cattle-${index}`}
                            label="Number of Cattle"
                            required
                            type="number"
                            min={0}
                            value={asset.number_of_cattle}
                            onChange={(v) => formik.setFieldValue(`${base}.number_of_cattle`, toInt(v, 0))}
                            onBlur={() => formik.setFieldTouched(`${base}.number_of_cattle`, true, false)}
                            error={errorAt(`${base}.number_of_cattle`)}
                          />

                          <FormInput
                            id={`sheep-${index}`}
                            label="Number of Sheep"
                            required
                            type="number"
                            min={0}
                            value={asset.number_of_sheep}
                            onChange={(v) => formik.setFieldValue(`${base}.number_of_sheep`, toInt(v, 0))}
                            onBlur={() => formik.setFieldTouched(`${base}.number_of_sheep`, true, false)}
                            error={errorAt(`${base}.number_of_sheep`)}
                          />

                          <FormInput
                            id={`goats-${index}`}
                            label="Number of Goats"
                            required
                            type="number"
                            min={0}
                            value={asset.number_of_goats}
                            onChange={(v) => formik.setFieldValue(`${base}.number_of_goats`, toInt(v, 0))}
                            onBlur={() => formik.setFieldTouched(`${base}.number_of_goats`, true, false)}
                            error={errorAt(`${base}.number_of_goats`)}
                          />

                          <FormInput
                            id={`poultry-${index}`}
                            label="Number of Poultry"
                            required
                            type="number"
                            min={0}
                            value={asset.number_of_poultry}
                            onChange={(v) => formik.setFieldValue(`${base}.number_of_poultry`, toInt(v, 0))}
                            onBlur={() => formik.setFieldTouched(`${base}.number_of_poultry`, true, false)}
                            error={errorAt(`${base}.number_of_poultry`)}
                          />

                          <FormSelect
                            id={`livestock-prod-${index}`}
                            label="Livestock Productivity"
                            required
                            value={asset.livestock_productivity}
                            onValueChange={(v) => formik.setFieldValue(`${base}.livestock_productivity`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.livestock_productivity`, true, false)}
                            error={errorAt(`${base}.livestock_productivity`)}
                          >
                            <SelectItem value="milk">Milk</SelectItem>
                            <SelectItem value="meat">Meat</SelectItem>
                            <SelectItem value="eggs">Eggs</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`animal-shelter-${index}`}
                            label="Animal Shelter"
                            required
                            value={asset.animal_shelter}
                            onValueChange={(v) => formik.setFieldValue(`${base}.animal_shelter`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.animal_shelter`, true, false)}
                            error={errorAt(`${base}.animal_shelter`)}
                          >
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="community-shared">Community-shared</SelectItem>
                          </FormSelect>
                        </div>
                      </section>

                      {/* Financial & Utilities */}
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Financial & Utilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FormSelect
                            id={`savings-${index}`}
                            label="Savings Account"
                            required
                            value={asset.savings_account}
                            onValueChange={(v) => formik.setFieldValue(`${base}.savings_account`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.savings_account`, true, false)}
                            error={errorAt(`${base}.savings_account`)}
                          >
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`credit-access-${index}`}
                            label="Credit Access"
                            required
                            value={asset.credit_access}
                            onValueChange={(v) => formik.setFieldValue(`${base}.credit_access`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.credit_access`, true, false)}
                            error={errorAt(`${base}.credit_access`)}
                          >
                            <SelectItem value="eligible">Eligible</SelectItem>
                            <SelectItem value="not_eligible">Not Eligible</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`farm-insurance-${index}`}
                            label="Farm Insurance"
                            required
                            value={asset.farm_insurance}
                            onValueChange={(v) => formik.setFieldValue(`${base}.farm_insurance`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.farm_insurance`, true, false)}
                            error={errorAt(`${base}.farm_insurance`)}
                          >
                            <SelectItem value="crop">Crop</SelectItem>
                            <SelectItem value="livestock">Livestock</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </FormSelect>

                          <FormInput
                            id={`monthly-exp-${index}`}
                            label="Monthly Agricultural Expenditure"
                            required
                            type="number"
                            value={asset.monthly_ag_expenditure}
                            onChange={(v) => formik.setFieldValue(`${base}.monthly_ag_expenditure`, toFloat(v, 0))}
                            onBlur={() => formik.setFieldTouched(`${base}.monthly_ag_expenditure`, true, false)}
                            error={errorAt(`${base}.monthly_ag_expenditure`)}
                          />

                          <FormSelect
                            id={`comm-devices-${index}`}
                            label="Communication Devices"
                            required
                            value={asset.communication_devices}
                            onValueChange={(v) => formik.setFieldValue(`${base}.communication_devices`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.communication_devices`, true, false)}
                            error={errorAt(`${base}.communication_devices`)}
                          >
                            <SelectItem value="radio">Radio</SelectItem>
                            <SelectItem value="mobile_phone">Mobile Phone</SelectItem>
                            <SelectItem value="tv">TV</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </FormSelect>

                          <FormInput
                            id={`shared-resources-${index}`}
                            label="Shared Resources"
                            required
                            placeholder="e.g., community_tractors"
                            value={asset.shared_resources}
                            onChange={(v) => formik.setFieldValue(`${base}.shared_resources`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.shared_resources`, true, false)}
                            error={errorAt(`${base}.shared_resources`)}
                          />

                          <FormSelect
                            id={`electricity-${index}`}
                            label="Electricity Availability"
                            required
                            value={asset.electricity_availability}
                            onValueChange={(v) => formik.setFieldValue(`${base}.electricity_availability`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.electricity_availability`, true, false)}
                            error={errorAt(`${base}.electricity_availability`)}
                          >
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="solar">Solar</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`water-source-${index}`}
                            label="Water Source"
                            required
                            value={asset.water_source}
                            onValueChange={(v) => formik.setFieldValue(`${base}.water_source`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.water_source`, true, false)}
                            error={errorAt(`${base}.water_source`)}
                          >
                            <SelectItem value="piped">Piped</SelectItem>
                            <SelectItem value="borehole">Borehole</SelectItem>
                            <SelectItem value="river">River</SelectItem>
                            <SelectItem value="rainwater">Rainwater</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`housing-durability-${index}`}
                            label="Housing Durability"
                            required
                            value={asset.housing_durability}
                            onValueChange={(v) => formik.setFieldValue(`${base}.housing_durability`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.housing_durability`, true, false)}
                            error={errorAt(`${base}.housing_durability`)}
                          >
                            <SelectItem value="mud">Mud</SelectItem>
                            <SelectItem value="cement">Cement</SelectItem>
                            <SelectItem value="bricks">Bricks</SelectItem>
                          </FormSelect>

                          <FormSelect
                            id={`dependence-nr-${index}`}
                            label="Dependence on Natural Resources"
                            required
                            value={asset.dependence_on_natural_resources}
                            onValueChange={(v) => formik.setFieldValue(`${base}.dependence_on_natural_resources`, v)}
                            onBlur={() => formik.setFieldTouched(`${base}.dependence_on_natural_resources`, true, false)}
                            error={errorAt(`${base}.dependence_on_natural_resources`)}
                          >
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </FormSelect>
                        </div>
                      </section>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex justify-between">
                <Button
                  onClick={() => arrayHelpers.push({ ...initialAsset, customerId: `CUST-${Date.now()}` })}
                  variant="outline"
                  className="border-teal-300 text-teal-700 hover:bg-teal-50"
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset Record
                </Button>

                <Button
                  disabled={formik.isSubmitting || !formik.isValid}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  type="submit"
                >
                  {formik.isSubmitting ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {formik.isSubmitting ? "Submitting..." : "Submit Assets"}
                </Button>
              </div>
            </>
          )}
        />
      </form>
    </FormikProvider>
  );
}
