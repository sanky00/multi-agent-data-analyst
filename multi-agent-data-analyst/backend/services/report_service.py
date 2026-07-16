import os
from xml.sax.saxutils import escape

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


REPORT_FOLDER = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "reports",
    )
)


def _safe_text(value):
    return escape(str(value or ""))


def _items(value):
    return value if isinstance(value, list) else []


def generate_pdf_report(
    summary,
    quality_score,
    insights,
    ai_insights,
):
    os.makedirs(REPORT_FOLDER, exist_ok=True)

    pdf_path = os.path.join(
        REPORT_FOLDER,
        "report.pdf",
    )

    doc = SimpleDocTemplate(
        pdf_path,
        title="AI Data Analysis Report",
    )

    styles = getSampleStyleSheet()
    content = []

    content.append(
        Paragraph(
            "AI Data Analysis Report",
            styles["Title"],
        )
    )
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"Rows: {_safe_text(summary.get('rows'))}",
            styles["BodyText"],
        )
    )
    content.append(
        Paragraph(
            f"Columns: {_safe_text(summary.get('columns'))}",
            styles["BodyText"],
        )
    )
    content.append(
        Paragraph(
            f"Quality Score: {_safe_text(quality_score)}",
            styles["BodyText"],
        )
    )
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            "Insights",
            styles["Heading2"],
        )
    )
    for item in _items(insights):
        content.append(
            Paragraph(
                _safe_text(item),
                styles["BodyText"],
            )
        )
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            "Executive Summary",
            styles["Heading2"],
        )
    )
    content.append(
        Paragraph(
            _safe_text(ai_insights.get("summary")),
            styles["BodyText"],
        )
    )
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            "Key Findings",
            styles["Heading2"],
        )
    )
    for finding in _items(ai_insights.get("key_findings")):
        content.append(
            Paragraph(
                f"- {_safe_text(finding)}",
                styles["BodyText"],
            )
        )
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            "Risks",
            styles["Heading2"],
        )
    )
    for risk in _items(ai_insights.get("risks")):
        content.append(
            Paragraph(
                f"- {_safe_text(risk)}",
                styles["BodyText"],
            )
        )
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            "Recommendations",
            styles["Heading2"],
        )
    )
    for recommendation in _items(ai_insights.get("recommendations")):
        content.append(
            Paragraph(
                f"- {_safe_text(recommendation)}",
                styles["BodyText"],
            )
        )
    content.append(Spacer(1, 12))

    doc.build(content)

    return "reports/report.pdf"
