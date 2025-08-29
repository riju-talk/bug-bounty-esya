# Overview

This is a deliberately vulnerable vanilla JavaScript ecommerce project designed for bug bounty practice and security testing. The application is built with vanilla JavaScript, HTML, and SCSS, using Gulp as a build tool and LiquidJS as a template engine. It contains 48 intentionally introduced vulnerabilities across functional bugs, security issues, and edge cases for educational purposes.

**WARNING: This project should NEVER be used in production or deployed to a public server.**

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Build System**: Gulp-based build pipeline with BrowserSync for live reloading
- **Template Engine**: LiquidJS for HTML templating with component-based structure
- **Styling**: SCSS with BEM methodology and mobile-first responsive design
- **JavaScript**: Vanilla ES6+ with class-based architecture for products, categories, and cart management
- **Data Format**: JSON files for products and categories stored in `/data` directory

## Component Structure
- **Views**: Organized into `/views/components` for reusable HTML components and `/views/pages` for page templates
- **Scripts**: Modular JavaScript files for specific functionality (products, slider, cart, etc.)
- **Styles**: SCSS organized into `/components`, `/config` (mixins/variables), and `/helper` directories

## Data Management
- **Product Data**: Static JSON files containing product information with categories
- **State Management**: LocalStorage for cart persistence and user preferences
- **Price Formatting**: Intl.NumberFormat API for currency display

## Security Context
The application deliberately includes various vulnerability types:
- **XSS Vulnerabilities**: Reflected and stored cross-site scripting in search and reviews
- **Injection Flaws**: HTML injection in product titles and user content
- **Client-Side Issues**: LocalStorage trust issues, weak validation, and prototype pollution
- **Configuration Problems**: Hardcoded API keys and insecure HTTP requests

# External Dependencies

## Build Dependencies
- **Gulp**: Task runner for build automation
- **browser-sync**: Live development server with hot reloading
- **gulp-sass**: SCSS compilation with Sass
- **gulp-autoprefixer**: CSS vendor prefix automation
- **@tuanpham-dev/gulp-liquidjs**: LiquidJS template compilation

## Runtime Dependencies
- **LiquidJS**: Template engine for component rendering
- **Intl.NumberFormat**: Native browser API for currency formatting
- **LocalStorage**: Browser storage for cart and user data persistence
- **Fetch API**: HTTP requests for loading JSON data files

## Static Assets
- **JSON Data Files**: Product and category data served statically
- **Image Assets**: Product images and slider content
- **Font Resources**: Typography assets for the UI

Note: The application uses static JSON files instead of a database, making it suitable for client-side-only deployment and security testing scenarios.