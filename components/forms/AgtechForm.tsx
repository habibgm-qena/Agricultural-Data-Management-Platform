"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Plus, Send, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import * as yup from "yup";
import type { InferType } from "yup";
import { useFormik, FieldArray, getIn, FormikProvider } from "formik";

import { useGenericMethod } from "@/app/api/useGeneric";
import { createAgtechSafe } from "@/app/api/injestion/agtech";

/* ========================== ENUM OPTION MODELS ========================== */
const PoultryModel = {
  Poultry_Training: ["Yes", "No"],
  Poultry_Sector: ["Layers", "Broilers", "Both", "Poultry feed production", "Chicken breeding"],
  Poultry_Housing_System: ["Battery_caged", "Slated or wired", "Free range system", "Deep litter", "Extensive", "Semi intensive"],
  Chicken_Breed_Size: ["Heavy (2-7kg)", "Standard (2-3kg)", "Bantam (0.5-1.5kg)"],
  Comb_Type: ["Single", "Rose"],
  Skin_Color: ["Black", "White", "Buff", "Red", "Brown"],
  Place_of_Origin: ["Local", "Hybrid", "Foreign"],
  Health_Management_Plan: ["Yes", "No"],
  Professionals: ["Yes", "No"],
  Type_of_Feed: ["Starter", "Grower", "Finisher"],
  Nutrient_Balance: ["Protein", "Vitamins", "Minerals"],
  Feed_Source: ["Own", "Purchase", "Both"],
  Waste_Management: ["Yes", "No"],
  Chicken_Source: ["Own", "Purchase", "Both"],
  Market_Channels: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
} as const;

const LivestockModel = {
  Livestock_Type: ["Cattle", "Sheep", "Goats", "Poultry", "Other"],
  Animal_Breed: ["Local", "Hybrid", "Exotic"],
  Feed_Source: ["Own", "Purchase", "Both"],
  Health_Management_Plan: ["Yes", "No"],
  Professionals: ["Yes", "No"],
  Training: ["Yes", "No"],
  Animal_Acquisition_Source: ["Own", "Purchase", "Both"],
  Waste_Management: ["Yes", "No"],
  Market_Channels: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
} as const;

const AgroProcessingModel = {
  Raw_Material_Source: ["Farm produce", "Contracted Farmers", "Open Market"],
  Product_Type: ["Juice", "Flour Milling", "Dairy Processing", "Vegetable Oil", "Fish Processing", "Honey Processing"],
  Processing_Type: ["Pasteurization", "Drying", "Canning", "Packaging"],
  Certified: ["Yes", "No"],
  Market_Channels: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
  Training: ["Yes", "No"],
} as const;

const FisheryModel = {
  Training: ["Yes", "No"],
  Type_of_fishes: ["Nile Catfish", "Bayad", "Ethiopian Straightfin Barb", "Others"],
  Feed_source: ["Own", "Purchase", "Both"],
  Fish_source: ["Own", "Purchase", "Both"],
  Market_channels: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
} as const;

const VegetableProductionModel = {
  vegetable_type: ["Tomatoes", "Onions", "Cabbage", "Hot Peppers", "Carrots", "Spinach", "Lettuce", "Kale", "Garlic", "Beetroot"],
  agriculture_practice: ["Rainfall", "Irrigation", "Both"],
  harvest_frequency: ["Annually", "Biannually", "Quarterly"],
  market_channel: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
} as const;

const SeedProductionModel = {
  seed_type: ["Teff", "Wheat", "Maize", "Sorghum", "Barley", "Coffee", "Others"],
  seed_variant: ["Genetically Modified", "Hybrid", "Open Pollinated"],
  agricultural_practice: ["Rainfall", "Irrigation", "Both"],
  production_frequency: ["Annually", "Biannually", "Quarterly"],
  market_channel: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
} as const;

const FruitVegSeedlingModel = {
  agricultural_practice: ["Rainfall", "Irrigation", "Both"],
  production_frequency: ["Annually", "Biannually", "Quarterly"],
  market_channel: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
} as const;

const ApicultureModel = {
  Training: ["Yes", "No"],
  Beeswax_Production: ["Yes", "No"],
  Production_Practice: ["Once", "Twice", "Three times"],
  Methods_to_Control_Predators_and_Pests: ["Traditional", "Modern"],
  Access_to_Domain_Expert: ["Yes", "No"],
  Honey_Quality: ["Grade A", "Grade B", "Grade C", "Substandard"],
  Honey_Color: ["Water White", "Extra White", "White", "Extra Light Amber", "Light Amber", "Amber", "Dark Amber"],
  Honey_Harvesting_Method: ["Traditional", "Modern"],
  Market_Channels: ["Export", "Cooperatives", "Local Market", "Wholesale Markets"],
} as const;

/* ========================== Yup Schemas ========================== */
const percentNumber = yup
  .number()
  .typeError("Must be a number")
  .min(0, "Must be between 0 and 100")
  .max(100, "Must be ≤ 100")
  .required("Required");

const nonNegNumber = yup.number().typeError("Must be a number").min(0, "Must be ≥ 0").required("Required");
const greaterThanTwo = yup.number().typeError("Must be a number").moreThan(2, "Must be > 2").required("Required");
const greaterThanOne = yup.number().typeError("Must be a number").moreThan(1, "Must be > 1").required("Required");
const posNumber = yup.number().typeError("Must be a number").moreThan(0, "Must be > 0").required("Required");
const oneOf = <T extends readonly string[]>(arr: T) => yup.string().oneOf([...arr] as string[]).required("Required");

const LivestockItemSchema = yup.object({
  Livestock_Type: oneOf(LivestockModel.Livestock_Type),
  Animal_Breed: oneOf(LivestockModel.Animal_Breed),
  Number_of_Animals: nonNegNumber,
  Feed_Source: oneOf(LivestockModel.Feed_Source),
  Health_Management_Plan: oneOf(LivestockModel.Health_Management_Plan),
  Professionals: oneOf(LivestockModel.Professionals),
  Training: oneOf(LivestockModel.Training),
  Animal_Acquisition_Source: oneOf(LivestockModel.Animal_Acquisition_Source),
  Years_of_Experience: greaterThanTwo,
  Temperature: yup.number().typeError("Must be a number").required("Required"),
  Humidity: percentNumber,
  Waste_Management: oneOf(LivestockModel.Waste_Management),
  Mortality_Rate: percentNumber,
  Market_Channels: oneOf(LivestockModel.Market_Channels),
  Land_Area: greaterThanOne,
  Proximity_to_Market: nonNegNumber,
  Fattening_Duration: nonNegNumber,
  Price_per_Item: nonNegNumber,
});

const VegetableItemSchema = yup.object({
  land_area: greaterThanOne,
  vegetable_type: oneOf(VegetableProductionModel.vegetable_type),
  agriculture_practice: oneOf(VegetableProductionModel.agriculture_practice),
  harvest_frequency: oneOf(VegetableProductionModel.harvest_frequency),
  price_per_Kg: nonNegNumber,
  proximity_to_market: nonNegNumber,
  production_period: nonNegNumber,
  yield_kg_per_hec: nonNegNumber,
  market_channel: oneOf(VegetableProductionModel.market_channel),
});

const FisheryItemSchema = yup.object({
  Training: oneOf(FisheryModel.Training),
  Type_of_fishes: oneOf(FisheryModel.Type_of_fishes),
  Number_of_fishes: nonNegNumber,
  Number_of_ponds: nonNegNumber,
  Pond_volume_m2: nonNegNumber,
  Stocking_density: nonNegNumber,
  Production_period_months: nonNegNumber,
  Feed_source: oneOf(FisheryModel.Feed_source),
  Fish_source: oneOf(FisheryModel.Fish_source),
  Mortality_rate_percent: percentNumber,
  PH: yup.number().typeError("Must be a number").min(0, "pH must be between 0 and 14").max(14, "pH must be ≤ 14").required("Required"),
  Dissolved_oxygen_mgL: nonNegNumber,
  Proximity_to_market_km: nonNegNumber,
  Average_kg: nonNegNumber,
  Price_per_Kg_ETB: nonNegNumber,
  Market_channels: oneOf(FisheryModel.Market_channels),
});

const FruitVegSeedlingItemSchema = yup.object({
  seedling_variety: yup.string().trim().required("Required"),
  production_capacity: nonNegNumber,
  land_area_hectares: greaterThanOne,
  germination_rate_percentage: percentNumber,
  proximity_to_market_km: nonNegNumber,
  production_period_months: nonNegNumber,
  agricultural_practice: oneOf(FruitVegSeedlingModel.agricultural_practice),
  production_frequency: oneOf(FruitVegSeedlingModel.production_frequency),
  price_per_seedling: nonNegNumber,
  market_channel: oneOf(FruitVegSeedlingModel.market_channel),
});

