# Architecture

```text
Frontend (React + Vite)
          │
          ▼
Backend (Express API)
          │
          ▼
Data Cleaning Engine
          │
          ├── Dataset Profiling
          ├── Outlier Detection
          ├── Dashboard Generation
          └── AI Services
                    │
                    ▼
                Groq API
```

### Processing Pipeline

```text
Upload
 ↓
Parse
 ↓
Clean
 ↓
Profile
 ↓
Analyze
 ↓
Visualize
 ↓
Generate Insights
```
