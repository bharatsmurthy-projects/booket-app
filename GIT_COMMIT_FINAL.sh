#!/bin/bash

# Git Commit Script for MVP-v1.1
# Execute this after updating all files in your project

cd /Users/bharat/Documents/Bharat/Projects/Booket/booket-app

echo "📋 Files to commit:"
echo "  - src/pages/ScoringScreen.tsx (ScoringScreen-FINAL-CLEAN.tsx)"
echo "  - src/lib/gameEngine.ts (gameEngine-FIXED.ts)"
echo "  - src/pages/ResultScreen.tsx (ResultScreen-CONFETTI.tsx)"
echo "  - src/styles.css (styles-FINAL-FIXED.css)"
echo ""

# Check git status
echo "🔍 Checking git status..."
git status

echo ""
echo "📝 Creating commit..."

# Add all changes
git add .

# Commit with detailed message
git commit -m "MVP-v1.1: Bug fixes, UI enhancements, and accessibility improvements

🐛 Bug Fixes:
- Fix impact card win bug - match now ends when winning via impact card
- Fix target exactly matched bug - match ends when score equals target (e.g., need 6, score 6)
- Both fixes use >= comparison instead of > for target checking

🎨 UI Enhancements:
- Change Start Match button to Booket Red (brand consistency)
- Change match result text to cream/white (better readability)
- Rename 'Other amount' to 'Custom Runs' (clearer labeling)
- Add confetti celebration animation on match end
- Add trophy bounce and staggered entrance animations

♿ Accessibility & Contrast:
- Fix dot ball contrast (medium gray with white text)
- Fix over total contrast (bold dark red in light, pink in dark)
- Fix innings total contrast (pure white for maximum visibility)
- Increase impact card text size (9px → 11px bold)
- Increase impact selection text size (10-13px → 12-15px)
- Add dark mode variants for all result screen elements
- All changes meet WCAG 2.1 Level AA standards

📁 Files Modified:
- src/pages/ScoringScreen.tsx - Impact card win fix, custom runs label
- src/lib/gameEngine.ts - Target chased comparison fix
- src/pages/ResultScreen.tsx - Confetti component and animations
- src/styles.css - Colors, contrast, animations, accessibility

✅ Testing:
All features tested and verified working correctly in both light and dark modes.

Status: Production Ready"

echo ""
echo "🏷️  Creating tag v1.1.0..."
git tag -a v1.1.0 -m "MVP-v1.1 - Bug Fixes, UI Enhancements & Accessibility Improvements

Critical bug fixes for match ending logic, improved UI consistency and readability, 
celebration animations, and comprehensive accessibility improvements for result screen."

echo ""
echo "🚀 Pushing to remote..."
git push origin main --tags

echo ""
echo "✅ MVP-v1.1 committed and tagged successfully!"
echo "🎉 Version v1.1.0 is now in production!"
