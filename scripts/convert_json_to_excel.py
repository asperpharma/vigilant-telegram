import json
import pandas as pd
from pathlib import Path

# Paths
json_path = r'C:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\dataset_productss_2026-01-15_23-29-45-343.json'
output_path = r'C:\Users\C-R\Desktop\Asper Beauty Box\lovable\products_for_upload.xlsx'

print("Loading JSON file...")
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Found {len(products)} products")

# Convert to format expected by bulk upload UI
# Based on BulkUpload.tsx, it expects: sku, name, costPrice, sellingPrice
excel_data = []

for product in products:
    # Extract price from variants
    current_price = 0
    cost_price = 0
    
    if product.get('variants') and len(product['variants']) > 0:
        variant = product['variants'][0]
        if variant.get('price', {}).get('current'):
            current_price = float(variant['price']['current']) / 100  # Convert from cents
        if variant.get('price', {}).get('previous'):
            cost_price = float(variant['price']['previous']) / 100
    
    # Use source ID as SKU
    sku = product.get('source', {}).get('id', '')
    if not sku:
        sku = f"PROD-{len(excel_data) + 1}"
    
    excel_data.append({
        'SKU': str(sku),
        'Product Name': product.get('title', 'Untitled Product'),
        'Cost Price': cost_price if cost_price > 0 else current_price * 0.7,  # Estimate 30% margin if no cost
        'Selling Price': current_price if current_price > 0 else 10.0  # Default price
    })

# Create DataFrame
df = pd.DataFrame(excel_data)

# Save to Excel
print(f"Saving to {output_path}...")
df.to_excel(output_path, index=False, sheet_name='Products')

print(f"✅ Successfully converted {len(excel_data)} products to Excel!")
print(f"📁 File saved to: {output_path}")
print(f"\nColumn mapping:")
print(f"  - SKU: Product identifier")
print(f"  - Product Name: Full product title")
print(f"  - Cost Price: Cost/previous price")
print(f"  - Selling Price: Current selling price")
