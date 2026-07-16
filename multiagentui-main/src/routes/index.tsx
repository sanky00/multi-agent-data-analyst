import { createFileRoute } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

import {
  Upload,
  FileText,
  Moon,
  Sun,
  User,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Activity,
  Database,
  ShieldCheck,
  Download,
  BarChart3,
  LineChart as LineChartIcon,
  ScatterChart as ScatterChartIcon,
  Brain,
  Lightbulb,
  Target,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "http://127.0.0.1:8000";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Multi-Agent Data Analyst — AI-Powered Analytics" },
      {
        name: "description",
        content:
          "Upload CSV files and receive automated insights, correlations, anomaly detection, quality scores and AI-generated business recommendations.",
      },
      { property: "og:title", content: "Multi-Agent Data Analyst" },
      {
        property: "og:description",
        content: "AI-powered platform for automated data analysis and business insights.",
      },
    ],
  }),
  component: Index,
});

type ChartDataPoint = Record<string, number | string | null | undefined>;
type VisualizationType = "scatter" | "histogram" | "trend" | "bar" | "pie";

type VisualizationRecommendation = {
  type: VisualizationType;
  title: string;
  description: string;
  x?: string;
  y?: string;
  column?: string;
  dataKey?: string;
};

type IconComponent = ComponentType<{ className?: string }>;

type AnalysisResult = {
  summary: {
    columns: { name: string; type: string; missing: number }[];
    rows: number;
    duplicates: number;
  };
  issues: string[];
  statistics: {
    column: string;
    mean: number;
    median: number;
    min: number;
    max: number;
    std: number;
  }[];
  insights: string[];
  quality_score: number;
  correlations: { a: string; b: string; value: number }[];
  correlation_insights: string[];
  outliers: { column: string; count: number }[];
  outliers_insights: string[];
  visualizations: VisualizationRecommendation[];
  chart_data?: {
    scatter?: {
      x: string;
      y: string;
      data: ChartDataPoint[];
    };
    [key: string]: unknown;
  };
  visualization_insights: string[];
  ai_insights: {
    key_findings: string[];
    risks: string[];
    recommendations: string[];
    summary: string;
  };
  report: string;
};

type BackendStats = {
  mean?: unknown;
  median?: unknown;
  min?: unknown;
  max?: unknown;
  std?: unknown;
};

type BackendVisualization = {
  chart_type?: unknown;
  title?: unknown;
  description?: unknown;
  x?: unknown;
  y?: unknown;
  column?: unknown;
  data_key?: unknown;
  date_column?: unknown;
};

type BackendData = {
  summary: {
    rows?: number;
    duplicates?: number;
    column_names?: string[];
    data_types?: Record<string, unknown>;
    missing_values?: Record<string, unknown>;
  };
  issues?: string[];
  statistics?: Record<string, BackendStats>;
  insights?: string[];
  quality_score?: number;
  correlations?: Record<string, unknown>;
  correlation_insights?: string[];
  outliers?: Record<string, unknown>;
  outliers_insights?: string[];
  visualizations?: BackendVisualization[];
  visualization_insights?: string[];
  ai_insights?: AnalysisResult["ai_insights"];
  chart_data?: AnalysisResult["chart_data"];
  report?: string;
};

