# 🧠 StrokeAware - Brain Stroke Education Platform

A Netflix-style education platform for brain stroke awareness, built with **pure HTML, CSS, and JavaScript** - no frameworks required!

![StrokeAware Platform](https://images.unsplash.com/photo-1767378262839-9d615a266ad3?w=1200&h=400&fit=crop)

---

## ✨ Features

### 🎨 **Netflix-Style Interface**
- Purple/blue gradient theme throughout
- Smooth animations and transitions
- Curved separators between sections
- Professional, modern design

### 🎬 **Interactive Components**
- **Video Carousel** - Horizontal scrolling with hover effects
- **Featured Video Player** - Large hero video section
- **Progress Tracking** - Animated progress bars with shimmer effects
- **Category Grid** - 6 medical education categories
- **Testimonials** - Auto-rotating student reviews
- **Sign-In Modal** - Smooth modal with backdrop blur

### 📱 **Fully Responsive**
- Desktop, tablet, and mobile optimized
- Mobile menu with smooth animations
- Touch-friendly interface
- Responsive grid layouts

### 🎯 **Pure Vanilla JavaScript**
- No React, no Vue, no frameworks
- No build tools required
- No npm dependencies
- Just open and run!

---

## 🚀 Quick Start

### Option 1: Double-Click (Easiest!)

1. **Extract the ZIP file** to a folder
2. **Double-click `index.html`**
3. **Done!** Opens in your default browser

### Option 2: Live Server (Recommended for Development)

If you use VS Code:

1. Install the **Live Server** extension
2. Right-click on `index.html`
3. Select **"Open with Live Server"**
4. Browser opens automatically at `http://localhost:5500`

### Option 3: Python Simple Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

---

## 📁 Project Structure

```
StrokeAware-education-platform/
│
├── index.html              # Main HTML file
│
├── styles/
│   ├── main.css           # Core styles & variables
│   ├── components.css     # Component-specific styles
│   ├── animations.css     # All animations
│   └── responsive.css     # Mobile responsiveness
│
├── scripts/
│   ├── data.js           # Course & content data
│   └── main.js           # All JavaScript functionality
│
└── README.md             # This file
```

---

## 🎨 Sections Included

### 1. **Header**
- Sticky navigation
- Mobile hamburger menu
- Sign-in button
- Purple/blue gradient logo

### 2. **Hero Section**
- Full-width background image
- Email signup form
- Call-to-action button
- Responsive text sizing

### 3. **Curved Separator**
- SVG curved line
- Purple to blue gradient
- Smooth transition between sections

### 4. **Featured Video**
- Large video player area
- Play and info buttons
- Expandable info panel
- Course details

### 5. **Trending Courses**
- Horizontal scrolling carousel
- 5 video cards
- Hover effects with video preview
- Progress bars
- Numbered badges

### 6. **Categories**
- 6 category cards
- Icon animations
- Hover zoom effects
- Image backgrounds

### 7. **Progress Dashboard**
- 4 statistics cards
- 3 active courses
- Animated progress bars
- Continue learning buttons

### 8. **Testimonials**
- 4 student testimonials
- Auto-rotating carousel
- Star ratings
- Navigation controls
- Statistics row

### 9. **Reasons to Learn**
- 4 benefit cards
- Icon animations
- Hover effects

### 10. **Footer**
- 4-column layout
- Social media links
- Quick links
- Contact information
- Copyright info

### 11. **Sign-In Modal**
- Email/password form
- Backdrop blur effect
- Smooth animations
- ESC key to close

---

## 🎯 Key Features

### Animations
- ✅ Shimmer effect on progress bars
- ✅ Fade-in animations
- ✅ Bounce-in effects
- ✅ Hover scale transitions
- ✅ Smooth carousel scrolling
- ✅ Auto-rotating testimonials
- ✅ Modal slide-in

### Interactivity
- ✅ Hamburger menu (mobile)
- ✅ Carousel navigation (prev/next)
- ✅ Video card hover previews
- ✅ Sign-in modal
- ✅ Email validation
- ✅ Smooth scroll navigation
- ✅ Testimonial navigation
- ✅ Scroll animations

### Responsive Design
- ✅ Mobile: < 768px
- ✅ Tablet: 768px - 1024px
- ✅ Desktop: > 1024px
- ✅ Large Desktop: > 1440px

---

## 🛠️ Customization

### Change Colors

Edit `styles/main.css`:

```css
:root {
    --purple-600: #9333ea;  /* Change primary purple */
    --blue-600: #2563eb;    /* Change primary blue */
}
```

### Change Content

Edit `scripts/data.js`:

```javascript
// Update course data
const videoCardsData = [
    {
        id: 1,
        title: 'Your Course Title',
        description: 'Your description',
        // ... more fields
    }
];
```

### Add New Section

1. Add HTML in `index.html`
2. Add CSS in `styles/components.css`
3. Add JS (if needed) in `scripts/main.js`

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |
| IE 11 | - | ❌ Not supported |

---

## 📊 File Sizes

- **index.html**: ~20 KB
- **styles/**: ~40 KB total
- **scripts/**: ~15 KB total
- **Total**: ~75 KB (excluding images)

**Images are loaded from Unsplash CDN** - no local images needed!

---

## 🚀 Performance

- ✅ No build process
- ✅ No dependencies to download
- ✅ Fast load times
- ✅ Optimized CSS
- ✅ Minimal JavaScript
- ✅ Responsive images

---

## 📱 Mobile Features

- ✅ Touch-friendly buttons
- ✅ Swipeable carousel
- ✅ Hamburger menu
- ✅ Responsive typography
- ✅ Optimized layouts
- ✅ Fast loading

---

## 🎓 Learning Value

This project demonstrates:

### HTML
- Semantic HTML5
- Proper document structure
- Accessibility features
- Form handling

### CSS
- CSS Grid & Flexbox
- CSS Variables
- Animations & Transitions
- Media queries
- Gradient backgrounds
- Box shadows

### JavaScript
- DOM manipulation
- Event handling
- Array methods (map, forEach)
- Template literals
- Arrow functions
- Intersection Observer
- Local functions

---

## 🔧 Common Tasks

### Adding a New Course

Edit `scripts/data.js`:

```javascript
videoCardsData.push({
    id: 6,
    title: 'New Course',
    description: 'Description here',
    duration: '30 min',
    progress: 0,
    image: 'https://your-image-url.jpg'
});
```

### Changing Hero Image

Edit `styles/main.css`:

```css
.hero-image {
    background: url('YOUR_NEW_IMAGE_URL') center/cover;
}
```

### Disabling Auto-Rotate Testimonials

Edit `scripts/main.js`:

```javascript
// Comment out this code in initTestimonials():
// setInterval(() => {
//     currentTestimonialIndex = ...
//     renderTestimonial();
//     updateDots();
// }, 5000);
```

---

## 🎨 Color Scheme

### Primary Colors
- **Purple 600**: `#9333ea`
- **Blue 600**: `#2563eb`

### Gradients
- **Primary**: `linear-gradient(135deg, #9333ea, #2563eb)`
- **Dark**: `linear-gradient(135deg, #6b21a8, #1e3a8a)`
- **Light**: `linear-gradient(135deg, #faf5ff, #eff6ff)`

---

## 💡 Tips

1. **Open in Modern Browser** - Chrome, Firefox, Safari, or Edge
2. **Use Live Server** - For best development experience
3. **Check Console** - F12 for debugging
4. **Mobile Testing** - Use browser DevTools (F12 → Toggle Device)
5. **Customize Freely** - All code is yours to modify!

---

## 🐛 Troubleshooting

### Images Not Loading
- Check internet connection (images from Unsplash)
- Open browser console (F12) for errors

### Carousel Not Working
- Ensure `scripts/data.js` is loaded
- Check browser console for JavaScript errors

### Styles Not Applying
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check all CSS files are linked in `index.html`

### Modal Not Opening
- Ensure `scripts/main.js` is loaded
- Check browser console for errors

---

## 📚 Resources

- **HTML**: https://developer.mozilla.org/en-US/docs/Web/HTML
- **CSS**: https://developer.mozilla.org/en-US/docs/Web/CSS
- **JavaScript**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Images**: https://unsplash.com

---

## 🎯 What Makes This Special

✅ **No Build Tools** - Just open and run
✅ **No Dependencies** - Pure vanilla code
✅ **No Frameworks** - Learn the fundamentals
✅ **Production Ready** - Use as-is or customize
✅ **Educational** - Clean, readable code
✅ **Responsive** - Works everywhere
✅ **Modern** - Latest CSS & JS features

---

## 📝 License

This is a demonstration project for educational purposes. Feel free to use, modify, and learn from it!

---

## 🎉 Getting Started Checklist

- [ ] Extract all files
- [ ] Open `index.html` in browser
- [ ] Check all sections load
- [ ] Test mobile responsiveness (F12 → Toggle Device)
- [ ] Try the carousel navigation
- [ ] Open the sign-in modal
- [ ] Check testimonial auto-rotation
- [ ] Customize colors (optional)
- [ ] Add your own content (optional)
- [ ] Deploy to web (optional)

---

## 🌐 Deployment

### Deploy to Web (Free Options)

1. **Netlify Drop**
   - Go to https://app.netlify.com/drop
   - Drag the entire folder
   - Get instant live URL!

2. **GitHub Pages**
   - Create a GitHub repository
   - Push your files
   - Enable GitHub Pages in settings
   - Your site is live!

3. **Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Follow prompts
   - Done!

---

## 💖 Credits

- **Design Inspiration**: Netflix
- **Images**: Unsplash
- **Icons**: Unicode Emojis
- **Built with**: HTML, CSS, JavaScript

---

**Built with ❤️ for medical education**

**No frameworks. No build tools. Just pure web development.** 🚀

---

## 🆘 Need Help?

1. Check browser console (F12)
2. Read error messages carefully
3. Verify all files are in correct folders
4. Try different browser
5. Clear cache and reload

**Happy Learning! 🎓**
