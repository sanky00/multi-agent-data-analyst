import pandas as pd

def get_correlations(file_path):

    df = pd.read_csv(file_path)

    numeric_df = df.select_dtypes(include=["number"])

    if len(numeric_df.columns) < 2:
        return {}

    correlation_matrix = numeric_df.corr()

    correlations = {}

    columns = correlation_matrix.columns

    for i in range(len(columns)):

        for j in range(i + 1, len(columns)):

            col1 = columns[i]
            col2 = columns[j]

            correlations[
                f"{col1} vs {col2}"
            ] = round(
                float(correlation_matrix.iloc[i, j]),
                3
            )

    return correlations