# 🌸 TuterNity Frontend

The frontend for the **TuterNity Online Tutoring Platform**, built with React, Tailwind CSS, Framer Motion, and Axios.  
It provides a clean, responsive interface for students and teachers to manage bookings, profiles, payments, dashboards, and more.
# 🚀 Features

- 🔐 **User Authentication (Login / Register)**
- 🧑‍🏫 **Student & Teacher Dashboards**
- 👤 **Profile Management (Edit, Update, Upload Image)**
- 📅 **Booking System (Search, Schedule, Cancel)**
- ⚡ **Real-time UI Updates**
- 💳 **Stripe Checkout Integration**
- 🌙 **Light & Dark Mode Support**
- 🎞️ **Framer Motion Animations**
- 📱 **Fully Responsive UI**
# 🧰 Tech Stack

## Frontend Technologies

- ⚛️ **React.js**
- 🔀 **React Router DOM**
- 🌐 **Axios**
- 🎨 **Tailwind CSS**
- 🎥 **Framer Motion**
- 🔔 **Lucide Icons**
- ▲ **Vercel (Deployment)**

# 📁 Folder Structure

```bash
tuternity-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── UI components...
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Student/
│   │   ├── Teacher/
│   │   ├── Bookings/
│   │   └── Payments/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── axios.js
│   │   ├── storage.js
│   │   └── constants.js
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── .env
├── package.json
└── README.md
```
# 🔐 Environment Variables

Create a `.env` file in the project root and add the following:

```bash
REACT_APP_API_URL=https://tuternity-backend.onrender.com/api
REACT_APP_STRIPE_PUBLIC_KEY=your_public_key_here
```
# ⚙️ Installation & Setup

## 1. Clone the Repository
```bash
git clone https://github.com/anas2k5/Tuternity-Frontend.git
cd Tuternity-Frontend
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Run Development Server
```bash
npm start
```

The app will run at:

```
http://localhost:3000
```

# 🏗️ Build for Production

To create an optimized production build, run:

```bash
npm run build
```

This generates a `build/` folder that can be deployed to any hosting platform.
# 🚀 Deployment (Vercel)

Follow these steps to deploy the frontend on **Vercel**:

## 1. Go to Vercel
Open the Vercel dashboard:

```
https://vercel.com
```

## 2. Import Your GitHub Repository
- Click **New Project**
- Select **TuterNity-Frontend** repo

## 3. Add Environment Variables
Under *Project Settings → Environment Variables* add:

```bash
REACT_APP_API_URL=https://tuternity-backend.onrender.com/api
REACT_APP_STRIPE_PUBLIC_KEY=your_public_key_here
```

## 4. Deploy
Click **Deploy** and wait for the build to finish.

### Live Deployment Example:
```
https://tuternity-frontend.vercel.app
```
# 🔗 API Integration

The frontend communicates with the backend using Axios.  
All API requests are routed through the base URL set in your `.env` file.

## Backend API Base URL
```
https://tuternity-backend.onrender.com/api
```

## Axios Base Setup
Inside `utils/axios.js`:

```js
const API = process.env.REACT_APP_API_URL;

export default API;
```

This allows all components to use:

```js
API + "/your-endpoint"
```
# 📄 Key Pages

Below are the main routes available in the TuterNity frontend:

```bash
/login
/register
/student/dashboard
/teacher/dashboard
/student/bookings
/teacher/bookings
/paymentSuccess
/paymentCancel
```
# 🤝 Contributing

Pull requests, enhancements, and bug reports are always welcome.  
Feel free to open an issue or submit a PR anytime.

---

# 📬 Contact

**Anas Syed**

**GitHub:**  
https://github.com/anas2k5

**Email:**  
anassyed236@gmail.com
