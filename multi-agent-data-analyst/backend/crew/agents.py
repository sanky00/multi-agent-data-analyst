from crewai import Agent
from crew.llm import groq_llm


data_cleaner_agent = Agent(
    role="Data Cleaner",
    goal="Find missing values, duplicates and data quality issues.",
    backstory="Expert in data cleaning and preprocessing.",
    llm=groq_llm,
    verbose=True
)


analyst_agent = Agent(
    role="Data Analyst",
    goal="Analyze dataset statistics and generate insights.",
    backstory="Experienced business data analyst.",
    llm=groq_llm,
    verbose=True
)


correlation_agent = Agent(
    role="Correlation Expert",
    goal="Find relationships between columns.",
    backstory="Expert in statistical correlation analysis.",
    llm=groq_llm,
    verbose=True
)


outlier_agent = Agent(
    role="Outlier Detector",
    goal="Detect unusual values in datasets.",
    backstory="Specialist in anomaly detection.",
    llm=groq_llm,
    verbose=True
)


report_agent = Agent(
    role="Report Writer",
    goal="Prepare final business reports.",
    backstory="Professional data reporting specialist.",
    llm=groq_llm,
    verbose=True
)