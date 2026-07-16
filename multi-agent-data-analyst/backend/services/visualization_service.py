import pandas as pd
import numpy as np


MAX_SCATTER_POINTS = 1000
HISTOGRAM_BINS = 12
MAX_CATEGORY_VALUES = 10


def _clean_numeric_series(series):
    return pd.to_numeric(series, errors="coerce").dropna()


def _sample_frame(frame, max_rows):
    if len(frame) <= max_rows:
        return frame

    step = max(1, len(frame) // max_rows)
    return frame.iloc[::step].head(max_rows)


def _format_bin(start, end):
    if start == end:
        return f"{start:.3g}"

    return f"{start:.3g} - {end:.3g}"


def _build_histogram(series):
    values = _clean_numeric_series(series)

    if values.empty:
        return []

    if values.min() == values.max():
        only_value = float(values.iloc[0])
        return [{
            "bin": _format_bin(only_value, only_value),
            "count": int(len(values)),
            "start": only_value,
            "end": only_value,
        }]

    bin_count = min(HISTOGRAM_BINS, int(values.nunique()))
    counts, edges = np.histogram(
        values.to_numpy(dtype=float),
        bins=bin_count
    )

    return [
        {
            "bin": _format_bin(float(edges[i]), float(edges[i + 1])),
            "count": int(count),
            "start": float(edges[i]),
            "end": float(edges[i + 1]),
        }
        for i, count in enumerate(counts)
    ]


def _build_category_counts(series, max_categories=MAX_CATEGORY_VALUES):
    values = series.dropna().astype(str).str.strip()
    values = values[values != ""]

    if values.empty:
        return []

    counts = values.value_counts().head(max_categories)

    return [
        {
            "label": str(label),
            "value": int(count),
        }
        for label, count in counts.items()
    ]


def suggest_visualizations(file_path):

    df = pd.read_csv(file_path)

    numeric_columns = list(
        df.select_dtypes(include=["number"]).columns
    )

    categorical_columns = [
        column
        for column in df.columns
        if column not in numeric_columns
        and df[column].dropna().nunique() > 1
        and df[column].dropna().nunique() <= 50
    ]

    visualizations = []

    chart_data = {}

    if len(numeric_columns) >= 2:

        x_col = numeric_columns[0]
        y_col = numeric_columns[1]

        scatter_df = (
            df[[x_col, y_col]]
            .apply(pd.to_numeric, errors="coerce")
            .dropna()
        )

        if not scatter_df.empty:
            visualizations.append({
                "chart_type": "scatter",
                "x": x_col,
                "y": y_col,
                "data_key": "scatter",
            })

            chart_data["scatter"] = {
                "x": x_col,
                "y": y_col,
                "data": (
                    _sample_frame(scatter_df, MAX_SCATTER_POINTS)
                    .astype(float)
                    .to_dict("records")
                )
            }
    
    for column in numeric_columns:

        histogram_key = f"{column}_histogram"
        histogram_data = _build_histogram(df[column])

        if not histogram_data:
            continue

        visualizations.append({
            "chart_type": "histogram",
            "column": column,
            "data_key": histogram_key,
        })

        chart_data[histogram_key] = histogram_data

    for column in categorical_columns:

        category_data = _build_category_counts(df[column])

        if not category_data:
            continue

        bar_key = f"{column}_bar"
        pie_key = f"{column}_pie"

        visualizations.append({
            "chart_type": "bar",
            "column": column,
            "data_key": bar_key,
            "title": f"{column} Counts",
            "description": f"Bar chart showing the most common values in {column}.",
        })

        chart_data[bar_key] = category_data

        visualizations.append({
            "chart_type": "pie",
            "column": column,
            "data_key": pie_key,
            "title": f"{column} Share",
            "description": f"Pie chart showing the proportional distribution of {column}.",
        })

        chart_data[pie_key] = category_data

    return visualizations, chart_data
