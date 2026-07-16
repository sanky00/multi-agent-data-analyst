def calculate_quality_score(summary):

    score = 100

    total_missing = sum(
        summary["missing_values"].values()
    )

    score -= total_missing * 5

    score -= summary["duplicates"] * 10

    if score < 0:
        score = 0

    return score