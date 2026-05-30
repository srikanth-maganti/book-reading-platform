# Recommendation System Implementation Plan

This document outlines the architecture and steps required to build a Machine Learning recommendation model using a Python Microservice (Option A).

## Architecture Overview
- **Core Node.js Application**: Handles authentication, book browsing, and the interactive reader.
- **MongoDB**: Stores book metadata (33,000+ books) and user reading progress (`UserBook` collection).
- **ML Python Microservice**: A lightweight FastAPI application running in its own Docker container that computes recommendations.

## Tech Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI (for high-performance async REST endpoints)
- **ML Libraries**: 
  - `scikit-learn` (for TF-IDF Vectorization and Cosine Similarity)
  - `pandas` (for data manipulation)
- **Database Driver**: `pymongo` (to read directly from the shared MongoDB instance)

## Data Availability
Before implementing the model, it is crucial to understand what data is available in MongoDB to train or compute recommendations, and what data we must work around.

### What We HAVE
1. **Book Metadata (`books` collection)**: 
   - `title` and `author`
   - `subjects`: An array of highly specific Project Gutenberg categories (e.g., "Science Fiction", "French literature", "Historical fiction"). This is our most valuable feature for Content-Based Filtering.
   - `downloadCount`: Useful as a proxy for "popularity" when generating fallback/trending recommendations.
2. **User Interaction (`userbooks` collection)**:
   - `bookId` and `userId` mapping (who is reading what).
   - `progress`: A percentage (0-100) indicating how far the user has read.
   - `lastReadAt`: A timestamp to determine recent interests.
3. **User Engagement (`notes` collection)**:
   - The existence of notes on a book indicates active engagement and can be used to boost a book's implicit rating.

### What We DO NOT HAVE
1. **Explicit 5-Star Ratings**: We do not have a rating system. We must use **Implicit Feedback**: a book with `progress > 50%` or multiple notes should be mathematically treated as a "Like", while a book abandoned at `progress < 5%` should be treated as neutral or a "Dislike".
2. **Rich Book Summaries (Blurbs)**: Project Gutenberg metadata does not include back-cover descriptions or synopses. We cannot do deep semantic NLP on book plots. We must rely entirely on the `subjects` array and `title` for TF-IDF vectorization.
3. **User Demographic Data**: We do not ask for age, location, or preferences during signup, so demographic-based collaborative filtering is impossible. We must rely purely on reading behavior.

## Step-by-Step Implementation

### Step 1: Infrastructure Setup
1. Create a new folder named `ml-service` in the root directory.
2. Inside `ml-service`, create a `requirements.txt`:
   ```txt
   fastapi==0.104.1
   uvicorn==0.24.0.post1
   pymongo==4.6.0
   scikit-learn==1.3.2
   pandas==2.1.3
   ```
3. Create `ml-service/Dockerfile`:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```
4. Update `docker-compose.yml` to include the new service:
   ```yaml
   ml-service:
     build: ./ml-service
     ports:
       - "8000:8000"
     environment:
       - MONGODB_URI=mongodb://mongodb:27017/bookreadingplatform
     depends_on:
       - mongodb
   ```

### Step 2: ML Model Implementation (`main.py`)
1. **Connect to MongoDB**: Use `pymongo` to connect to the `bookreadingplatform` database.
2. **Data Loading**: On startup, fetch all books from the `books` collection and load them into a Pandas DataFrame.
3. **Vectorization (Content-Based Filtering)**:
   - Extract the `subjects`, `title`, and `author` fields.
   - Combine them into a single string for each book.
   - Use `scikit-learn`'s `TfidfVectorizer` to convert these text strings into a mathematical matrix (TF-IDF matrix).
4. **Recommendation Endpoint (`GET /recommend/{user_id}`)**:
   - Fetch the user's reading history from the `userbooks` collection.
   - Identify books where the user's `progress` is greater than 10%.
   - Look up the TF-IDF vectors for those read books.
   - Calculate the **Cosine Similarity** between the user's read books and all other books in the matrix.
   - Sort by highest similarity.
   - Filter out books the user has already read.
   - Return the `bookId`s of the top 10 recommended books.

### Step 3: Node.js Backend Integration
1. Update `backend/controllers/recommendations.controllers.js`.
2. Instead of returning random trending books, make an internal HTTP request to the Python microservice:
   ```javascript
   const mlResponse = await axios.get(`http://ml-service:8000/recommend/${req.user.id}`);
   const recommendedBookIds = mlResponse.data.recommendations;
   ```
3. Query the local MongoDB to fetch the full book details for those specific IDs:
   ```javascript
   const books = await Book.find({ bookId: { $in: recommendedBookIds } });
   ```
4. Return the formatted data to the React frontend.

### Step 4: Handling Cold Starts (New Users)
- If the Python microservice detects that the user has 0 books in their `userbooks` collection, it cannot compute similarity.
- **Fallback Mechanism**: The Python service should return a `cold_start: true` flag.
- The Node.js backend should catch this and automatically fall back to querying the top trending/most downloaded books directly from MongoDB.