const SeedProductionItemSchema = yup.object({
  seed_type: oneOf(SeedProductionModel.seed_type),
  seed_variant: oneOf(SeedProductionModel.seed_variant),
  germination_rate_percentage: percentNumber,
  land_area_hectares: greaterThanOne,
  proximity_to_market_km: nonNegNumber,
  agricultural_practice: oneOf(SeedProductionModel.agricultural_practice),
  production_frequency: oneOf(SeedProductionModel.production_frequency),
  production_period_months: nonNegNumber,
  yield_per_hectare_kg: nonNegNumber,
  market_channel: oneOf(SeedProductionModel.market_channel),
  price_per_kg: nonNegNumber,
});

const ApicultureItemSchema = yup.object({
  Training: oneOf(ApicultureModel.Training),
  Beeswax_Production: oneOf(ApicultureModel.Beeswax_Production),
  Mortality_Rate: percentNumber,
  Production_Period: nonNegNumber,
  Production_Practice: oneOf(ApicultureModel.Production_Practice),
  Methods_to_Control_Predators_and_Pests: oneOf(ApicultureModel.Methods_to_Control_Predators_and_Pests),
  Years_of_Experience: greaterThanTwo,
  Access_to_Domain_Expert: oneOf(ApicultureModel.Access_to_Domain_Expert),
  Proximity_to_Clean_Water: nonNegNumber,
  Diversity_of_Flowering_Plants: nonNegNumber,
  Temperature_Celsius: yup.number().typeError("Must be a number").required("Required"),
  Humidity_Percent: percentNumber,
  Honey_Quality: oneOf(ApicultureModel.Honey_Quality),
  Honey_Color: oneOf(ApicultureModel.Honey_Color),
  Honey_Harvesting_Method: oneOf(ApicultureModel.Honey_Harvesting_Method),
  Proximity_to_Market_Km: nonNegNumber,
  Price_per_kg_ETB: nonNegNumber,
  Market_Channels: oneOf(ApicultureModel.Market_Channels),
  Hives_Information: yup.string().trim().required("Required"),
  Number_of_Hives: posNumber,
  Honey_Bee_Types: yup.string().trim().required("Required"),
  Honey_Yield_Per_Year_Kg: nonNegNumber,
});

const AgroProcessingItemSchema = yup.object({
  Raw_Material_Source: oneOf(AgroProcessingModel.Raw_Material_Source),
  Product_Type: oneOf(AgroProcessingModel.Product_Type),
  Processing_Type: oneOf(AgroProcessingModel.Processing_Type),
  Certified: oneOf(AgroProcessingModel.Certified),
  Proximity_to_Market: nonNegNumber,
  Market_Channels: oneOf(AgroProcessingModel.Market_Channels),
  Years_of_Experience: greaterThanTwo,
  Training: oneOf(AgroProcessingModel.Training),
  Specific_Products: yup.array(yup.string().trim().required("Required")).min(1, "At least one product").required("Required"),
  Number_of_Unique_Products: posNumber,
  Production_Capacity: nonNegNumber,
  Land_Area: nonNegNumber,
  Price_per_Kg_or_Liter: nonNegNumber,
});

const PoultryItemSchema = yup.object({
  Poultry_Training: oneOf(PoultryModel.Poultry_Training),
  Poultry_Sector: oneOf(PoultryModel.Poultry_Sector),
  Poultry_Housing_System: oneOf(PoultryModel.Poultry_Housing_System),
  Chicken_Breed_Size: oneOf(PoultryModel.Chicken_Breed_Size),
  Comb_Type: oneOf(PoultryModel.Comb_Type),
  Skin_Color: oneOf(PoultryModel.Skin_Color),
  Place_of_Origin: oneOf(PoultryModel.Place_of_Origin),
  Health_Management_Plan: oneOf(PoultryModel.Health_Management_Plan),
  Professionals: oneOf(PoultryModel.Professionals),
  Temperature: yup.number().typeError("Must be a number").required("Required"),
  Humidity: percentNumber,
  Type_of_Feed: oneOf(PoultryModel.Type_of_Feed),
  Nutrient_Balance: oneOf(PoultryModel.Nutrient_Balance),
  Feed_Source: oneOf(PoultryModel.Feed_Source),
  Waste_Management: oneOf(PoultryModel.Waste_Management),
  Chicken_Source: oneOf(PoultryModel.Chicken_Source),
  Years_of_Experience: greaterThanTwo,
  Mortality_Rate: percentNumber,
  Production_Period: nonNegNumber,
  Price_per_Item: nonNegNumber,
  Proximity_to_Market: nonNegNumber,
  Number_of_Chickens: posNumber,
  Number_of_Poultry_Houses: posNumber,
  Market_Channels: oneOf(PoultryModel.Market_Channels),
});

/* Root schema (final payload) */
const AgtechSafeSchema = yup.object({
  customerId: yup.string().trim().required("Required"),
  latitude: yup.number().typeError("Latitude must be a number").min(-90, "Latitude must be ≥ -90").max(90, "Latitude must be ≤ 90").required("Latitude is required"),
  longitude: yup.number().typeError("Longitude must be a number").min(-180, "Longitude must be ≥ -180").max(180, "Longitude must be ≤ 180").required("Longitude is required"),
  fishery: yup.array(FisheryItemSchema).min(0).required(),
  vegetable_production: yup.array(VegetableItemSchema).min(0).required(),
  fruit_veg_seedling: yup.array(FruitVegSeedlingItemSchema).min(0).required(),
  seed_production: yup.array(SeedProductionItemSchema).min(0).required(),
  apiculture: yup.array(ApicultureItemSchema).min(0).required(),
  livestock: yup.array(LivestockItemSchema).min(0).required(),
  agroprocessing: yup.array(AgroProcessingItemSchema).min(0).required(),
  poultry: yup.array(PoultryItemSchema).min(0).required(),
});

type FormValues = InferType<typeof AgtechSafeSchema>;

/* ========================== Initial Values (sensible defaults) ========================== */
const initialLivestock: InferType<typeof LivestockItemSchema> = {
  Livestock_Type: "Cattle",
  Animal_Breed: "Local",
  Number_of_Animals: 1,
  Feed_Source: "Own",
  Health_Management_Plan: "Yes",
  Professionals: "Yes",
  Training: "Yes",
  Animal_Acquisition_Source: "Own",
  Years_of_Experience: 12,
  Temperature: 24,
  Humidity: 50,
  Waste_Management: "Yes",
  Mortality_Rate: 0,
  Market_Channels: "Local Market",
  Land_Area: 0.5,
  Proximity_to_Market: 5,
  Fattening_Duration: 3,
  Price_per_Item: 0,
};

const initialVegetable: InferType<typeof VegetableItemSchema> = {
  land_area: 2,
  vegetable_type: "Tomatoes",
  agriculture_practice: "Rainfall",
  harvest_frequency: "Annually",
  price_per_Kg: 10,
  proximity_to_market: 5,
  production_period: 4,
  yield_kg_per_hec: 1000,
  market_channel: "Local Market",
};

const initialFishery: InferType<typeof FisheryItemSchema> = {
  Training: "Yes",
  Type_of_fishes: "Nile Catfish",
  Number_of_fishes: 1,
  Number_of_ponds: 1,
  Pond_volume_m2: 1,
  Stocking_density: 0,
  Production_period_months: 6,
  Feed_source: "Own",
  Fish_source: "Own",
  Mortality_rate_percent: 0,
  PH: 7,
  Dissolved_oxygen_mgL: 5,
  Proximity_to_market_km: 5,
  Average_kg: 0.25,
  Price_per_Kg_ETB: 0,
  Market_channels: "Local Market",
};

const initialSeedling: InferType<typeof FruitVegSeedlingItemSchema> = {
  seedling_variety: "Generic",
  production_capacity: 100,
  land_area_hectares: 2,
  germination_rate_percentage: 90,
  proximity_to_market_km: 5,
  production_period_months: 6,
  agricultural_practice: "Rainfall",
  production_frequency: "Annually",
  price_per_seedling: 10,
  market_channel: "Local Market",
};

