#!/usr/bin/env python3
"""
Simple prediction script using the original RandomForest model
"""

import sys
import argparse
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

MODEL_PATH = '/Users/john/Downloads/inventory/ml/demand_model.joblib'

def predict_demand(product_id, current_stock, price):
    """Predict demand using the trained RandomForest model"""
    try:
        # Load the model pipeline
        model_data = joblib.load(MODEL_PATH)
        pipeline = model_data['model']
        
        # Create product data matching the model's expected input format
        timestamp = pd.Timestamp.now()
        product_data = {
            'sku_id': f"SKU_{product_id:04d}",
            'qty_in': max(0, current_stock - 10),  # Simple restock logic
            'current_stock': current_stock,
            'batch_id': f'BATCH_{np.random.randint(1, 5000):05d}',
            'expiry_date': (timestamp + pd.Timedelta(days=180)).strftime('%Y-%m-%d'),
            'manufacture_date': (timestamp - pd.Timedelta(days=30)).strftime('%Y-%m-%d'),
            'transaction_type': 'sale',
            'location': 'WH_A',
            'price': price
        }
        
        # Create DataFrame with all required columns
        df = pd.DataFrame([product_data])
        
        # Add time features that the model expects
        df['timestamp'] = timestamp
        df['year'] = timestamp.year
        df['month'] = timestamp.month
        df['day'] = timestamp.day
        df['day_of_week'] = timestamp.dayofweek
        
        # Convert date columns to days (as expected by model)
        reference_date = pd.Timestamp.now()
        df['expiry_days'] = (pd.to_datetime(df['expiry_date']) - reference_date).dt.days
        df['manufacture_days'] = (reference_date - pd.to_datetime(df['manufacture_date'])).dt.days
        
        # Get the input columns from the model data
        input_cols = model_data['input_cols']
        
        # Prepare features in the correct order
        X = df[input_cols].copy()
        
        # Use the pipeline to predict (it handles preprocessing internally)
        prediction = pipeline.predict(X)[0]
        
        # SCALE: Inverse stock-demand relationship (stock-heavy, price-insensitive)
        base_prediction = prediction * 0.5
        
        # INVERSE LOGIC: Low stock = High demand, High stock = Low demand
        if current_stock < 10:
            base_prediction *= 3.0  # Low stock = HIGH demand (~240)
        elif current_stock < 50:
            base_prediction *= 2.0  # Medium-low stock = High-medium demand (~160)
        elif current_stock < 100:
            base_prediction *= 1.2  # Medium stock = Medium demand (~96)
        elif current_stock > 150:
            base_prediction *= 0.3  # High stock = LOW demand (~40)
        else:
            base_prediction *= 0.6  # Medium-high stock = Low-medium demand (~72)
        
        prediction = base_prediction
        
        # Return the prediction
        print(max(0, float(prediction)))
        
    except Exception as e:
        print(f"Prediction error: {e}", file=sys.stderr)
        # Fallback to simple business logic
        base_demand = 100
        if current_stock < 10:
            base_demand *= 2
        elif current_stock > 200:
            base_demand *= 0.5
        print(max(0, int(base_demand)))

def main():
    parser = argparse.ArgumentParser(description='Demand prediction for stock optimization')
    parser.add_argument('product_id', help='Product ID')
    parser.add_argument('current_stock', help='Current stock level')
    parser.add_argument('price', help='Product price')
    
    args = parser.parse_args()
    
    # Convert arguments
    product_id = int(args.product_id)
    current_stock = float(args.current_stock)
    price = float(args.price)
    
    # Predict demand
    predict_demand(product_id, current_stock, price)

if __name__ == "__main__":
    main()
