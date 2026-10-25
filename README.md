# Smart Student Portal

A responsive front-end prototype created for an AI-assisted web application project.

## Features
- Dashboard with summary cards and sample attendance overview
- Subject-wise attendance and marks pages
- Weekly timetable with day switching
- Study planner with add, complete, delete, and clear-completed actions
- Rule-based study suggestion generator
- Local storage for study tasks
- Responsive layout for mobile and desktop
- Clearly labelled sample data and demo assistant disclaimer

## Run locally
1. Download and extract the ZIP.
2. Open `index.html` in a modern browser.
3. No build step or package installation is required.

## Publish using GitHub Pages
1. Create a new public repository on GitHub.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for the Pages deployment to finish and open the published URL shown in Settings → Pages.

## Important notes
- All student data is fictional sample data. Do not use it as an official attendance or marks record.
- The study assistant uses built-in rules and does not call a live AI model or external AI API.
- Study tasks are saved in the current browser using `localStorage`; they are not synced between devices.
- Google Fonts requires internet access. The page remains usable without it, using fallback fonts.
