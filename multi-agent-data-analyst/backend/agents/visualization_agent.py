def explain_visualizations(visualizations):

    insights = []

    for chart in visualizations:

        if chart["chart_type"] == "scatter":

            insights.append(f"Scatter plot suggested for {chart['x']} vs {chart['y']}.")

        elif chart["chart_type"] == "histogram":

            insights.append(f"Histogram suggested for {chart['column']}.")

        elif chart["chart_type"] == "bar":

            insights.append(
                f"Bar chart suggested for category counts in {chart['column']}."
            )

        elif chart["chart_type"] == "pie":

            insights.append(
                f"Pie chart suggested for category share in {chart['column']}."
            )

    return insights
