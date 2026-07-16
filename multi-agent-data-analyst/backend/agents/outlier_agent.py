def interpret_outliers(outliers):

    insights = []

    for column, values in outliers.items():

        sample = values[:5]
        sample_str = ", ".join(map(str, sample))
        if len(values) > 5:
            sample_str += ", ..."

        insights.append(
            f"{column} contains {len(values)} potential outlier(s) (e.g., [{sample_str}])"
        )

    return insights