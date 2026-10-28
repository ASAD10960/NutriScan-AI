<div align="center">

# 🥗 NutriScan AI

**Instant, intelligent food recognition and deterministic nutritional analysis right from your meal photos.**

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-00FFFF.svg?logo=yolo&logoColor=white)](https://github.com/ultralytics/ultralytics)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ASAD10960/NutriScan-AI?style=social)](https://github.com/ASAD10960/NutriScan-AI)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

<br />

<!-- PROJECT BANNER / DEMO SCREENSHOT -->
<p align="center">
  <img src="https://raw.githubusercontent.com/ASAD10960/NutriScan-AI/main/nutriscan%2021/runs/nutriscan_food/results.png" alt="NutriScan AI Banner" width="850px" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
</p>

*Snap or upload a photo of your meal to automatically detect food items, display bounding boxes, compute macro/micronutrients, adjust portions, and track long-term nutrition habits.*

</div>

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ System Architecture & Workflow](#️-system-architecture--workflow)
- [🚀 Getting Started & Installation](#-getting-started--installation)
- [💻 Usage Guide](#-usage-guide)
- [📊 Nutritional Catalog & Accuracy](#-nutritional-catalog--accuracy)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License & Acknowledgments](#-license--acknowledgments)

---

## ✨ Key Features

- 📸 **Multi-Modal AI Food Detection**: Hybrid recognition engine combining **YOLOv8** object detection and **MobileNetV3** deep visual classification to detect dishes with spatial bounding boxes.
- 🥗 **Instant Macro & Micro Breakdown**: Real-time deterministic calculation of **calories, protein, carbohydrates, fats, and dietary fiber** scaled accurately to serving sizes.
- 🍛 **Curated Food Catalog**: 70+ common Indian and international dishes with versioned nutritional baselines derived from IFCT 2017 & USDA FoodData Central.
- ⚖️ **Interactive Portion Controls**: Effortlessly tweak gram weights, adjust serving sizes, or swap recognized items directly with instant recalculation.
- 📊 **Trends & Habit Tracking**: Clean, interactive dashboard showing daily calorie progress, macro split percentages, logging streaks, and meal histories.
- 🔒 **Local & Privacy-First**: 100% functional offline with zero cloud telemetry. Your images and personal meal logs remain stored locally in your SQLite database.
- ⚡ **Zero-Build Lightweight UI**: Pure Vanilla HTML5/CSS3/JavaScript SPA with smooth glassmorphism, responsive layout, and dark/light accents—no complex build chains or node_modules needed.

---

## 🛠️ Tech Stack

### **Machine Learning & Vision**
- **[Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics)**: Real-time object detection and spatial bounding box estimation.
- **[PyTorch](https://pytorch.org/) & [TorchVision](https://pytorch.org/vision)**: Deep neural network execution and MobileNetV3 visual classification.
- **[Pillow (PIL)](https://python-pillow.org/)**: Image format decoding, auto-orientation, aspect ratio checks, and quality validation.

### **Backend & Storage**
- **Python Standard Library (3.10+)**: Native multi-threaded HTTP server (`ThreadingHTTPServer`) and robust RESTful API routing.
- **SQLite3**: Lightweight, zero-configuration local database for user sessions, historical meal records, and nutritional logs.
- **Token-based Authentication**: Cryptographic SHA-256 session management and secure bearer token authorization.

### **Frontend & User Interface**
- **HTML5 & Vanilla CSS3**: Hand-crafted modern styling featuring glassmorphic components, micro-animations, and fluid responsive design.
- **Vanilla JavaScript (ES6+)**: Custom reactive state management, asynchronous fetch client, and client-side hash routing.
- **Typography**: Google Fonts (*Plus Jakarta Sans*).

---

## 🏗️ System Architecture & Workflow

NutriScan AI bridges vision processing and nutritional computation through a streamlined sequential pipeline:

```
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│  User Uploads   │ ────> │ Image Preprocessing  │ ────> │ Multi-Modal Vision AI  │
│ Meal Photo /Cam │       │ Quality & Validation │       │ YOLOv8n + MobileNetV3  │
└─────────────────┘       └──────────────────────┘       └───────────┬────────────┘
                                                                     │
                                                                     ▼
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│ Interactive UI  │ <──── │ Nutrition Calculation│ <──── │ Catalog Resolution     │
│ Adjust & Save   │       │ Macros & Energy Split│       │ USDA / IFCT Matching   │
└─────────────────┘       └──────────────────────┘       └────────────────────────┘
```

### Pipeline Details
1. **Validation & Assessment**: Uploaded images are checked for dimensions (128px – 8000px), file size (under 5 MB), brightness, blur, and contrast.
2. **Detection & Spatial Localization**: YOLOv8 locates food items and generates normalized bounding coordinates `[x, y, w, h]`, while MobileNetV3 classifies dish categories.
3. **Deterministic Mapping**: Detected entities are matched against `nutrition_catalog.json`. Foods receive standardized gram estimates and exact nutritional baselines.
4. **State Transitions**: Analyses progress through deterministic states:
   $$\text{ANALYZING} \longrightarrow \text{CALCULATED} \longrightarrow \text{SAVED}$$

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Python 3.10** or higher installed ([Download Python](https://www.python.org/downloads/))
- **Git** installed on your system

### 1. Clone the Repository
```bash
git clone https://github.com/ASAD10960/NutriScan-AI.git
cd NutriScan-AI
```

### 2. Set Up Virtual Environment (Recommended)
```bash
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows (Command Prompt / PowerShell)
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r "nutriscan 21/requirements.txt"
```

### 4. Optional Environment Setup
```bash
# Copy example environment configuration if you wish to customize port or AI engine
cp "nutriscan 21/.env.example" "nutriscan 21/.env"
```

---

## 💻 Usage Guide

### Launching the Application

Run the automated launcher script or start the server directly:

```bash
# Windows
cd "nutriscan 21"
run.bat

# macOS / Linux
cd "nutriscan 21"
chmod +x run.sh
./run.sh

# Or start directly with Python:
python backend/server.py
```

Once initialized, open your browser and visit:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

### Quick Start Walkthrough
1. **Create Account**: Register an account with an email and password (stored locally in SQLite).
2. **Scan Meal**: Navigate to **Scan Meal**, upload a photo (e.g., roast chicken, thali, salad, pizza), or use your camera.
3. **Review Results**: The AI automatically identifies the food, overlays detection boxes, and calculates calories and macros.
4. **Fine-Tune & Save**: Use the portion steppers (`-` / `+`) to adjust grams if needed, select the meal type (*Breakfast, Lunch, Dinner, Snack*), and click **Save Meal**.
5. **Inspect Trends**: View your daily intake and macro distribution under **Nutrition Plan** and **History**.

---

<details>
<summary><b>📊 Nutritional Catalog & Verification (Click to expand)</b></summary>

<br />

All nutritional math is deterministic and reproducible. NutriScan AI uses reference values per 100 grams as served:

| Food Category | Example Catalog Items | Primary Source |
| :--- | :--- | :--- |
| **Breads & Grains** | Roti / Chapati, Naan, Paratha, Steamed Rice, Jeera Rice, Khichdi | IFCT 2017 / USDA |
| **Proteins** | Roasted Chicken, Grilled Chicken, Boiled Egg, Paneer, Tofu | USDA FoodData Central |
| **Curries & Lentils**| Dal Tadka, Dal Makhani, Chole, Rajma, Chicken Curry, Sambar | IFCT 2017 |
| **Quick Meals** | Veg Sandwich, Burger, Pizza, Hakka Noodles, Pasta | Reference Tables |
| **Fruits & Bowls** | Banana, Apple, Orange, Mango, Papaya, Mixed Fruit Bowl | USDA FoodData Central |

> *Note: Nutritional values represent standardized reference data for fitness and awareness, not clinical medical advice.*
</details>

---

<details>
<summary><b>🗺️ Roadmap & Planned Enhancements (Click to expand)</b></summary>

<br />

- [ ] **Multi-item Thali Segmentation**: Improved overlapping item separation using YOLOv8-Seg polygon masks.
- [ ] **Barcode & Packaged Food Scanner**: Camera-based barcode scanner querying Open Food Facts API.
- [ ] **Wearable & Health App Sync**: Exporting daily totals to Apple Health and Google Fit.
- [ ] **Multi-language Support**: Expanding localizations for regional food naming conventions.
- [ ] **Micronutrient Tracking**: Adding vitamins, minerals, and sodium tracking to the daily analytics view.
</details>

---

## 🤝 Contributing

Contributions make the open-source community a powerful place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project (`https://github.com/ASAD10960/NutriScan-AI/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License & Acknowledgments

Distributed under the **MIT License**. See `LICENSE` for more information.

### Acknowledgments
- [Ultralytics](https://github.com/ultralytics/ultralytics) for the YOLOv8 architecture.
- [PyTorch Team](https://pytorch.org/) for TorchVision vision backbones.
- [Indian Food Composition Tables (IFCT)](https://www.nin.res.in/) & [USDA FoodData Central](https://fdc.nal.usda.gov/) for nutritional baselines.
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for the clean typeface.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/ASAD10960">ASAD10960</a> and contributors.</sub>
</div>
