import os
import pickle
from flask import Flask, request, jsonify
import pandas as pd

# Load the pre-trained model from /models/svd_model.pkl
model_path = os.path.join('models', 'svd_model.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

# THIS IS WRONG
# Load the movies dataset; ensure this CSV has at least "tmdbId" and "title"
movies_df = pd.read_csv('movies.csv')
# THIS IS WRONG



# Convert tmdbId to integer if needed
movies_df['tmdbId'] = movies_df['tmdbId'].astype(int)

app = Flask(__name__)

def get_recommendations(user_id, watched_movies, model, movies_df, n=10):
    """
    Given a user_id, a list of watched movie tmdbIds, the trained model, and the movies DataFrame,
    predict and return the top n recommended movies (as tuples of (tmdbId, predicted_rating)).
    """
    # All movie IDs from the movies DataFrame
    all_movie_ids = movies_df['tmdbId'].unique()
    
    # Filter out movies that the user has already watched
    unseen_ids = [mid for mid in all_movie_ids if mid not in watched_movies]
    
    # Predict ratings for each unseen movie
    predictions = [(mid, model.predict(user_id, mid).est) for mid in unseen_ids]
    
    # Sort predictions by predicted rating (highest first) and return top n
    predictions.sort(key=lambda x: x[1], reverse=True)
    return predictions[:n]

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user_id = data.get("userId")
    watched_movies = data.get("watchedMovies", [])
    n = data.get("n", 10)
    
    if user_id is None:
        return jsonify({"error": "userId is required"}), 400

    # Get top n recommendations (each is a tuple of (tmdbId, predicted_rating))
    recs = get_recommendations(user_id, watched_movies, model, movies_df, n)
    
    # Build response: include movie details from movies_df and the predicted rating
    recommendations = []
    for tmdbId, pred in recs:
        movie_info = movies_df[movies_df['tmdbId'] == tmdbId].iloc[0].to_dict()
        movie_info['predicted_rating'] = pred
        recommendations.append(movie_info)
    
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5123, debug=True)