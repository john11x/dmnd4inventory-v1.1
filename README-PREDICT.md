Quick start for the demand prediction service

1. Create a Python 3.10+ venv (recommended):

   python3 -m venv .venv
   source .venv/bin/activate

2. Install requirements:

   pip install -r requirements-predict.txt

3. Run the service:

   uvicorn predict_service:app --reload --host 127.0.0.1 --port 5000

4. Test:

   curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d '{"features": [1,2,3]}'

Adjust the input `features` shape to match your model's expected feature vector.
