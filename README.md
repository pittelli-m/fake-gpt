# FakeGPT

A self-aware mock chatbot that explains its own over-engineered implementation through an interactive chat interface.

## Overview

FakeGPT is a React Native application that simulates a chatbot experience while simultaneously documenting its own architecture and implementation details. The bot responds to user queries about its structure, demonstrating clean architecture principles with intentional over-engineering showcase purposes.

## Live Demo

**Mobile:** Install [Expo Go](https://expo.dev/client) and scan:

![QR Code](screenshots/eas-update-qr.svg)

**Direct link:** `exp://u.expo.dev/update/d5dfc258-d472-4e2f-8357-6f13c1733607`

**Desktop:** View [screenshots below](#screenshots) or clone and run locally with `npm install --legacy-peer-deps && npm start`

## Screenshots

![Greeting](screenshots/Screenshot%202025-09-28%20at%2009.46.06.png)
![Topic Selected](screenshots/Screenshot%202025-09-28%20at%2009.46.18.png)

## Tech Stack

- **React Native** with Expo (managed workflow)
- **TypeScript** for type safety
- **NativeWind** for styling (Tailwind CSS for React Native)
- **React Query** for state management
- **Jest** with ts-jest for testing
- **ESLint** and **Prettier** for code quality

## Features

- Interactive chat interface with quick reply navigation
- Self-documenting architecture explanations
- Network simulation demonstrations
- Component-driven development showcase
- Clean architecture with separated concerns

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## Architecture

The application follows clean architecture principles with clear separation between:

- Core business logic
- Feature modules
- Shared utilities
- UI components

The chatbot itself provides detailed explanations of each architectural layer when prompted.
