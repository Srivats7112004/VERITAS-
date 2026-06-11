# 🧪 VERITAS API Testing Guide

## 📖 Introduction

This guide shows how to test all VERITAS API endpoints using curl commands or Postman.

---

## ✅ Prerequisites

- Backend running on http://localhost:8000
- curl installed (or Postman)
- Valid JSON data

---

## 🔧 Base URL

```
http://localhost:8000
```

---

## 📋 API Endpoints

### 1. Health Check

**Check if API is running**

```bash
curl -X GET http://localhost:8000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "VERITAS API"
}
```

---

### 2. Root Endpoint

**Get API information**

```bash
curl -X GET http://localhost:8000/
```

**Expected Response:**
```json
{
  "message": "VERITAS API - Because Appearances Deceive",
  "version": "1.0.0",
  "endpoints": {
    "docs": "/docs",
    "health": "/api/health",
    "analyze": "POST /api/analyze",
    "twin_detection": "POST /api/twin-detection",
    "simulations": "GET /api/simulations",
    "dashboard": "GET /api/dashboard/stats",
    "deception_graph": "GET /api/deception-graph"
  }
}
```

---

### 3. Analyze Identity 🔍

**Endpoint**: POST /api/analyze  
**Purpose**: Analyze profile for risk assessment

#### Test Case 1: High-Risk Profile

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "username": "@crypto_support_official",
    "followers": 50,
    "following": 5000,
    "bio": "Official Crypto Support Team - Verify Your Account",
    "message": "Your account needs urgent verification! Click here immediately or lose access! Send 1 BTC to confirm: https://bit.ly/verify"
  }'
```

**Expected Response:**
```json
{
  "risk_score": 78,
  "category": "High",
  "risk_factors": [
    "Financial urgency detected (3 phrases)",
    "Action request detected (2 phrases)",
    "Suspicious links detected",
    "Authority claims detected (1 keywords)",
    "Suspicious username structure",
    "Following suspiciously large number of accounts"
  ],
  "explanation": "High risk detected. This profile shows multiple warning signs: Financial urgency detected (3 phrases) Action request detected (2 phrases) ...",
  "recommendation": "⚠️ DO NOT engage with this account. Block it immediately and report for potential fraud/scam activity."
}
```

#### Test Case 2: Medium-Risk Profile

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "username": "@marketing_tips",
    "followers": 500,
    "following": 300,
    "bio": "Digital marketing expert - helping businesses grow",
    "message": "Great opportunity! Limited time offer. Contact us for details."
  }'
```

#### Test Case 3: Low-Risk Profile

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "username": "@john_smith",
    "followers": 1500,
    "following": 800,
    "bio": "Software engineer | Coffee enthusiast | Tech lover",
    "message": "Check out my new blog post about React best practices!"
  }'
```

---

### 4. Twin Detection 👥

**Endpoint**: POST /api/twin-detection  
**Purpose**: Detect impersonation attempts

#### Test Case 1: Clear Impersonation

```bash
curl -X POST http://localhost:8000/api/twin-detection \
  -H "Content-Type: application/json" \
  -d '{
    "legitimate_username": "@instagram",
    "suspicious_username": "@instagram_official"
  }'
```

**Expected Response:**
```json
{
  "is_impersonation": true,
  "similarity_score": 0.855,
  "matching_patterns": [
    "Very similar character sequence",
    "Same username with different separators/numbers"
  ],
  "suspicious_indicators": [
    "Extra underscores for obfuscation",
    "Contains 'official' or 'real' in username"
  ],
  "recommendation": "🚨 LIKELY IMPERSONATION. Report this account immediately..."
}
```

#### Test Case 2: Possible Impersonation

```bash
curl -X POST http://localhost:8000/api/twin-detection \
  -H "Content-Type: application/json" \
  -d '{
    "legitimate_username": "@apple",
    "suspicious_username": "@app1e_"
  }'
```

#### Test Case 3: No Impersonation

```bash
curl -X POST http://localhost:8000/api/twin-detection \
  -H "Content-Type: application/json" \
  -d '{
    "legitimate_username": "@techblog",
    "suspicious_username": "@travelguide"
  }'
```

---

### 5. Get Simulations 🎮

**Endpoint**: GET /api/simulations  
**Purpose**: Get all training scenarios

```bash
curl -X GET http://localhost:8000/api/simulations
```

**Expected Response:**
```json
{
  "scenarios": [
    {
      "id": 1,
      "title": "Crypto Doubling Scam",
      "type": "financial",
      "scenario": "You receive a DM from an account...",
      "correct_response": "Ignore",
      "manipulation_tactics": ["Scarcity - Limited time offer", ...]
    },
    {
      "id": 2,
      "title": "Fake Instagram Support",
      "type": "account_security",
      ...
    },
    ...
  ]
}
```

---

### 6. Submit Simulation Response 📤

**Endpoint**: POST /api/simulations/{scenario_id}/response  
**Purpose**: Submit response to scenario and get feedback

#### Test Case 1: Correct Response

```bash
curl -X POST http://localhost:8000/api/simulations/1/response \
  -H "Content-Type: application/json" \
  -d '{
    "response": "Ignore"
  }'
```

**Expected Response:**
```json
{
  "is_correct": true,
  "your_response": "Ignore",
  "correct_response": "Ignore",
  "explanation": "Great judgment! The correct action was to ignore this message.",
  "tactics_used": [
    "Scarcity - Limited time offer",
    "Urgency - 24 hour deadline",
    ...
  ]
}
```

#### Test Case 2: Incorrect Response

```bash
curl -X POST http://localhost:8000/api/simulations/1/response \
  -H "Content-Type: application/json" \
  -d '{
    "response": "Trust"
  }'
