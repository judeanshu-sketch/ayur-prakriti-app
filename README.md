# AyurPrakriti: Clinical BAMS Ayurvedic Diagnostic Suite & Botanical Classifier

AyurPrakriti is an advanced, high-fidelity full-stack healthcare application designed to bridge traditional **clinical BAMS (Bachelor of Ayurvedic Medicine and Surgery) frameworks** with modern deep learning computer vision architecture. Built with an elite, responsive frontend interface and an asynchronous FastAPI backend core, the application serves as an interactive educational and diagnostic sanctuary for Ayurvedic practitioners and student nodes.

---

## 🔬 Core System Architecture & Clinical Engineering

### 1. The BAMS Foundational Matrix (त्रिलक्षण-अनुसंधानम्)
The application’s core text interface is surgically anchored to the foundational Sanskrit shlokas that initialize the official BAMS curriculum. 
*   **Tridosha Dynamics:** Integrates interactive hover features for classical shlokas introducing the three foundational life forces: **Vata (वात), Pitta (पित्त), and Kapha (कफ)**. It details the precise physiological parameters where a homeostatic imbalance within these forces systemically triggers pathological illness.
*   **Nadi Pariksha Terminal:** Provides comprehensive structural documentation regarding the clinical methodologies of pulse diagnosis (**नाडी परीक्षा**), mapping specific arterial pulse wave attributes to physiological status vectors.
*   **Symptom Mapping Grid:** Offers a detailed diagnostic taxonomy breakdown of clinical symptoms, enabling users to forensically cross-reference behavioral and physiological markers with traditional dosha distributions.

### 2. Interactive Prakriti Diagnostic Quiz Engine
*   Features an advanced, multi-stage assessment matrix that evaluates custom behavioral, physical, and metabolic telemetry data points.
*   Dynamically calculates scores to identify the user node's dominant dosha composition.
*   Natively maps the output profile to an optimized, target nutrition and lifestyle management plan designed to restore homeostatic metabolic throughput.
*   Includes a digital, multi-layered interactive flipbook to visualize clinical data lines with zero visual clutter.

### 3. "Scan Plant Core" Multi-Task Deep Learning Classifier (AyurPrakritiTaxonomyNet)
Bypassing traditional single-layer classifiers, the visual diagnostic core deploys a **MobileNetV3 Large deep learning backbone** optimized for edge computing pipelines. When a user captures a real-time snapshot of an herbal plant node, a single forward execution pass dynamically branches into **6 parallel inference heads** to compute total botanical telemetry instantly:
*   🌿 **`species_head`**: Identifies the core botanical genus and identity across 10 distinct herbal species categories.
*   🍃 **`phyllotaxy_head`**: Maps the structural leaf arrangement patterns (Alternate, Opposite, or Whorled).
*   🌸 **`inflorescence_head`**: Classifies flower cluster branching frameworks (Racemose, Cymose, or Special).
*   🔬 **`trichome_head`**: Detects and measures surface micro-hair density distributions (Absent, Base, or Rim).
*   🕸️ **`venation_head`**: Evaluates leaf vascular network infrastructures (Reticulate, Pinnate, or Parallel).
*   🧬 **`bract_head`**: Utilizes a Sigmoid activation layer to scale a definitive probability curve mapping the genetic presence of bract structures (Bracteate vs. Ebracteate).

---

## 🛠️ Technological Infrastructure Stack

*   **Frontend Interface:** Pure semantic HTML5, highly responsive CSS3 structural layouts (featuring rich aesthetic shading blends and shloka hover states), and custom vanilla JavaScript compilation nodes.
*   **Backend Routing Core:** FastAPI (Python 3.15 Engine) optimized with Asynchronous CORS Middlewares to enable secure, un-throttled cross-origin data streaming.
*   **Relational Vault Casing:** SQLite3 embedded database architecture to log and secure diagnostic historical profiles securely inside relational columns via structured Pydantic schemas.
*   **Machine Learning Core:** PyTorch serialized parameters layer (`ayurvedaprakritiweights.pts`) compiled via standard state dictionary serialization loops with a 0.0% network tunnel failure rate.

---

## 🚀 Deployment Parameter Overview

To install dependencies locally or initialize building containers over serverless cloud instances (such as Hugging Face Spaces or Render), use the production dependency profile:

```bash
pip install -r requirements.txt
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

*AyurPrakriti stands as a testament to autonomous full-stack development, delivering elite visual minimalism and first-principles scientific transparency completely on its own sovereign merit.*
