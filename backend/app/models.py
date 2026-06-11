from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class AnalysisRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    followers: int = Field(..., ge=0, le=1_000_000_000)
    following: int = Field(..., ge=0, le=1_000_000_000)
    bio: Optional[str] = Field(default="", max_length=500)
    message: str = Field(..., min_length=3, max_length=3000)

    @field_validator("username")
    @classmethod
    def clean_username(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Username cannot be empty")
        return value

    @field_validator("message")
    @classmethod
    def clean_message(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Message cannot be empty")
        return value


class ScoreBreakdownItem(BaseModel):
    factor: str
    weight: float
    source: str


class UrlFinding(BaseModel):
    url: str
    domain: str
    risk_score: float
    severity: str
    indicators: List[str]
    recommendation: str


class UrlAnalysis(BaseModel):
    urls_found: int = 0
    suspicious_urls: int = 0
    max_url_risk_score: float = 0
    findings: List[UrlFinding] = Field(default_factory=list)


class MLAnalysis(BaseModel):
    label: str
    confidence: float
    risk_score: float
    probabilities: dict
    indicators: List[str] = Field(default_factory=list)


class ProfileAnalysis(BaseModel):
    label: str
    confidence: float
    risk_score: float
    probabilities: dict
    indicators: List[str] = Field(default_factory=list)


class AnalysisResponse(BaseModel):
    risk_score: float
    category: str
    scam_type: Optional[str] = "unknown"
    confidence: Optional[str] = "Low"
    risk_factors: List[str]
    score_breakdown: List[ScoreBreakdownItem] = Field(default_factory=list)
    url_analysis: Optional[UrlAnalysis] = None
    ml_analysis: Optional[MLAnalysis] = None
    profile_analysis: Optional[ProfileAnalysis] = None
    explanation: str
    recommendation: str


class TwinDetectionRequest(BaseModel):
    legitimate_username: str = Field(..., min_length=3, max_length=50)
    suspicious_username: str = Field(..., min_length=3, max_length=50)


class TwinDetectionResponse(BaseModel):
    is_impersonation: bool
    similarity_score: float
    matching_patterns: List[str]
    suspicious_indicators: Optional[List[str]]
    recommendation: str


class SimulationScenario(BaseModel):
    id: int
    title: str
    type: str
    scenario: str
    correct_response: str
    manipulation_tactics: List[str]


class SimulationResponse(BaseModel):
    is_correct: bool
    your_response: str
    correct_response: str
    explanation: str
    tactics_used: List[str]


class DashboardStats(BaseModel):
    total_analyses: int
    high_risk_detected: int
    scam_keywords_tracked: int
    active_users: int