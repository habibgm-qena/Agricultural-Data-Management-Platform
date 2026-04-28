"use client";

import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Gauge as GaugeIcon,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  User,
  ShieldCheck,
} from "lucide-react";
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
  Cell,
  Legend,
} from "recharts";

type SectorScore = { name: string; score: number };

const MIN_SCORE = 300;
const MAX_SCORE = 800;

const ratingFor = (score: number) => {
  if (score >= 750)
    return {
      label: "Excellent",
      tone: "from-emerald-500 to-green-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      ring: "ring-emerald-200",
      hex: "#10b981",
      summary: "Top-tier credit profile with very low default risk.",
    };
  if (score >= 670)
    return {
      label: "Good",
      tone: "from-teal-500 to-emerald-500",
      text: "text-teal-700",
      bg: "bg-teal-50",
      ring: "ring-teal-200",
      hex: "#14b8a6",
      summary: "Healthy credit standing with manageable risk.",
    };
  if (score >= 550)
    return {
      label: "Fair",
      tone: "from-amber-500 to-orange-500",
      text: "text-amber-700",
      bg: "bg-amber-50",
      ring: "ring-amber-200",
      hex: "#f59e0b",
      summary: "Moderate risk — consider closer monitoring.",
    };
  return {
    label: "Poor",
    tone: "from-rose-500 to-red-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    hex: "#ef4444",
    summary: "Elevated risk — extra due diligence recommended.",
  };
};

const sectorColor = (score: number) => ratingFor(score).hex;

