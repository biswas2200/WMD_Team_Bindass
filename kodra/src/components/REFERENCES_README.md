# References Module Documentation

## Overview
The `References` component serves as a centralized "Knowledge Hub" for the application. It provides users with curated educational resources across various Computer Science domains such as Data Structures, Database Management, Object-Oriented Programming, and more.

## Features
- **Accordion Interface**: Clean, collapsible UI to manage large amounts of information without clutter.
- **Categorized Learning**: Topics are distinct (DSA, DBMS, OOPs, etc.).
- **Dual Resource Types**: Each topic provides links to:
  - **Articles**: Text-based tutorials and documentation.
  - **Learning Platforms**: Structured courses from providers like Coursera, EdX, etc.
- **Glassmorphism Design**: Fully integrated with the application's `global.css` design system.

## File Structure
- **Component**: `src/components/References.js`
- **Styles**: Inherits from `src/global.css` (uses `.ka-card`, `.ka-btn`, `.ka-slide-up`, etc.).

## How to Add New Topics
To add a new topic (e.g., "Web Development"), simply add a new object to the `referencesData` array in `src/components/References.js`:

```javascript
{
  id: 'webdev',
  title: 'Web Development',
  icon: '🌐',
  description: 'Building modern web applications.',
  articles: [
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' }
  ],
  platforms: [
    { title: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/' }
  ]
}
```

## Dependencies
- **React**: For component state (managing open/closed accordion items).
- **Global CSS**: For styling consistency.

## Usage
The component is routed in `App.js` via:
```javascript
{page === "references" && <References />}
```
It is accessible via the "References" item in the `Navbar`.