const initialSeedProduction: InferType<typeof SeedProductionItemSchema> = {
  seed_type: "Teff",
  seed_variant: "Hybrid",
  germination_rate_percentage: 90,
  land_area_hectares: 2,
  proximity_to_market_km: 5,
  agricultural_practice: "Rainfall",
  production_frequency: "Annually",
  production_period_months: 6,
  yield_per_hectare_kg: 100,
  market_channel: "Local Market",
  price_per_kg: 10,
};

const initialApiculture: InferType<typeof ApicultureItemSchema> = {
  Training: "Yes",
  Beeswax_Production: "Yes",
  Mortality_Rate: 5,
  Production_Period: 12,
  Production_Practice: "Once",
  Methods_to_Control_Predators_and_Pests: "Traditional",
  Years_of_Experience: 12,
  Access_to_Domain_Expert: "Yes",
  Proximity_to_Clean_Water: 1,
  Diversity_of_Flowering_Plants: 1,
  Temperature_Celsius: 24,
  Humidity_Percent: 60,
  Honey_Quality: "Grade A",
  Honey_Color: "Water White",
  Honey_Harvesting_Method: "Traditional",
  Proximity_to_Market_Km: 5,
  Price_per_kg_ETB: 0,
  Market_Channels: "Local Market",
  Hives_Information: "Langstroth hives",
  Number_of_Hives: 1,
  Honey_Bee_Types: "Local",
  Honey_Yield_Per_Year_Kg: 10,
};

const initialAgroProcessing: InferType<typeof AgroProcessingItemSchema> = {
  Raw_Material_Source: "Farm produce",
  Product_Type: "Juice",
  Processing_Type: "Pasteurization",
  Certified: "Yes",
  Proximity_to_Market: 5,
  Market_Channels: "Local Market",
  Years_of_Experience: 12,
  Training: "Yes",
  Specific_Products: ["Product"],
  Number_of_Unique_Products: 1,
  Production_Capacity: 1,
  Land_Area: 0.5,
  Price_per_Kg_or_Liter: 0,
};

const initialPoultry: InferType<typeof PoultryItemSchema> = {
  Poultry_Training: "Yes",
  Poultry_Sector: "Layers",
  Poultry_Housing_System: "Battery_caged",
  Chicken_Breed_Size: "Heavy (2-7kg)",
  Comb_Type: "Single",
  Skin_Color: "Black",
  Place_of_Origin: "Local",
  Health_Management_Plan: "Yes",
  Professionals: "Yes",
  Temperature: 24,
  Humidity: 70,
  Type_of_Feed: "Starter",
  Nutrient_Balance: "Protein",
  Feed_Source: "Own",
  Waste_Management: "Yes",
  Chicken_Source: "Own",
  Years_of_Experience: 12,
  Mortality_Rate: 2,
  Production_Period: 12,
  Price_per_Item: 0,
  Proximity_to_Market: 5,
  Number_of_Chickens: 100,
  Number_of_Poultry_Houses: 1,
  Market_Channels: "Local Market",
};

const initialValues: FormValues = {
  customerId: "CUST-001",
  latitude: 8.9806, // Addis Ababa default
  longitude: 38.7578,
  fishery: [],
  vegetable_production: [],
  fruit_veg_seedling: [],
  seed_production: [],
  apiculture: [],
  livestock: [],
  agroprocessing: [],
  poultry: [],
};

/* ========================== Helpers ========================== */
function SelectField({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  options: readonly string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(v) => {
          onChange(v);
          onBlur();
        }}
      >
        <SelectTrigger className="border-green-200 focus:border-green-500">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

const numberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const v = e.target.value;
  if (v === "" || v === "-" || v === "." || v === "-.") return NaN;
  const n = Number(v);
  return Number.isNaN(n) ? NaN : n;
};

