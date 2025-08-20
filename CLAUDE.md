# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyFlix is a Korean movie and book recommendation application built with React. This is a student project for a government-funded coding education program, demonstrating React skills after one month of training.

**Key Features:**
- Movie recommendations using TMDB API
- Book recommendations using Naver Books API  
- User authentication and profiles
- Wishlist management
- Custom playlist creation and sharing
- Content search and filtering
- Random recommendation system

## Available Scripts

In the project directory, you can run:

```bash
# Development
npm start          # or yarn start - runs dev server on localhost:3000
npm test           # or yarn test - launches test runner
npm run build      # or yarn build - builds for production
npm run eject      # or yarn eject - ejects from Create React App (one-way operation)
```

## Technology Stack & Constraints

- **React**: Uses react-router-dom and axios only
- **No TypeScript or Next.js**: Standard React with JavaScript
- **CSS**: Regular CSS files, no frameworks like Tailwind
- **Backend**: No traditional backend - uses LocalStorage/SessionStorage only
- **APIs**: TMDB for movies, Naver Books API for books

## Architecture

### Context System
- **AuthContext** (`src/contexts/AuthContext.js`): Manages user authentication state
- **ContentTypeContext** (`src/contexts/ContentTypeContext.js`): Handles movie/book tab switching

### Component Structure
```
src/
├── components/
│   ├── common/          # Header, Footer, Nav, Carousel
│   ├── content/         # ContentCard (shared movie/book component)
│   ├── movie/           # MovieCard, MovieCarousel  
│   ├── book/            # BookCard, BookList
│   ├── playlist/        # PlaylistCard
│   ├── modals/          # Modal components
│   └── layout/          # Layout components
├── pages/               # Route components
├── services/            # API services and mock data
├── utils/               # localStorage utilities
├── contexts/            # React contexts
├── constants/           # Application constants
└── config/              # API configuration
```

### Data Management
- **LocalStorage**: User data, wishlists, playlists, reviews
- **Constants**: All hardcoded values managed in `src/constants/constants.js`
- **API Config**: API keys and endpoints in `src/config/apiConfig.js`

## API Integration

### TMDB (Movies)
- Filters: Korean region support, has poster/overview/videos, no adult content
- Language: ko-KR, Region: KR

### Naver Books
- Filters: Korean books with descriptions and cover images
- Requires proxy for CORS issues

## Development Guidelines

### Content Filtering Requirements
All content must be filtered to ensure:
1. Korean language support (한글 번역 available)
2. Complete metadata (title, description, images)
3. No adult/inappropriate content
4. For movies: Must have trailers/teasers

### File Organization
- Use absolute imports from src/
- Separate CSS files for each component
- Group related components in subdirectories
- Constants and utilities in dedicated folders

### State Management
- Use React Context for global state (auth, content type)
- LocalStorage for persistence
- No external state management libraries

## Key Files to Understand

- `src/App.js` - Main routing and protected routes
- `src/contexts/AuthContext.js` - Authentication system
- `src/contexts/ContentTypeContext.js` - Movie/book tab switching
- `src/constants/constants.js` - All application constants
- `src/config/apiConfig.js` - API configuration
- `src/services/` - API service implementations
- `src/utils/localStorage.js` - Data persistence utilities

## Development Environment

This project was bootstrapped with Create React App. The development server runs on port 3000 by default.

Environment variables should be managed in `.env` files for API keys (though currently hardcoded in config for development).