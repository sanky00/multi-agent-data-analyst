import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")

if not API_KEY or API_KEY == "YOUR_GEMINI_API_KEY_HERE":
    print("WARNING: GEMINI_API_KEY environment variable is not set or is set to placeholder. Please set it in your .env file.")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def generate_ai_insights(data):

    prompt = f"""
You are a senior business data analyst.

Analyze:

{data}

Return ONLY valid JSON.

Format:

{{
  "key_findings": [
    "finding 1",
    "finding 2",
    "finding 3"
  ],
  "risks": [
    "risk 1",
    "risk 2"
  ],
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "summary": "short executive summary"
}}

No markdown.
No explanation.
No code block.
Only JSON.
"""

    try:

        response = model.generate_content(prompt)

        text = response.text.strip()

        text = text.replace("```json", "")
        text = text.replace("```", "")

        return json.loads(text)

    except Exception as e:

        print("Gemini Error:", e)

        return {
            "key_findings": [
                "AI insights are currently unavailable."
            ],
            "risks": [
                "Gemini API quota exceeded or service unavailable."
            ],
            "recommendations": [
                "Retry later or upgrade Gemini API quota."
            ],
            "summary": "AI-generated insights could not be produced at this time."
        }