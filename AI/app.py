from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# ----------------------
# 1. Load and preprocess data once on startup
# ----------------------

# Load data
movies_df = pd.read_csv("./data/movie.csv")  # movieId, title, genres
links_df = pd.read_csv("./data/link.csv")    # movieId, imdbId, tmdbId
tags_df = pd.read_csv("./data/tag.csv")      # userId, movieId, tag, timestamp

# Convert tag NaNs to empty strings and ensure type is string
tags_df["tag"] = tags_df["tag"].fillna("").astype(str)

# Group tags by movieId
tags_agg = tags_df.groupby("movieId")["tag"].apply(lambda x: " ".join(x)).reset_index()
tags_agg.columns = ["movieId", "all_tags"]

# Merge tags into movies
movies_df = pd.merge(movies_df, tags_agg, on="movieId", how="left")
movies_df["all_tags"] = movies_df["all_tags"].fillna("")

# Build a combined text column: genres + tags + (optionally) title
movies_df["genres"] = movies_df["genres"].str.replace("|", " ", regex=False)
movies_df["combined_text"] = (
    movies_df["genres"] + " " + 
    movies_df["all_tags"] + " " + 
    movies_df["title"].str.lower().str.replace(r"[^a-z0-9 ]", "", regex=True)
)

# Vectorize (TF-IDF)
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(movies_df["combined_text"])

# Build a map from tmdbId -> movieId
tmdb_to_movie = dict(zip(links_df["tmdbId"], links_df["movieId"]))

# Quick helper to get row index in movies_df from a movieId
movieid_to_index = pd.Series(movies_df.index, index=movies_df["movieId"])

movie_id_to_tmdb = dict(zip(links_df["movieId"], links_df["tmdbId"]))

# ----------------------
# 2. Define a function for content-based recommendations
# ----------------------


def get_content_based_recs(watched_tmdb_ids, top_n=10):
    """
    watched_tmdb_ids: list of integer TMDb IDs that the user has watched.
    Returns a list of dicts with 'tmdbId' for recommended movies.
    """

    # Map tmdbId -> movieId
    watched_movie_ids = []
    for t in watched_tmdb_ids:
        if t in tmdb_to_movie:
            watched_movie_ids.append(tmdb_to_movie[t])

    # Get row indices for watched movies
    watched_indices = []
    for mid in watched_movie_ids:
        if mid in movieid_to_index:
            watched_indices.append(movieid_to_index[mid])

    # If the user has watched none of the movies in our dataset, return empty
    if not watched_indices:
        return []

    # Build user profile vector by averaging watched items
    watched_vectors = tfidf_matrix[watched_indices]
    user_profile = watched_vectors.mean(axis=0)

    # Convert to array if it's a sparse or matrix object
    user_profile = np.asarray(user_profile).reshape(1, -1)

    # Compute similarity to all movies
    sims = cosine_similarity(user_profile, tfidf_matrix).flatten()

    # Sort by descending similarity
    sorted_indices = np.argsort(-sims)

    # Exclude watched movies and collect only tmdbId
    watched_set = set(watched_movie_ids)
    tmdb_ids = []
    for idx in sorted_indices:
        movie_id = movies_df.iloc[idx]["movieId"]
        if movie_id not in watched_set:
            tmdb_id = movie_id_to_tmdb.get(movie_id)
            if tmdb_id is not None:
                tmdb_ids.append(int(tmdb_id))
            if len(tmdb_ids) >= top_n:
                break

    # Return a dictionary with "tmdbIds" as a single list
    return {"tmdbIds": tmdb_ids}


# ----------------------
# 3. Flask endpoint
# ----------------------

@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Expects a JSON body with:
    {
       "watched_tmdb_ids": [862, 240, 155, ...],
       "top_n": 10
    }
    Returns JSON with top_n recommended movies.
    """
    data = request.get_json()
    
    watched_tmdb_ids = data.get("watched_tmdb_ids", [])
    top_n = data.get("top_n", 10)

    recs = get_content_based_recs(watched_tmdb_ids, top_n=top_n)
    return jsonify(recs)


# ----------------------
# 4. Run (for local dev)
# ----------------------

if __name__ == "__main__":
    app.run(debug=True, port=5123)