from crewai import Task
from crew.agents import analyst_agent

task = Task(
    description="Analyze a dataset with 100 rows and 5 columns.",
    expected_output="Business analysis."
)

response = analyst_agent.execute_task(task)

print(response)