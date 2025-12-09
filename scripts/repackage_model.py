"""Repackage the existing demand_model.joblib (dict with pieces)
into a single sklearn Pipeline that contains a ColumnTransformer
and the estimator, then save as demand_model_pipeline.joblib.

Run from project root:
    python3 scripts/repackage_model.py
"""
import os
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline as SKPipeline

ROOT = os.path.dirname(os.path.dirname(__file__))
MODEL_IN = os.path.join(ROOT, "demand_model.joblib")
MODEL_OUT = os.path.join(ROOT, "demand_model_pipeline.joblib")

if not os.path.exists(MODEL_IN):
    raise SystemExit(f"Input model not found: {MODEL_IN}")

print("Loading input model...")
obj = joblib.load(MODEL_IN)
if not isinstance(obj, dict):
    raise SystemExit("Expected a dict-like joblib with keys: model, imputer, scaler, encoder, input_cols, numeric_cols, categorical_cols")

model = obj.get('model')
imputer = obj.get('imputer')
scaler = obj.get('scaler')
encoder = obj.get('encoder')
input_cols = obj.get('input_cols')
numeric_cols = obj.get('numeric_cols')
categorical_cols = obj.get('categorical_cols')

print('Found keys:', list(obj.keys()))
print('Input cols:', input_cols)
print('Numeric cols:', numeric_cols)
print('Categorical cols:', categorical_cols)

# Build transformers using existing objects where possible
transformers = []
if numeric_cols and (imputer or scaler):
    steps = []
    if imputer:
        steps.append(('imputer', imputer))
    if scaler:
        steps.append(('scaler', scaler))
    if steps:
        num_pipeline = SKPipeline(steps)
        transformers.append(('num', num_pipeline, numeric_cols))

if categorical_cols and encoder:
    # encoder is likely an OrdinalEncoder or similar that accepts 2D array
    transformers.append(('cat', encoder, categorical_cols))

if not transformers:
    raise SystemExit('No transformers could be constructed; aborting')

pre = ColumnTransformer(transformers=transformers, remainder='drop')
full = Pipeline([('preprocessing', pre), ('estimator', model)])

print('Saving new pipeline to', MODEL_OUT)
joblib.dump(full, MODEL_OUT)
print('Saved. Done.')
