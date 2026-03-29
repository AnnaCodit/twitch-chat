# Twitch Chat Overlay - Project Overview

## 🎯 Project Purpose
**Twitch Chat Overlay** for OBS streaming. Displays Twitch chat messages on stream with a **retro terminal/hacker aesthetic** (green-on-black, CRT effects). Built using **StreamElements** integration.

## 📁 Project Structure
```
twitch-chat/
├── index.html          # Main HTML structure
├── style.css           # Terminal-style CSS (VT323 font, CRT scanlines, green glow)
├── agents.md           # This file - AI agent reference
├── js/
│   ├── main.js         # Core logic: StreamElements integration, TypeIt animation, avatar caching
│   └── local-testing.js # Spacebar testing mode (simulate chat messages)
└── .gitignore
```

## 🎨 Visual Style
- **Font**: `VT323` (terminal monospace from Google Fonts)
- **Colors**: Neon green (`#39ff14`) on dark background (`#0a0a0a`)
- **Effects**: 
  - CRT scanlines (via `::before` pseudo-element)
  - Green glow/shadows
  - Avatar filters (sepia + hue-rotate for terminal look)
  - Typing animation with block cursor (`█`)
- **Background**: Path of Exile-themed (filterblade.xyz)

## ⚙️ Key Features

### StreamElements Integration (`main.js`)
- Listens for `onEventReceived` custom event (StreamElements widget event)
- Event structure: `obj.detail.event.data` contains `nick`, `displayName`, `renderedText`, `badges`
- Renders chat messages as floating boxes with random screen positions

### Message Rendering
1. **Avatar caching**: Uses `ivr.fi` Twitch API, caches up to 100 users (LRU eviction)
2. **TypeIt animation**: Types message text character-by-character (30ms speed, HTML-enabled)
3. **Auto-remove**: Messages fade out 5s after typing completes (first message: paused)
4. **Random positioning**: X: 0 to (screenWidth - 450px), Y: random vertical placement

### Testing Mode (`local-testing.js`)
- Press **Spacebar** to spawn test messages
- Uses real Twitch users (forsen, shroud, lirik) for avatar API testing
- Includes sample messages with 7TV emotes

## 🔧 Dependencies
- **TypeIt** (v8.8.7): Typing animation library (loaded via CDN in `index.html`)
- **ivr.fi API**: Twitch user avatar lookup (`GET /v2/twitch/user?login={username}`)
- **7TV CDN**: Fallback avatar/emote images

## 📝 Key Variables (`main.js`)
```javascript
pauseFirstMessage = true   // Don't auto-remove first message
maxCacheSize = 100         // Avatar cache limit
userCache = Map()          // LRU cache for avatars
messagesCount = 0          // Track message count
```

## 🎯 For AI Agents
When modifying this project:
1. **Preserve terminal aesthetic**: Keep green colors, CRT effects, VT323 font
2. **StreamElements compatibility**: Don't break `onEventReceived` event handler
3. **TypeIt integration**: Message text must use TypeIt for typing animation
4. **Avatar caching**: Maintain LRU cache to avoid API rate limits
5. **Testing**: Use spacebar in `local-testing.js` for quick iteration without StreamElements

## 🚀 Usage in OBS
1. Add as **Browser Source** in OBS
2. Set resolution to match stream (e.g., 1920x1080)
3. Enable "Shutdown source when not visible"
4. Configure StreamElements widget to send chat events to this overlay
