def interpret_correlations(correlations):

    insights = []

    for pair, value in correlations.items():

        if abs(value) >= 0.8:

            insights.append(
                f"{pair} shows a strong correlation ({value})."
            )

        elif abs(value) >= 0.5:

            insights.append(
                f"{pair} shows a moderate correlation ({value})."
            )

        elif abs(value) >= 0.3:

            insights.append(
                f"{pair} shows a weak correlation ({value})."
            )

    return insights