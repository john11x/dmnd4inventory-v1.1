from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Demand Prediction Service")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "demand_model.joblib")
model = None

# Try to load model at startup
try:
    model = joblib.load(MODEL_PATH)
    print("Loaded model from", MODEL_PATH)
except Exception as e:
    print("Failed to load model:", e)
    model = None

class PredictRequest(BaseModel):
    # either send `features` as a 2D list [[f1,f2,...]] or a single flat list
    # or send a mapping {colName: value} matching the model's `input_cols`
    features: object

class PredictResponse(BaseModel):
    predictions: list

@app.get("/health")
def health():
    return {"ok": True, "model_loaded": model is not None}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    # normalize input to 2D; support dict input keyed by input_cols
    try:
        if isinstance(req.features, dict):
            cols = model.get('input_cols') if isinstance(model, dict) and 'input_cols' in model else None
            if not cols:
                raise HTTPException(status_code=400, detail="Model does not expose input_cols; send features as list")
            row = [req.features.get(c, None) for c in cols]
            arr = np.array(row).reshape(1, -1)
        else:
            arr = np.array(req.features)
            if arr.ndim == 1:
                arr = arr.reshape(1, -1)

        # if model is a dict with preprocessing pipeline, use it
        if isinstance(model, dict) and 'model' in model:
            pipeline_model = model['model']
            preds = pipeline_model.predict(arr)
        else:
            preds = model.predict(arr)

        preds_list = [float(p) if hasattr(p, '__float__') else p for p in preds]
        return {"predictions": preds_list}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
