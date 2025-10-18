# AI Travel Agent

A production-grade AI-powered travel planning application built with Next.js, React, TypeScript, Firebase, and Google Gemini.

## 🚀 Features

- **AI-Powered Itinerary Creation**: Generate personalized travel plans using conversational chat and structured wizards
- **Conversational Planning**: Multi-turn chat interface with memory and context
- **Cost Optimization**: Price alerts and budget tracking
- **Multi-modal Inputs**: Support for images, links, and PDFs
- **Real-time Assistance**: In-trip support with disruption handling
- **Sustainability Focus**: Eco-friendly recommendations and filters
- **Multi-language Support**: English and Hebrew (RTL) with accessibility features
- **Security First**: RBAC, CSP, CSRF protection, and audit logging

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **AI/LLM**: Google Gemini via LangChain with MCP adapters
- **Vector DB**: Pinecone for RAG (Retrieval-Augmented Generation)
- **Testing**: Jest, React Testing Library, Playwright
- **CI/CD**: GitHub Actions, Vercel deployment
- **Accessibility**: WCAG AA compliance, axe testing

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Firebase project with Authentication and Firestore enabled
- Google Gemini API key
- Pinecone account and API key
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-travel-agent
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Vector Database (Pinecone)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=travel-agent-embeddings
```

### 3. Firebase Setup

Install Firebase CLI and initialize your project:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Start the Firebase emulators for local development:

```bash
npm run firebase:emulators
```

### 4. Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🧪 Testing

### Unit Tests

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
npm run test:e2e:ui
```

### Accessibility Tests

```bash
npx playwright test --grep="accessibility"
```

## 📚 Storybook

View and develop components in isolation:

```bash
npm run storybook
```

## 🏗 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (app)/             # Main application pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── layouts/          # Layout components
│   └── pages/            # Page-specific components
├── lib/                  # Utility libraries
│   ├── firebase/         # Firebase configuration
│   ├── auth.ts           # NextAuth configuration
│   └── utils.ts          # Utility functions
├── services/             # Business logic services
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── locales/              # Internationalization files
├── e2e/                  # End-to-end tests
├── .storybook/           # Storybook configuration
└── firebase.json         # Firebase configuration
```

## 🔒 Security

This application implements comprehensive security measures:

- **Authentication**: Firebase Auth with NextAuth.js
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Zod schemas and sanitization
- **Rate Limiting**: API request throttling
- **CSP**: Content Security Policy headers
- **CSRF Protection**: Cross-site request forgery prevention
- **Audit Logging**: Comprehensive action tracking

## 🌍 Internationalization

The application supports multiple languages with RTL support:

- English (LTR)
- Hebrew (RTL)

Language detection is automatic, and users can manually switch languages.

## ♿ Accessibility

- WCAG AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Automated accessibility testing with axe

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 📊 Monitoring

- **Analytics**: Built-in usage tracking
- **Error Tracking**: Comprehensive error logging
- **Performance**: Core Web Vitals monitoring
- **Security**: Automated vulnerability scanning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Ensure accessibility compliance
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions

## 🗺 Roadmap

- [ ] Advanced AI features with custom models
- [ ] Mobile app (React Native)
- [ ] Social features and trip sharing
- [ ] Advanced analytics dashboard
- [ ] Integration with more travel APIs
- [ ] Offline support with PWA features

---

Built with ❤️ using modern web technologies and AI.
