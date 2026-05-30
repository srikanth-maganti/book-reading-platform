# 📖 PageTurn — Free Book Reading Platform

A modern, interactive book reading platform built with React and Express.js. Read 33,000+ free classic books from Project Gutenberg, take notes while reading, and get personalized recommendations.

![PageTurn](image-removebg-preview.png)

---

## ✨ Features

### 📚 Browse & Read Free Books
- Access **33,000+ free classic books** from Project Gutenberg stored locally for ultra-fast browsing
- Browse by genres: Fiction, Science, History, Adventure, Romance, Philosophy, Poetry, Mystery, and more
- Instant search by title or author
- View book details including subjects, download count, and available formats

### 🖥️ Interactive Reader
- **Beautiful reading experience** with dark, light, and sepia themes
- **Adjustable font size** for comfortable reading
- **Reading progress tracking** — auto-saves your position
- **Scroll-based progress bar** — always know how far you've read
- Automatically strips Project Gutenberg boilerplate headers/footers
- Full-screen immersive mode (no navbar/footer while reading)

### 📝 Notes System
- **Take notes while reading** — write your thoughts at any point in the book
- **Color-coded notes** (yellow, green, blue, pink, orange) for organization
- Edit and delete notes
- Notes sidebar slides in from the right without interrupting your reading
- Notes are synced to your account and organized by book



### 🤖 Personalized Recommendations (Placeholder)
- Curated book recommendations organized by category
- "Trending Now" section with most popular books
- Genre-based suggestions (Fiction, Science, History, etc.)
- **ML-powered personalized recommendations coming soon** — the system is architected to plug in a recommendation model

### 🔐 Authentication
- **Email/Password** registration and login
- **Google OAuth** sign-in
- JWT-based session management (7-day token expiry)
- Protected routes for library and recommendations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |
| **Google OAuth** | Social authentication |

### Backend
| Technology | Purpose |
|---|---|
| **Express.js** | REST API server |
| **MongoDB** | Database (via Mongoose ODM) |
| **JWT** | Authentication tokens |
| **Multer** | File upload handling |
| **bcrypt** | Password hashing |
| **Axios** | API calls to Gutendex |

### External APIs
| API | Purpose |
|---|---|
| **Local Data Cache** | Pre-seeded database of 33k+ books for ultra-fast browsing |
| **Project Gutenberg CDN** | Proxied through backend to avoid CORS restrictions |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker & Docker Compose** | Containerized deployment |
| **MongoDB 7** | Database container |
| **Node.js 20 Alpine** | Backend container |

---

## 📁 Project Structure

```
book-reading-platform/
├── docker-compose.yml          # Docker orchestration
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── app.js                  # Express server entry point
│   ├── package.json
│   ├── .env                    # Environment variables
│   ├── db/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT auth middleware
│   ├── models/
│   │   ├── user.js             # User model (auth + preferences)
│   │   ├── note.js             # Reading notes model
│   │   ├── userBook.js         # Library/reading progress model
│   │   └── uploadedPdf.js      # Uploaded PDF metadata model
│   ├── controllers/
│   │   ├── users.controllers.js
│   │   ├── notes.controllers.js
│   │   ├── library.controllers.js
│   │   ├── upload.controllers.js
│   │   └── recommendations.controllers.js
│   ├── routes/
│   │   ├── users.routes.js
│   │   ├── notes.routes.js
│   │   ├── library.routes.js
│   │   ├── upload.routes.js
│   │   └── recommendations.routes.js
│   ├── utils/
│   │   └── api_error.js
│   └── uploads/                # PDF storage (gitignored)
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── src/
│       ├── main.jsx            # App entry + routing
│       ├── index.css           # Design system & global styles
│       ├── utils/
│       │   ├── api.js          # API helpers (backend + Gutendex)
│       │   └── AuthContext.jsx # Auth state management
│       ├── layouts/
│       │   ├── MainLayout.jsx  # Navbar + Footer wrapper
│       │   ├── AuthLayout.jsx  # Minimal auth pages wrapper
│       │   └── ReaderLayout.jsx # Full-screen reader wrapper
│       ├── components/
│       │   ├── Navbar.jsx      # Navigation bar
│       │   ├── Footer.jsx      # Footer with credits
│       │   ├── BookCard.jsx    # Book card component
│       │   ├── GenreFilter.jsx # Genre chip filter
│       │   ├── NotesSidebar.jsx # Notes panel for reader
│       │   └── ReaderToolbar.jsx # Reader controls toolbar
│       └── pages/
│           ├── Landing.jsx     # Homepage with hero & trending
│           ├── Browse.jsx      # Search & filter books
│           ├── BookDetail.jsx  # Book details page
│           ├── Reader.jsx      # Interactive book reader
│           ├── Library.jsx     # User's book collection
│           ├── Upload.jsx      # PDF upload page
│           ├── Recommendations.jsx # Book recommendations
│           ├── Login.jsx       # Sign in page
│           └── Signup.jsx      # Registration page
│
└── recommendation_system/      # ML model (future)
```

