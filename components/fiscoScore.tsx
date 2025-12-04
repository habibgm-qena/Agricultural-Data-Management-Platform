"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartBarIcon, Loader2, Send } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function FiscoScore() {
  const [customerId, setCustomerId] = useState("");
  const [fiscoData, setFiscoData] = useState<Array<{ name: string; score: number }>>([]);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overall = useMemo(() => {
    if (!fiscoData.length) return null;
    const avg = Math.round(
      fiscoData.reduce((acc, d) => acc + d.score, 0) / fiscoData.length
    );
    return { name: "Overall", score: avg };
  }, [fiscoData]);

  const fetchDescription = async (id: string) => {
    try {
      const res = await fetch("/api/fico/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: id }),
      });
      if (!res.ok) return setDescription("");
      const data = await res.json();
      setDescription(data?.description || "");
    } catch {
      setDescription("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFiscoData([]);
    setDescription("");

    const id = customerId.trim();
    if (!id) {
      setError("Please enter a valid Customer ID.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/fico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: id }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch KIFIYA score");
      }
      const data: Array<{ name: string; score: number }> = await res.json();
      setFiscoData(data);
      fetchDescription(id);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Simple Gauge component using SVG; value 300-800
  const Gauge = ({ value }: { value: number }) => {
    const min = 300;
    const max = 800;
    const clamped = Math.max(min, Math.min(max, value));
    const pct = (clamped - min) / (max - min);

    const startAngle = -120; // degrees
    const endAngle = 120;
    const angle = startAngle + pct * (endAngle - startAngle);

    const r = 80;
    const cx = 100;
    const cy = 100;

    const toXY = (deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
      };
    };

    const start = toXY(startAngle);
    const end = toXY(endAngle);
    const needle = toXY(angle);

    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    return (
      <svg width={220} height={140} viewBox="0 0 200 140">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="url(#g)"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="#111827" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={4} fill="#111827" />
        <text x={cx} y={cy + 30} textAnchor="middle" fontSize="14" fill="#111827">
          {clamped}
        </text>
        <text x={cx - 70} y={cy + 40} fontSize="10" fill="#6b7280">300</text>
        <text x={cx + 70} y={cy + 40} fontSize="10" fill="#6b7280">800</text>
      </svg>
    );
  };

  const radarData = useMemo(() => {
    if (!fiscoData.length) return [] as Array<{ sector: string; score: number }>;
    return fiscoData.map((d) => ({ sector: d.name, score: d.score }));
  }, [fiscoData]);

  const miniTrend = useMemo(() => {
    // fabricate a short trend around each sector's score
    return fiscoData.map((d) => ({ name: d.name, current: d.score, prev: Math.max(300, d.score - Math.floor(Math.random() * 60)) }));
  }, [fiscoData]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">KIFIYA Score Lookup</CardTitle>
              <CardDescription className="text-emerald-100">
                Enter a Customer ID to fetch sector-based dummy scores and insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm p-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 items-end gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="customerId">Customer ID *</Label>
              <Input
                id="customerId"
                placeholder="e.g., CUST-00123"
                className="focus-visible:ring-emerald-600 focus-visible:border-emerald-700"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>

            <div className="justify-self-end self-center">
              <Button
                type="submit"
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    <>Get KIFIYA Score</>
                  </span>
                )}
              </Button>
            </div>
          </form>

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </CardContent>
      </Card>

      {overall && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-700">Overall Credit Score (300–800)</CardTitle>
            <CardDescription>Gauge visualization of the average across sectors</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Gauge value={overall.score} />
          </CardContent>
        </Card>
      )}

      {!!fiscoData.length && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-700">Scores by Sector</CardTitle>
              <CardDescription>Bar chart per sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={fiscoData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[300, 800]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-700">Sector Radar</CardTitle>
              <CardDescription>Relative distribution of scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} outerRadius={110}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="sector" />
                  <PolarRadiusAxis angle={30} domain={[300, 800]} />
                  <Radar name="Score" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-emerald-700">Mini Trends</CardTitle>
              <CardDescription>Fabricated previous vs current comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={miniTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[300, 800]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="prev" stroke="#94a3b8" strokeWidth={2} />
                  <Line type="monotone" dataKey="current" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {description && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-700">AI Insight</CardTitle>
            <CardDescription>Generated from cached customer data and sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
