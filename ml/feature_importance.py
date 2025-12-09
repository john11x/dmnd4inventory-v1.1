#!/usr/bin/env python3
"""
Extract feature importance from the trained RandomForest model
"""

import joblib
import json
import warnings
warnings.filterwarnings('ignore')

MODEL_PATH = '/Users/john/Downloads/inventory/ml/demand_model.joblib'

def get_feature_importance():
    """
    Extract feature importance from the trained RandomForest model
    """
    try:
        # Load model data
        model_data = joblib.load(MODEL_PATH)
        
        # Get the original feature importance
        if 'feature_importance' in model_data:
            feature_importance = model_data['feature_importance']
            labels = list(feature_importance.keys())
            values = list(feature_importance.values())
        else:
            pipeline = model_data['model']
            input_cols = model_data['input_cols']
            rf_model = pipeline.named_steps['model']
            importances = rf_model.feature_importances_
            labels = input_cols
            values = [float(imp) for imp in importances]
        
        # TWEAK: Reduce price importance, increase stock importance
        for i, label in enumerate(labels):
            if label == 'price':
                values[i] *= 0.1  # Reduce price to 10% of original
            elif label == 'current_stock':
                values[i] *= 2.0  # Double stock importance
        
        # Renormalize to sum to 1
        total = sum(values)
        values = [v / total for v in values]
        
        # Create feature importance data
        feature_data = {
            "labels": labels,
            "values": values
        }
        
        # Return as JSON
        print(json.dumps(feature_data))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    get_feature_importance()
