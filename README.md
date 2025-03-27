# 🎯 LMR – Live Movie Recommendation

Welcome to **LMR**, a full-stack AI-powered application that demonstrates the integration of machine learning and web technologies in a modular architecture. This project was developed for experimentation, prototyping, and demonstrating applied skills in AI, backend, and frontend development.


## 🧠 Overview

In this project, the main objective is to onboard users as quickly and smoothly as possible, enabling them to search for and select their favorite or previously watched movies with ease. Based on this selection, the system swiftly generates personalized movie recommendations.

LMR explores the use of **Content-Based Filtering (CBF)** using **TF-IDF** (Term Frequency-Inverse Document Frequency) to recommend content based on user input. The TF-IDF vectors were constructed using the MovieLens dataset to represent movie metadata and features. Users are able to choose movies through a dynamic interface that retrieves all movie details from the TMDB API, which are stored in a MongoDB database. 
After choosing all the favorite movies, the user is able to quickly request AI recommended movies by the press of a button.


## 📂 Project Structure

```
LMR/
├── AI/           # Python script for training, TF-IDF vectorization, and making the AI API via a flask endpoint
├── Server/       # Node.js backend handling API requests and integrating AI logic
├── Client/       # Frontend built with HTML, CSS, and JavaScript
└── README.md     # Project documentation
```


## 🛠️ Technologies Used

- **Python** – For AI logic including TF-IDF vectorization and recommendation generation
- **Scikit-learn** – Used for TF-IDF vectorization and cosine similarity calculations
- **Node.js & Express.js** – For building API endpoints and connecting the frontend to the AI logic
- **JavaScript** – For building both the frontend and backend
- **HTML/CSS** – For layout and styling of the frontend
- **Git & GitHub** – For version control and collaboration


## Highlights

- **AI-powered recommendations** using classical CBF with TF-IDF
- Modular structure with clear separation of concerns
- Functional frontend for testing and visualization
- Great showcase of integrating traditional ML techniques into a full-stack system



---
## Visual Demonstration:

**Home Page**
![Screenshot 2025-03-27 at 16 54 10](https://github.com/user-attachments/assets/d210954d-c47d-4107-8b5c-399089cc0bb6)
![Screenshot 2025-03-27 at 16 54 19](https://github.com/user-attachments/assets/8ef08b7f-fd10-4480-a95f-ccc83c589281)

**Sign Up**
![Screenshot 2025-03-27 at 16 54 28](https://github.com/user-attachments/assets/6a009fc5-1553-46fa-b3f3-07f92e5f56cb)

**Profile Page**
![Screenshot 2025-03-27 at 16 55 03](https://github.com/user-attachments/assets/30c8afd3-053f-4e71-8968-1615c49e8970)

**Add A Movie**
![Screenshot 2025-03-27 at 16 55 10](https://github.com/user-attachments/assets/eaec3209-083a-4b66-a32b-3b8b8cee18b7)

**AI Recommendations**
![Screenshot 2025-03-27 at 16 58 18](https://github.com/user-attachments/assets/695f0740-1dd4-4e70-be9b-4761322177b1)

---
_Note: This project is intended as a demonstration and is not packaged for direct public use or deployment._
