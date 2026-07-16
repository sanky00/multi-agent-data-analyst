from fastapi import FastAPI, UploadFile, File, HTTPException, Query
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
from services.csv_service import get_csv_summary
from services.stats_service import get_statistics
from agents.data_cleaner import analyze_data_quality
from agents.analyst_agent import generate_insights
from services.quality_score import calculate_quality_score
from services.correlation_service import get_correlations
from agents.correlation_agent import interpret_correlations
from services.outlier_service import detect_outliers
from agents.outlier_agent import interpret_outliers
from services.visualization_service import suggest_visualizations
from agents.visualization_agent import explain_visualizations
from services.gemini_service import generate_ai_insights
from services.report_service import generate_pdf_report
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
REPORT_FOLDER = os.path.join(BASE_DIR, "reports")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Multi-Agent Data Analyst API Running"
    }


@app.get("/download-report")
def download_report(path: str = Query("reports/report.pdf")):

    filename = os.path.basename(
        os.path.normpath(path)
    )

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Invalid report path"
        )

    report_path = os.path.join(
        REPORT_FOLDER,
        filename
    )

    if not os.path.exists(report_path):
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return FileResponse(
        report_path,
        media_type="application/pdf",
        filename=os.path.basename(report_path)
    )


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    summary = get_csv_summary(file_path)

    issues = analyze_data_quality(summary)

    statistics = get_statistics(file_path)

    insights = generate_insights(summary, statistics)

    quality_score = calculate_quality_score(summary)

    correlations = get_correlations(file_path)

    correlation_insights = interpret_correlations(correlations)

    outliers_raw = detect_outliers(file_path)

    outliers_insights = interpret_outliers(outliers_raw)

    outliers_counts = {col: len(vals) for col, vals in outliers_raw.items()}

    visualizations, chart_data = suggest_visualizations(file_path)

    visualization_insights = explain_visualizations(visualizations)

    ai_insights = generate_ai_insights({
    "summary": summary,
    "statistics": statistics,
    "correlations": correlations,
    "outliers": outliers_counts
    })

    report_path = generate_pdf_report(
    summary,
    quality_score,
    insights,
    ai_insights)




    return {
        "summary": summary,
        "issues": issues,
        "statistics": statistics,
        "insights": insights,
        "quality_score": quality_score,
        "correlations": correlations,
        "correlation_insights": correlation_insights,
        "outliers": outliers_counts,
        "outliers_insights": outliers_insights,
        "visualizations": visualizations,
        "chart_data": chart_data,
        "visualization_insights": visualization_insights,
        "ai_insights": ai_insights,
        "report": report_path,
    }
