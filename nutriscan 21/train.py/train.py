

from pathlib import Path
from ultralytics import YOLO

# Project directory
# train.py is inside the inner train.py folder
PROJECT_DIR = Path(__file__).resolve().parent.parent

# Dataset configuration file
DATA_YAML = PROJECT_DIR / "dataset" / "data.yaml"

# Check whether data.yaml exists
if not DATA_YAML.exists():
    raise FileNotFoundError(
        f"Dataset configuration not found: {DATA_YAML}"
    )

print("Dataset configuration found:", DATA_YAML)

# Load pretrained YOLOv8 nano weights
model = YOLO("yolov8n.pt")

# Train the food detection model
model.train(
    data=str(DATA_YAML),
    epochs=50,
    imgsz=640,
    batch=4,
    workers=0,
    device="cpu",
    project=str(PROJECT_DIR / "runs"),
    name="nutriscan_food",
    patience=10
)

print("Training finished!")
print(
    "Best model:",
    PROJECT_DIR / "runs" / "nutriscan_food" / "weights" / "best.pt"
)
