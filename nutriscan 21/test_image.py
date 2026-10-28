from ultralytics import YOLO

# 1. Load your newly trained custom model weights
model = YOLO("runs/nutriscan_food/weights/best.pt")

# 2. Provide the exact path to your idli image (e.g., inside your data/uploads folder)
image_path = "dataset/test/images/Thali-51_jpg.rf.d7486b48ecbba3910b87c95f3e23ee39.jpg"  # Replace with your actual image file name

# 3. Run prediction/recognition
results = model(image_path)

# 4. Display results and show detected names/boxes
for result in results:
  print(result.boxes.cls)  # Prints the class IDs detected
  print(result.boxes.conf)  # Prints the confidence scores
  result.show()  # Opens an image window with bounding boxes drawn around the idli