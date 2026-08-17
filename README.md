# Market - Web Development Catalog App

A premium, fast, and accessible multi-page catalog application built with React and Vite. It connects to the `dummyjson.com` public API to display products, handle details, support client-side listings, and show business insights.

This project was built to satisfy the **CodingAtom Web Development Internship Assessment** specifications.

<a href="https://example.com" target="_blank">Open Live Preview in New Tab</a>


---

## 🎨 Theme & Typography
- **Color Palette**: Styled using custom shades of Forest Green/Emerald (representing growth and quality) and Golden Yellow/Amber (accentuating CTA components and focal highlights).
- **Typography**: Configured with the **Plus Jakarta Sans** font family loaded dynamically from Google Fonts for a clean, modern aesthetic.

---

## ⚙️ Key Architectural & Design Decisions

1. **Lightweight Hash Routing (`#/` etc.)**
   - Implemented a robust hash-based client-side router inside [NavigationContext.jsx](src/context/NavigationContext.jsx) to ensure that deep linking and browser back/forward buttons work out-of-the-box on static servers without rewrite rules.
2. **Request Cancellation on Route Changes**
   - Integrated `AbortController` registration inside the routing engine. Any in-flight HTTP request is canceled instantly if the user switches routes, preventing background resource waste and race conditions.
3. **Honest UX States & Resiliency**
   - Explicitly designed states for **Loading**, **Empty** search results, and network **Error** states (with manual retry actions). Wrapped the main viewport tree in a React `ErrorBoundary` class component to gracefully catch code exceptions.
4. **Optimistic UI Updates**
   - Form submissions for creating products immediately render local previews on the UI before the mock API successfully completes its round-trip network response.
5. **Accessibility (A11y)**
   - Included a keyboard "Skip to main content" link, proper semantic landmarks (`nav`, `main`, `footer`), explicit `aria` labels, and a focus-reset trigger on route changes.

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone or download the repository contents.
2. Open terminal in the directory and run:
   ```bash
   npm install
   ```

### Running Locally
To launch the Vite development server:
```bash
npm run dev
```

### Production Build
To package the project for deployment:
```bash
npm run build
```
This output is saved to the `/dist` directory.
