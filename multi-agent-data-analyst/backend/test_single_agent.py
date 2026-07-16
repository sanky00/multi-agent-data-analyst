# test_single_agent.py

from crew.agents import analyst_agent
from crewai import Task

task = Task(
    description="Analyze a dataset with 100 rows and 5 columns.",
    expected_output="Business analysis."
)

result = analyst_agent.execute_task(task)

print(result)