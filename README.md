# HN Scraper - Backend (API)

The Node.js/Express server for the Hacker News Scraper application. This API handles web scraping, user authentication, and bookmark management.

## 🚀 Backend Features
- **Hacker News Scraper**: Integrated `node-cron` service that scrapes top stories every 30 minutes.
- **Clean Architecture**: Follows the Model-Controller-Route-Service pattern.
- **JWT Authentication**: Secure registration and login using `bcryptjs` and `jsonwebtoken`.
- **Database**: MongoDB integration via Mongoose with `upsert` logic for data integrity.
- **Error Handling**: Centralized global error handling middleware.

---

## 🔍 Key Implementation Details

### Scraping Strategy & Database Accumulation
- **Upsert Logic**: We use MongoDB's `upsert` functionality. If a story's `hnId` already exists, we update its points and title. If it's new, we add it.
- **Why Accumulate?**: This approach allows the application to build a historical archive. If we deleted the database before every scrape, users would lose their **bookmarks** on stories that are no longer in the Top 10.

---

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, Bcrypt.js
- **Scraping**: Axios, Cheerio
- **Scheduling**: Node-cron

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ashmit65/mern-hn-backend.git
   cd mern-hn-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5001
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

---

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Stories
- `GET /api/stories` - List paginated stories
- `GET /api/stories/bookmarks` - Get user's bookmarked stories (Auth required)
- `POST /api/stories/:id/bookmark` - Toggle bookmark for a story (Auth required)
- `POST /api/stories/scrape` - Trigger manual scrape (Auth required)
