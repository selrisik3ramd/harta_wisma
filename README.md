# 🏠 Harta Wisma - User Guide

Hi! This guide will help you manage and update the **Harta Wisma** application, even if you're not a programmer.

---

## 1. 📝 How to Update Files
To change the text or data in the app:
1. Open the project folder in your code editor (like VS Code).
2. Find the file you want to change (usually in the `src` folder).
3. Type your changes and **Save** the file (`Ctrl + S`).

---

## 2. 💻 How to Run Locally
To see your changes on your computer before they go live:
1. Open your terminal or command prompt.
2. Type this command and press Enter:
   ```bash
   npm run dev
   ```
3. Open your browser and go to: `http://localhost:5173`

---

## 3. ☁️ Sync with GitHub (Save & Share)
To save your work to the cloud and share it with others:

### Get Latest Changes (Pull)
Before you start working, always get the newest version:
```bash
git pull
```

### Save Your Changes (Push)
When you are done with your updates:
1. Add your changes:
   ```bash
   git add .
   ```
2. Write a short note about what you did:
   ```bash
   git commit -m "Update asset list"
   ```
3. Send it to GitHub:
   ```bash
   git push
   ```

---

## 4. 🚀 Deploy to Firebase (Go Live!)
To make your changes visible to everyone at `harta-wisma.web.app`:
1. Prepare the files:
   ```bash
   npm run build
   ```
2. Send to Firebase:
   ```bash
   npx firebase-tools deploy --only hosting
   ```

---

### 💡 Tips
- If a command doesn't work, try adding `.cmd` (e.g., `npm.cmd run dev`).
- Make sure you are in the `Harta Wisma` folder in your terminal!
