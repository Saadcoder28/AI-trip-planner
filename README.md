# ✈️ AI Trip Planner

**Live Demo:** https://ai-trip-planner-six-rust.vercel.app

AI Trip Planner is your personal travel curator. It generates instant, personalized 3-day travel itineraries for 1000+ destinations using Google Places and Gemini AI. Save your favorite trips securely with Firebase.

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
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_MAPS_API_KEY=your_google_maps_api_key
```

⚠️ **Important:** Do NOT commit this file to GitHub. It’s ignored by `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Then open: `http://localhost:5173`

---

## 📤 Deployment (Vercel)

This app is automatically deployed using Vercel.

To deploy manually:

```bash
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy from the `main` branch.

---

## 🔒 Security

- All API keys are stored in `.env.local`  
- Firebase Firestore rules restrict trip data to authenticated users  
- Google Maps API key is domain-restricted for protection  

---

## 🙌 Acknowledgements

- Firebase  
- Gemini AI  
- Google Maps Platform  
- Tailwind CSS  
- Vercel  

---

## 👨‍💻 Author

**Saad Amin**  
GitHub: [@Saadcoder28](https://github.com/Saadcoder28)

---

## ⭐️ Support

If you like this project, give it a ⭐️ on GitHub!


