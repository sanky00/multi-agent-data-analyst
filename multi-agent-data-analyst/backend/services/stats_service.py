import pandas as pd

def get_statistics(file_path):

    df = pd.read_csv(file_path)

    numeric_df = df.select_dtypes(include=["number"])

    stats = {}

    for column in numeric_df.columns:

        stats[column] = {
            "mean": float(numeric_df[column].mean()),
            "median": float(numeric_df[column].median()),
            "min": float(numeric_df[column].min()),
            "max": float(numeric_df[column].max()),
            "std": float(numeric_df[column].std())
        }

    return stats