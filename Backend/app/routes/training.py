from fastapi import APIRouter
from app.ml.risk_model import RiskModel

router = APIRouter()
model = RiskModel()

@router.post("/train")
async def train_model():
    results = await model.train()
    return {
        "status": "training_complete",
        "model_performance": results
    }