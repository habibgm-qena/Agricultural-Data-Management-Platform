"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Plus, Send, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuestionResponse {
  question_id: string;
  answer: string;
}

interface PsychometricData {
  customerId: string;
  product_type: string;
  question_category: string;
  response: QuestionResponse[];
}

const initialResponse: QuestionResponse = {
  question_id: '',
  answer: '',
};

const initialData: PsychometricData = {
  customerId: '',
  product_type: '',
  question_category: '',
  response: [],
};

const sampleQuestions = [
  { id: 'q1_risk_aversion', label: 'Risk Aversion Assessment', description: 'How comfortable are you with taking financial risks?' },
  { id: 'q2_future_orientation', label: 'Future Orientation', description: 'How important is long-term planning to you?' },
  { id: 'q3_innovation_adoption', label: 'Innovation Adoption', description: 'How quickly do you adopt new technologies?' },
  { id: 'q4_collaboration_preference', label: 'Collaboration Preference', description: 'Do you prefer working with others or independently?' },
  { id: 'q5_decision_making', label: 'Decision Making Style', description: 'How do you typically make important decisions?' },
];

const answerOptions = [
  { value: 'option_a', label: 'Strongly Disagree' },
  { value: 'option_b', label: 'Disagree' },
  { value: 'option_c', label: 'Neutral' },
  { value: 'option_d', label: 'Agree' },
  { value: 'option_e', label: 'Strongly Agree' },
];

export default function PsychometricForm() {
  const [assessments, setAssessments] = useState<PsychometricData[]>([{ ...initialData }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const addAssessment = () => {
    setAssessments([...assessments, { ...initialData, customerId: `CUST-${Date.now()}` }]);
  };

  const updateAssessment = (index: number, field: keyof Omit<PsychometricData, 'response'>, value: any) => {
    const updated = [...assessments];
    updated[index] = { ...updated[index], [field]: value };
    setAssessments(updated);
  };

  const addResponse = (assessmentIndex: number) => {
    const updated = [...assessments];
    updated[assessmentIndex].response.push({ ...initialResponse });
    setAssessments(updated);
  };

  const updateResponse = (assessmentIndex: number, responseIndex: number, field: keyof QuestionResponse, value: string) => {
    const updated = [...assessments];
    updated[assessmentIndex].response[responseIndex] = {
      ...updated[assessmentIndex].response[responseIndex],
      [field]: value
    };
    setAssessments(updated);
  };

  const removeResponse = (assessmentIndex: number, responseIndex: number) => {
    const updated = [...assessments];
    updated[assessmentIndex].response = updated[assessmentIndex].response.filter((_, i) => i !== responseIndex);
    setAssessments(updated);
  };

  const removeAssessment = (index: number) => {
    setAssessments(assessments.filter((_, i) => i !== index));
  };

  const addSampleQuestions = (assessmentIndex: number) => {
    const updated = [...assessments];
    const existingQuestions = updated[assessmentIndex].response.map(r => r.question_id);
    const newQuestions = sampleQuestions
      .filter(q => !existingQuestions.includes(q.id))
      .map(q => ({ question_id: q.id, answer: '' }));
    updated[assessmentIndex].response.push(...newQuestions);
    setAssessments(updated);
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
      <Card className="bg-gradient-to-r from-purple-500 to-emerald-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">Psychometric Assessment</CardTitle>
              <CardDescription className="text-purple-100">
                Register customer psychometric assessment responses
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
              ? 'Psychometric data submitted successfully!' 
              : 'Failed to submit data. Please try again.'
            }
          </AlertDescription>
        </Alert>
      )}

      {assessments.map((assessment, assessmentIndex) => (
        <Card key={assessmentIndex} className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                  Assessment #{assessmentIndex + 1}
                </Badge>
                <CardTitle className="text-lg">Psychometric Assessment</CardTitle>
              </div>
              {assessments.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeAssessment(assessmentIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Assessment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Assessment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Customer ID *</Label>
                  <Input
                    value={assessment.customerId}
                    onChange={(e) => updateAssessment(assessmentIndex, 'customerId', e.target.value)}
                    placeholder="CUST-004"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Type *</Label>
                  <Select 
                    value={assessment.product_type} 
                    onValueChange={(value) => updateAssessment(assessmentIndex, 'product_type', value)}
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

                <div className="space-y-2">
                  <Label>Question Category *</Label>
                  <Select 
                    value={assessment.question_category} 
                    onValueChange={(value) => updateAssessment(assessmentIndex, 'question_category', value)}
                  >
                    <SelectTrigger className="border-purple-200 focus:border-purple-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat1">Category 1</SelectItem>
                      <SelectItem value="cat2">Category 2</SelectItem>
                      <SelectItem value="cat3">Category 3</SelectItem>
                      <SelectItem value="cat4">Category 4</SelectItem>
                      <SelectItem value="cat5">Category 5</SelectItem>
                      <SelectItem value="cat6">Category 6</SelectItem>
                      <SelectItem value="cat7">Category 7</SelectItem>
                      <SelectItem value="cat8">Category 8</SelectItem>
                      <SelectItem value="cat9">Category 9</SelectItem>
                      <SelectItem value="cat10">Category 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Question Responses */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Question Responses</h3>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => addSampleQuestions(assessmentIndex)}
                    variant="outline" 
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Add Sample Questions
                  </Button>
                  <Button 
                    onClick={() => addResponse(assessmentIndex)}
                    variant="outline" 
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Response
                  </Button>
                </div>
              </div>

              {assessment.response.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No responses added yet. Click &quot;Add Sample Questions&quot; or &quot;Add Response&quot; to get started.</p>
                </div>
              )}

              {assessment.response.map((response, responseIndex) => {
                const sampleQuestion = sampleQuestions.find(q => q.id === response.question_id);
                return (
                  <Card key={responseIndex} className="border-purple-200 bg-purple-50/30">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="bg-purple-100 text-purple-700">
                          Question #{responseIndex + 1}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeResponse(assessmentIndex, responseIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Question ID *</Label>
                          <Select
                            value={response.question_id}
                            onValueChange={(value) => updateResponse(assessmentIndex, responseIndex, 'question_id', value)}
                          >
                            <SelectTrigger className="border-purple-200 focus:border-purple-500">
                              <SelectValue placeholder="Select question" />
                            </SelectTrigger>
                            <SelectContent>
                              {sampleQuestions.map((question) => (
                                <SelectItem key={question.id} value={question.id}>
                                  {question.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {sampleQuestion && (
                            <p className="text-xs text-gray-600 mt-1">{sampleQuestion.description}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Answer *</Label>
                          <Select
                            value={response.answer}
                            onValueChange={(value) => updateResponse(assessmentIndex, responseIndex, 'answer', value)}
                          >
                            <SelectTrigger className="border-purple-200 focus:border-purple-500">
                              <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent>
                              {answerOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {!sampleQuestion && response.question_id && (
                        <div className="mt-4 space-y-2">
                          <Label>Custom Question ID</Label>
                          <Input
                            value={response.question_id}
                            onChange={(e) => updateResponse(assessmentIndex, responseIndex, 'question_id', e.target.value)}
                            placeholder="Enter custom question ID"
                            className="border-purple-200 focus:border-purple-500"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button onClick={addAssessment} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
          <Plus className="h-4 w-4 mr-2" />
          Add Assessment
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white"
        >
          {isSubmitting ? (
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit Psychometric Data'}
        </Button>
      </div>
    </div>
  );
}