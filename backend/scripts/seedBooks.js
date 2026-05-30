import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Book from '../models/book.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DATA_FILE = path.resolve(__dirname, '../recommendation_system/data.json');
const BATCH_SIZE = 1000;

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        // Default to localhost if MONGO_URI isn't set
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookreadingplatform';
        await mongoose.connect(uri);
        console.log('✅ Connected to database');

        console.log('Clearing existing books...');
        await Book.deleteMany({});
        console.log('✅ Cleared old books');

        console.log(`Reading data from ${DATA_FILE}...`);
        
        // Reading 91MB file into memory is fine for Node.js
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        const books = JSON.parse(rawData);
        
        console.log(`Found ${books.length} books to insert.`);
        
        let insertedCount = 0;
        
        for (let i = 0; i < books.length; i += BATCH_SIZE) {
            const batch = books.slice(i, i + BATCH_SIZE).map(book => ({
                gutendexId: book.id,
                title: book.title,
                authors: book.authors,
                subjects: book.subjects,
                bookshelves: book.bookshelves,
                languages: book.languages,
                copyright: book.copyright,
                media_type: book.media_type,
                formats: book.formats,
                download_count: book.download_count,
                summaries: book.summaries
            }));
            
            await Book.insertMany(batch, { ordered: false }); // ignore dupes if any
            insertedCount += batch.length;
            
            // Print progress
            const progress = Math.round((insertedCount / books.length) * 100);
            process.stdout.write(`\rProgress: ${progress}% (${insertedCount}/${books.length})`);
        }
        
        console.log('\n✅ Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
