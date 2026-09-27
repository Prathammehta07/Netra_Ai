import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.retinal import AnalysisResponse
from app.services.analyzer import RetinalAnalyzer

app = FastAPI(
    title="Netra AI Retinal AI Microservice",
    version="1.0.0",
    description="AI service for diabetic retinopathy screening and lesion detection."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = RetinalAnalyzer(mode=os.getenv("AI_MODE", "demo"))

@app.get("/")
def read_root():
    return {
        "service": "Netra AI Service",
        "status": "online",
        "mode": analyzer.mode,
        "modelVersion": analyzer.model_version
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "ai_mode": analyzer.mode}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_retinal_image(file: UploadFile = File(...)):
    # File validation
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (jpg, jpeg, png).")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 10MB.")
        
    try:
        result = analyzer.analyze_image(contents, file.filename or "retinal_scan.png")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
