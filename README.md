# AnimeRec - AI-Powered Anime Recommendation App

A production-grade, manga/comic-themed anime recommendation web app with two entry paths: Beginner Quiz or Pick/Search Your Favorites. Features real-time search over AniList, OpenRouter-powered recommendations, and blazing-fast UX with strict rate-limiting and error-handling guarantees.

## 🎨 Features

- **Dual Entry Paths**: Quiz for beginners or search for experienced users
- **AI-Powered Recommendations**: OpenRouter integration for personalized suggestions
- **Real-time Search**: Instant search across 10,000+ anime titles via AniList API
- **Manga/Comic Theme**: Beautiful design with ink borders, halftone patterns, and comic-style elements
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Performance Optimized**: Rate limiting, caching, and progressive loading
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- OpenRouter API key (for AI recommendations)

### Installation

1. **Clone and install dependencies:**
```bash
cd "anime recommendation"
npm install
```

2. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key-here
```

3. **Start the development server:**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppShell.js     # Main layout with header/footer
│   ├── AnimeCard.js    # Anime display card
│   ├── SearchBar.js    # Search with autocomplete
│   └── ErrorBoundary.js # Error handling
├── pages/              # Route components
│   ├── Landing.js      # Home page with trending
│   ├── Quiz.js         # 5-question personality quiz
│   ├── Search.js       # Search and select favorites
│   ├── Recommendations.js # AI recommendation results
│   └── AnimeDetails.js # Detailed anime information
├── services/           # API integrations
│   ├── anilistApi.js   # AniList GraphQL API
│   └── recommendationApi.js # OpenRouter AI API
├── contexts/           # React contexts
│   └── ToastContext.js # Toast notifications
└── App.js             # Main app component
```

## 🎯 User Flows

### Quiz Flow
1. **Landing** → Take Quiz button
2. **Quiz** → Answer 5 questions about preferences
3. **Recommendations** → View AI-generated suggestions
4. **Details** → Click any anime for full information

### Search Flow
1. **Landing** → Pick Favorites button
2. **Search** → Real-time search and select 1-3 anime
3. **Recommendations** → View similar anime suggestions
4. **Details** → Explore recommended titles

## 🎨 Design System

### Colors
- **Ink**: `#0A0A0A` (primary text/borders)
- **Paper**: `#FAFAFA` (backgrounds)
- **Crimson**: `#E11D48` (primary actions)
- **Cobalt**: `#2563EB` (secondary actions)
- **Halftone Gray**: `#D9D9D9` (textures)

### Typography
- **Display**: Bangers (comic-style headings)
- **Body**: Inter (readable text)
- **Comic**: Permanent Marker (special effects)

### Components
- Ink-stroke borders around panels
- Halftone dot patterns for texture
- Speech-bubble notifications
- Card hover effects with rotation
- Progressive loading skeletons

## 🔧 API Integration

### AniList GraphQL API
- **Trending anime**: Fetches top 20 trending titles
- **Search**: Real-time search with debouncing
- **Details**: Complete anime information
- **Rate limiting**: 100ms between requests with caching

### OpenRouter AI API
- **Quiz recommendations**: Based on user preferences
- **Seed recommendations**: Based on selected anime
- **Fallback handling**: Graceful degradation when AI fails
- **Caching**: 24-hour cache for recommendations

## 🚀 Performance Features

### Client-Side Optimizations
- **React Query**: Smart caching and background updates
- **Debounced search**: 200ms delay to reduce API calls
- **Image optimization**: Lazy loading with blur placeholders
- **Code splitting**: Dynamic imports for heavy components
- **Virtualization**: For large lists (40+ items)

### API Optimizations
- **Request deduplication**: Prevent duplicate API calls
- **Batch processing**: Group related requests
- **Exponential backoff**: Retry failed requests intelligently
- **Circuit breaker**: Prevent cascade failures

## 🛡️ Error Handling

### User-Friendly Errors
- **Toast notifications**: Non-intrusive error messages
- **Fallback content**: Show cached/default data when possible
- **Retry mechanisms**: Easy recovery from temporary failures
- **Error boundaries**: Prevent app crashes

### Rate Limiting
- **Client-side queuing**: Respect API limits
- **Backoff strategies**: Handle 429 responses gracefully
- **Cache-first**: Reduce unnecessary requests

## 🎮 Usage Tips

### Getting OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Generate an API key
4. Add to your `.env` file

### Customizing Recommendations
- **Quiz answers**: More specific answers = better recommendations
- **Seed selection**: Choose diverse anime for varied suggestions
- **Filters**: Use sort/filter options on results page

## 🔧 Development

### Available Scripts
- `npm start` - Development server
- `npm build` - Production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables
```env
REACT_APP_OPENROUTER_API_KEY=your-key-here
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- **AniList**: Comprehensive anime database
- **OpenRouter**: AI recommendation engine
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Query**: Smart data fetching

---

**Built with ❤️ for anime fans everywhere!**
