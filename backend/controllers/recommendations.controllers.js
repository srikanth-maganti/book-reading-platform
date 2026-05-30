import axios from "axios";

const GUTENDEX_URL = "https://gutendex.com/books/";

/**
 * Dummy recommendation engine.
 * 
 * TODO: Replace with ML model integration.
 * 
 * Current approach: Returns popular books from different genres
 * to simulate personalized recommendations. When the ML model is ready,
 * this endpoint should:
 * 1. Accept user reading history + preferences
 * 2. Call the ML model API (e.g., Flask/FastAPI microservice)
 * 3. Return ranked book recommendations with confidence scores
 */

// Curated genre topics for dummy recommendations
const RECOMMENDATION_TOPICS = [
    { topic: "fiction", label: "Fiction Picks" },
    { topic: "science", label: "Science & Discovery" },
    { topic: "history", label: "Historical Reads" },
    { topic: "adventure", label: "Adventure Stories" },
    { topic: "philosophy", label: "Philosophy & Thought" },
    { topic: "romance", label: "Romance" }
];

export const getRecommendations = async (req, res) => {
    try {
        // TODO: When ML model is ready, use user's reading history:
        // const userBooks = await UserBook.find({ userId: req.user.userId });
        // const recommendations = await mlModel.predict(userBooks);

        // For now, fetch popular books from a few genres
        const recommendations = [];

        // Get 2-3 random topics to recommend
        const shuffled = [...RECOMMENDATION_TOPICS].sort(() => 0.5 - Math.random());
        const selectedTopics = shuffled.slice(0, 3);

        for (const { topic, label } of selectedTopics) {
            try {
                const response = await axios.get(GUTENDEX_URL, {
                    params: {
                        topic: topic,
                        sort: 'popular',
                        languages: 'en'
                    }
                });

                recommendations.push({
                    category: label,
                    reason: `Popular ${label.toLowerCase()} books you might enjoy`,
                    books: response.data.results.slice(0, 6)
                });
            } catch (apiErr) {
                console.error(`Failed to fetch ${topic} recommendations:`, apiErr.message);
            }
        }

        // Add a "Trending Now" section with overall popular books
        try {
            const trendingResponse = await axios.get(GUTENDEX_URL, {
                params: {
                    sort: 'popular',
                    languages: 'en'
                }
            });

            recommendations.unshift({
                category: "Trending Now",
                reason: "Most downloaded books on Project Gutenberg",
                books: trendingResponse.data.results.slice(0, 8)
            });
        } catch (apiErr) {
            console.error("Failed to fetch trending:", apiErr.message);
        }

        res.json({
            success: true,
            recommendations,
            meta: {
                engine: "dummy",
                message: "These are curated recommendations. ML-powered personalized recommendations coming soon!",
                // TODO: Add model version, confidence scores, etc.
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch recommendations" });
    }
};
