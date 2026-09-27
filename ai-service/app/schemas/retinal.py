from pydantic import BaseModel
from typing import List, Optional

class ImageQuality(BaseModel):
    score: float
    usable: bool

class ScreeningResult(BaseModel):
    category: str
    confidence: float

class Location(BaseModel):
    x: int
    y: int
    radius: int

class Finding(BaseModel):
    type: str
    count: int
    confidence: float
    locations: List[Location]

class AnalysisResponse(BaseModel):
    analysisId: str
    imageQuality: ImageQuality
    screeningResult: ScreeningResult
    findings: List[Finding]
    severity: str
    explanation: str
    clinicalNotes: str
    modelVersion: str
    isDemo: bool