function ScoreGauge({ value }: { value: number }) {
  const clamped = Math.max(MIN_SCORE, Math.min(MAX_SCORE, value));
  const pct = (clamped - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);

  // Half-circle gauge: angles measured from the +X axis.
  // Sweep from 180° (left) → 360° (right), passing through 270° (top).
  const startAngle = 180;
  const endAngle = 360;
  const angle = startAngle + pct * (endAngle - startAngle);

  const cx = 150;
  const cy = 130;
  const r = 110;
  const stroke = 18;

  const polar = (deg: number, radius: number = r) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const start = polar(startAngle);
  const end = polar(endAngle);
  const needle = polar(angle, r - 8);
  const needleBase1 = polar(angle + 90, 6);
  const needleBase2 = polar(angle - 90, 6);

  const rating = ratingFor(clamped);

  return (
    <div className="flex flex-col items-center">
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 300 180"
        className="max-w-[340px]"
        role="img"
        aria-label={`Credit score ${clamped}`}
      >
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="gauge-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Track */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          filter="url(#gauge-shadow)"
        />

        {/* Tick labels */}
        <text x={start.x - 4} y={start.y + 22} fontSize="11" fill="#6b7280" textAnchor="middle">
          {MIN_SCORE}
        </text>
        <text x={cx} y={cy - r - 8} fontSize="11" fill="#6b7280" textAnchor="middle">
          550
        </text>
        <text x={end.x + 4} y={end.y + 22} fontSize="11" fill="#6b7280" textAnchor="middle">
          {MAX_SCORE}
        </text>

        {/* Needle */}
        <polygon
          points={`${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y} ${needle.x},${needle.y}`}
          fill="#0f172a"
        />
        <circle cx={cx} cy={cy} r={9} fill="#fff" stroke="#0f172a" strokeWidth={3} />
      </svg>

      <div className="mt-2 flex flex-col items-center">
        <div className="text-5xl font-bold tracking-tight text-gray-900">{clamped}</div>
        <Badge
          className={`mt-2 bg-gradient-to-r ${rating.tone} text-white border-0 px-3 py-1 text-sm`}
        >
          {rating.label}
        </Badge>
        <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
          {rating.summary}
        </p>
      </div>
    </div>
  );
}

function SectorCard({
  sector,
  rank,
}: {
  sector: SectorScore;
  rank: number;
}) {
  const rating = ratingFor(sector.score);
  const pct = ((sector.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm ring-1 ${rating.ring} transition hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
            #{rank}
          </div>
          <div className="mt-1 text-sm font-semibold text-gray-800">
            {sector.name}
          </div>
        </div>
        <Badge variant="secondary" className={`${rating.bg} ${rating.text} border-0`}>
          {rating.label}
        </Badge>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className={`text-3xl font-bold ${rating.text}`}>{sector.score}</div>
        <div className="text-xs text-gray-400">/ {MAX_SCORE}</div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${rating.tone} transition-all`}
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed bg-white/60 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-emerald-50 p-4">
          <GaugeIcon className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          No score loaded yet
        </h3>
        <p className="mt-1 max-w-md text-sm text-gray-500">
          Enter a Customer ID above to retrieve sector-level KIFIYA scores,
          a credit gauge, and an AI-generated insight summary.
        </p>
      </CardContent>
    </Card>
  );
}

export default function FiscoScore() {
  const [customerId, setCustomerId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [fiscoData, setFiscoData] = useState<SectorScore[]>([]);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overall = useMemo(() => {
    if (!fiscoData.length) return null;
    const avg = Math.round(
      fiscoData.reduce((acc, d) => acc + d.score, 0) / fiscoData.length
    );
    return avg;
  }, [fiscoData]);

  const stats = useMemo(() => {
    if (!fiscoData.length) return null;
    const sorted = [...fiscoData].sort((a, b) => b.score - a.score);
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1],
      sectors: sorted.length,
    };
  }, [fiscoData]);

  const radarData = useMemo(
    () => fiscoData.map((d) => ({ sector: d.name, score: d.score })),
    [fiscoData]
  );

  const miniTrend = useMemo(
    () =>
      fiscoData.map((d) => ({
        name: d.name,
        current: d.score,
        prev: Math.max(
          MIN_SCORE,
          d.score - Math.floor(Math.random() * 60)
        ),
      })),
    [fiscoData]
  );

  const fetchDescription = async (id: string) => {
    setIsInsightLoading(true);
    try {
      const res = await fetch("/api/fico/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: id }),
      });
      if (!res.ok) {
        setDescription("");
        return;
      }
      const data = await res.json();
      setDescription(data?.description || "");
    } catch {
      setDescription("");
    } finally {
      setIsInsightLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFiscoData([]);
    setDescription("");
    setSubmittedId(null);

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
      const data: SectorScore[] = await res.json();
      setFiscoData(data);
      setSubmittedId(id);
      fetchDescription(id);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const overallRating = overall !== null ? ratingFor(overall) : null;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg">
        <div className="relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-emerald-300/40 blur-3xl" />
          </div>
          <CardHeader className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm ring-1 ring-white/30">
                  <GaugeIcon className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                    KIFIYA Credit Score
                  </CardTitle>
                  <CardDescription className="text-emerald-50/90">
                    Sector-level scoring, credit gauge, and AI insights for any customer
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-100" />
                <span className="text-emerald-50/90">
                  Range {MIN_SCORE} – {MAX_SCORE}
                </span>
              </div>
            </div>
          </CardHeader>
        </div>
      </Card>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:flex-row md:items-end"
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor="customerId" className="text-sm font-medium">
                Customer ID
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="customerId"
                  placeholder="e.g., CUST-00123"
                  className="pl-9 focus-visible:ring-emerald-600 focus-visible:border-emerald-700"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700 md:min-w-[180px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Get KIFIYA Score
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty state */}
      {!fiscoData.length && !isLoading && <EmptyState />}

      {/* Loading skeleton */}
      {isLoading && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <p className="mt-4 text-sm text-gray-500">
              Calculating sector scores...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!!fiscoData.length && overall !== null && overallRating && (
        <>
          {/* Overall + summary stats */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="bg-white/90 backdrop-blur-sm lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-emerald-800">
                    Overall Credit Score
                  </CardTitle>
                  <CardDescription>
                    Average across {stats?.sectors ?? 0} sectors
                  </CardDescription>
                </div>
                {submittedId && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700"
                  >
                    <User className="mr-1 h-3 w-3" />
                    {submittedId}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <ScoreGauge value={overall} />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Top Sector
                    </div>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 text-lg font-semibold text-gray-800">
                    {stats?.best.name}
                  </div>
                  <div className="mt-1 text-3xl font-bold text-emerald-700">
                    {stats?.best.score}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Lowest Sector
                    </div>
                    <TrendingDown className="h-4 w-4 text-rose-500" />
                  </div>
                  <div className="mt-2 text-lg font-semibold text-gray-800">
                    {stats?.worst.name}
                  </div>
                  <div className="mt-1 text-3xl font-bold text-rose-600">
                    {stats?.worst.score}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Spread
                    </div>
                    <Minus className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="mt-2 text-lg font-semibold text-gray-800">
                    Best vs. lowest
                  </div>
                  <div className="mt-1 text-3xl font-bold text-gray-700">
                    {stats ? stats.best.score - stats.worst.score : 0}
                    <span className="ml-1 text-sm font-medium text-gray-400">
                      pts
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sector cards */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800">
                Sector Breakdown
              </CardTitle>
              <CardDescription>
                Per-sector scores ranked from highest to lowest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...fiscoData]
                  .sort((a, b) => b.score - a.score)
                  .map((sector, idx) => (
                    <SectorCard
                      key={sector.name}
                      sector={sector}
                      rank={idx + 1}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-800">
                  Scores by Sector
                </CardTitle>
                <CardDescription>
                  Color-coded by rating tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={fiscoData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-12}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[MIN_SCORE, MAX_SCORE]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {fiscoData.map((d, i) => (
                        <Cell key={i} fill={sectorColor(d.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-800">
                  Sector Radar
                </CardTitle>
                <CardDescription>
                  Relative distribution across sectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData} outerRadius={110}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="sector" tick={{ fontSize: 12, fill: "#374151" }} />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[MIN_SCORE, MAX_SCORE]}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-emerald-800">
                  Period-over-Period Trend
                </CardTitle>
                <CardDescription>
                  Previous vs. current sector score (illustrative)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={miniTrend} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[MIN_SCORE, MAX_SCORE]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      name="Previous"
                      dataKey="prev"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      name="Current"
                      dataKey="current"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Insight */}
          <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                </div>
                <div>
                  <CardTitle className="text-emerald-800">AI Insight</CardTitle>
                  <CardDescription>
                    Generated from cached customer data and active sectors
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isInsightLoading ? (
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-emerald-100/70" />
                  <div className="h-3 w-11/12 animate-pulse rounded bg-emerald-100/70" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-emerald-100/70" />
                </div>
              ) : description ? (
                <p className="leading-relaxed text-gray-700">{description}</p>
              ) : (
                <p className="text-sm italic text-gray-500">
                  No AI insight available for this customer.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