---

## 🚀 Getting Started

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Node.js 20+** (for local frontend development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/book-reading-platform.git
   cd book-reading-platform
   ```

2. **Start the backend and database**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - MongoDB on port `27017`
   - Backend API on port `3000`

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

### Manual Setup (without Docker)

1. **Start MongoDB** locally (port 27017)

2. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

**Backend** (`backend/.env`):
```env
JWT_SECRET=my_secret_key
CLIENT_ID=your_google_client_id
PORT=3000
BASE_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/bookreadingplatform
MAX_FILE_SIZE=52428800
```

**Frontend** (`frontend/.env`):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE=http://localhost:3000/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register with email/password |
| POST | `/api/users/login` | Login with email/password |
| POST | `/api/auth/google` | Login/register with Google |
| GET | `/api/users/profile` | Get user profile 🔒 |
| PUT | `/api/users/preferences` | Update reading preferences 🔒 |

### Library
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/library` | Get user's library 🔒 |
| POST | `/api/library` | Add book to library 🔒 |
| GET | `/api/library/check/:bookId` | Check if book is in library 🔒 |
| PUT | `/api/library/progress/:id` | Update reading progress 🔒 |
| DELETE | `/api/library/:id` | Remove from library 🔒 |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Get all user's notes 🔒 |
| GET | `/api/notes/book/:bookId` | Get notes for a book 🔒 |
| POST | `/api/notes` | Create a note 🔒 |
| PUT | `/api/notes/:noteId` | Update a note 🔒 |
| DELETE | `/api/notes/:noteId` | Delete a note 🔒 |

### Upload
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload a PDF 🔒 |
| GET | `/api/upload` | List uploaded PDFs 🔒 |
| GET | `/api/upload/:id` | Stream a PDF file 🔒 |
| DELETE | `/api/upload/:id` | Delete an uploaded PDF 🔒 |

### Recommendations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recommendations` | Get book recommendations 🔒 |

🔒 = Requires authentication (Bearer token)

---

## 🤖 Recommendation System (Future ML Integration)

The recommendation system is currently a **dummy** that returns curated popular books from Gutendex. It's designed to be easily replaced with an ML model.

### Current Implementation
- Returns popular books from different genres
- Randomized category selection for variety
- "Trending Now" section with overall popular books

### Integration Points
The backend controller (`recommendations.controllers.js`) is marked with `TODO` comments showing where to:
1. Fetch user reading history
2. Call your ML model API (Flask/FastAPI microservice)
3. Return ranked recommendations with confidence scores

### Planned Architecture
```
User Reading Data → ML Model API → Ranked Recommendations
                    ↑
        Training Pipeline (offline)
```

---

## 🎨 Design System

The frontend uses a custom dark-mode design system with:
- **Color palette**: Deep navy backgrounds with amber/gold accents
- **Glassmorphism**: Frosted glass cards and panels
- **Typography**: Inter (body) + Playfair Display (headings)
- **Animations**: Fade-in, slide-up, float, and shimmer effects
- **Components**: Glass cards, progress bars, badges, skeletons, buttons

---

## 📜 License

This project is open source. All books are sourced from [Project Gutenberg](https://www.gutenberg.org/) (public domain).

---

## 🙏 Acknowledgments

- [Project Gutenberg](https://www.gutenberg.org/) — Free eBooks since 1971
- [Gutendex](https://gutendex.com/) — REST API for Project Gutenberg
- [Lucide Icons](https://lucide.dev/) — Beautiful open-source icons
- Built with ❤️ by **Srikanth**