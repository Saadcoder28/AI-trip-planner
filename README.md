# ✈️ AI Trip Planner

**Live Demo:** [https://ai-trip-planner-six-rust.vercel.app](https://ai-trip-planner-six-rust.vercel.app)

AI Trip Planner is your personal travel curator. It generates instant, personalized 3-day travel itineraries for over 1000+ destinations using Google Places and Gemini AI. Save your favorite trips securely with Firebase.

---

## 🚀 Features

- 🔍 Destination autocomplete with Google Places API  
- 🤖 AI-powered 3-day travel itineraries (Gemini 1.5 Flash)  
- 🗺️ Real location-based photos via Google Maps  
- 🔐 User authentication with Firebase Auth  
- ☁️ Cloud storage for trips using Firestore  
- 🎨 Responsive UI built with Tailwind CSS  
- ✅ Deployed on Vercel

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite  
- **Styling:** Tailwind CSS  
- **Backend:** Firebase Auth & Firestore  
- **APIs:** Google Places API, Google Maps Photos API, Gemini API  
- **Hosting:** Vercel

---

## 🧪 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Saadcoder28/AI-trip-planner.git
cd AI-trip-planner
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up environment variables
Create a .env.local file in the root directory and add the following:

env
Copy
Edit
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_MAPS_API_KEY=your_google_maps_api_key
⚠️ Keep this file private and do not commit it.

4. Run the development server
bash
Copy
Edit
npm run dev
Visit: http://localhost:5173

📤 Deployment (Vercel)
This app is deployed using Vercel.

To manually deploy:

bash
Copy
Edit
vercel --prod
Or push to GitHub and Vercel auto-deploys the main branch.

🔒 Security
API keys are stored in .env.local

Firebase rules restrict trip data per authenticated user

Google Maps key is domain-restricted

🙌 Acknowledgements
Firebase

Gemini AI

Google Maps API

Tailwind CSS

Vercel

👨‍💻 Author
Saad Amin
GitHub – @Saadcoder28

⭐️ Show your support
If you like this project, give it a ⭐ on GitHub!

python
Copy
Edit
