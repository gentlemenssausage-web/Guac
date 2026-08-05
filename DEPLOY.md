# Deploy to GitHub Pages

## Quick Start

1. **Create repo** on GitHub called `guacamole-converter` (or whatever name)

2. **Copy files** into repo root:
   - `index.html`

3. **Push to GitHub**
   ```bash
   git init
   git add index.html
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/guacamole-converter.git
   git push -u origin main
   ```

4. **Enable Pages**:
   - Repo Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Save

5. **Done** — live at `https://YOUR-USERNAME.github.io/guacamole-converter/`

---

## How It Works

- **image upload** — pick any image (cat, building, food, whatever)
- **green shift** — boosts green channel, adds texture noise to make it look like guacamole
- **recipe generation** — creates absurd guacamole recipe using randomized templates

## Customization

### Change the filter effect
Edit the image processing loop in `index.html` (search for "Green shift"):
```javascript
// Currently: r * 0.6 + g * 0.2, etc.
// Try: stronger green boost, add blur, add pixelation
```

### Add more recipe templates
Find `generateRecipe()` and add more steps/ingredients/tools arrays

### Modify colors/styling
CSS is at the top of `<style>` — change hex codes for different vibe

---

## Local Testing

```bash
# Python 3
python -m http.server 8000

# Node (if you have it)
npx http-server
```

Then open `localhost:8000`

---

## What's Inside

- Pure React (via CDN, no build step needed)
- Canvas API for image processing
- All client-side (no server required)
- ~300 lines of code total
