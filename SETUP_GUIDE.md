# Complete Setup Guide - StrokeAware Platform

This guide will help you set up and run the StrokeAware Education Platform on any system.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (version 18.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Package Manager** (choose one):
   - **npm** (comes with Node.js)
   - **yarn**: `npm install -g yarn`
   - **pnpm** (recommended): `npm install -g pnpm`

### Checking Your Installation

Open your terminal/command prompt and run:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

## 🚀 Installation Steps

### Step 1: Extract/Clone the Project

If you have a ZIP file:
1. Extract the ZIP file to a location on your computer
2. Open terminal/command prompt
3. Navigate to the extracted folder:

**Windows:**
```cmd
cd C:\path\to\strokeaware-education-platform
```

**Mac/Linux:**
```bash
cd /path/to/strokeaware-education-platform
```

### Step 2: Install Dependencies

Choose your preferred package manager and run:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm (fastest):**
```bash
pnpm install
```

This will install all required packages. It may take 2-5 minutes depending on your internet speed.

### Step 3: Start the Development Server

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

**Using pnpm:**
```bash
pnpm dev
```

You should see output like:
```
  VITE v6.3.5  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 4: Open in Browser

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. The StrokeAware platform should load!

---

## 🏗️ Building for Production

To create a production-ready build:

**Using npm:**
```bash
npm run build
```

**Using yarn:**
```bash
yarn build
```

**Using pnpm:**
```bash
pnpm build
```

The optimized files will be created in the `dist/` folder.

### Preview Production Build

To test the production build locally:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

---

## 🖥️ System-Specific Instructions

### Windows

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`
   - Type `cmd` or `powershell`
   - Press Enter

2. **Navigate to project folder:**
   ```cmd
   cd C:\Users\YourName\Downloads\strokeaware-education-platform
   ```

3. **Run installation:**
   ```cmd
   npm install
   npm run dev
   ```

### macOS

1. **Open Terminal**
   - Press `Cmd + Space`
   - Type "Terminal"
   - Press Enter

2. **Navigate to project folder:**
   ```bash
   cd ~/Downloads/strokeaware-education-platform
   ```

3. **Run installation:**
   ```bash
   npm install
   npm run dev
   ```

### Linux (Ubuntu/Debian)

1. **Open Terminal**
   - Press `Ctrl + Alt + T`

2. **Navigate to project folder:**
   ```bash
   cd ~/Downloads/strokeaware-education-platform
   ```

3. **Run installation:**
   ```bash
   npm install
   npm run dev
   ```

---

## 🔧 Troubleshooting

### Problem: "npm: command not found" or "node: command not found"

**Solution:** Node.js is not installed or not in PATH
1. Download and install Node.js from https://nodejs.org/
2. Restart your terminal
3. Verify: `node --version`

### Problem: "Port 5173 already in use"

**Solution:** Another application is using port 5173
1. Kill the process using that port, or
2. Vite will automatically use the next available port (check terminal output)

### Problem: Dependencies installation fails

**Solution 1:** Clear cache and reinstall
```bash
# For npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# For yarn
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# For pnpm
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Solution 2:** Try a different package manager
```bash
# If npm fails, try pnpm
npm install -g pnpm
pnpm install
```

### Problem: Permission errors (Mac/Linux)

**Solution:** Use appropriate permissions
```bash
# DON'T use sudo with npm install!
# Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Problem: "Cannot find module 'react'" or similar errors

**Solution:** Dependencies not properly installed
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: Blank page or console errors

**Solution:** Clear browser cache
1. Open browser DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: TypeScript errors

**Solution:** Check for type errors
```bash
npm run lint
```

---

## 📱 Accessing from Mobile Device

To test on your phone/tablet on the same network:

1. Start dev server with host flag:
   ```bash
   npm run dev -- --host
   ```

2. Note the Network URL shown (e.g., `http://192.168.1.100:5173`)

3. Open that URL on your mobile device

---

## 🎨 Customization

### Changing Colors

Edit `/src/styles/theme.css`:
```css
/* Change primary purple color */
--color-purple-600: #9333ea;

/* Change secondary blue color */
--color-blue-600: #2563eb;
```

### Changing Content

- **Courses:** Edit `/src/app/components/TrendingSection.tsx`
- **Categories:** Edit `/src/app/components/CategoriesSection.tsx`
- **Testimonials:** Edit `/src/app/components/TestimonialsSection.tsx`

### Adding New Pages

1. Create a new component in `/src/app/components/`
2. Import and use it in `/src/app/App.tsx`

---

## 📦 Project Structure

```
strokeaware-education-platform/
│
├── src/
│   ├── app/
│   │   ├── components/      # All React components
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   └── ... (other components)
│   │   └── App.tsx          # Main app component
│   │
│   ├── styles/              # CSS files
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   │
│   └── main.tsx             # App entry point
│
├── public/                  # Static files
│   └── favicon.svg
│
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
└── README.md              # Documentation
```

---

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ⚠️ Internet Explorer: Not supported

---

## 💡 Tips for Beginners

1. **Keep the terminal open** while developing - it shows helpful errors
2. **Use Chrome DevTools** (F12) to debug issues
3. **Hot reload is enabled** - save files and see changes instantly
4. **Check the console** if something doesn't work
5. **Read error messages** - they usually tell you what's wrong

---

## 📚 Learning Resources

- **React:** https://react.dev/learn
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite:** https://vitejs.dev/guide/

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Read error messages carefully
3. Check browser console (F12)
4. Verify all prerequisites are installed
5. Try deleting `node_modules` and reinstalling

---

## ✅ Checklist

Before asking for help, ensure you've:

- [ ] Installed Node.js 18.x or higher
- [ ] Navigated to the correct project folder
- [ ] Run `npm install` successfully
- [ ] Checked for error messages
- [ ] Tried the troubleshooting steps
- [ ] Tested in a modern browser (Chrome/Firefox/Safari)

---

**Happy Learning! 🎓**

If everything works, you should see the StrokeAware platform running at http://localhost:5173
