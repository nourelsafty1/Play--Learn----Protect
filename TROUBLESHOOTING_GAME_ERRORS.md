# Troubleshooting Game Errors After Merge

## Common Issues When Games Don't Work After Merge

### 1. **Missing GameWrapper Component** ⚠️
**Problem:** The `GameWrapper` component might not exist in main branch.

**Check:**
- File should exist at: `frontend/src/components/games/GameWrapper.js`
- If missing, copy from Muna branch

**Fix:**
```bash
# Make sure this file exists:
frontend/src/components/games/GameWrapper.js
```

### 2. **GameWrapper Not Imported in GameDetailPage** ⚠️
**Problem:** `GameDetailPage.js` might not import GameWrapper.

**Check:**
```javascript
// Should have this import:
import GameWrapper from '../components/games/GameWrapper';
```

**Fix:** Add the import if missing.

### 3. **Games Folder Missing or Wrong Location** ⚠️
**Problem:** Games might not be in the correct location.

**Check:**
- Games should be in: `frontend/public/games/`
- NOT in: `frontend/src/games/` or `frontend/games/`

**Verify:**
```bash
# Should see these files:
frontend/public/games/math-addition-game.html
frontend/public/games/english-word-game.html
frontend/public/games/coding-sequence-game.html
frontend/public/games/physics-forces-game.html
frontend/public/games/chemistry-elements-game.html
frontend/public/games/creative-art-game.html
frontend/public/games/coding-challenge-advanced.html
```

### 4. **Database gameType Not Set** ⚠️
**Problem:** Games in database might not have `gameType: 'self-hosted'`

**Check in MongoDB:**
```javascript
db.games.find({}, { title: 1, gameUrl: 1, gameType: 1 })
```

**Fix:**
```javascript
// Update all games to self-hosted
db.games.updateMany(
  { gameType: { $exists: false } },
  { $set: { gameType: 'self-hosted' } }
)

// Or update specific games
db.games.updateMany(
  {},
  { $set: { gameType: 'self-hosted' } }
)
```

### 5. **Game URLs Wrong in Database** ⚠️
**Problem:** Game URLs might be absolute URLs instead of relative paths.

**Check:**
- URLs should be: `/games/math-addition-game.html`
- NOT: `http://localhost:3000/games/...` or `https://...`

**Fix:**
```javascript
// Update game URLs
db.games.updateMany(
  { gameUrl: { $regex: /^https?:\/\// } },
  [
    {
      $set: {
        gameUrl: {
          $concat: [
            "/games/",
            {
              $arrayElemAt: [
                { $split: [{ $arrayElemAt: [{ $split: ["$gameUrl", "/"] }, -1] }, "?"] },
                0
              ]
            }
          ]
        }
      }
    }
  ]
)
```

### 6. **React Router Blocking Static Files** ⚠️
**Problem:** React Router might be intercepting `/games/*` routes.

**Check:** Make sure games are served from `public` folder (they should be automatically).

**Fix:** Games in `public/games/` are served at root level, so `/games/file.html` should work.

### 7. **Iframe Loading Error** ⚠️
**Problem:** Browser console might show CORS or loading errors.

**Check Browser Console:**
- Open DevTools (F12)
- Look for errors when clicking "Play Now"
- Check Network tab for failed requests

**Common Errors:**
- `404 Not Found` → Game file missing
- `CORS error` → Shouldn't happen for same-origin
- `Failed to load` → Check file path

### 8. **Missing Dependencies** ⚠️
**Problem:** Frontend might be missing dependencies.

**Fix:**
```bash
cd frontend
npm install
```

### 9. **Frontend Not Serving Static Files** ⚠️
**Problem:** React dev server might not be serving public folder correctly.

**Check:**
- Make sure you're running `npm start` from `frontend` folder
- Try accessing game directly: `http://localhost:3000/games/math-addition-game.html`
- If 404, the public folder isn't being served

**Fix:**
- Restart frontend server
- Check `frontend/package.json` has correct scripts

### 10. **GameDetailPage Logic Missing** ⚠️
**Problem:** `GameDetailPage.js` might not have the logic to show GameWrapper.

**Check:**
```javascript
// Should have this check:
if (showGameWrapper && game && (game.gameType === 'self-hosted' || !game.gameType)) {
  return <GameWrapper ... />
}
```

## Quick Diagnostic Checklist

Run these checks:

1. ✅ **Games folder exists?**
   ```bash
   ls frontend/public/games/
   ```

2. ✅ **GameWrapper component exists?**
   ```bash
   ls frontend/src/components/games/GameWrapper.js
   ```

3. ✅ **GameDetailPage imports GameWrapper?**
   ```bash
   grep "GameWrapper" frontend/src/pages/GameDetailPage.js
   ```

4. ✅ **Database has gameType set?**
   ```javascript
   db.games.findOne({}, { gameType: 1, gameUrl: 1 })
   ```

5. ✅ **Can access game directly?**
   - Open: `http://localhost:3000/games/math-addition-game.html`
   - Should load the game HTML

6. ✅ **Check browser console for errors?**
   - F12 → Console tab
   - Look for red errors

## Most Likely Issues

Based on merge scenarios, most common problems are:

1. **GameWrapper component missing** (50% chance)
2. **gameType not set in database** (30% chance)
3. **Games folder in wrong location** (15% chance)
4. **GameDetailPage missing import** (5% chance)

## Quick Fix Script

If you have MongoDB access, run this to fix database issues:

```javascript
// Connect to database
use play-learn-protect

// Fix gameType
db.games.updateMany(
  {},
  { $set: { gameType: 'self-hosted' } }
)

// Fix game URLs (if they're absolute)
db.games.find({ gameUrl: { $regex: /^\/games\// } }).forEach(function(game) {
  // URLs starting with /games/ are correct
  print("Game: " + game.title + " - URL: " + game.gameUrl);
})

// Check for external URLs
db.games.find({ gameUrl: { $regex: /^https?:\/\// } }).forEach(function(game) {
  print("WARNING: " + game.title + " has external URL: " + game.gameUrl);
})
```

## What to Tell Your Teammate

Ask them to check:

1. **Does this file exist?**
   - `frontend/src/components/games/GameWrapper.js`

2. **Does GameDetailPage import it?**
   - Open `frontend/src/pages/GameDetailPage.js`
   - Look for: `import GameWrapper from '../components/games/GameWrapper';`

3. **What error do they see?**
   - Browser console (F12)
   - Network tab
   - Exact error message

4. **Can they access game directly?**
   - Try: `http://localhost:3000/games/math-addition-game.html`
   - Does it load?

5. **Check database:**
   ```javascript
   db.games.findOne({}, { title: 1, gameType: 1, gameUrl: 1 })
   ```
   - Is `gameType` set to `'self-hosted'`?
   - Does `gameUrl` start with `/games/`?