/* ========================== Component ========================== */
export default function AgtechSafeForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHook = useGenericMethod({
    method: "POST",
    apiMethod: createAgtechSafe,
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

  const formik = useFormik<FormValues>({
    initialValues,
    // validateOnMount: true,
    validationSchema: AgtechSafeSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const validated = await AgtechSafeSchema.validate(values, { abortEarly: false });
        await submitHook.handleAction(validated);
      } catch {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const touch = (path: string) => formik.setFieldTouched(path, true, false);
  const errorAt = (path: string) => {
    const touched = getIn(formik.touched, path);
    const err = getIn(formik.errors, path) as unknown;
    if (!touched) return undefined;
    if (Array.isArray(err)) return err.filter(Boolean).join(", ");
    return (err as string) || undefined;
  };

  return (
    <FormikProvider value={formik}>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Agtech Data Registration</CardTitle>
                <CardDescription className="text-green-100">Submit comprehensive agricultural activity data</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {submitStatus !== "idle" && (
          <Alert className={submitStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {submitStatus === "success" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
            <AlertDescription className={submitStatus === "success" ? "text-green-700" : "text-red-700"}>
              {submitStatus === "success" ? "Data submitted successfully!" : "Failed to submit data. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Basic */}
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
                value={formik.values.customerId}
                onChange={(e) => formik.setFieldValue("customerId", e.target.value)}
                onBlur={() => touch("customerId")}
                placeholder="CUST-003"
                className="border-green-200 focus:border-green-500"
              />
              {errorAt("customerId") && <p className="text-sm text-red-600">{errorAt("customerId")}</p>}
            </div>
            <div className="space-y-2">
              <Label>Latitude (-90 to 90) *</Label>
              <Input
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={formik.values.latitude}
                onChange={(e) => {
                  const n = numberChange(e);
                  formik.setFieldValue("latitude", Number.isNaN(n) ? formik.values.latitude : n);
                }}
                onBlur={() => touch("latitude")}
                placeholder="9.145"
                className="border-green-200 focus:border-green-500"
              />
              {errorAt("latitude") && <p className="text-sm text-red-600">{errorAt("latitude")}</p>}
            </div>
            <div className="space-y-2">
              <Label>Longitude (-180 to 180) *</Label>
              <Input
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={formik.values.longitude}
                onChange={(e) => {
                  const n = numberChange(e);
                  formik.setFieldValue("longitude", Number.isNaN(n) ? formik.values.longitude : n);
                }}
                onBlur={() => touch("longitude")}
                placeholder="40.4897"
                className="border-green-200 focus:border-green-500"
              />
              {errorAt("longitude") && <p className="text-sm text-red-600">{errorAt("longitude")}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Activities</CardTitle>
            <CardDescription>Fill in one or more sections, as applicable</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="livestock" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
                <TabsTrigger value="livestock">Livestock</TabsTrigger>
                <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
                <TabsTrigger value="fishery">Fishery</TabsTrigger>
                <TabsTrigger value="seedlings">Seedlings</TabsTrigger>
                <TabsTrigger value="seedprod">Seed Prod.</TabsTrigger>
                <TabsTrigger value="apiculture">Apiculture</TabsTrigger>
                <TabsTrigger value="agroproc">Agro-processing</TabsTrigger>
                <TabsTrigger value="poultry">Poultry</TabsTrigger>
              </TabsList>

              {/* Livestock */}
              <TabsContent value="livestock" className="space-y-6">
                <FieldArray name="livestock">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Livestock Records</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialLivestock })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Livestock
                        </Button>
                      </div>

                      {formik.values.livestock.map((row, i) => {
                        const base = `livestock.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Livestock #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SelectField
                                label="Livestock Type *"
                                value={row.Livestock_Type}
                                onChange={(v) => formik.setFieldValue(`${base}.Livestock_Type`, v)}
                                onBlur={() => touch(`${base}.Livestock_Type`)}
                                options={LivestockModel.Livestock_Type}
                                error={errorAt(`${base}.Livestock_Type`)}
                              />
                              <SelectField
                                label="Animal Breed *"
                                value={row.Animal_Breed}
                                onChange={(v) => formik.setFieldValue(`${base}.Animal_Breed`, v)}
                                onBlur={() => touch(`${base}.Animal_Breed`)}
                                options={LivestockModel.Animal_Breed}
                                error={errorAt(`${base}.Animal_Breed`)}
                              />
                              <div className="space-y-2">
                                <Label>Number of Animals *</Label>
                                <Input
                                  type="number"
                                  value={row.Number_of_Animals}
                                  onChange={(e) => formik.setFieldValue(`${base}.Number_of_Animals`, numberChange(e) ?? 0)}
                                  onBlur={() => touch(`${base}.Number_of_Animals`)}
                                  className="border-green-200 focus:border-green-500"
                                />
                                {errorAt(`${base}.Number_of_Animals`) && <p className="text-sm text-red-600">{errorAt(`${base}.Number_of_Animals`)}</p>}
                              </div>
                              <SelectField label="Feed Source *" value={row.Feed_Source} onChange={(v) => formik.setFieldValue(`${base}.Feed_Source`, v)} onBlur={() => touch(`${base}.Feed_Source`)} options={LivestockModel.Feed_Source} error={errorAt(`${base}.Feed_Source`)} />
                              <SelectField label="Health Management Plan *" value={row.Health_Management_Plan} onChange={(v) => formik.setFieldValue(`${base}.Health_Management_Plan`, v)} onBlur={() => touch(`${base}.Health_Management_Plan`)} options={LivestockModel.Health_Management_Plan} error={errorAt(`${base}.Health_Management_Plan`)} />
                              <SelectField label="Professionals *" value={row.Professionals} onChange={(v) => formik.setFieldValue(`${base}.Professionals`, v)} onBlur={() => touch(`${base}.Professionals`)} options={LivestockModel.Professionals} error={errorAt(`${base}.Professionals`)} />
                              <SelectField label="Training *" value={row.Training} onChange={(v) => formik.setFieldValue(`${base}.Training`, v)} onBlur={() => touch(`${base}.Training`)} options={LivestockModel.Training} error={errorAt(`${base}.Training`)} />
                              <SelectField label="Animal Acquisition Source *" value={row.Animal_Acquisition_Source} onChange={(v) => formik.setFieldValue(`${base}.Animal_Acquisition_Source`, v)} onBlur={() => touch(`${base}.Animal_Acquisition_Source`)} options={LivestockModel.Animal_Acquisition_Source} error={errorAt(`${base}.Animal_Acquisition_Source`)} />
                              <div className="space-y-2">
                                <Label>Years of Experience *</Label>
                                <Input type="number" value={row.Years_of_Experience} onChange={(e) => formik.setFieldValue(`${base}.Years_of_Experience`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Years_of_Experience`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Years_of_Experience`) && <p className="text-sm text-red-600">{errorAt(`${base}.Years_of_Experience`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Temperature (°C) *</Label>
                                <Input type="number" value={row.Temperature} onChange={(e) => formik.setFieldValue(`${base}.Temperature`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Temperature`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Temperature`) && <p className="text-sm text-red-600">{errorAt(`${base}.Temperature`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Humidity (%) *</Label>
                                <Input type="number" value={row.Humidity} onChange={(e) => formik.setFieldValue(`${base}.Humidity`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Humidity`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Humidity`) && <p className="text-sm text-red-600">{errorAt(`${base}.Humidity`)}</p>}
                              </div>
                              <SelectField label="Waste Management *" value={row.Waste_Management} onChange={(v) => formik.setFieldValue(`${base}.Waste_Management`, v)} onBlur={() => touch(`${base}.Waste_Management`)} options={LivestockModel.Waste_Management} error={errorAt(`${base}.Waste_Management`)} />
                              <div className="space-y-2">
                                <Label>Mortality Rate (%) *</Label>
                                <Input type="number" value={row.Mortality_Rate} onChange={(e) => formik.setFieldValue(`${base}.Mortality_Rate`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Mortality_Rate`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Mortality_Rate`) && <p className="text-sm text-red-600">{errorAt(`${base}.Mortality_Rate`)}</p>}
                              </div>
                              <SelectField label="Market Channels *" value={row.Market_Channels} onChange={(v) => formik.setFieldValue(`${base}.Market_Channels`, v)} onBlur={() => touch(`${base}.Market_Channels`)} options={LivestockModel.Market_Channels} error={errorAt(`${base}.Market_Channels`)} />
                              <div className="space-y-2">
                                <Label>Land Area (Ha) *</Label>
                                <Input type="number" step="0.1" value={row.Land_Area} onChange={(e) => formik.setFieldValue(`${base}.Land_Area`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Land_Area`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Land_Area`) && <p className="text-sm text-red-600">{errorAt(`${base}.Land_Area`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.Proximity_to_Market} onChange={(e) => formik.setFieldValue(`${base}.Proximity_to_Market`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Proximity_to_Market`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Proximity_to_Market`) && <p className="text-sm text-red-600">{errorAt(`${base}.Proximity_to_Market`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Fattening Duration (months) *</Label>
                                <Input type="number" value={row.Fattening_Duration} onChange={(e) => formik.setFieldValue(`${base}.Fattening_Duration`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Fattening_Duration`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Fattening_Duration`) && <p className="text-sm text-red-600">{errorAt(`${base}.Fattening_Duration`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Price per Item *</Label>
                                <Input type="number" value={row.Price_per_Item} onChange={(e) => formik.setFieldValue(`${base}.Price_per_Item`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Price_per_Item`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Price_per_Item`) && <p className="text-sm text-red-600">{errorAt(`${base}.Price_per_Item`)}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>

              {/* Vegetables */}
              <TabsContent value="vegetables" className="space-y-6">
                <FieldArray name="vegetable_production">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Vegetable Production</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialVegetable })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Vegetable
                        </Button>
                      </div>

                      {formik.values.vegetable_production.map((row, i) => {
                        const base = `vegetable_production.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Vegetable #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Land Area (Ha) *</Label>
                                <Input type="number" step="0.1" value={row.land_area} onChange={(e) => formik.setFieldValue(`${base}.land_area`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.land_area`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.land_area`) && <p className="text-sm text-red-600">{errorAt(`${base}.land_area`)}</p>}
                              </div>
                              <SelectField label="Vegetable Type *" value={row.vegetable_type} onChange={(v) => formik.setFieldValue(`${base}.vegetable_type`, v)} onBlur={() => touch(`${base}.vegetable_type`)} options={VegetableProductionModel.vegetable_type} error={errorAt(`${base}.vegetable_type`)} />
                              <SelectField label="Agriculture Practice *" value={row.agriculture_practice} onChange={(v) => formik.setFieldValue(`${base}.agriculture_practice`, v)} onBlur={() => touch(`${base}.agriculture_practice`)} options={VegetableProductionModel.agriculture_practice} error={errorAt(`${base}.agriculture_practice`)} />
                              <SelectField label="Harvest Frequency *" value={row.harvest_frequency} onChange={(v) => formik.setFieldValue(`${base}.harvest_frequency`, v)} onBlur={() => touch(`${base}.harvest_frequency`)} options={VegetableProductionModel.harvest_frequency} error={errorAt(`${base}.harvest_frequency`)} />
                              <div className="space-y-2">
                                <Label>Price per Kg *</Label>
                                <Input type="number" step="0.01" value={row.price_per_Kg} onChange={(e) => formik.setFieldValue(`${base}.price_per_Kg`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.price_per_Kg`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.price_per_Kg`) && <p className="text-sm text-red-600">{errorAt(`${base}.price_per_Kg`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.proximity_to_market} onChange={(e) => formik.setFieldValue(`${base}.proximity_to_market`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.proximity_to_market`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.proximity_to_market`) && <p className="text-sm text-red-600">{errorAt(`${base}.proximity_to_market`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Production Period (months) *</Label>
                                <Input type="number" value={row.production_period} onChange={(e) => formik.setFieldValue(`${base}.production_period`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.production_period`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.production_period`) && <p className="text-sm text-red-600">{errorAt(`${base}.production_period`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Yield (kg/ha) *</Label>
                                <Input type="number" value={row.yield_kg_per_hec} onChange={(e) => formik.setFieldValue(`${base}.yield_kg_per_hec`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.yield_kg_per_hec`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.yield_kg_per_hec`) && <p className="text-sm text-red-600">{errorAt(`${base}.yield_kg_per_hec`)}</p>}
                              </div>
                              <SelectField label="Market Channel *" value={row.market_channel} onChange={(v) => formik.setFieldValue(`${base}.market_channel`, v)} onBlur={() => touch(`${base}.market_channel`)} options={VegetableProductionModel.market_channel} error={errorAt(`${base}.market_channel`)} />
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>

              {/* Fishery */}
              <TabsContent value="fishery" className="space-y-6">
                <FieldArray name="fishery">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Fishery</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialFishery })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Fishery
                        </Button>
                      </div>

                      {formik.values.fishery.map((row, i) => {
                        const base = `fishery.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Fishery #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SelectField label="Training *" value={row.Training} onChange={(v) => formik.setFieldValue(`${base}.Training`, v)} onBlur={() => touch(`${base}.Training`)} options={FisheryModel.Training} error={errorAt(`${base}.Training`)} />
                              <SelectField label="Type of Fishes *" value={row.Type_of_fishes} onChange={(v) => formik.setFieldValue(`${base}.Type_of_fishes`, v)} onBlur={() => touch(`${base}.Type_of_fishes`)} options={FisheryModel.Type_of_fishes} error={errorAt(`${base}.Type_of_fishes`)} />
                              <div className="space-y-2">
                                <Label>Number of Fishes *</Label>
                                <Input type="number" value={row.Number_of_fishes} onChange={(e) => formik.setFieldValue(`${base}.Number_of_fishes`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Number_of_fishes`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Number_of_fishes`) && <p className="text-sm text-red-600">{errorAt(`${base}.Number_of_fishes`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Number of Ponds *</Label>
                                <Input type="number" value={row.Number_of_ponds} onChange={(e) => formik.setFieldValue(`${base}.Number_of_ponds`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Number_of_ponds`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Number_of_ponds`) && <p className="text-sm text-red-600">{errorAt(`${base}.Number_of_ponds`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Pond Volume (m²) *</Label>
                                <Input type="number" value={row.Pond_volume_m2} onChange={(e) => formik.setFieldValue(`${base}.Pond_volume_m2`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Pond_volume_m2`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Pond_volume_m2`) && <p className="text-sm text-red-600">{errorAt(`${base}.Pond_volume_m2`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Stocking Density *</Label>
                                <Input type="number" value={row.Stocking_density} onChange={(e) => formik.setFieldValue(`${base}.Stocking_density`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Stocking_density`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Stocking_density`) && <p className="text-sm text-red-600">{errorAt(`${base}.Stocking_density`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Production Period (months) *</Label>
                                <Input type="number" value={row.Production_period_months} onChange={(e) => formik.setFieldValue(`${base}.Production_period_months`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Production_period_months`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Production_period_months`) && <p className="text-sm text-red-600">{errorAt(`${base}.Production_period_months`)}</p>}
                              </div>
                              <SelectField label="Feed Source *" value={row.Feed_source} onChange={(v) => formik.setFieldValue(`${base}.Feed_source`, v)} onBlur={() => touch(`${base}.Feed_source`)} options={FisheryModel.Feed_source} error={errorAt(`${base}.Feed_source`)} />
                              <SelectField label="Fish Source *" value={row.Fish_source} onChange={(v) => formik.setFieldValue(`${base}.Fish_source`, v)} onBlur={() => touch(`${base}.Fish_source`)} options={FisheryModel.Fish_source} error={errorAt(`${base}.Fish_source`)} />
                              <div className="space-y-2">
                                <Label>Mortality Rate (%) *</Label>
                                <Input type="number" value={row.Mortality_rate_percent} onChange={(e) => formik.setFieldValue(`${base}.Mortality_rate_percent`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Mortality_rate_percent`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Mortality_rate_percent`) && <p className="text-sm text-red-600">{errorAt(`${base}.Mortality_rate_percent`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>pH (0–14) *</Label>
                                <Input type="number" value={row.PH} onChange={(e) => formik.setFieldValue(`${base}.PH`, numberChange(e) ?? 7)} onBlur={() => touch(`${base}.PH`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.PH`) && <p className="text-sm text-red-600">{errorAt(`${base}.PH`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Dissolved oxygen (mg/L) *</Label>
                                <Input type="number" value={row.Dissolved_oxygen_mgL} onChange={(e) => formik.setFieldValue(`${base}.Dissolved_oxygen_mgL`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Dissolved_oxygen_mgL`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Dissolved_oxygen_mgL`) && <p className="text-sm text-red-600">{errorAt(`${base}.Dissolved_oxygen_mgL`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.Proximity_to_market_km} onChange={(e) => formik.setFieldValue(`${base}.Proximity_to_market_km`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Proximity_to_market_km`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Proximity_to_market_km`) && <p className="text-sm text-red-600">{errorAt(`${base}.Proximity_to_market_km`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Average Weight (kg) *</Label>
                                <Input type="number" step="0.01" value={row.Average_kg} onChange={(e) => formik.setFieldValue(`${base}.Average_kg`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Average_kg`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Average_kg`) && <p className="text-sm text-red-600">{errorAt(`${base}.Average_kg`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Price per Kg (ETB) *</Label>
                                <Input type="number" value={row.Price_per_Kg_ETB} onChange={(e) => formik.setFieldValue(`${base}.Price_per_Kg_ETB`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Price_per_Kg_ETB`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Price_per_Kg_ETB`) && <p className="text-sm text-red-600">{errorAt(`${base}.Price_per_Kg_ETB`)}</p>}
                              </div>
                              <SelectField label="Market Channels *" value={row.Market_channels} onChange={(v) => formik.setFieldValue(`${base}.Market_channels`, v)} onBlur={() => touch(`${base}.Market_channels`)} options={FisheryModel.Market_channels} error={errorAt(`${base}.Market_channels`)} />
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>

              {/* Seedlings */}
              <TabsContent value="seedlings" className="space-y-6">
                <FieldArray name="fruit_veg_seedling">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Fruit & Vegetable Seedlings</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialSeedling })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Seedling
                        </Button>
                      </div>

                      {formik.values.fruit_veg_seedling.map((row, i) => {
                        const base = `fruit_veg_seedling.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Seedling #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Seedling Variety *</Label>
                                <Input value={row.seedling_variety} onChange={(e) => formik.setFieldValue(`${base}.seedling_variety`, e.target.value)} onBlur={() => touch(`${base}.seedling_variety`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.seedling_variety`) && <p className="text-sm text-red-600">{errorAt(`${base}.seedling_variety`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Production Capacity *</Label>
                                <Input type="number" value={row.production_capacity} onChange={(e) => formik.setFieldValue(`${base}.production_capacity`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.production_capacity`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.production_capacity`) && <p className="text-sm text-red-600">{errorAt(`${base}.production_capacity`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Land Area (ha) *</Label>
                                <Input type="number" step="0.1" value={row.land_area_hectares} onChange={(e) => formik.setFieldValue(`${base}.land_area_hectares`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.land_area_hectares`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.land_area_hectares`) && <p className="text-sm text-red-600">{errorAt(`${base}.land_area_hectares`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Germination Rate (%) *</Label>
                                <Input type="number" value={row.germination_rate_percentage} onChange={(e) => formik.setFieldValue(`${base}.germination_rate_percentage`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.germination_rate_percentage`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.germination_rate_percentage`) && <p className="text-sm text-red-600">{errorAt(`${base}.germination_rate_percentage`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.proximity_to_market_km} onChange={(e) => formik.setFieldValue(`${base}.proximity_to_market_km`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.proximity_to_market_km`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.proximity_to_market_km`) && <p className="text-sm text-red-600">{errorAt(`${base}.proximity_to_market_km`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Production Period (months) *</Label>
                                <Input type="number" value={row.production_period_months} onChange={(e) => formik.setFieldValue(`${base}.production_period_months`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.production_period_months`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.production_period_months`) && <p className="text-sm text-red-600">{errorAt(`${base}.production_period_months`)}</p>}
                              </div>
                              <SelectField label="Agricultural Practice *" value={row.agricultural_practice} onChange={(v) => formik.setFieldValue(`${base}.agricultural_practice`, v)} onBlur={() => touch(`${base}.agricultural_practice`)} options={FruitVegSeedlingModel.agricultural_practice} error={errorAt(`${base}.agricultural_practice`)} />
                              <SelectField label="Production Frequency *" value={row.production_frequency} onChange={(v) => formik.setFieldValue(`${base}.production_frequency`, v)} onBlur={() => touch(`${base}.production_frequency`)} options={FruitVegSeedlingModel.production_frequency} error={errorAt(`${base}.production_frequency`)} />
                              <div className="space-y-2">
                                <Label>Price per Seedling *</Label>
                                <Input type="number" value={row.price_per_seedling} onChange={(e) => formik.setFieldValue(`${base}.price_per_seedling`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.price_per_seedling`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.price_per_seedling`) && <p className="text-sm text-red-600">{errorAt(`${base}.price_per_seedling`)}</p>}
                              </div>
                              <SelectField label="Market Channel *" value={row.market_channel} onChange={(v) => formik.setFieldValue(`${base}.market_channel`, v)} onBlur={() => touch(`${base}.market_channel`)} options={FruitVegSeedlingModel.market_channel} error={errorAt(`${base}.market_channel`)} />
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>

              {/* Seed Production */}
              <TabsContent value="seedprod" className="space-y-6">
                <FieldArray name="seed_production">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Seed Production</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialSeedProduction })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Seed Production
                        </Button>
                      </div>

                      {formik.values.seed_production.map((row, i) => {
                        const base = `seed_production.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Seed Prod. #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SelectField label="Seed Type *" value={row.seed_type} onChange={(v) => formik.setFieldValue(`${base}.seed_type`, v)} onBlur={() => touch(`${base}.seed_type`)} options={SeedProductionModel.seed_type} error={errorAt(`${base}.seed_type`)} />
                              <SelectField label="Seed Variant *" value={row.seed_variant} onChange={(v) => formik.setFieldValue(`${base}.seed_variant`, v)} onBlur={() => touch(`${base}.seed_variant`)} options={SeedProductionModel.seed_variant} error={errorAt(`${base}.seed_variant`)} />
                              <div className="space-y-2">
                                <Label>Germination Rate (%) *</Label>
                                <Input type="number" value={row.germination_rate_percentage} onChange={(e) => formik.setFieldValue(`${base}.germination_rate_percentage`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.germination_rate_percentage`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.germination_rate_percentage`) && <p className="text-sm text-red-600">{errorAt(`${base}.germination_rate_percentage`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Land Area (ha) *</Label>
                                <Input type="number" step="0.1" value={row.land_area_hectares} onChange={(e) => formik.setFieldValue(`${base}.land_area_hectares`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.land_area_hectares`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.land_area_hectares`) && <p className="text-sm text-red-600">{errorAt(`${base}.land_area_hectares`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.proximity_to_market_km} onChange={(e) => formik.setFieldValue(`${base}.proximity_to_market_km`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.proximity_to_market_km`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.proximity_to_market_km`) && <p className="text-sm text-red-600">{errorAt(`${base}.proximity_to_market_km`)}</p>}
                              </div>
                              <SelectField label="Agricultural Practice *" value={row.agricultural_practice} onChange={(v) => formik.setFieldValue(`${base}.agricultural_practice`, v)} onBlur={() => touch(`${base}.agricultural_practice`)} options={SeedProductionModel.agricultural_practice} error={errorAt(`${base}.agricultural_practice`)} />
                              <SelectField label="Production Frequency *" value={row.production_frequency} onChange={(v) => formik.setFieldValue(`${base}.production_frequency`, v)} onBlur={() => touch(`${base}.production_frequency`)} options={SeedProductionModel.production_frequency} error={errorAt(`${base}.production_frequency`)} />
                              <div className="space-y-2">
                                <Label>Production Period (months) *</Label>
                                <Input type="number" value={row.production_period_months} onChange={(e) => formik.setFieldValue(`${base}.production_period_months`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.production_period_months`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.production_period_months`) && <p className="text-sm text-red-600">{errorAt(`${base}.production_period_months`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Yield per ha (kg) *</Label>
                                <Input type="number" value={row.yield_per_hectare_kg} onChange={(e) => formik.setFieldValue(`${base}.yield_per_hectare_kg`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.yield_per_hectare_kg`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.yield_per_hectare_kg`) && <p className="text-sm text-red-600">{errorAt(`${base}.yield_per_hectare_kg`)}</p>}
                              </div>
                              <SelectField label="Market Channel *" value={row.market_channel} onChange={(v) => formik.setFieldValue(`${base}.market_channel`, v)} onBlur={() => touch(`${base}.market_channel`)} options={SeedProductionModel.market_channel} error={errorAt(`${base}.market_channel`)} />
                              <div className="space-y-2">
                                <Label>Price per Kg *</Label>
                                <Input type="number" value={row.price_per_kg} onChange={(e) => formik.setFieldValue(`${base}.price_per_kg`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.price_per_kg`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.price_per_kg`) && <p className="text-sm text-red-600">{errorAt(`${base}.price_per_kg`)}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>

              {/* Apiculture */}
              <TabsContent value="apiculture" className="space-y-6">
                <FieldArray name="apiculture">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Apiculture</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialApiculture })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Apiculture
                        </Button>
                      </div>

                      {formik.values.apiculture.map((row, i) => {
                        const base = `apiculture.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Apiculture #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SelectField label="Training *" value={row.Training} onChange={(v) => formik.setFieldValue(`${base}.Training`, v)} onBlur={() => touch(`${base}.Training`)} options={ApicultureModel.Training} error={errorAt(`${base}.Training`)} />
                              <SelectField label="Beeswax Production *" value={row.Beeswax_Production} onChange={(v) => formik.setFieldValue(`${base}.Beeswax_Production`, v)} onBlur={() => touch(`${base}.Beeswax_Production`)} options={ApicultureModel.Beeswax_Production} error={errorAt(`${base}.Beeswax_Production`)} />
                              <div className="space-y-2">
                                <Label>Mortality Rate (%) *</Label>
                                <Input type="number" value={row.Mortality_Rate} onChange={(e) => formik.setFieldValue(`${base}.Mortality_Rate`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Mortality_Rate`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Mortality_Rate`) && <p className="text-sm text-red-600">{errorAt(`${base}.Mortality_Rate`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Production Period *</Label>
                                <Input type="number" value={row.Production_Period} onChange={(e) => formik.setFieldValue(`${base}.Production_Period`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Production_Period`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Production_Period`) && <p className="text-sm text-red-600">{errorAt(`${base}.Production_Period`)}</p>}
                              </div>
                              <SelectField label="Production Practice *" value={row.Production_Practice} onChange={(v) => formik.setFieldValue(`${base}.Production_Practice`, v)} onBlur={() => touch(`${base}.Production_Practice`)} options={ApicultureModel.Production_Practice} error={errorAt(`${base}.Production_Practice`)} />
                              <SelectField label="Predator/Pest Control Methods *" value={row.Methods_to_Control_Predators_and_Pests} onChange={(v) => formik.setFieldValue(`${base}.Methods_to_Control_Predators_and_Pests`, v)} onBlur={() => touch(`${base}.Methods_to_Control_Predators_and_Pests`)} options={ApicultureModel.Methods_to_Control_Predators_and_Pests} error={errorAt(`${base}.Methods_to_Control_Predators_and_Pests`)} />
                              <div className="space-y-2">
                                <Label>Years of Experience *</Label>
                                <Input type="number" value={row.Years_of_Experience} onChange={(e) => formik.setFieldValue(`${base}.Years_of_Experience`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Years_of_Experience`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Years_of_Experience`) && <p className="text-sm text-red-600">{errorAt(`${base}.Years_of_Experience`)}</p>}
                              </div>
                              <SelectField label="Access to Domain Expert *" value={row.Access_to_Domain_Expert} onChange={(v) => formik.setFieldValue(`${base}.Access_to_Domain_Expert`, v)} onBlur={() => touch(`${base}.Access_to_Domain_Expert`)} options={ApicultureModel.Access_to_Domain_Expert} error={errorAt(`${base}.Access_to_Domain_Expert`)} />
                              <div className="space-y-2">
                                <Label>Proximity to Clean Water (km) *</Label>
                                <Input type="number" value={row.Proximity_to_Clean_Water} onChange={(e) => formik.setFieldValue(`${base}.Proximity_to_Clean_Water`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Proximity_to_Clean_Water`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Proximity_to_Clean_Water`) && <p className="text-sm text-red-600">{errorAt(`${base}.Proximity_to_Clean_Water`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Diversity of Flowering Plants *</Label>
                                <Input type="number" value={row.Diversity_of_Flowering_Plants} onChange={(e) => formik.setFieldValue(`${base}.Diversity_of_Flowering_Plants`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Diversity_of_Flowering_Plants`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Diversity_of_Flowering_Plants`) && <p className="text-sm text-red-600">{errorAt(`${base}.Diversity_of_Flowering_Plants`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Temperature (°C) *</Label>
                                <Input type="number" value={row.Temperature_Celsius} onChange={(e) => formik.setFieldValue(`${base}.Temperature_Celsius`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Temperature_Celsius`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Temperature_Celsius`) && <p className="text-sm text-red-600">{errorAt(`${base}.Temperature_Celsius`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Humidity (%) *</Label>
                                <Input type="number" value={row.Humidity_Percent} onChange={(e) => formik.setFieldValue(`${base}.Humidity_Percent`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Humidity_Percent`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Humidity_Percent`) && <p className="text-sm text-red-600">{errorAt(`${base}.Humidity_Percent`)}</p>}
                              </div>
                              <SelectField label="Honey Quality *" value={row.Honey_Quality} onChange={(v) => formik.setFieldValue(`${base}.Honey_Quality`, v)} onBlur={() => touch(`${base}.Honey_Quality`)} options={ApicultureModel.Honey_Quality} error={errorAt(`${base}.Honey_Quality`)} />
                              <SelectField label="Honey Color *" value={row.Honey_Color} onChange={(v) => formik.setFieldValue(`${base}.Honey_Color`, v)} onBlur={() => touch(`${base}.Honey_Color`)} options={ApicultureModel.Honey_Color} error={errorAt(`${base}.Honey_Color`)} />
                              <SelectField label="Harvesting Method *" value={row.Honey_Harvesting_Method} onChange={(v) => formik.setFieldValue(`${base}.Honey_Harvesting_Method`, v)} onBlur={() => touch(`${base}.Honey_Harvesting_Method`)} options={ApicultureModel.Honey_Harvesting_Method} error={errorAt(`${base}.Honey_Harvesting_Method`)} />
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.Proximity_to_Market_Km} onChange={(e) => formik.setFieldValue(`${base}.Proximity_to_Market_Km`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Proximity_to_Market_Km`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Proximity_to_Market_Km`) && <p className="text-sm text-red-600">{errorAt(`${base}.Proximity_to_Market_Km`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Price per Kg (ETB) *</Label>
                                <Input type="number" value={row.Price_per_kg_ETB} onChange={(e) => formik.setFieldValue(`${base}.Price_per_kg_ETB`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Price_per_kg_ETB`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Price_per_kg_ETB`) && <p className="text-sm text-red-600">{errorAt(`${base}.Price_per_kg_ETB`)}</p>}
                              </div>
                              <SelectField label="Market Channels *" value={row.Market_Channels} onChange={(v) => formik.setFieldValue(`${base}.Market_Channels`, v)} onBlur={() => touch(`${base}.Market_Channels`)} options={ApicultureModel.Market_Channels} error={errorAt(`${base}.Market_Channels`)} />
                              <div className="space-y-2">
                                <Label>Hives Information *</Label>
                                <Input value={row.Hives_Information} onChange={(e) => formik.setFieldValue(`${base}.Hives_Information`, e.target.value)} onBlur={() => touch(`${base}.Hives_Information`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Hives_Information`) && <p className="text-sm text-red-600">{errorAt(`${base}.Hives_Information`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Number of Hives *</Label>
                                <Input type="number" value={row.Number_of_Hives} onChange={(e) => formik.setFieldValue(`${base}.Number_of_Hives`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Number_of_Hives`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Number_of_Hives`) && <p className="text-sm text-red-600">{errorAt(`${base}.Number_of_Hives`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Honey Bee Types *</Label>
                                <Input value={row.Honey_Bee_Types} onChange={(e) => formik.setFieldValue(`${base}.Honey_Bee_Types`, e.target.value)} onBlur={() => touch(`${base}.Honey_Bee_Types`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Honey_Bee_Types`) && <p className="text-sm text-red-600">{errorAt(`${base}.Honey_Bee_Types`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Honey Yield/Year (kg) *</Label>
                                <Input type="number" value={row.Honey_Yield_Per_Year_Kg} onChange={(e) => formik.setFieldValue(`${base}.Honey_Yield_Per_Year_Kg`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Honey_Yield_Per_Year_Kg`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Honey_Yield_Per_Year_Kg`) && <p className="text-sm text-red-600">{errorAt(`${base}.Honey_Yield_Per_Year_Kg`)}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>

              {/* Agro-processing */}
              <TabsContent value="agroproc" className="space-y-6">
                <FieldArray name="agroprocessing">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Agro-processing</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialAgroProcessing })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Agro-processing
                        </Button>
                      </div>

                      {formik.values.agroprocessing.map((row, i) => {
                        const base = `agroprocessing.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Agro-processing #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SelectField label="Raw Material Source *" value={row.Raw_Material_Source} onChange={(v) => formik.setFieldValue(`${base}.Raw_Material_Source`, v)} onBlur={() => touch(`${base}.Raw_Material_Source`)} options={AgroProcessingModel.Raw_Material_Source} error={errorAt(`${base}.Raw_Material_Source`)} />
                              <SelectField label="Product Type *" value={row.Product_Type} onChange={(v) => formik.setFieldValue(`${base}.Product_Type`, v)} onBlur={() => touch(`${base}.Product_Type`)} options={AgroProcessingModel.Product_Type} error={errorAt(`${base}.Product_Type`)} />
                              <SelectField label="Processing Type *" value={row.Processing_Type} onChange={(v) => formik.setFieldValue(`${base}.Processing_Type`, v)} onBlur={() => touch(`${base}.Processing_Type`)} options={AgroProcessingModel.Processing_Type} error={errorAt(`${base}.Processing_Type`)} />
                              <SelectField label="Certified *" value={row.Certified} onChange={(v) => formik.setFieldValue(`${base}.Certified`, v)} onBlur={() => touch(`${base}.Certified`)} options={AgroProcessingModel.Certified} error={errorAt(`${base}.Certified`)} />
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.Proximity_to_Market} onChange={(e) => formik.setFieldValue(`${base}.Proximity_to_Market`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Proximity_to_Market`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Proximity_to_Market`) && <p className="text-sm text-red-600">{errorAt(`${base}.Proximity_to_Market`)}</p>}
                              </div>
                              <SelectField label="Market Channels *" value={row.Market_Channels} onChange={(v) => formik.setFieldValue(`${base}.Market_Channels`, v)} onBlur={() => touch(`${base}.Market_Channels`)} options={AgroProcessingModel.Market_Channels} error={errorAt(`${base}.Market_Channels`)} />
                              <div className="space-y-2">
                                <Label>Years of Experience *</Label>
                                <Input type="number" value={row.Years_of_Experience} onChange={(e) => formik.setFieldValue(`${base}.Years_of_Experience`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Years_of_Experience`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Years_of_Experience`) && <p className="text-sm text-red-600">{errorAt(`${base}.Years_of_Experience`)}</p>}
                              </div>
                              <SelectField label="Training *" value={row.Training} onChange={(v) => formik.setFieldValue(`${base}.Training`, v)} onBlur={() => touch(`${base}.Training`)} options={AgroProcessingModel.Training} error={errorAt(`${base}.Training`)} />
                              <div className="space-y-2">
                                <Label>Number of Unique Products *</Label>
                                <Input type="number" value={row.Number_of_Unique_Products} onChange={(e) => formik.setFieldValue(`${base}.Number_of_Unique_Products`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Number_of_Unique_Products`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Number_of_Unique_Products`) && <p className="text-sm text-red-600">{errorAt(`${base}.Number_of_Unique_Products`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Production Capacity *</Label>
                                <Input type="number" value={row.Production_Capacity} onChange={(e) => formik.setFieldValue(`${base}.Production_Capacity`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Production_Capacity`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Production_Capacity`) && <p className="text-sm text-red-600">{errorAt(`${base}.Production_Capacity`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Land Area (ha) *</Label>
                                <Input type="number" step="0.1" value={row.Land_Area} onChange={(e) => formik.setFieldValue(`${base}.Land_Area`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Land_Area`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Land_Area`) && <p className="text-sm text-red-600">{errorAt(`${base}.Land_Area`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Price per Kg/L *</Label>
                                <Input type="number" value={row.Price_per_Kg_or_Liter} onChange={(e) => formik.setFieldValue(`${base}.Price_per_Kg_or_Liter`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Price_per_Kg_or_Liter`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Price_per_Kg_or_Liter`) && <p className="text-sm text-red-600">{errorAt(`${base}.Price_per_Kg_or_Liter`)}</p>}
                              </div>

                              {/* Specific Products */}
                              <div className="col-span-1 md:col-span-3 space-y-2">
                                <Label>Specific Products *</Label>
                                <FieldArray name={`${base}.Specific_Products`}>
                                  {(fa) => (
                                    <div className="space-y-2">
                                      {(row.Specific_Products || []).map((prod, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                          <Input
                                            value={prod}
                                            onChange={(e) => formik.setFieldValue(`${base}.Specific_Products.${idx}`, e.target.value)}
                                            onBlur={() => touch(`${base}.Specific_Products.${idx}`)}
                                            className="border-green-200 focus:border-green-500"
                                          />
                                          <Button type="button" variant="ghost" className="text-red-600 hover:text-red-800" onClick={() => fa.remove(idx)}>
                                            Remove
                                          </Button>
                                        </div>
                                      ))}
                                      <Button type="button" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => fa.push("")}>
                                        + Add Product
                                      </Button>
                                    </div>
                                  )}
                                </FieldArray>
                                {errorAt(`${base}.Specific_Products`) && <p className="text-sm text-red-600">{errorAt(`${base}.Specific_Products`)}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>

              {/* Poultry */}
              <TabsContent value="poultry" className="space-y-6">
                <FieldArray name="poultry">
                  {(arrayHelpers) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Poultry</h3>
                        <Button onClick={() => arrayHelpers.push({ ...initialPoultry })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" type="button">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Poultry
                        </Button>
                      </div>

                      {formik.values.poultry.map((row, i) => {
                        const base = `poultry.${i}`;
                        return (
                          <Card key={i} className="border-green-200">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="bg-green-100 text-green-700">Poultry #{i + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => arrayHelpers.remove(i)} className="text-red-600 hover:text-red-800" type="button">
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SelectField label="Poultry Training *" value={row.Poultry_Training} onChange={(v) => formik.setFieldValue(`${base}.Poultry_Training`, v)} onBlur={() => touch(`${base}.Poultry_Training`)} options={PoultryModel.Poultry_Training} error={errorAt(`${base}.Poultry_Training`)} />
                              <SelectField label="Poultry Sector *" value={row.Poultry_Sector} onChange={(v) => formik.setFieldValue(`${base}.Poultry_Sector`, v)} onBlur={() => touch(`${base}.Poultry_Sector`)} options={PoultryModel.Poultry_Sector} error={errorAt(`${base}.Poultry_Sector`)} />
                              <SelectField label="Housing System *" value={row.Poultry_Housing_System} onChange={(v) => formik.setFieldValue(`${base}.Poultry_Housing_System`, v)} onBlur={() => touch(`${base}.Poultry_Housing_System`)} options={PoultryModel.Poultry_Housing_System} error={errorAt(`${base}.Poultry_Housing_System`)} />
                              <SelectField label="Breed Size *" value={row.Chicken_Breed_Size} onChange={(v) => formik.setFieldValue(`${base}.Chicken_Breed_Size`, v)} onBlur={() => touch(`${base}.Chicken_Breed_Size`)} options={PoultryModel.Chicken_Breed_Size} error={errorAt(`${base}.Chicken_Breed_Size`)} />
                              <SelectField label="Comb Type *" value={row.Comb_Type} onChange={(v) => formik.setFieldValue(`${base}.Comb_Type`, v)} onBlur={() => touch(`${base}.Comb_Type`)} options={PoultryModel.Comb_Type} error={errorAt(`${base}.Comb_Type`)} />
                              <SelectField label="Skin Color *" value={row.Skin_Color} onChange={(v) => formik.setFieldValue(`${base}.Skin_Color`, v)} onBlur={() => touch(`${base}.Skin_Color`)} options={PoultryModel.Skin_Color} error={errorAt(`${base}.Skin_Color`)} />
                              <SelectField label="Place of Origin *" value={row.Place_of_Origin} onChange={(v) => formik.setFieldValue(`${base}.Place_of_Origin`, v)} onBlur={() => touch(`${base}.Place_of_Origin`)} options={PoultryModel.Place_of_Origin} error={errorAt(`${base}.Place_of_Origin`)} />
                              <SelectField label="Health Management Plan *" value={row.Health_Management_Plan} onChange={(v) => formik.setFieldValue(`${base}.Health_Management_Plan`, v)} onBlur={() => touch(`${base}.Health_Management_Plan`)} options={PoultryModel.Health_Management_Plan} error={errorAt(`${base}.Health_Management_Plan`)} />
                              <SelectField label="Professionals *" value={row.Professionals} onChange={(v) => formik.setFieldValue(`${base}.Professionals`, v)} onBlur={() => touch(`${base}.Professionals`)} options={PoultryModel.Professionals} error={errorAt(`${base}.Professionals`)} />
                              <div className="space-y-2">
                                <Label>Temperature (°C) *</Label>
                                <Input type="number" value={row.Temperature} onChange={(e) => formik.setFieldValue(`${base}.Temperature`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Temperature`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Temperature`) && <p className="text-sm text-red-600">{errorAt(`${base}.Temperature`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Humidity (%) *</Label>
                                <Input type="number" value={row.Humidity} onChange={(e) => formik.setFieldValue(`${base}.Humidity`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Humidity`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Humidity`) && <p className="text-sm text-red-600">{errorAt(`${base}.Humidity`)}</p>}
                              </div>
                              <SelectField label="Type of Feed *" value={row.Type_of_Feed} onChange={(v) => formik.setFieldValue(`${base}.Type_of_Feed`, v)} onBlur={() => touch(`${base}.Type_of_Feed`)} options={PoultryModel.Type_of_Feed} error={errorAt(`${base}.Type_of_Feed`)} />
                              <SelectField label="Nutrient Balance *" value={row.Nutrient_Balance} onChange={(v) => formik.setFieldValue(`${base}.Nutrient_Balance`, v)} onBlur={() => touch(`${base}.Nutrient_Balance`)} options={PoultryModel.Nutrient_Balance} error={errorAt(`${base}.Nutrient_Balance`)} />
                              <SelectField label="Feed Source *" value={row.Feed_Source} onChange={(v) => formik.setFieldValue(`${base}.Feed_Source`, v)} onBlur={() => touch(`${base}.Feed_Source`)} options={PoultryModel.Feed_Source} error={errorAt(`${base}.Feed_Source`)} />
                              <SelectField label="Waste Management *" value={row.Waste_Management} onChange={(v) => formik.setFieldValue(`${base}.Waste_Management`, v)} onBlur={() => touch(`${base}.Waste_Management`)} options={PoultryModel.Waste_Management} error={errorAt(`${base}.Waste_Management`)} />
                              <SelectField label="Chicken Source *" value={row.Chicken_Source} onChange={(v) => formik.setFieldValue(`${base}.Chicken_Source`, v)} onBlur={() => touch(`${base}.Chicken_Source`)} options={PoultryModel.Chicken_Source} error={errorAt(`${base}.Chicken_Source`)} />
                              <div className="space-y-2">
                                <Label>Years of Experience *</Label>
                                <Input type="number" value={row.Years_of_Experience} onChange={(e) => formik.setFieldValue(`${base}.Years_of_Experience`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Years_of_Experience`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Years_of_Experience`) && <p className="text-sm text-red-600">{errorAt(`${base}.Years_of_Experience`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Mortality Rate (%) *</Label>
                                <Input type="number" value={row.Mortality_Rate} onChange={(e) => formik.setFieldValue(`${base}.Mortality_Rate`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Mortality_Rate`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Mortality_Rate`) && <p className="text-sm text-red-600">{errorAt(`${base}.Mortality_Rate`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Production Period *</Label>
                                <Input type="number" value={row.Production_Period} onChange={(e) => formik.setFieldValue(`${base}.Production_Period`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Production_Period`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Production_Period`) && <p className="text-sm text-red-600">{errorAt(`${base}.Production_Period`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Price per Item *</Label>
                                <Input type="number" value={row.Price_per_Item} onChange={(e) => formik.setFieldValue(`${base}.Price_per_Item`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Price_per_Item`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Price_per_Item`) && <p className="text-sm text-red-600">{errorAt(`${base}.Price_per_Item`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Proximity to Market (km) *</Label>
                                <Input type="number" value={row.Proximity_to_Market} onChange={(e) => formik.setFieldValue(`${base}.Proximity_to_Market`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Proximity_to_Market`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Proximity_to_Market`) && <p className="text-sm text-red-600">{errorAt(`${base}.Proximity_to_Market`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Number of Chickens *</Label>
                                <Input type="number" value={row.Number_of_Chickens} onChange={(e) => formik.setFieldValue(`${base}.Number_of_Chickens`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Number_of_Chickens`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Number_of_Chickens`) && <p className="text-sm text-red-600">{errorAt(`${base}.Number_of_Chickens`)}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label>Number of Poultry Houses *</Label>
                                <Input type="number" value={row.Number_of_Poultry_Houses} onChange={(e) => formik.setFieldValue(`${base}.Number_of_Poultry_Houses`, numberChange(e) ?? 0)} onBlur={() => touch(`${base}.Number_of_Poultry_Houses`)} className="border-green-200 focus:border-green-500" />
                                {errorAt(`${base}.Number_of_Poultry_Houses`) && <p className="text-sm text-red-600">{errorAt(`${base}.Number_of_Poultry_Houses`)}</p>}
                              </div>
                              <SelectField label="Market Channels *" value={row.Market_Channels} onChange={(v) => formik.setFieldValue(`${base}.Market_Channels`, v)} onBlur={() => touch(`${base}.Market_Channels`)} options={PoultryModel.Market_Channels} error={errorAt(`${base}.Market_Channels`)} />
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => formik.submitForm()} disabled={isSubmitting || !formik.isValid} className="bg-green-600 hover:bg-green-700 text-white" type="button">
            {isSubmitting ? <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" /> : <Send className="h-4 w-4 mr-2" />}
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </FormikProvider>
  );
}
