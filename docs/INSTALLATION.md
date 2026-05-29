# Installation

## Clone Repository

```bash
git clone <repository-url>
cd AutoViz
```

## Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
GROQ_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

## Frontend Setup

```bash
cd client
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```
