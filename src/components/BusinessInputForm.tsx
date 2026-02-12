"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, Clock, Briefcase, ChevronRight } from "lucide-react";

interface BusinessData {
  businessName: string;
  businessType: string;
  staffCount: number;
  openTime: string;
  closeTime: string;
  specialNeeds: string;
}

// 1. New Props Interface added here
interface Props {
  onGenerate?: (data: BusinessData) => void;
  isGenerating?: boolean;
}

const EXAMPLE_BUSINESSES = [
  {
    title: "Pizza Shop",
    icon: <Users className="h-5 w-5 mb-2 text-orange-500" />,
    data: {
      businessName: "Bella's Pizza",
      businessType: "Restaurant",
      staffCount: 3,
      openTime: "09:00",
      closeTime: "21:00",
      specialNeeds:
        "Need voicemail after hours and call waiting during rush times.",
    },
  },
  {
    title: "Law Office",
    icon: <Briefcase className="h-5 w-5 mb-2 text-blue-500" />,
    data: {
      businessName: "Smith & Associates",
      businessType: "Office",
      staffCount: 5,
      openTime: "08:00",
      closeTime: "17:00",
      specialNeeds:
        "Need separate lines for each lawyer and a general receptionist line.",
    },
  },
  {
    title: "Medical Practice",
    icon: <Clock className="h-5 w-5 mb-2 text-green-500" />,
    data: {
      businessName: "City Care Clinic",
      businessType: "Medical Practice",
      staffCount: 4,
      openTime: "08:00",
      closeTime: "18:00",
      specialNeeds:
        "Emergency line after hours. Press 1 for appointments, 2 for emergencies.",
    },
  },
];

// 2. Updated component signature to accept props
export default function BusinessInputForm({
  onGenerate,
  isGenerating = false,
}: Props) {
  // We removed local 'loading' state because we use 'isGenerating' from parent
  const [formData, setFormData] = useState<BusinessData>({
    businessName: "",
    businessType: "",
    staffCount: 1,
    openTime: "09:00",
    closeTime: "17:00",
    specialNeeds: "",
  });

  const handleInputChange = (field: keyof BusinessData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreFill = (data: Partial<BusinessData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Updated logic to call the parent function
    if (onGenerate) {
      onGenerate(formData);
    } else {
      console.log("Form Submitted (No handler connected):", formData);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Voys Dial Plan Generator
        </h1>
        <p className="text-slate-600">
          Turn your business description into a professional phone system in
          seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXAMPLE_BUSINESSES.map((example) => (
          <Card
            key={example.title}
            className="cursor-pointer hover:border-blue-500 transition-colors hover:bg-slate-50"
            onClick={() => handlePreFill(example.data)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              {example.icon}
              <h3 className="font-semibold">{example.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Click to try example
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle>Describe Your Business</CardTitle>
          <CardDescription>
            We'll use this to build your perfect call routing plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Name</label>
                <Input
                  required
                  placeholder="e.g. Joe's Coffee"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Type</label>
                <Select
                  value={formData.businessType}
                  onValueChange={(val) =>
                    handleInputChange("businessType", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Office">
                      Office / Professional
                    </SelectItem>
                    <SelectItem value="Retail">Retail Store</SelectItem>
                    <SelectItem value="Medical Practice">
                      Medical Practice
                    </SelectItem>
                    <SelectItem value="Service Business">
                      Service Business
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Staff Count</label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.staffCount}
                  onChange={(e) =>
                    handleInputChange("staffCount", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Opening Time</label>
                <Input
                  type="time"
                  value={formData.openTime}
                  onChange={(e) =>
                    handleInputChange("openTime", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Closing Time</label>
                <Input
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) =>
                    handleInputChange("closeTime", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Special Requirements
              </label>
              <Textarea
                placeholder="Describe any specific needs (e.g., 'We have a sales team', 'Need English and Afrikaans options')"
                className="h-32"
                value={formData.specialNeeds}
                onChange={(e) =>
                  handleInputChange("specialNeeds", e.target.value)
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              // 4. Updated disabled state to use parent prop
              disabled={isGenerating}
            >
              {isGenerating ? "Generating Plan..." : "Generate My Dial Plan"}
              {!isGenerating && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
