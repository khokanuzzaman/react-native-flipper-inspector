# 📸 Screenshots

Visual showcase of React Native Flipper Inspector features in action.

## Features Showcase

### 1️⃣ Floating Inspector Button

<div align="center">
  <img src="../screenshots/floating-button.png" width="300" alt="Floating Button">
</div>

**Features:**
- 🎨 Professional gradient design (purple to blue)
- 📍 Draggable around the screen
- ✨ Professional shadow effects
- 📳 Haptic feedback on drag
- ⚡ Instant open on tap

**How to Use:**
- **Tap** (< 200ms): Opens inspector
- **Hold & Drag** (> 200ms): Moves button
- Works from any position on screen

---

### 2️⃣ API Inspector Overview

<div align="center">
  <img src="../screenshots/api-inspector-list.png" width="300" alt="API Inspector List">
</div>

**Features:**
- 📊 Real-time API call list
- 🔍 Search across all calls
- ⚡ Response time display
- 📍 Status code visibility
- 🎯 Quick tap to view details

**Shows:**
- GET, POST, PUT, DELETE requests
- API endpoints
- Response status (200, 400, 500, etc.)
- Request/response times
- Timestamps

---

### 3️⃣ API Call Details

<div align="center">
  <img src="../screenshots/api-details.png" width="300" alt="API Call Details">
</div>

**Features:**
- 📋 Full request details
- 📥 Request headers with values
- 📤 Response headers
- 🎨 JSON syntax highlighting with colors
- 📋 Formatted request body
- 💾 Complete response body

**View:**
- URL and method
- All headers (request & response)
- Request body (formatted)
- Response body (with colors)
- Status code
- Timing information

---

### 4️⃣ Search & Highlighting

<div align="center">
  <img src="../screenshots/search-feature.png" width="300" alt="Search Feature">
</div>

**Features:**
- 🔍 Real-time search
- ✨ Match highlighting
- 📊 Match count display
- ⬆️ Previous/Next navigation
- 🎯 Search across URL, headers, body

**Search:**
- Find requests by endpoint
- Search in headers
- Search in request body
- Search in response
- Highlighted matches

---

### 5️⃣ Copy & Export Features

<div align="center">
  <img src="../screenshots/copy-features.png" width="300" alt="Copy Features">
</div>

**Available Actions:**
- 📋 Copy cURL command
- 📝 Copy request headers
- 📝 Copy response headers
- 📄 Copy request body
- 📄 Copy response body
- 💾 Copy as JSON
- 📊 Export all calls (JSON/CSV)

**Quick Copy:**
- Long press on items for quick copy
- Copy to clipboard immediately
- Ready to paste anywhere

---

### 6️⃣ JSON Syntax Highlighting

<div align="center">
  <img src="../screenshots/json-highlighting.png" width="300" alt="JSON Highlighting">
</div>

**Beautiful JSON Rendering:**
- 🎨 Colorful syntax highlighting
- 📊 Nested object support
- 📋 Array formatting
- 🔤 String values in quotes
- 🔢 Number highlighting
- ✓ Boolean values
- ⚠️ Null handling

**Colors:**
- Keys: Blue
- Strings: Green
- Numbers: Red
- Booleans: Purple
- Null: Gray

---

### 7️⃣ Professional Design

<div align="center">
  <img src="../screenshots/design-overview.png" width="300" alt="Professional Design">
</div>

**Design Elements:**
- 🎨 Modern card-based layout
- 📱 Responsive design
- 🌈 Gradient accents
- 📏 Proper spacing & alignment
- 🎯 Clear typography
- ⚡ Smooth animations

---

## Platform Comparison

### Android Features
- 🎨 Native floating button
- 📍 Draggable with physics
- 📳 Haptic vibration feedback
- 🎯 Touch-optimized UI
- ⚡ Fast performance

### iOS Features
- 🎨 React Native button
- 📍 Gesture-based dragging
- 📱 Native feel
- 🎯 Smooth animations
- ⚡ Optimized performance

Both platforms have identical feature support!

---

## How to Capture Your Own Screenshots

### Android Device
```bash
# Take screenshot
adb shell screencap -p /sdcard/screenshot.png

# Pull to computer
adb pull /sdcard/screenshot.png ./screenshots/
```

### Android Emulator
- `Ctrl+F11` - Toggle landscape/portrait
- `Tools > Take Screenshot`

### iOS Simulator
- `Cmd + S` - Takes screenshot
- Saved in `~/Desktop/`

### iOS Device
- `Side button + Volume up`
- Screenshot in Photos app

---

## Tips for Better Screenshots

1. **Use Light Theme**
   - Better visibility in documentation
   - Easier to read code

2. **Clear Data**
   - Remove sensitive information
   - Use dummy/test data

3. **Consistent Size**
   - Keep all screenshots same width
   - Typically 300-500px

4. **Annotate When Helpful**
   - Add arrows to highlight features
   - Use tools like Markup (Mac) or Paint

5. **Include Context**
   - Show the full screen
   - Include status bar when relevant

---

## Adding Screenshots to Your Docs

### Step 1: Take Screenshots
Capture screenshots of each feature

### Step 2: Organize
Place in `/screenshots/` folder:
```
screenshots/
├── floating-button.png
├── api-inspector-list.png
├── api-details.png
├── search-feature.png
├── copy-features.png
└── json-highlighting.png
```

### Step 3: Add to Markdown
Use the template above in your docs

### Step 4: Commit & Push
```bash
git add screenshots/
git commit -m "docs: Add feature screenshots"
git push origin main
```

---

## Markdown Code Used

```markdown
# Basic Image
![Alt Text](../screenshots/image.png)

# With Size
<div align="center">
  <img src="../screenshots/image.png" width="300" alt="Alt Text">
</div>

# Side by Side
<div align="center">
  <img src="../screenshots/image1.png" width="45%" alt="Image 1">
  <img src="../screenshots/image2.png" width="45%" alt="Image 2">
</div>

# With Link
[![Alt Text](../screenshots/image.png)](./other-page.md)
```

---

## File Size Tips

### Compress Images
- Use ImageOptim (Mac)
- Use FileOptimizer (Windows)
- Use online tools like TinyPNG
- Target: < 100KB per image

### Format Selection
- PNG: Best for screenshots (lossless)
- JPEG: For photos only
- WebP: Modern format (limited support)

---

## Next Steps

1. ✅ Capture screenshots from your device
2. ✅ Create `/screenshots/` folder
3. ✅ Add images to folder
4. ✅ Commit and push to GitHub
5. ✅ Update README to link here

Ready to add your screenshots! 📸
