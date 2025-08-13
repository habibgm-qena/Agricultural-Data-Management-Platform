"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGenericMethod } from "@/app/api/useGeneric";
import { createDemography } from "@/app/api/injestion/demography";
import { useFormik, FieldArray, getIn, FormikProvider } from "formik";
import { FormInput } from "@/components/forms/inputs/FormInput";
import { FormSelect, SelectItem } from "@/components/forms/inputs/FormSelect";

import * as yup from "yup";
import type { InferType } from "yup";

const DemographicDataSchema = yup.object({
  customerId: yup.string().required("Customer ID is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .min(18, "Age must be at least 18")
    .max(67, "Age must be at most 67")
  .required("Age is required"),
  gender: yup.mixed<"male" | "female">().oneOf(["male", "female"], "Gender is required").required(),
  marital_status: yup
    .mixed<"single" | "married" | "divorced" | "widowed" | "separated">()
    .oneOf(["single", "married", "divorced", "widowed", "separated"], "Marital status is required")
    .required(),
  education_level: yup
    .mixed<"no_formal_education" | "primary" | "secondary" | "diploma" | "bachelor's" | "master's" | "phd">()
    .oneOf(["no_formal_education", "primary", "secondary", "diploma", "bachelor's", "master's", "phd"], "Education level is required")
    .required(),
  household_size: yup
    .number()
    .typeError("Household size must be a number")
    .min(1, "Household size must be at least 1")
    .max(10, "Household size must be at most 10")
    .required(),
  household_composition: yup
    .number()
    .typeError("Household composition must be a number")
    .min(0, "Household composition must be at least 0")
    .required(),
  monthly_household_income: yup
    .number()
    .typeError("Monthly household income must be a number")
    .min(0, "Monthly household income must be at least 0")
    .required(),
  dependents_education: yup
    .number()
    .typeError("Dependents in education must be a number")
    .min(0, "Dependents in education must be at least 0")
    .max(5, "Dependents in education must be at most 5")
    .required(),
  region: yup
    .mixed<"oromia" | "addis_ababa" | "amhara" | "tigray" | "sidama" | "snnp">()
    .oneOf(["oromia", "addis_ababa", "amhara", "tigray", "sidama", "snnp"], "Region is required")
    .required(),
  migration_status: yup
    .mixed<"idp" | "refugee" | "non-migrant">()
    .oneOf(["idp", "refugee", "non-migrant"], "Migration status is required")
    .required(),
  employment_status: yup
    .mixed<"employed" | "self-employed" | "unemployed" | "student" | "retired">()
    .oneOf(["employed", "self-employed", "unemployed", "student", "retired"], "Employment status is required")
    .required(),
  employment_type: yup
    .mixed<"agriculture" | "government" | "private_sector" | "informal">()
    .oneOf(["agriculture", "government", "private_sector", "informal"], "Employment type is required")
    .required(),
  digital_literacy: yup
    .mixed<"none" | "basic_mobile" | "smartphone_user" | "advanced">()
    .oneOf(["none", "basic_mobile", "smartphone_user", "advanced"], "Digital literacy is required")
    .required(),
  access_to_extension: yup
    .mixed<"regular" | "irregular" | "none">()
    .oneOf(["regular", "irregular", "none"], "Access to extension is required")
    .required(),
  cooperative_membership: yup
    .mixed<"member" | "non-member">()
    .oneOf(["member", "non-member"], "Cooperative membership is required")
    .required(),
  proximity_to_markets: yup
    .number()
    .typeError("Proximity to markets must be a number")
    .min(1, "Proximity to markets must be at least 1")
    .max(30, "Proximity to markets must be at most 30")
    .required(),
});

const DemographicsSubmissionSchema = yup.object({
  demographics: yup.array().of(DemographicDataSchema).min(1, "At least one demographic record is required"),
});

type DemographicData = InferType<typeof DemographicDataSchema>;

const initialData: DemographicData = {
  customerId: "",
  age: 18,
  gender: "male",
  marital_status: "single",
  education_level: "no_formal_education",
  household_size: 1,
  household_composition: 0,
  monthly_household_income: 0,
  dependents_education: 0,
  region: "oromia",
  migration_status: "non-migrant",
  employment_status: "employed",
  employment_type: "agriculture",
  digital_literacy: "none",
  access_to_extension: "none",
  cooperative_membership: "non-member",
  proximity_to_markets: 1,
};

export default function DemographicsForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const demographyData = useGenericMethod({
    method: "POST",
    apiMethod: createDemography,
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
    initialValues: { demographics: [{ ...initialData }] },
    validateOnMount: true,
    validationSchema: DemographicsSubmissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await demographyData.handleAction(values);
      } catch {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } finally {
        setSubmitting(false);
      }
    },
  });

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

        {submitStatus !== "idle" && (
          <Alert className={submitStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {submitStatus === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={submitStatus === "success" ? "text-green-700" : "text-red-700"}>
              {submitStatus === "success"
                ? "Demographics data submitted successfully!"
                : "Failed to submit data. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <FieldArray
          name="demographics"
          render={(arrayHelpers) => (
            <>
              {formik.values.demographics.map((customer, index) => {
                const base = `demographics.${index}`;
                return (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-700">
                            Customer #{index + 1}
                          </Badge>
                          <CardTitle className="text-lg">Demographic Information</CardTitle>
                        </div>
                        {formik.values.demographics.length > 1 && (
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
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormInput
                          id={`customerId-${index}`}
                          label="Customer ID"
                          required
                          value={customer.customerId}
                          placeholder="CUST-001"
                          onChange={(v) => formik.setFieldValue(`${base}.customerId`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.customerId`, true, false)}
                          error={errorAt(`${base}.customerId`)}
                        />

                        <FormInput
                          id={`age-${index}`}
                          label="Age (18-67)"
                          required
                          type="number"
                          min={18}
                          max={67}
                          value={customer.age}
                          onChange={(v) => formik.setFieldValue(`${base}.age`, toInt(v, 18))}
                          onBlur={() => formik.setFieldTouched(`${base}.age`, true, false)}
                          error={errorAt(`${base}.age`)}
                        />

                        <FormSelect
                          id={`gender-${index}`}
                          label="Gender"
                          required
                          value={customer.gender}
                          onValueChange={(v) => formik.setFieldValue(`${base}.gender`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.gender`, true, false)}
                          error={errorAt(`${base}.gender`)}
                        >
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`marital-${index}`}
                          label="Marital Status"
                          required
                          value={customer.marital_status}
                          onValueChange={(v) => formik.setFieldValue(`${base}.marital_status`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.marital_status`, true, false)}
                          error={errorAt(`${base}.marital_status`)}
                        >
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`education-${index}`}
                          label="Education Level"
                          required
                          value={customer.education_level}
                          onValueChange={(v) => formik.setFieldValue(`${base}.education_level`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.education_level`, true, false)}
                          error={errorAt(`${base}.education_level`)}
                        >
                          <SelectItem value="no_formal_education">No Formal Education</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelor's">Bachelor&apos;s</SelectItem>
                          <SelectItem value="master's">Master&apos;s</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </FormSelect>

                        <FormInput
                          id={`household-size-${index}`}
                          label="Household Size (1-10)"
                          required
                          type="number"
                          min={1}
                          max={10}
                          value={customer.household_size}
                          onChange={(v) => formik.setFieldValue(`${base}.household_size`, toInt(v, 1))}
                          onBlur={() => formik.setFieldTouched(`${base}.household_size`, true, false)}
                          error={errorAt(`${base}.household_size`)}
                        />

                        <FormInput
                          id={`household-composition-${index}`}
                          label="Household Composition"
                          type="number"
                          step={0.1}
                          value={customer.household_composition}
                          onChange={(v) => formik.setFieldValue(`${base}.household_composition`, toFloat(v, 0))}
                          onBlur={() => formik.setFieldTouched(`${base}.household_composition`, true, false)}
                          error={errorAt(`${base}.household_composition`)}
                        />

                        <FormInput
                          id={`income-${index}`}
                          label="Monthly Household Income"
                          type="number"
                          value={customer.monthly_household_income}
                          onChange={(v) => formik.setFieldValue(`${base}.monthly_household_income`, toInt(v, 0))}
                          onBlur={() => formik.setFieldTouched(`${base}.monthly_household_income`, true, false)}
                          error={errorAt(`${base}.monthly_household_income`)}
                        />

                        <FormInput
                          id={`dependents-${index}`}
                          label="Dependents in Education (0-5)"
                          required
                          type="number"
                          min={0}
                          max={5}
                          value={customer.dependents_education}
                          onChange={(v) => formik.setFieldValue(`${base}.dependents_education`, toInt(v, 0))}
                          onBlur={() => formik.setFieldTouched(`${base}.dependents_education`, true, false)}
                          error={errorAt(`${base}.dependents_education`)}
                        />

                        <FormSelect
                          id={`region-${index}`}
                          label="Region"
                          required
                          value={customer.region}
                          onValueChange={(v) => formik.setFieldValue(`${base}.region`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.region`, true, false)}
                          error={errorAt(`${base}.region`)}
                        >
                          <SelectItem value="oromia">Oromia</SelectItem>
                          <SelectItem value="addis_ababa">Addis Ababa</SelectItem>
                          <SelectItem value="amhara">Amhara</SelectItem>
                          <SelectItem value="tigray">Tigray</SelectItem>
                          <SelectItem value="sidama">Sidama</SelectItem>
                          <SelectItem value="snnp">SNNP</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`migration-${index}`}
                          label="Migration Status"
                          required
                          value={customer.migration_status}
                          onValueChange={(v) => formik.setFieldValue(`${base}.migration_status`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.migration_status`, true, false)}
                          error={errorAt(`${base}.migration_status`)}
                        >
                          <SelectItem value="idp">IDP</SelectItem>
                          <SelectItem value="refugee">Refugee</SelectItem>
                          <SelectItem value="non-migrant">Non-migrant</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`employment-status-${index}`}
                          label="Employment Status"
                          required
                          value={customer.employment_status}
                          onValueChange={(v) => formik.setFieldValue(`${base}.employment_status`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.employment_status`, true, false)}
                          error={errorAt(`${base}.employment_status`)}
                        >
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">Self-employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`employment-type-${index}`}
                          label="Employment Type"
                          required
                          value={customer.employment_type}
                          onValueChange={(v) => formik.setFieldValue(`${base}.employment_type`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.employment_type`, true, false)}
                          error={errorAt(`${base}.employment_type`)}
                        >
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="private_sector">Private Sector</SelectItem>
                          <SelectItem value="informal">Informal</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`digital-literacy-${index}`}
                          label="Digital Literacy"
                          required
                          value={customer.digital_literacy}
                          onValueChange={(v) => formik.setFieldValue(`${base}.digital_literacy`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.digital_literacy`, true, false)}
                          error={errorAt(`${base}.digital_literacy`)}
                        >
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="basic_mobile">Basic Mobile</SelectItem>
                          <SelectItem value="smartphone_user">Smartphone User</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`extension-${index}`}
                          label="Access to Extension"
                          required
                          value={customer.access_to_extension}
                          onValueChange={(v) => formik.setFieldValue(`${base}.access_to_extension`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.access_to_extension`, true, false)}
                          error={errorAt(`${base}.access_to_extension`)}
                        >
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="irregular">Irregular</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </FormSelect>

                        <FormSelect
                          id={`cooperative-${index}`}
                          label="Cooperative Membership"
                          required
                          value={customer.cooperative_membership}
                          onValueChange={(v) => formik.setFieldValue(`${base}.cooperative_membership`, v)}
                          onBlur={() => formik.setFieldTouched(`${base}.cooperative_membership`, true, false)}
                          error={errorAt(`${base}.cooperative_membership`)}
                        >
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="non-member">Non-member</SelectItem>
                        </FormSelect>

                        <FormInput
                          id={`proximity-${index}`}
                          label="Proximity to Markets (1-30 km)"
                          required
                          type="number"
                          min={1}
                          max={30}
                          value={customer.proximity_to_markets}
                          onChange={(v) => formik.setFieldValue(`${base}.proximity_to_markets`, toInt(v, 1))}
                          onBlur={() => formik.setFieldTouched(`${base}.proximity_to_markets`, true, false)}
                          error={errorAt(`${base}.proximity_to_markets`)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex justify-between">
                <Button
                  onClick={() => arrayHelpers.push({ ...initialData, customerId: `CUST-${Date.now()}` })}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>

                <Button
                  disabled={formik.isSubmitting || !formik.touched}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  type="submit"
                >
                  {formik.isSubmitting ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {formik.isSubmitting ? "Submitting..." : "Submit Demographics"}
                </Button>
              </div>
            </>
          )}
        />
      </form>
    </FormikProvider>
  );
}
