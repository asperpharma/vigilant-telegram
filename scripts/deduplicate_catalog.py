import pandas as pd
import numpy as np
import os

# =================CONFIGURATION=================
# Actual file path for the Master Catalog
input_file = r"c:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\1-3999 pro (1).csv"
output_file = r"c:\Users\C-R\Desktop\Asper Beauty Box\lovable\asper_unique_cleaned_catalog.csv"

# Configuration based on Apify CSV structure
handle_col = 'handle'
category_col = 'productType'
image_col = 'images/0/src'
desc_col = 'descriptionHtml'
# ===============================================

print(f"--- 🏺 Starting Surgical Deduplication process ---")
print(f"Input: {input_file}")

# 1. Load the heavy data
try:
    if not os.path.exists(input_file):
        print(f"Error: file not found at {input_file}")
        exit(1)
        
    df = pd.read_csv(input_file, low_memory=False)
    initial_count = len(df)
    print(f"Loaded {initial_count:,} rows successfully.")
except Exception as e:
    print(f"Error loading CSV: {e}")
    exit(1)

# 2. Create 'Completeness Scores' (Temporary Helper Columns)
print("Analysing row quality based on categories, images, and description depth...")

# Score 1: Has Category (High Priority)
df['has_category_score'] = np.where(df[category_col].notna() & (df[category_col] != ''), 1, 0)

# Score 2: Has Image URL
df['has_image_score'] = np.where(df[image_col].notna() & (df[image_col] != ''), 1, 0)

# Score 3: Description Length
df['desc_len_score'] = df[desc_col].astype(str).str.len()

# 3. The Strategic Sort (Bringing the best versions to the top)
print("Sorting catalog to prioritize maximum data integrity...")
df_sorted = df.sort_values(
    by=['has_category_score', 'has_image_score', 'desc_len_score'],
    ascending=[False, False, False]
)

# 4. The Safe Deduplication
print(f"Removing duplicates based on unique '{handle_col}'...")
df_unique = df_sorted.drop_duplicates(subset=[handle_col], keep='first')

# Calculate stats
final_count = len(df_unique)
duplicates_removed = initial_count - final_count

# 5. Cleanup and Export
df_final = df_unique.drop(columns=['has_category_score', 'has_image_score', 'desc_len_score'])

print(f"Saving cleaned data to {output_file}...")
df_final.to_csv(output_file, index=False)

print("\n" + "="*40)
print("✅ DEDUPLICATION COMPLETE")
print(f"Original Rows: {initial_count:,}")
print(f"Unique Products Kept: {final_count:,}")
print(f"Duplicates Removed (Inferior versions): {duplicates_removed:,}")
print("="*40)
print(f"Cleaned catalog ready: {output_file}")
