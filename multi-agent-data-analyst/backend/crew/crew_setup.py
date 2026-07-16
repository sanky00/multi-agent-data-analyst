from crewai import Crew, Process

from crew.agents import (
    data_cleaner_agent,
    analyst_agent,
    correlation_agent,
    outlier_agent,
    report_agent
)

from crew.tasks import (
    cleaning_task,
    analysis_task,
    correlation_task,
    outlier_task,
    report_task
)


crew = Crew(
    agents=[
        data_cleaner_agent,
        analyst_agent,
        correlation_agent,
        outlier_agent,
        report_agent
    ],
    tasks=[
        cleaning_task,
        analysis_task,
        correlation_task,
        outlier_task,
        report_task
    ],
    process=Process.sequential,
    verbose=True
)