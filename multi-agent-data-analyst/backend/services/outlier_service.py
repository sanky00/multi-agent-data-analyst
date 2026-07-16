import pandas as pd

class OutlierSummary:
    def __init__(self, sample, total_count):
        self.sample = sample
        self.total_count = total_count

    def __len__(self):
        return self.total_count

    def __getitem__(self, index):
        return self.sample[index]


def detect_outliers(file_path):

    df = pd.read_csv(file_path)

    outliers = {}

    for column in df.columns:
        series = df[column]

        # Skip boolean, datetime, and timedelta columns
        if (pd.api.types.is_bool_dtype(series) or 
            pd.api.types.is_datetime64_any_dtype(series) or 
            pd.api.types.is_timedelta64_dtype(series)):
            continue

        if not pd.api.types.is_numeric_dtype(series):
            # Strip currency symbols, commas, percent signs, and whitespace
            series = series.astype(str).str.replace(r"[\$,%€£¥\s]", "", regex=True)

        # Clean and coerce data to numeric, handling object column type inference issues on large files
        clean_series = pd.to_numeric(series, errors="coerce").dropna()

        if clean_series.empty or len(clean_series) < 4:
            continue

        q1 = clean_series.quantile(0.25)
        q3 = clean_series.quantile(0.75)

        iqr = q3 - q1

        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr

        mask = (clean_series < lower_bound) | (clean_series > upper_bound)
        total_count = mask.sum()

        if total_count > 0:
            # Only grab up to 5 outliers to avoid building/copying huge lists in memory
            sample = clean_series[mask].head(5).tolist()
            outliers[column] = OutlierSummary(sample, int(total_count))

    return outliers