const MOCK: AnalysisResult = {
  summary: {
    rows: 12847,
    duplicates: 142,
    columns: [
      { name: "order_id", type: "string", missing: 0 },
      { name: "customer_id", type: "string", missing: 12 },
      { name: "revenue", type: "float", missing: 3 },
      { name: "quantity", type: "int", missing: 0 },
      { name: "discount", type: "float", missing: 218 },
      { name: "region", type: "category", missing: 7 },
      { name: "order_date", type: "datetime", missing: 0 },
      { name: "channel", type: "category", missing: 0 },
    ],
  },
  issues: [
    "218 missing values in `discount`",
    "142 duplicate rows detected",
    "12 missing `customer_id` values",
    "Revenue column contains 34 outliers",
  ],
  statistics: [
    { column: "revenue", mean: 284.32, median: 198.5, min: 4.99, max: 12480.0, std: 412.18 },
    { column: "quantity", mean: 3.42, median: 3, min: 1, max: 48, std: 2.81 },
    { column: "discount", mean: 0.087, median: 0.05, min: 0, max: 0.65, std: 0.094 },
  ],
  insights: [],
  quality_score: 87,
  correlations: [
    { a: "revenue", b: "quantity", value: 0.82 },
    { a: "discount", b: "revenue", value: -0.41 },
    { a: "quantity", b: "discount", value: -0.18 },
    { a: "revenue", b: "channel_online", value: 0.34 },
  ],
  correlation_insights: [
    "Strong positive correlation between revenue and quantity (r=0.82) suggests bundle pricing opportunity.",
    "Negative correlation between discount and revenue (r=-0.41) — deeper discounts erode net revenue.",
  ],
  outliers: [
    { column: "revenue", count: 34 },
    { column: "quantity", count: 11 },
    { column: "discount", count: 6 },
  ],
  outliers_insights: [
    "34 high-revenue outliers concentrated in the Enterprise segment — likely legitimate large orders.",
    "Quantity outliers (>40 units) correlate with bulk B2B channel.",
  ],
  visualizations: [
    {
      type: "scatter",
      title: "Revenue vs Quantity",
      description: "Strong linear trend with clustered outliers in B2B.",
    },
    {
      type: "histogram",
      title: "Discount Distribution",
      description: "Right-skewed; majority of orders under 10% discount.",
    },
    {
      type: "trend",
      title: "Daily Revenue Trend",
      description: "Clear weekly seasonality with weekend dips.",
    },
  ],
  visualization_insights: [
    "Time-series shows 14% lift on promo weeks — consider expanding promo cadence.",
    "Histogram of discount reveals untapped 15-25% bracket.",
  ],
  ai_insights: {
    key_findings: [
      "Revenue is primarily driven by order quantity, not unit price.",
      "Online channel outperforms retail by 1.8x on conversion velocity.",
      "Top 12% of customers generate 64% of total revenue (Pareto signal).",
    ],
    risks: [
      "Discount strategy is eroding margins without proportional volume lift.",
      "142 duplicate rows may inflate revenue reporting by ~2.3%.",
      "Missing customer IDs prevent attribution for 0.09% of orders.",
    ],
    recommendations: [
      "Cap promotional discounts at 15% — model predicts +8% net margin.",
      "Launch a loyalty tier for the top 12% customer cohort.",
      "Deploy deduplication pipeline before downstream BI ingestion.",
      "A/B test bundled SKUs in online channel to amplify quantity-driven revenue.",
    ],
    summary:
      "The dataset is high quality (87/100) with strong predictive signal. Revenue growth is volume-driven, and the most impactful lever is rationalizing discount strategy while doubling down on high-LTV customers via loyalty programs.",
  },
  report: "report.pdf",
};

function normalizeVisualizationType(chartType: unknown): VisualizationType {
  if (
    chartType === "scatter" ||
    chartType === "histogram" ||
    chartType === "trend" ||
    chartType === "bar" ||
    chartType === "pie"
  ) {
    return chartType;
  }

  return "histogram";
}

function formatColumnName(name: string): string {
  if (!name) return "";
  return name
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bId\b/g, "ID")
    .replace(/\bCsv\b/g, "CSV")
    .replace(/\bPdf\b/g, "PDF");
}

function cleanText(text: string, columns: string[]): string {
  if (!text) return "";
  let cleaned = text;
  // Sort columns by length descending to match longer ones first
  const sortedCols = [...columns].sort((a, b) => b.length - a.length);
  for (const col of sortedCols) {
    const formatted = formatColumnName(col);
    const esc = col.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Replace whole word occurrences (like employee_id)
    const regex = new RegExp(`\\b${esc}\\b`, 'g');
    cleaned = cleaned.replace(regex, formatted);

    // Replace backticked or single-quoted occurrences (like `employee_id` or 'employee_id')
    cleaned = cleaned.replace(new RegExp(`\`${esc}\``, 'g'), `\`${formatted}\``);
    cleaned = cleaned.replace(new RegExp(`'${esc}'`, 'g'), `'${formatted}'`);
  }
  return cleaned;
}

function parseInsightItems(items: string[]): string[] {
  const result: string[] = [];
  for (const item of items) {
    if (!item) continue;
    // Split by newlines in case the AI returned a single string with newlines
    const lines = String(item).split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Strip markdown list characters (e.g. "- ", "* ", "1. ", "• ")
      const cleanLine = trimmed
        .replace(/^[-*•]\s+/, "")
        .replace(/^\d+\.\s+/, "");
      if (cleanLine) {
        result.push(cleanLine);
      }
    }
  }
  return result;
}

