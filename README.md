# 🎨 SFERA - AI Carousel Generator Platform

## Project Overview

Complete AI-powered carousel generator with:
- ✨ AI Chat Interface for template generation
- 📚 Template Gallery with design database
- 📌 Pinterest Integration for design inspiration
- 🤖 Neural Network Template Generator
- 💾 Backend API & Database

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Vue.js/React)         │
│  ├─ Chat Interface Component            │
│  ├─ Template Gallery                    │
│  └─ Preview/Export Module               │
└────────────┬────────────────────────────┘
             │ HTTP/WebSocket
┌────────────▼────────────────────────────┐
│      Backend API (Node.js/Python)       │
│  ├─ Express/FastAPI Server              │
│  ├─ OpenAI/Claude Integration           │
│  ├─ Pinterest API Integration           │
│  └─ Template Engine                     │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│    Database (MongoDB/Supabase)          │
│  ├─ Templates Collection                │
│  ├─ User History                        │
│  ├─ Pinterest Cache                     │
│  └─ Design Tokens                       │
└─────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
sfera-landing/
├── index.html                 # Landing page
├── app.html                   # Main application
├── styles/
│   ├── main.css              # Main styles
│   ├── chat.css              # Chat interface
│   └─ gallery.css             # Template gallery
├── js/
│   ├── app.js                # Main app logic
│   ├── chat.js               # Chat handler
│   ├── gallery.js            # Gallery manager
│   └── api.js                # API client
├── backend/
│   ├── server.js             # Node.js server
│   ├── routes/
│   │   ├── templates.js      # Template endpoints
│   │   ├── chat.js           # Chat endpoints
│   │   └── pinterest.js      # Pinterest endpoints
│   ├── services/
│   │   ├── openai.js         # OpenAI service
│   │   ├── pinterest.js      # Pinterest service
│   │   └── template-gen.js   # Template generator
│   └── models/
│       ├── Template.js       # Template schema
│       └── User.js           # User schema
├── templates/
│   ├── carousel-minimal.html
│   ├── carousel-modern.html
│   └── carousel-gradient.html
└── .env                      # Environment variables
```

---

## 🚀 Quick Start (Setup Instructions)

### 1. Clone Repository
```bash
git clone https://github.com/andxsexai/sfera-landing.git
cd sfera-landing
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Install key packages
npm install express cors dotenv axios openai mongodb
```

### 3. Environment Setup
Create `.env` file:
```env
# OpenAI/Claude
OPENAI_API_KEY=sk-your-key-here
CLAUDE_API_KEY=your-claude-key

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sfera
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-key

# Pinterest
PINTEREST_ACCESS_TOKEN=your-token

# Server
PORT=3000
NODE_ENV=development
```

### 4. Run Server
```bash
cd backend
node server.js
```

### 5. Open Frontend
```
http://localhost:3000/app.html
```

---

## 💬 Chat Interface Features

### Example Prompts:
```
- "Create a minimal carousel for Instagram with 5 frames"
- "Generate a modern product showcase template"
- "Design a carousel in cyberpunk style with neon colors"
- "Make a carousel template for real estate business"
- "Create 3 variations of carousel designs for fashion brand"
```

### Response Format:
```json
{
  "id": "template_12345",
  "name": "Minimal Instagram Carousel",
  "html": "<div class='carousel'>...</div>",
  "css": ".carousel { ... }",
  "thumbnail": "data:image/png;base64,...",
  "frames": 5,
  "style": "minimal",
  "tags": ["instagram", "minimal", "modern"]
}
```

---

## 📸 Template Gallery Features

- Browse pre-made templates
- Filter by style, industry, purpose
- Search functionality
- Preview before download
- One-click export as HTML/CSS
- Instagram size presets (1080x1920, 1080x1350)

---

## 📌 Pinterest Integration

### Automatic Design Mining:
```javascript
// Fetch trending carousel designs from Pinterest
GET /api/pinterest/trending?category=social_media

// Response includes:
- Image URLs
- Design descriptions  
- Color palettes
- Layout structures
- Trending keywords
```

### Implementation:
- Automated scraper for design inspiration
- Color palette extraction
- Layout analysis
- Database caching

---

## 🤖 AI Template Generator

### How It Works:

1. **User Input**: "Create a carousel for coffee shop"
2. **Processing**:
   - Analyze prompt with NLP
   - Extract style/purpose/brand requirements
   - Query template database
   - Generate variations with AI
3. **Output**: 
   - Multiple design options
   - Customizable HTML/CSS
   - Preview renderings

### Sample Generation:
```python
# backend/services/template-gen.js
const generateTemplate = async (prompt) => {
  const analysis = await analyzePrompt(prompt);
  const baseTemplate = findSimilarTemplate(analysis);
  const enhanced = await enhanceWithAI(baseTemplate, analysis);
  return formatOutput(enhanced);
}
```

---

## 📦 API Endpoints

### Templates
```
GET  /api/templates              # List all templates
GET  /api/templates/:id          # Get template details
POST /api/templates              # Create new template
PUT  /api/templates/:id          # Update template
DEL  /api/templates/:id          # Delete template
```

### Chat
```
POST /api/chat                   # Send message to AI
GET  /api/chat/history           # Get chat history
WS   /api/chat/stream            # WebSocket for live generation
```

### Gallery
```
GET  /api/gallery/featured       # Featured templates
GET  /api/gallery/search?q=...   # Search templates
GET  /api/gallery/categories     # List categories
```

### Pinterest
```
GET  /api/pinterest/trending     # Trending designs
GET  /api/pinterest/search?q=... # Search Pinterest
POST /api/pinterest/sync         # Sync new designs
```

---

## 💾 Database Schema

### Templates Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  html: String,
  css: String,
  preview: String,          // Base64 image
  category: String,         // minimal, modern, gradient, etc.
  industry: String,         // fashion, tech, cafe, etc.
  frames: Number,
  colors: [String],         // Hex colors used
  tags: [String],
  downloadCount: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: Date,
  aiGenerated: Boolean,
  prompt: String            // Original AI prompt
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  username: String,
  favorites: [ObjectId],    // Template IDs
  history: [ObjectId],      // Generated templates
  apiKey: String,
  plan: String,             // free, pro, premium
  createdAt: Date
}
```

---

## 🎯 Implementation Roadmap

### Phase 1 (Week 1-2): Core Backend
- [ ] Setup Express server
- [ ] Database connection
- [ ] Template API endpoints
- [ ] OpenAI integration
- [ ] Basic template storage

### Phase 2 (Week 3): Chat & AI
- [ ] Chat interface
- [ ] Prompt processing
- [ ] Template generation with AI
- [ ] WebSocket streaming
- [ ] Real-time preview

### Phase 3 (Week 4-5): Gallery & Pinterest
- [ ] Template gallery UI
- [ ] Search & filters
- [ ] Pinterest API integration
- [ ] Design mining automation
- [ ] Cache management

### Phase 4 (Week 6): Polish & Deploy
- [ ] Performance optimization
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Testing
- [ ] Production deployment

---

## 🔑 Key Technologies

- **Frontend**: HTML5, CSS3, Vue.js/React, WebSocket
- **Backend**: Node.js, Express.js, Python FastAPI
- **Database**: MongoDB, Supabase
- **AI**: OpenAI API, Claude API
- **External**: Pinterest API, Axios
- **Deployment**: GitHub Pages (Frontend), Heroku/Railway (Backend)

---

## 📝 License

MIT

---

**Happy Creating! 🎨✨**
