# 🤖 Multi-Agent Data Analyst Platform

An AI-powered data analysis platform that automates CSV analysis using multiple intelligent modules. The platform performs data quality assessment, statistical analysis, correlation detection, outlier detection, visualization recommendations, AI-generated insights, and PDF report generation through an interactive web dashboard.

---

## 🚀 Features

- 📁 Upload CSV datasets
- 🧹 Data Cleaning Analysis
- 📊 Statistical Analysis
- 📈 Correlation Analysis
- 🚨 Outlier Detection
- 📉 Dynamic Visualizations
- 🧠 AI-Generated Insights
- 📄 PDF Report Generation
- ⚡ FastAPI Backend
- 🎨 Modern React Dashboard

---

# 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
- Recharts
- shadcn/ui

### Backend
- FastAPI
- Python
- Pandas
- NumPy
- ReportLab

### AI
- Groq LLM

---

# 🏗️ Project Architecture

```text
CSV Upload
      │
      ▼
Data Cleaning Module
      │
      ▼
Statistics Engine
      │
      ▼
Correlation Analysis
      │
      ▼
Outlier Detection
      │
      ▼
Visualization Engine
      │
      ▼
AI Insight Generator
      │
      ▼
PDF Report Generator
      │
      ▼
Interactive Dashboard
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/sanky00/multi-agent-data-analyst.git
```

## Backend

```bash
cd backend

python -m venv .venv

pip install -r requirements.txt

python -m uvicorn main:app --reload
```

## Frontend

```bash
cd multiagentui-main

npm install

npm run dev
```
---

# 📌 Key Functionalities

- Upload and analyze any CSV dataset
- Automatic data quality assessment
- Missing value and duplicate detection
- Statistical summary generation
- Correlation analysis between numeric features
- Outlier detection using statistical methods
- Dynamic chart generation
- AI-powered insights and recommendations
- Downloadable PDF analysis report
- Responsive modern dashboard

---

# 📂 Project Structure

```
multi-agent-data-analyst/
│
├── backend/
│   ├── agents/
│   ├── services/
│   ├── uploads/
│   ├── reports/
│   ├── requirements.txt
│   └── main.py
│
├── multiagentui-main/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```
---

# 🚀 Future Improvements

- Google Authentication (Clerk)
- User Dashboard
- Analysis History
- Cloud Deployment
- Custom AI Orchestrator
- More Interactive Charts
- Export to Excel
- Real-time Dataset Analysis
- Advanced Business Intelligence Reports


