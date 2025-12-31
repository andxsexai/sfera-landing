# SFERA AI Carousel Generator - QUICK START GUIDE

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 16+ (https://nodejs.org)
- Git installed
- OpenAI API Key: sk-aa0a7af28b774479b85d3efb90269e90

### Step 1: Clone & Install
```bash
git clone https://github.com/andxsexai/sfera-landing.git
cd sfera-landing
cd backend
npm install
```

### Step 2: Configure Environment
Create `.env` file in `backend/` folder:
```
OPENAI_API_KEY=sk-aa0a7af28b774479b85d3efb90269e90
PORT=3000
NODE_ENV=development
```

### Step 3: Create Missing Route Files

#### `backend/routes/templates.js`
```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Sample template database
const TEMPLATES = [
  {
    id: 1,
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    category: "stories",
    preset: "instagram_story"
  },
  {
    id: 2,
    name: "TikTok Video",
    width: 1080,
    height: 1920,
    category: "video",
    preset: "tiktok"
  },
  {
    id: 3,
    name: "Carousel Post",
    width: 1080,
    height: 1350,
    category: "carousel",
    preset: "carousel"
  }
];

router.get('/all', (req, res) => {
  res.json({
    success: true,
    templates: TEMPLATES,
    count: TEMPLATES.length
  });
});

router.get('/:id', (req, res) => {
  const template = TEMPLATES.find(t => t.id === parseInt(req.params.id));
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json({ success: true, template });
});

router.get('/category/:category', (req, res) => {
  const filtered = TEMPLATES.filter(t => t.category === req.params.category);
  res.json({
    success: true,
    templates: filtered,
    count: filtered.length
  });
});

module.exports = router;
```

#### `backend/routes/chat.js`
```javascript
const express = require('express');
const router = express.Router();
const { generateCarouselWithAI } = require('../services/openai');

router.post('/generate', async (req, res) => {
  try {
    const { prompt, templateId, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const aiResponse = await generateCarouselWithAI(prompt, {
      templateId,
      style: style || 'modern'
    });

    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('Chat generation error:', error);
    res.status(500).json({
      error: 'Failed to generate carousel',
      details: error.message
    });
  }
});

router.post('/suggest', async (req, res) => {
  try {
    const { topic, context } = req.body;

    const suggestion = await generateCarouselWithAI(
      `Generate 5 creative carousel ideas for: ${topic}. Context: ${context || 'General'}`,
      { style: 'suggestions' }
    );

    res.json({
      success: true,
      suggestions: suggestion
    });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

module.exports = router;
```

#### `backend/routes/gallery.js`
```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// In-memory gallery storage (replace with database later)
const gallery = [];
let galleryId = 0;

router.post('/save', async (req, res) => {
  try {
    const { title, content, templateId, aiPrompt, imageData } = req.body;

    const item = {
      id: ++galleryId,
      title,
      content,
      templateId,
      aiPrompt,
      imageData,
      createdAt: new Date().toISOString(),
      likes: 0,
      shared: false
    };

    gallery.push(item);

    res.json({
      success: true,
      message: 'Carousel saved to gallery',
      id: item.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const items = gallery.slice(offset, offset + limit);

  res.json({
    success: true,
    items,
    total: gallery.length,
    limit,
    offset
  });
});

router.get('/:id', (req, res) => {
  const item = gallery.find(g => g.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }
  res.json({ success: true, item });
});

router.post('/:id/like', (req, res) => {
  const item = gallery.find(g => g.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  item.likes++;
  res.json({ success: true, likes: item.likes });
});

router.delete('/:id', (req, res) => {
  const index = gallery.findIndex(g => g.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  gallery.splice(index, 1);
  res.json({ success: true, message: 'Item deleted' });
});

module.exports = router;
```

### Step 4: Update `backend/server.js`
Add these imports at the top:
```javascript
const templatesRouter = require('./routes/templates');
const chatRouter = require('./routes/chat');
const galleryRouter = require('./routes/gallery');
```

Add these before `app.listen()`:
```javascript
app.use('/api/templates', templatesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/gallery', galleryRouter);
```

### Step 5: Start Backend
```bash
node backend/server.js
```

You should see:
```
✅ Server running on http://localhost:3000
✅ OpenAI service initialized
```

### Step 6: Open Frontend
Open `app.html` in your browser or serve it:
```bash
# In project root directory
python3 -m http.server 8000
# Visit: http://localhost:8000/app.html
```

## 📱 Usage

### Generate Carousel
1. Type prompt in chat: "Create a carousel about [topic]"
2. Select template (optional)
3. Click Generate
4. Preview in gallery

### Examples
- "Create 5-slide carousel about healthy breakfast ideas"
- "Generate Instagram story carousel for my AI newsletter"
- "Design TikTok carousel about web development tips"

## 🔧 API Endpoints

### Templates
- `GET /api/templates/all` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `GET /api/templates/category/:category` - Get templates by category

### Chat & Generation
- `POST /api/chat/generate` - Generate carousel from prompt
  ```json
  {
    "prompt": "Create carousel about...",
    "templateId": 1,
    "style": "modern"
  }
  ```

### Gallery
- `GET /api/gallery/all` - Get all saved carousels
- `POST /api/gallery/save` - Save carousel
- `POST /api/gallery/:id/like` - Like item
- `DELETE /api/gallery/:id` - Delete item

## 🐛 Troubleshooting

**Port 3000 already in use:**
```bash
kill -9 $(lsof -t -i :3000)
# Or change PORT in .env file
```

**OpenAI API error:**
- Check API key is correct: sk-aa0a7af28b774479b85d3efb90269e90
- Check you have API credits
- Check internet connection

**CORS errors:**
Ensure frontend and backend are on correct ports (8000 and 3000)

## 📚 Next Steps

1. **Add Pinterest Integration**
   - Use Pinterest API for template inspirations
   - Store popular carousel designs

2. **Database Setup**
   - Replace in-memory storage with MongoDB/PostgreSQL
   - Add user authentication

3. **Deploy**
   - Heroku: `git push heroku main`
   - Vercel: Frontend only (use API endpoint)
   - Railway: Full stack deployment

## 🎯 Feature Roadmap
- ✅ Basic carousel generation
- ✅ Template system
- ✅ Gallery storage
- ⏳ Pinterest integration
- ⏳ User accounts
- ⏳ Export to Canva/Gamma
- ⏳ Monetization (premium templates)

## 📞 Support
Check GitHub Issues: https://github.com/andxsexai/sfera-landing/issues
