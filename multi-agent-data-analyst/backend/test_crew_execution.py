from crew.crew_setup import crew

result = crew.kickoff(
    inputs={
        "summary": {
            "rows": 100,
            "columns": 5,
            "duplicates": 2
        },
        "statistics": {
            "salary_mean": 50000,
            "salary_max": 120000
        },
        "correlations": {
            "Age vs Salary": 0.82
        },
        "outliers": {
            "Salary": 3
        }
    }
)

print("\n")
print("=" * 50)
print("CREW RESULT")
print("=" * 50)
print(result)