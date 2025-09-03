# AnimeRec - AI-Powered Anime Recommendation App

A modern, responsive web application that provides personalized anime recommendations using AI-powered suggestions and the AniList API.

![AnimeRec Preview](https://via.placeholder.com/800x400/0A0A0A/E11D48?text=AnimeRec+App)

## Features

- AI-Powered Recommendations: Get personalized anime suggestions using advanced AI models
- Interactive Quiz: Take a personality quiz to discover anime that matches your taste
- Smart Search: Search for anime and get recommendations based on your selections
- Detailed Information: View comprehensive details including scores, genres, and descriptions
- Modern UI: Beautiful, responsive design with smooth animations and manga-inspired theme
- Real-time Search: Fast search functionality with debounced input
- Mobile Responsive: Optimized for all device sizes

## Live Demo

Deployed on Vercel: https://anime-recommendation-app.vercel.app

## Tech Stack

- Frontend: React 18 with React Router v6
- Styling: Tailwind CSS with custom manga/comic theme
- Animations: Framer Motion for smooth transitions
- Data Fetching: React Query (TanStack Query) for efficient caching
- APIs: 
  - OpenRouter AI API for intelligent recommendations
  - AniList GraphQL API for comprehensive anime data
- Icons: Lucide React for consistent iconography
- Deployment: Vercel with automatic deployments

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- OpenRouter API key (free tier available)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/anime-recommendation-app.git
cd anime-recommendation-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit .env and add your OpenRouter API key:
```env
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your_api_key_here
REACT_APP_OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

4. Start the development server
```bash
npm start
```

The app will be available at http://localhost:3000.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| REACT_APP_OPENROUTER_API_KEY | Your OpenRouter API key for AI recommendations | Yes |
| REACT_APP_OPENROUTER_MODEL | AI model to use (default: meta-llama/llama-3.2-3b-instruct:free) | No |
## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically!

## 🔑 Getting API Keys

### OpenRouter API (Required)
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Add it to your `.env` file

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Email: meccode360@gmail.com

---

**Made with ❤️ for anime lovers everywhere**

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
