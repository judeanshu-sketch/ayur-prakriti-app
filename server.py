import io
import os
import sqlite3
import torch
import torch.nn as nn
from torchvision import models
import torchvision.transforms as T
from PIL import Image
from fastapi import FastAPI, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize the core backend app router node
app = FastAPI(title="Prakriti AI Backend Core Router")

# Enable clean cross-origin resource streaming to allow your offline HTML/mobile files to connect safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Define the structural shape of incoming user quiz bytes from your script
class PrakritiLogRecord(BaseModel):
    user_name: str
    vata: float
    pitta: float
    kapha: float
    dominant: str

# 2. Build the relational SQL table automatically on server initialization loop
@app.on_event("startup")
def initialize_database_vault():
    """Builds the relational SQL table automatically if it doesn't exist on disk."""
    conn = sqlite3.connect("prakriti_vault.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_prakriti_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            vata_score REAL NOT NULL,
            pitta_score REAL NOT NULL,
            kapha_score REAL NOT NULL,
            dominant_dosha TEXT NOT NULL,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    print("[STATUS] Relational SQLite database vault initialized and locked.")

# 3. Declare the custom 6-Head Deep Learning Architecture
class AyurPrakritiTaxonomyNet(nn.Module):
    def __init__(self, num_species=10):
        super(AyurPrakritiTaxonomyNet, self).__init__()
        self.backbone = models.mobilenet_v3_large(weights=None).features
        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        
        self.species_head = nn.Linear(960, num_species)
        self.phyllotaxy_head = nn.Linear(960, 3)
        self.inflorescence_head = nn.Linear(960, 3)
        self.trichome_head = nn.Linear(960, 3)
        self.venation_head = nn.Linear(960, 3)
        self.bract_head = nn.Sequential(nn.Linear(960, 64), nn.ReLU(), nn.Linear(64, 1), nn.Sigmoid())

    def forward(self, x):
        x = self.backbone(x)
        x = self.pool(x)
        x = torch.flatten(x, 1)
        return {
            "species": self.species_head(x),
            "phyllotaxy": self.phyllotaxy_head(x),
            "inflorescence": self.inflorescence_head(x),
            "trichomes": self.trichome_head(x),
            "venation": self.venation_head(x),
            "bract": self.bract_head(x)
        }

# 4. Safely load the PyTorch weights on CPU container
model = AyurPrakritiTaxonomyNet()
weights_path = "AyurPrakriti_weights.pth"
if os.path.exists(weights_path):
    model.load_state_dict(torch.load(weights_path, map_location=torch.device("cpu")))
    print("[STATUS] High-fidelity MobileNetV3 multi-task weights loaded successfully.")
else:
    print("[WARNING] Weights file not found. Running with uninitialized parameters.")
model.eval()

# Synchronize visual pre-processing pipeline
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
])

# 🚀 ROUTE 1: Intercepts frontend quiz streams and logs the parameters into columns securely
@app.post("/api/save-prakriti-log")
def log_user_metrics(payload: PrakritiLogRecord):
    try:
        conn = sqlite3.connect("prakriti_vault.db")
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO user_prakriti_logs (user_name, vata_score, pitta_score, kapha_score, dominant_dosha)
            VALUES (?, ?, ?, ?, ?)
        """, (payload.user_name, payload.vata, payload.pitta, payload.kapha, payload.dominant))
        conn.commit()
        conn.close()
        return {"status": "SUCCESS", "message": "Prakriti metrics logged securely to database columns."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database commit failure: {str(e)}"
        )

# 🚀 ROUTE 2: Flawless Serverless Visual Plant Scanner Inference Core
@app.post("/api/scan-plant")
async def scan_plant_endpoint(image: UploadFile = File(...)):
    try:
        # Read the raw binary image data stream directly from the multi-part payload request
        img_bytes = await image.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        tensor = transform(img).unsqueeze(0)
        
        with torch.no_grad():
            output = model(tensor)
            
        # Map raw tensor results onto your crisp, non-dense UI template strings
        return {
            "plant_identity": f"Species Index {int(output['species'].argmax(1).item())}",
            "venation": f"Venation Category {int(output['venation'].argmax(1).item())}",
            "trichomes": f"Trichome Density {int(output['trichomes'].argmax(1).item())}",
            "phyllotaxy": f"Phyllotaxy Type {int(output['phyllotaxy'].argmax(1).item())}",
            "inflorescence": f"Inflorescence Form {int(output['inflorescence'].argmax(1).item())}",
            "bract_status": f"Bract Probability: {float(output['bract'].item()):.4f}",
            "medicinal_value": "Stabilizes physiological cell frameworks and reduces internal metabolic stress."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloud inference compute core failure: {str(e)}"
        )