function formatInsightItem(item: string) {
  if (!item) return null;
  // Match bold text like **bold**
  const regex = /\*\*(.*?)\*\*/g;
  if (!regex.test(item)) {
    return <span className="flex-1 text-sm text-foreground/85 leading-relaxed">{item}</span>;
  }
  // Reset regex index
  regex.lastIndex = 0;

  const parts = item.split(regex);
  return (
    <span className="flex-1 text-sm text-foreground/85 leading-relaxed">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <strong key={index} className="font-semibold text-foreground animate-pulse duration-1000">
              {part}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function visualizationTitle(v: BackendVisualization, type: VisualizationType) {
  const title = stringValue(v.title);
  const x = stringValue(v.x);
  const y = stringValue(v.y);
  const column = stringValue(v.column);
  const dateColumn = stringValue(v.date_column);

  if (title) return title;
  if (type === "scatter") return `${x || "X"} vs ${y || "Y"}`;
  if (type === "histogram") return `${column || "Column"} Distribution`;
  if (type === "bar") return `${column || "Category"} Counts`;
  if (type === "pie") return `${column || "Category"} Share`;
  return `${dateColumn || x || "Time"} Trend`;
}

function visualizationDescription(v: BackendVisualization, type: VisualizationType) {
  const description = stringValue(v.description);
  const x = stringValue(v.x);
  const y = stringValue(v.y);
  const column = stringValue(v.column);
  const dateColumn = stringValue(v.date_column);

  if (description) return description;
  if (type === "scatter")
    return `Relationship between ${x || "one numeric column"} and ${y || "another numeric column"}.`;
  if (type === "histogram") return `Distribution of ${column || "a numeric column"}.`;
  if (type === "bar") return `Most frequent values in ${column || "a categorical column"}.`;
  if (type === "pie") return `Proportional share of values in ${column || "a categorical column"}.`;
  return `Trend over ${dateColumn || "time"}.`;
}

function transformBackendData(data: BackendData): AnalysisResult {
  const columnNames = data.summary.column_names || [];
  const dataTypes = data.summary.data_types || {};
  const missingValues = data.summary.missing_values || {};

  const issues = (data.issues || []).map((i) => cleanText(i, columnNames));
  const insights = (data.insights || []).map((i) => cleanText(i, columnNames));
  const correlationInsights = (data.correlation_insights || []).map((i) => cleanText(i, columnNames));
  const outliersInsights = (data.outliers_insights || []).map((i) => cleanText(i, columnNames));
  const visualizationInsights = (data.visualization_insights || []).map((i) => cleanText(i, columnNames));

  const rawAi = data.ai_insights || {
    key_findings: [],
    risks: [],
    recommendations: [],
    summary: "",
  };
  const aiInsights = {
    key_findings: parseInsightItems((rawAi.key_findings || []).map((i) => cleanText(i, columnNames))),
    risks: parseInsightItems((rawAi.risks || []).map((i) => cleanText(i, columnNames))),
    recommendations: parseInsightItems((rawAi.recommendations || []).map((i) => cleanText(i, columnNames))),
    summary: cleanText(rawAi.summary || "", columnNames),
  };

  return {
    summary: {
      rows: data.summary.rows || 0,
      duplicates: data.summary.duplicates || 0,

      columns: columnNames.map((col) => ({
        name: col,
        type: String(dataTypes[col] || "unknown"),
        missing: toNumber(missingValues[col]) || 0,
      })),
    },

    issues,

    statistics: Object.entries(data.statistics || {}).map(([column, stats]) => ({
      column,
      mean: toNumber(stats.mean) || 0,
      median: toNumber(stats.median) || 0,
      min: toNumber(stats.min) || 0,
      max: toNumber(stats.max) || 0,
      std: toNumber(stats.std) || 0,
    })),

    insights,

    quality_score: data.quality_score || 0,

    correlations: Object.entries(data.correlations || {}).map(([key, value]) => {
      const parts = key.split(" vs ");

      return {
        a: parts[0] || "",
        b: parts[1] || "",
        value: toNumber(value) ?? 0,
      };
    }),

    correlation_insights: correlationInsights,

    outliers: Object.entries(data.outliers || {}).map(([column, count]) => ({
      column,
      count: toNumber(count) || 0,
    })),

    outliers_insights: outliersInsights,

    visualizations: (data.visualizations || []).map((v) => {
      const type = normalizeVisualizationType(v.chart_type);
      const x = stringValue(v.x);
      const y = stringValue(v.y);
      const column = stringValue(v.column);
      const dataKey = stringValue(v.data_key);

      return {
        type,
        title: cleanText(visualizationTitle(v, type), columnNames),
        description: cleanText(visualizationDescription(v, type), columnNames),
        x,
        y,
        column,
        dataKey:
          dataKey ||
          (type === "scatter"
            ? "scatter"
            : type === "histogram" && column
              ? `${column}_histogram`
              : type === "bar" && column
                ? `${column}_bar`
                : type === "pie" && column
                  ? `${column}_pie`
                  : "trend"),
      };
    }),

    visualization_insights: visualizationInsights,

    ai_insights: aiInsights,
    chart_data: data.chart_data || {},
    report: data.report || "",
  };
}

function getReportFilename(reportPath: string) {
  return reportPath.split(/[\\/]/).pop() || "analysis-report.pdf";
}

async function downloadReportFile(reportPath: string) {
  if (!reportPath) {
    throw new Error("No report is available for download yet.");
  }

  const params = new URLSearchParams({
    path: reportPath,
  });

  const response = await fetch(`${API_BASE_URL}/download-report?${params.toString()}`);

  if (!response.ok) {
    const fallbackMessage = `Report download failed (${response.status})`;
    let message = fallbackMessage;

    try {
      const errorBody = await response.json();
      if (typeof errorBody.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      message = fallbackMessage;
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = getReportFilename(reportPath);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
}

function Index() {
  const [dark, setDark] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }
    setFile(f);
    setUploadProgress(0);
    setResult(null);
    setAnalyzing(false);

    // Simulate upload
    let p = 0;
    const up = setInterval(() => {
      p += 8 + Math.random() * 12;
      if (p >= 100) {
        p = 100;
        clearInterval(up);
        setUploadProgress(100);
        setAnalyzing(true);

        const formData = new FormData();
        formData.append("file", f);

        fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            const transformed = transformBackendData(data);

            setResult(transformed);

            toast.success("Analysis complete");
          })
          .catch((err) => {
            console.error(err);

            toast.error("Analysis failed");
          })
          .finally(() => {
            setAnalyzing(false);
          });
      } else {
        setUploadProgress(p);
      }
    }, 120);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent-foreground/80 shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">Multi-Agent Data Analyst</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Platform
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 px-6 py-16 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-foreground/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl text-center animate-fade-in">
            <Badge variant="secondary" className="mb-5 gap-1.5 px-3 py-1">
              <Sparkles className="h-3 w-3" /> Powered by autonomous agents
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              AI-Powered Data Analytics Platform
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              Upload CSV files and receive automated insights, correlations, anomaly detection,
              quality scores and AI-generated business recommendations.
            </p>
          </div>
        </section>

        {/* Upload */}
        <section className="mt-10">
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`group relative cursor-pointer rounded-3xl border-2 border-dashed bg-card/40 px-6 py-14 text-center transition-all hover:bg-card/70 ${dragOver ? "border-primary bg-primary/5" : "border-border"
              }`}
            onClick={() => inputRef.current?.click()}
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Upload className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Drag & drop your CSV file</h3>
            <p className="mt-1 text-sm text-muted-foreground">or click to browse — max 100MB</p>
            <Button
              className="mt-6"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>

            {file && (
              <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-background/60 p-4 text-left">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {uploadProgress === 100 && !analyzing && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  {analyzing && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                </div>
                {uploadProgress < 100 && (
                  <div className="mt-3">
                    <Progress value={uploadProgress} className="h-1.5" />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Uploading… {Math.floor(uploadProgress)}%
                    </p>
                  </div>
                )}
                {analyzing && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 animate-pulse text-primary" />
                    Agents are analyzing your dataset…
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Empty state */}
        {!file && !result && (
          <section className="mt-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-muted">
              <Database className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Upload a CSV file to begin analysis
            </p>
          </section>
        )}

        {/* Loading skeletons */}
        {analyzing && <LoadingState />}

        {/* Results */}
        {result && !analyzing && <Results r={result} />}
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © 2026 Multi-Agent Data Analyst. Built with autonomous AI agents.
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-12 space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: IconComponent;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warn";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-500 bg-emerald-500/10"
      : tone === "warn"
        ? "text-amber-500 bg-amber-500/10"
        : "text-primary bg-primary/10";
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: IconComponent;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </div>
    </div>
  );
}

function corrColor(v: number) {
  if (!Number.isFinite(v)) return "bg-muted";
  const abs = Math.abs(v);
  if (abs > 0.7) return v > 0 ? "bg-emerald-500/80" : "bg-rose-500/80";
  if (abs > 0.4) return v > 0 ? "bg-emerald-500/50" : "bg-rose-500/50";
  if (abs > 0.2) return v > 0 ? "bg-emerald-500/25" : "bg-rose-500/25";
  return "bg-muted";
}

const MAX_SCATTER_POINTS = 900;
const HISTOGRAM_BIN_COUNT = 12;

type ScatterPoint = {
  x: number;
  y: number;
};

type HistogramBin = {
  bin: string;
  count: number;
  start?: number;
  end?: number;
};

type CategoryCount = {
  label: string;
  value: number;
};

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function formatChartNumber(value: unknown, maximumFractionDigits = 2) {
  const numericValue = toNumber(value);
  if (numericValue === null) return "";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(numericValue);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function sampleEvenly<T>(items: T[], maxItems: number) {
  if (items.length <= maxItems) return items;

  const step = items.length / maxItems;
  return Array.from({ length: maxItems }, (_, index) => items[Math.floor(index * step)]);
}

function buildScatterData(
  scatter: NonNullable<AnalysisResult["chart_data"]>["scatter"] | undefined,
): ScatterPoint[] {
  if (!scatter?.x || !scatter?.y || !Array.isArray(scatter.data)) return [];

  const points = scatter.data
    .map((row) => {
      const x = toNumber(row[scatter.x]);
      const y = toNumber(row[scatter.y]);

      return x === null || y === null ? null : { x, y };
    })
    .filter((point): point is ScatterPoint => point !== null);

  return sampleEvenly(points, MAX_SCATTER_POINTS);
}

function buildHistogramData(rawData: unknown): HistogramBin[] {
  if (!Array.isArray(rawData) || rawData.length === 0) return [];

  const serverBins = rawData
    .map((item) => {
      const record = asRecord(item);
      if (!record) return null;

      const count = toNumber(record.count);
      if (count === null) return null;

      const start = toNumber(record.start);
      const end = toNumber(record.end);
      const bin =
        typeof record.bin === "string"
          ? record.bin
          : start !== null && end !== null
            ? `${formatCompactNumber(start)} - ${formatCompactNumber(end)}`
            : "Bin";

      return {
        bin,
        count,
        start: start ?? undefined,
        end: end ?? undefined,
      } as HistogramBin;
    })
    .filter((bin): bin is HistogramBin => bin !== null);

  if (serverBins.length === rawData.length) return serverBins;

  const values = rawData
    .map((item) => {
      const record = asRecord(item);
      return toNumber(record?.value ?? item);
    })
    .filter((value): value is number => value !== null);

  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [{ bin: formatCompactNumber(min), count: values.length, start: min, end: max }];
  }

  const binCount = Math.min(HISTOGRAM_BIN_COUNT, values.length);
  const width = (max - min) / binCount;
  const counts = Array.from({ length: binCount }, () => 0);

  values.forEach((value) => {
    const index = Math.min(binCount - 1, Math.floor((value - min) / width));
    counts[index] += 1;
  });

  return counts.map((count, index) => {
    const start = min + width * index;
    const end = index === binCount - 1 ? max : start + width;

    return {
      bin: `${formatCompactNumber(start)} - ${formatCompactNumber(end)}`,
      count,
      start,
      end,
    };
  });
}

function buildCategoryData(rawData: unknown): CategoryCount[] {
  if (!Array.isArray(rawData)) return [];

  return rawData
    .map((item) => {
      const record = asRecord(item);
      if (!record) return null;

      const value = toNumber(record.value ?? record.count);
      const label = record.label ?? record.category ?? record.name;

      if (value === null || label === undefined || label === null) return null;

      return {
        label: String(label),
        value,
      };
    })
    .filter((point): point is CategoryCount => point !== null);
}

function getCorrelationValue(
  row: string,
  col: string,
  correlations: AnalysisResult["correlations"],
) {
  if (row === col) return 1;

  const match = correlations.find(
    (c) => (c.a === row && c.b === col) || (c.a === col && c.b === row),
  );

  return Number.isFinite(match?.value) ? match!.value : 0;
}

function Results({ r }: { r: AnalysisResult }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const cols = r.summary.columns;
  const heatmapCols = Array.from(
    new Set([...r.statistics.map((s) => s.column), ...r.correlations.flatMap((c) => [c.a, c.b])]),
  )
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="mt-12 space-y-10 animate-fade-in">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          icon={Database}
          label="Dataset Rows"
          value={r.summary.rows.toLocaleString()}
          hint="Total records"
        />
        <MetricCard icon={BarChart3} label="Columns" value={cols.length} hint="Detected features" />
        <MetricCard
          icon={ShieldCheck}
          label="Quality Score"
          value={`${r.quality_score}/100`}
          hint="Above industry avg"
          tone="success"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Issues Found"
          value={r.issues.length}
          hint="Need attention"
          tone="warn"
        />
      </div>

      {/* Summary */}
      <section>
        <SectionHeader
          icon={Database}
          title="Dataset Summary"
          desc="Schema, types, and data integrity overview"
        />
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-[1fr_280px] lg:divide-x lg:divide-y-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Missing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cols.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell className="text-sm font-medium">{formatColumnName(c.name)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {c.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={c.missing > 0 ? "text-amber-500" : "text-muted-foreground"}
                        >
                          {c.missing}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="space-y-4 p-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Duplicate Rows
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{r.summary.duplicates}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Total Missing
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {cols.reduce((s, c) => s + c.missing, 0)}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Issues
                  </p>
                  <ul className="space-y-1.5">
                    {r.issues.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Statistics */}
      <section>
        <SectionHeader
          icon={Activity}
          title="Statistics"
          desc="Descriptive statistics per numerical column"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {r.statistics.map((s) => (
            <Card key={s.column}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{formatColumnName(s.column)}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <Stat label="Mean" value={s.mean} />
                <Stat label="Median" value={s.median} />
                <Stat label="Min" value={s.min} />
                <Stat label="Max" value={s.max} />
                <Stat label="Std Dev" value={s.std} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Correlation */}
      <section>
        <SectionHeader
          icon={TrendingUp}
          title="Correlation Analysis"
          desc="Pairwise relationships between features"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Correlations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {r.correlations.map((c) => (
                <div key={`${c.a}-${c.b}`} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-xs font-medium text-foreground/80">
                      {formatColumnName(c.a)} ↔ {formatColumnName(c.b)}
                    </span>
                    <span
                      className={`font-mono text-xs font-semibold ${c.value > 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                    >
                      {c.value > 0 ? "+" : ""}
                      {c.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={c.value > 0 ? "h-full bg-emerald-500" : "h-full bg-rose-500"}
                      style={{ width: `${Math.abs(c.value) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Correlation Heatmap</CardTitle>
              <CardDescription className="text-xs">Pearson coefficient matrix</CardDescription>
            </CardHeader>
            <CardContent>
              {heatmapCols.length > 1 ? (
                <div
                  className="grid gap-1 text-[10px]"
                  style={{
                    gridTemplateColumns: `90px repeat(${heatmapCols.length}, minmax(0, 1fr))`,
                  }}
                >
                  <div />
                  {heatmapCols.map((c) => (
                    <div key={c} className="truncate text-center text-muted-foreground font-medium text-[10px]" title={formatColumnName(c)}>
                      {formatColumnName(c)}
                    </div>
                  ))}
                  {heatmapCols.map((row) => (
                    <div key={row} className="contents">
                      <div className="truncate text-muted-foreground font-medium text-[10px]" title={formatColumnName(row)}>{formatColumnName(row)}</div>
                      {heatmapCols.map((col) => {
                        const v = getCorrelationValue(row, col, r.correlations);
                        return (
                          <div
                            key={`${row}-${col}`}
                            className={`grid aspect-square place-items-center rounded text-[10px] font-medium text-foreground ${corrColor(v)}`}
                          >
                            {v.toFixed(2)}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Need at least two numeric columns to render a correlation heatmap.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <Card className="mt-4 border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <Lightbulb className="h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-2">
                {r.correlation_insights.map((i) => (
                  <p key={i} className="text-sm text-foreground/90">
                    {i}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Outliers */}
      <section>
        <SectionHeader
          icon={AlertTriangle}
          title="Outlier Detection"
          desc="Anomalies detected via IQR & z-score"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {r.outliers.length > 0 ? (
            r.outliers.map((o) => (
              <Card key={o.column}>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground">{formatColumnName(o.column)}</p>

                  <p className="mt-2 text-3xl font-semibold">{o.count}</p>

                  <p className="mt-1 text-xs text-amber-500">outliers detected</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-emerald-500">
                  ✅ No outliers detected in the dataset
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        {r.outliers.length > 0 && r.outliers_insights.length > 0 && (
          <Card className="mt-4 border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-5">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                <div className="space-y-2">
                  {r.outliers_insights.map((i) => (
                    <p key={i} className="text-sm text-foreground/90">
                      {i}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Visualizations */}
      <section>
        <SectionHeader
          icon={BarChart3}
          title="Visualization Recommendations"
          desc="Suggested charts based on column types"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {r.visualizations.length > 0 ? (
            r.visualizations.map((v) => (
              <VisualizationChart
                key={`${v.type}-${v.title}-${v.dataKey || v.column || v.x || ""}`}
                chart={v}
                chartData={r.chart_data}
              />
            ))
          ) : (
            <Card className="lg:col-span-2">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  No visualization recommendations were generated for this dataset.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="mt-4 border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <Lightbulb className="h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-2">
                {r.visualization_insights.map((i) => (
                  <p key={i} className="text-sm text-foreground/90">
                    {i}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* AI Insights — prominent */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-accent/40 p-1">
        <div className="rounded-[calc(1.5rem-4px)] bg-card/80 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-xl bg-primary/30" />
              <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/30">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">AI Insights</h2>
                <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/20">
                  <Sparkles className="h-3 w-3" /> GPT-Analyst
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Autonomous agent synthesis across all dimensions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <InsightBlock
              icon={Target}
              title="Key Findings"
              items={r.ai_insights.key_findings}
              tone="primary"
            />
            <InsightBlock
              icon={AlertTriangle}
              title="Risks"
              items={r.ai_insights.risks}
              tone="warn"
            />
            <InsightBlock
              icon={Lightbulb}
              title="Recommendations"
              items={r.ai_insights.recommendations}
              tone="success"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI Analyst Summary</h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{r.ai_insights.summary}</p>
          </div>
        </div>
      </section>

      {/* Report */}
      <section>
        <Card>
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Analysis Report</h3>
                <p className="text-sm text-muted-foreground">
                  {downloaded
                    ? "Report downloaded successfully"
                    : r.report
                      ? "Comprehensive PDF report with all findings"
                      : "Report will be available after analysis"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={downloaded ? "default" : "secondary"} className="gap-1.5">
                {downloaded ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </>
                ) : (
                  <>{r.report ? "Ready to download" : "Not available"}</>
                )}
              </Badge>
              <Button
                size="lg"
                disabled={downloading || !r.report}
                onClick={async () => {
                  setDownloading(true);
                  try {
                    await downloadReportFile(r.report);
                    setDownloaded(true);
                    toast.success("Report downloaded");
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Report download failed");
                  } finally {
                    setDownloading(false);
                  }
                }}
              >
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function VisualizationChart({
  chart,
  chartData,
}: {
  chart: VisualizationRecommendation;
  chartData?: AnalysisResult["chart_data"];
}) {
  const Icon =
    chart.type === "scatter"
      ? ScatterChartIcon
      : chart.type === "histogram"
        ? BarChart3
        : chart.type === "bar"
          ? BarChart3
          : chart.type === "pie"
            ? Activity
            : LineChartIcon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm">{chart.title}</CardTitle>
            <CardDescription className="mt-1 text-xs">{chart.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1 text-[10px] uppercase">
            <Icon className="h-3 w-3" />
            {chart.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          {chart.type === "scatter" && <ScatterVisualization chart={chart} chartData={chartData} />}
          {chart.type === "histogram" && (
            <HistogramVisualization chart={chart} chartData={chartData} />
          )}
          {chart.type === "bar" && <BarVisualization chart={chart} chartData={chartData} />}
          {chart.type === "pie" && <PieVisualization chart={chart} chartData={chartData} />}
          {chart.type === "trend" && <TrendVisualization chart={chart} chartData={chartData} />}
        </div>
      </CardContent>
    </Card>
  );
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="grid h-full place-items-center rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function chartTooltipStyle() {
  return {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--foreground)",
  };
}

function ScatterVisualization({
  chart,
  chartData,
}: {
  chart: VisualizationRecommendation;
  chartData?: AnalysisResult["chart_data"];
}) {
  const scatter = chartData?.scatter;
  const points = buildScatterData(scatter);
  const xLabel = formatColumnName(chart.x || scatter?.x || "X");
  const yLabel = formatColumnName(chart.y || scatter?.y || "Y");

  if (points.length === 0) {
    return (
      <ChartEmpty message="Need at least two numeric columns with values to render this scatter plot." />
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 16, bottom: 18, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tickFormatter={(value) => formatCompactNumber(Number(value))}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          stroke="var(--border)"
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tickFormatter={(value) => formatCompactNumber(Number(value))}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          stroke="var(--border)"
        />
        <Tooltip
          cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
          contentStyle={chartTooltipStyle()}
          formatter={(value: unknown, name: unknown) => [
            formatChartNumber(value),
            name === "x" ? xLabel : yLabel,
          ]}
        />
        <Scatter data={points} fill="var(--chart-1)" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function HistogramVisualization({
  chart,
  chartData,
}: {
  chart: VisualizationRecommendation;
  chartData?: AnalysisResult["chart_data"];
}) {
  const dataKey = chart.dataKey || (chart.column ? `${chart.column}_histogram` : undefined);
  const bins = buildHistogramData(dataKey ? chartData?.[dataKey] : undefined);

  if (bins.length === 0) {
    return <ChartEmpty message="No numeric values were available for this histogram." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={bins} margin={{ top: 10, right: 16, bottom: 18, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="bin"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          stroke="var(--border)"
          interval={Math.max(0, Math.floor(bins.length / 6) - 1)}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          stroke="var(--border)"
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={chartTooltipStyle()}
          formatter={(value: unknown) => [`${formatChartNumber(value, 0)} rows`, "Count"]}
          labelFormatter={(label) => `${formatColumnName(chart.column || "Value")}: ${label}`}
        />
        <Bar dataKey="count" name="Count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function BarVisualization({
  chart,
  chartData,
}: {
  chart: VisualizationRecommendation;
  chartData?: AnalysisResult["chart_data"];
}) {
  const dataKey = chart.dataKey || (chart.column ? `${chart.column}_bar` : undefined);
  const bars = buildCategoryData(dataKey ? chartData?.[dataKey] : undefined);

  if (bars.length === 0) {
    return <ChartEmpty message="No categorical values were available for this bar chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 18, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          stroke="var(--border)"
          interval={0}
          angle={bars.length > 5 ? -20 : 0}
          textAnchor={bars.length > 5 ? "end" : "middle"}
          height={bars.length > 5 ? 55 : 30}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          stroke="var(--border)"
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={chartTooltipStyle()}
          formatter={(value: unknown) => [`${formatChartNumber(value, 0)} rows`, "Count"]}
        />
        <Bar dataKey="value" name="Count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieVisualization({
  chart,
  chartData,
}: {
  chart: VisualizationRecommendation;
  chartData?: AnalysisResult["chart_data"];
}) {
  const dataKey = chart.dataKey || (chart.column ? `${chart.column}_pie` : undefined);
  const rawSlices = buildCategoryData(dataKey ? chartData?.[dataKey] : undefined);

  if (rawSlices.length === 0) {
    return <ChartEmpty message="No categorical values were available for this pie chart." />;
  }

  // Sort raw slices by value descending
  const sortedSlices = [...rawSlices].sort((a, b) => b.value - a.value);

  // Limit pie chart slices to top 5 + "Other" to prevent layout collisions
  let slices = sortedSlices;
  if (sortedSlices.length > 6) {
    const topSlices = sortedSlices.slice(0, 5);
    const otherSlices = sortedSlices.slice(5);
    const otherValue = otherSlices.reduce((sum, item) => sum + item.value, 0);

    slices = [
      ...topSlices,
      {
        label: "Other",
        value: otherValue,
      },
    ];
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 10, right: 55, bottom: 10, left: 55 }}>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="45%"
          outerRadius="58%"
          labelLine={(props: any) => {
            const name = props.name || props.payload?.label || props.payload?.name;
            const percent = props.percent || props.payload?.percent;
            if (name === "Other" || (percent !== undefined && percent < 0.01)) {
              return <path d="" />;
            }
            const { sx, sy, mx, my, ex, ey, stroke } = props;
            return (
              <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={stroke}
                fill="none"
              />
            );
          }}
          label={({ name, percent }) => {
            // Hide outer label for "Other" slice to prevent layout/line collision
            if (name === "Other" || percent < 0.01) return "";
            const displayName = name.length > 20 ? `${name.slice(0, 18)}…` : name;
            return `${displayName} ${(percent * 100).toFixed(0)}%`;
          }}
        >
          {slices.map((slice, index) => (
            <Cell key={slice.label} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={chartTooltipStyle()}
          formatter={(value: unknown) => [`${formatChartNumber(value, 0)} rows`, "Count"]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function buildTrendData(rawData: unknown) {
  if (!Array.isArray(rawData)) return [];

  return rawData
    .map((item) => {
      const record = asRecord(item);
      if (!record) return null;

      const value = toNumber(record.value ?? record.y ?? record.count);
      const label = record.date ?? record.label ?? record.x ?? record.period;

      if (value === null || label === undefined || label === null) return null;

      return {
        label: String(label),
        value,
      };
    })
    .filter((point): point is { label: string; value: number } => point !== null);
}

function TrendVisualization({
  chart,
  chartData,
}: {
  chart: VisualizationRecommendation;
  chartData?: AnalysisResult["chart_data"];
}) {
  const dataKey = chart.dataKey || "trend";
  const points = sampleEvenly(buildTrendData(chartData?.[dataKey]), 80);

  if (points.length === 0) {
    return <ChartEmpty message="No time-series values were available for this trend chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={points} margin={{ top: 10, right: 16, bottom: 18, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          stroke="var(--border)"
          interval={Math.max(0, Math.floor(points.length / 6) - 1)}
        />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} stroke="var(--border)" />
        <Tooltip
          contentStyle={chartTooltipStyle()}
          formatter={(value: unknown) => [formatChartNumber(value), formatColumnName(chart.y || "Value")]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--chart-3)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold">{value.toLocaleString()}</p>
    </div>
  );
}

function InsightBlock({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: IconComponent;
  title: string;
  items: string[];
  tone: "primary" | "warn" | "success";
}) {
  const toneMap = {
    primary: {
      text: "text-primary",
      bg: "bg-primary",
      bgLight: "bg-primary/10",
      border: "border-primary/20",
    },
    warn: {
      text: "text-amber-500",
      bg: "bg-amber-500",
      bgLight: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    success: {
      text: "text-emerald-500",
      bg: "bg-emerald-500",
      bgLight: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  } as const;

  const config = toneMap[tone];

  return (
    <div className={`rounded-2xl border bg-background/60 p-5 ${config.border}`}>
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`grid h-7 w-7 place-items-center rounded-lg ${config.text} ${config.bgLight}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((i, idx) => (
          <li key={`${i}-${idx}`} className="flex items-start gap-2.5 text-sm text-foreground/85">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${config.bg}`}
            />
            {formatInsightItem(i)}
          </li>
        ))}
      </ul>
    </div>
  );
}
