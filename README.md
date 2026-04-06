# Task Board UI

🚧 **Work in Progress**  
This project is actively being developed. Some features are incomplete or experimental, and the current version should be treated as a demo/prototype of the overall architecture and functionality.

A modern, feature-rich Task board application built with React, TypeScript, and Vite. Manage your projects and tasks with drag-and-drop functionality, tagging, and real-time collaboration support via Firebase.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-blue?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Current Features
> ⚠️ Some features are partially implemented and may change as the project evolves.

- **📌 Task Board**: Organize tasks into customizable columns
- **🏷️ Smart Tagging**: Create, organize with tags
- **🎨 Drag & Drop**: Smooth drag-and-drop interface powered by dnd-kit
- **🔐 Authentication**: Firebase-powered user authentication
- **🎯 Issue Management**: Create, edit, delete, and organize issues
- **💾 Multi-Storage**: Support for guest and user-authenticated storage strategies
- **⚡ Real-time Sync**: Automatic data persistence and synchronization
- **🎨 Modern UI**: Built with Radix UI and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adrian-Oz/nosql-notes-app.git
   cd task-board-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📖 Usage
> ℹ️ This demo version focuses on core task management functionality. Some edge cases and advanced features are still under development.
### Creating a Board

1. Start the application - a default board is created automatically


### Managing Columns

- Click the **Add Column** button to create new columns
- Drag column headers to reorganize them
- Edit column names by dropdown menu
- Delete columns (Only when empty)

### Managing Issues

- Click **Create Issue** in any column
- Fill in the issue data
- Drag issues between columns to change their status
- Click on an issue dropdown menu to edit or delete it

### Using Tags

- Open the tag manager
- Create custom tags 
- Attach tags to issues for better organization


## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, Dialog, etc.)
│   ├── layout.tsx       # Main layout wrapper
│   └── layout-skeleton.tsx
├── features/            # Feature-specific components
│   ├── auth/            # Authentication/login components
│   ├── board/           # Board and column components
│   ├── nav/             # Navigation components
│   └── tags/            # Tag management components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
│   ├── firebase.ts      # Firebase setup
│   ├── storage-strategies.ts # Data persistence strategies
│   └── utils.ts         # Helper functions
├── store/               # Zustand store for state management
│   └── board-store.ts   # Board state store
├── types/               # TypeScript type definitions
│   ├── board.ts
│   ├── column.ts
│   ├── issue.ts
│   └── tag.ts
├── schemas/             # JSON schemas for data validation
└── App.tsx              # Root component
```

## 🛠️ Technology Stack

### Frontend
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Modern build tool
- **Tailwind CSS**: Utility-first CSS framework

### State Management
- **Zustand**: Lightweight state management
- **React Hook Form**: Form state management

### UI Components
- **Radix UI**: Headless UI primitives
- **dnd-kit**: Drag and Drop toolkit
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Data & Auth
- **Firebase**: Authentication and real-time data
- **Zod**: TypeScript-first schema validation

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## 📝 Available Scripts

```bash
# Start development server with hot module replacement
npm run dev

# Build for production (with TypeScript type checking)
npm run build

# Preview production build
npm run preview

# Run ESLint to check code quality
npm run lint
```

## 🎯 State Management

The app uses **Zustand** for global state management. The main store (`useBoardStore`) handles:

- Board CRUD operations
- Column management
- Issue management
- Tag management and filtering
- Dialog state (issue and tag dialogs)

### Accessing the Store

```typescript
import { useBoardStore } from '@/store/board-store';

// In a component
const activeBoard = useBoardStore((state) => state.getActiveBoard());
const createIssue = useBoardStore((state) => state.addIssue);
```

## 🔐 Authentication

The app supports two modes:

1. **Guest Mode**: Local storage-based persistence
2. **User Mode**: Firebase authentication with cloud persistence

User state is managed by `useAuthStore` in `features/auth/useAuthStore.ts`

## 🎨 Styling

The project uses **Tailwind CSS** with custom configuration:

- Dynamic theme support (light/dark mode)
- Responsive design system
- Custom animations
- CSS scrollbar styling

## 🚀 Building for Production

```bash
npm run build
```

This command:
1. Runs TypeScript type checking
2. Builds the React app with Vite
3. Outputs optimized files to `dist/`


### Code Style

- Run `npm run lint` before committing
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic



## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚧 Project Status

This project is currently in active development and serves as a learning-focused full-stack application.

### What’s complete:
- Core task board functionality (columns, issues, drag & drop)
- State management architecture using Zustand
- Persistence layer (localStorage + Firebase)
- Authentication flow

### What’s in progress / planned:
- Improved real-time synchronization
- Better error handling and edge-case coverage
- UI/UX refinements
- Performance optimizations

The goal of this project is not only to build a functional application, but also to explore scalable state management, data modeling, and full-stack architecture patterns.

## 💡 Future Enhancements

- [ ] Real-time collaboration
- [ ] Comments and mentions on issues
- [ ] Issue activity history
- [ ] Recurring/scheduled tasks
- [ ] Board templates
- [ ] Export to CSV/PDF
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality

## 👤 Author

Created with ❤️ by [Adrian Ozorek]

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://react.dev/) for the UI library
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities


