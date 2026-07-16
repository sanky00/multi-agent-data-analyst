def analyze_data_quality(summary):

    issues = []

    for column, missing in summary["missing_values"].items():

        if missing > 0:
            issues.append(
                f"{column} has {missing} missing values"
            )

    if summary["duplicates"] > 0:

        issues.append(
            f"Dataset contains {summary['duplicates']} duplicate rows"
        )

    return issues