```

---

### 7. Dashboard Statistics 📊

**Endpoint**: GET /api/dashboard/stats  
**Purpose**: Get analytics and statistics

```bash
curl -X GET http://localhost:8000/api/dashboard/stats
```

**Expected Response:**
```json
{
  "total_analyses": 2847,
  "high_risk_detected": 412,
  "scam_keywords_tracked": 156,
  "active_users": 892,
  "risk_distribution": [
    {"name": "Low", "value": 1500, "fill": "#10b981"},
    {"name": "Medium", "value": 935, "fill": "#f59e0b"},
    {"name": "High", "value": 412, "fill": "#ef4444"}
  ],
  "scam_trends": [
    {"month": "Jan", "detections": 120},
    ...
  ],
  "top_scam_types": [
    {"name": "Crypto Scams", "count": 156},
    ...
  ]
}
```

---

### 8. Deception Graph 🕸️

**Endpoint**: GET /api/deception-graph  
**Purpose**: Get network graph data for visualization

```bash
curl -X GET http://localhost:8000/api/deception-graph
```

**Expected Response:**
```json
{
  "nodes": [
    {"id": 1, "label": "Fake Bank Account", "type": "identity", "severity": "high"},
    {"id": 2, "label": "Crypto Scammer", "type": "identity", "severity": "high"},
    ...
  ],
  "edges": [
    {"from": 1, "to": 3},
    {"from": 1, "to": 5},
    ...
  ]
}
```

---

## 🧪 Using Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Create requests manually or paste this environment:

```json
{
  "name": "VERITAS API",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:8000",
      "enabled": true
    },
    {
      "key": "api_url",
      "value": "http://localhost:8000/api",
      "enabled": true
    }
  ]
}
```

### Create Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | {{base_url}}/api/health | Health check |
| POST | {{api_url}}/analyze | Analyze profile |
| POST | {{api_url}}/twin-detection | Detect twin |
| GET | {{api_url}}/simulations | Get scenarios |
| POST | {{api_url}}/simulations/1/response | Submit response |
| GET | {{api_url}}/dashboard/stats | Get stats |
| GET | {{api_url}}/deception-graph | Get graph |

---

## 📝 Common Test Scenarios

### Test Scenario 1: Complete Workflow

1. **Health Check** - Verify API is running
2. **Analyze Identity** - Test with high-risk profile
3. **Twin Detection** - Test impersonation detection
4. **Get Simulations** - Retrieve scenarios
5. **Submit Response** - Test simulation feedback
6. **Dashboard Stats** - Retrieve analytics

### Test Scenario 2: Error Cases

```bash
# Missing required field
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username": "@test"}'  # Missing other fields

# Invalid data type
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "username": "@test",
    "followers": "abc",  # Should be number
    "following": 100,
    "bio": "",
    "message": "test"
  }'

# Empty strings
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "username": "",
    "followers": 0,
    "following": 0,
    "bio": "",
    "message": ""
  }'
```

---

## 🔍 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid data) |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## 🛠️ Debugging Tips

### Check Request Headers
```bash
curl -v -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Pretty Print JSON Response
```bash
curl -X GET http://localhost:8000/api/health | python -m json.tool
```

### Check API is Running
```bash
curl -i http://localhost:8000/api/health
```

### Monitor Requests in Real-time
```bash
# Terminal 1: Run backend
python main.py

# Terminal 2: Make requests
curl http://localhost:8000/api/health
```

---

## 📚 API Response Patterns

### Success Response
```json
{
  "data": {...},
  "status": "success"
}
```

### Error Response
```json
{
  "detail": "Error message",
  "status": "error"
}
```

### Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "Field validation error",
      "type": "value_error"
    }
  ]
}
```

---

## ⏱️ Performance Testing

### Test Response Time
```bash
time curl -X GET http://localhost:8000/api/health
```

### Load Testing (Sequential)
```bash
for i in {1..100}; do
  curl -X GET http://localhost:8000/api/health
done
```

---

## 🔒 Security Testing

- ✅ Input validation works
- ✅ XSS protection (escaping)
- ✅ CORS properly configured
- ✅ No sensitive data in responses
- ✅ Error messages don't leak internals

---

## 📊 Expected Behavior

### Analysis Risk Score Distribution
- 20% Low Risk (0-30)
- 30% Medium Risk (31-60)
- 50% High Risk (61-100)

### Twin Detection Accuracy
- 95%+ accuracy for exact matches
- 85%+ for similar patterns
- 70%+ for slight variations

### Simulation Success Rate
- Beginner: 40-60% correct
- Intermediate: 60-80% correct
- Advanced: 80%+ correct

---

## 💡 Tips

1. **Use Postman** for more complex testing
2. **Check Swagger UI** at `/docs` for live testing
3. **Monitor logs** in backend terminal
4. **Test edge cases** with unusual input
5. **Verify response times** are acceptable

---

## 🚀 Next Steps

1. ✅ Test all endpoints with provided examples
2. ✅ Verify responses match expected format
3. ✅ Test error cases
4. ✅ Monitor performance
5. ✅ Check Swagger UI documentation
6. ✅ Proceed to frontend testing

---

**Happy Testing!** 🎉

For more help, visit the [Swagger UI](http://localhost:8000/docs)
