from crewai import Task

from crew.agents import (
    data_cleaner_agent,
    analyst_agent,
    correlation_agent,
    outlier_agent,
    report_agent
)


cleaning_task = Task(
    description="""
Analyze the dataset summary:

{summary}

Identify:
- Missing values
- Duplicate records
- Data quality issues
- Data consistency concerns

Provide a clear data quality assessment.
""",
    agent=data_cleaner_agent,
    expected_output="""
A detailed data quality report containing:
- Missing values analysis
- Duplicate analysis
- Data quality concerns
- Cleaning recommendations
"""
)


analysis_task = Task(
    description="""
Analyze the dataset statistics:

{statistics}

Generate:
- Business insights
- Trends
- Patterns
- Important observations

Focus on actionable insights.
""",
    agent=analyst_agent,
    expected_output="""
A business analysis report containing:
- Key findings
- Trends
- Statistical observations
- Business insights
"""
)


correlation_task = Task(
    description="""
Analyze the following correlations:

{correlations}

Determine:
- Strong relationships
- Weak relationships
- Positive correlations
- Negative correlations

Explain business implications.
""",
    agent=correlation_agent,
    expected_output="""
A correlation report containing:
- Correlation interpretation
- Relationship strength analysis
- Business impact assessment
"""
)


outlier_task = Task(
    description="""
Analyze detected outliers:

{outliers}

Determine:
- Possible causes
- Business risks
- Data quality implications
- Recommended actions
""",
    agent=outlier_agent,
    expected_output="""
An outlier analysis report containing:
- Outlier explanation
- Risk assessment
- Recommendations
"""
)


report_task = Task(
    description="""
Using outputs from all previous agents:

1. Data Cleaner Agent
2. Data Analyst Agent
3. Correlation Agent
4. Outlier Agent

Create a professional executive report.

Include:
- Executive Summary
- Key Findings
- Risks
- Recommendations
- Final Conclusion
""",
    agent=report_agent,
    expected_output="""
A professional executive business report with:
- Executive Summary
- Key Findings
- Risks
- Recommendations
- Conclusion
"""
)