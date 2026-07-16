def generate_insights(summary, statistics):

    insights = []

    # Missing Values Analysis
    total_missing = sum(
        summary["missing_values"].values()
    )

    if total_missing == 0:
        insights.append(
            "Dataset contains no missing values."
        )

    for column, missing in summary["missing_values"].items():

        if missing > 0:
            insights.append(
                f"{column} contains {missing} missing values."
            )

    # Duplicate Analysis
    if summary["duplicates"] == 0:

        insights.append(
            "No duplicate rows detected."
        )

    else:

        insights.append(
            f"Dataset contains {summary['duplicates']} duplicate rows."
        )

    # Dataset Size Insight
    insights.append(
        f"Dataset contains {summary['rows']} rows and {summary['columns']} columns."
    )

    # Statistics Analysis
    for column, stats in statistics.items():

        insights.append(
            f"Average {column} is {round(stats['mean'], 2)}."
        )

        insights.append(
            f"{column} ranges from {stats['min']} to {stats['max']}."
        )

        # Range analysis
        if stats["max"] > (stats["mean"] * 2):

            insights.append(
                f"{column} shows high variability and may contain extreme values."
            )

    return insights