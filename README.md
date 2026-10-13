# Cognevance Task Management System (MERN Stack)

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%7C%207.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-cyan.svg)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208.x-brightgreen.svg)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Auth-bcrypt%20%2B%20JWT-red.svg)](https://jwt.io/)

A complete, production-ready full-stack **Task Management System** developed using the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js) with TypeScript, secure bcrypt password hashing, JSON Web Token (JWT) authentication, strict user-specific task ownership isolation, dynamic deadline tracking, overdue task calculations, and an interactive, responsive dashboard.

Suggested Repository Name: `cognevance_task-management`

---

## 📖 सरल भाषा में व्याख्या (Hindi / Hinglish Overview)

यह प्रोजेक्ट एक संपूर्ण **MERN Stack Task Management System** है। इसका उद्देश्य यूज़र्स को अपने दैनिक कार्यों (Tasks) को व्यवस्थित करने, समय सीमा (Deadlines) ट्रैक करने, और प्राथमिकताओं (Priorities) के आधार पर काम पूरा करने में मदद करना है।

### प्रमुख विशेषताएँ (Key Highlights):
1. **सुरक्षित प्रमाणीकरण (Authentication & Security):**
   - यूज़र रजिस्ट्रेशन और लॉगिन **bcryptjs** (10-round salted password hashing) और **JWT (JSON Web Token)** के ज़रिये सुरक्षित है।
   - पासवर्ड कभी भी डेटाबेस से प्लेन टेक्स्ट में नहीं निकलता और API रिस्पॉन्स में भी एक्सक्लूड रहता है।
2. **यूज़र-विशिष्ट कार्य स्वामित्व (User-Specific Task Ownership):**
   - हर टास्क एक विशिष्ट यूज़र के `ObjectId` से जुड़ा होता है।
   - एक यूज़र दूसरे यूज़र का टास्क ना तो देख सकता है, ना एडिट या डिलीट कर सकता है।
3. **टास्क CRUD और फ़ील्ड्स:**
   - प्रत्येक टास्क में: `title`, `description`, `status` (*Pending*, *In Progress*, *Completed*), `priority` (*Low*, *Medium*, *High*), `dueDate` (समय सीमा), और टाइमस्टैम्प्स (`createdAt`, `updatedAt`) शामिल हैं।
4. **डेडलाइन ट्रैकिंग और ओवरड्यू अलर्ट (Deadline Tracking & Overdue Calculation):**
   - सिस्टम अपने आप कैलकुलेट करता है कि कौन सा टास्क ओवरड्यू (Deadline पार कर चुका) है, कौन सा आज ड्यू है, और कितने दिन बचे हैं।
   - डैशबोर्ड पर ओवरड्यू टास्क होने पर तुरंत चेतावनी बैनर दिखता है।
5. **लाइव सर्च, फ़िल्टरिंग और सॉर्टिंग:**
   - लाइव सर्च (Title और Description में), स्टेटस पिल्स, प्रायोरिटी फ़िल्टर, ओवरड्यू टॉगल, और ड्यू डेट/प्रायोरिटी के अनुसार सॉर्टिंग।
6. **रेस्पॉन्सिव डैशबोर्ड (Analytics & Stats):**
   - 6 इंटरएक्टिव मेट्रिक कार्ड्स (Total, Completed, In Progress, Pending, Overdue, High Priority) और स्प्रिंट प्रोग्रेस बार।
7. **स्मार्ट डेटाबेस फ़ॉलबैक (Zero Downtime Fallback):**
   - अगर आपके सिस्टम में लोकल MongoDB चालू नहीं है, तो सिस्टम ऑटोमैटिकली हाई-स्पीड इन-मेमोरी स्टोर पर स्विच हो जाता है, जिससे टेस्टिंग या रिव्यू के दौरान ऐप कभी क्रैश नहीं होता। जब आप MongoDB URL प्रदान करते हैं, तो यह सीधे लाइव MongoDB से जुड़ जाता है।

---

## 🗂️ प्रोजेक्ट फ़ोल्डर स्ट्रक्चर (Folder Structure)

```text
cognevance_task-management/
│
├── backend/                              # Express & Node.js Backend
│   ├── config/
│   │   └── db.ts                        # Mongoose connection & in-memory fallback
│   ├── controllers/
│   │   ├── authController.ts            # Register, Login, Me, Logout
│   │   └── taskController.ts            # Tasks CRUD, Stats, Search, Seed
│   ├── middleware/
│   │   ├── auth.ts                      # JWT Bearer token protection middleware
│   │   ├── errorHandler.ts              # Centralized JSON error & 404 handler
│   │   └── validator.ts                 # Input validation middleware
│   ├── models/
│   │   ├── User.ts                      # Mongoose User schema with bcrypt hooks
│   │   └── Task.ts                      # Mongoose Task schema with indexes
│   ├── routes/
│   │   ├── authRoutes.ts                # /api/auth routes
│   │   ├── taskRoutes.ts                # /api/tasks routes
│   │   └── index.ts                     # Aggregator /api router & /health
│   └── package.json                     # Standalone backend package file
│
├── src/                                  # React.js Frontend (Vite + Tailwind)
│   ├── components/
│   │   ├── AuthModal.tsx                # Tabbed Sign In / Register + 1-Click Demo
│   │   ├── DocumentationView.tsx        # In-app developer documentation hub
│   │   ├── Navbar.tsx                   # Top navigation with DB indicator & logout
│   │   ├── TaskDashboard.tsx            # KPI metric cards & sprint progress bar
│   │   ├── TaskFilters.tsx              # Search, status pills, priority & sort
│   │   ├── TaskList.tsx                 # Interactive task cards with deadline pills
│   │   └── TaskModal.tsx                # Task create / edit modal with validation
│   ├── context/
│   │   └── AuthContext.tsx              # Global authentication context & state
│   ├── services/
│   │   └── api.ts                       # Fetch client with auto-attached JWT Bearer
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces (User, Task, Stats)
│   ├── App.tsx                          # Main application layout & state
│   ├── index.css                        # Tailwind CSS imports
│   └── main.tsx                         # React 19 root entry point
│
├── server.ts                            # Unified Express + Vite full-stack server
├── index.html                           # HTML5 entry with meta tags
├── package.json                         # Unified full-stack dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite bundling configuration
├── .env.example                         # Environment variables template
├── postman_collection.json              # Postman collection (v2.1.0)
└── README.md                            # Comprehensive project guide
```

---

## ⚙️ Windows PowerShell Setup & Run Commands

Windows 10/11 पर **PowerShell** खोलें और निम्नलिखित कमांड्स एक-एक करके चलाएँ:

### 1. रिपॉजिटरी क्लोन करें (Clone Repository)
```powershell
git clone https://github.com/omvadnere2930/cognevance_task-management.git
cd cognevance_task-management
```

### 2. एनवायरनमेंट फ़ाइल बनाएँ (Create Environment File)
```powershell
Copy-Item .env.example .env
```
*(यदि आवश्यक हो, तो `.env` फ़ाइल में अपना MongoDB Atlas URI या कस्टम JWT_SECRET अपडेट करें)*

### 3. डिपेंडेंसीज़ इंस्टॉल करें (Install Dependencies)
```powershell
npm install
```

### 4. लोकल MongoDB चालू करें (Start MongoDB on Windows)
यदि आपने MongoDB Community Server इंस्टॉल किया है:
```powershell
# MongoDB सर्विस का स्टेटस चेक करें
Get-Service MongoDB

# यदि सर्विस बंद है तो स्टार्ट करें
Start-Service MongoDB
```
*या मैन्युअल रूप से चलाएँ:*
```powershell
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```
*(नोट: यदि MongoDB इंस्टॉल नहीं है, तब भी यह सिस्टम बिल्ट-इन इन-मेमोरी इंजन के साथ बिना किसी रुकावट के चलेगा)*

### 5. डेवलपमेंट सर्वर शुरू करें (Start Development Server)
```powershell
npm run dev
```

### 6. ब्राउज़र में खोलें (Open Application)
```powershell
Start-Process "http://localhost:3000"
```

---

## 🐙 GitHub Instructions (Create & Push Repository)

अपने कोड को GitHub पर अपलोड करने के लिए Windows PowerShell में यह कमांड्स चलाएँ:

```powershell
# 1. गिट इनिशियलाइज़ करें
git init

# 2. सभी फाइल्स स्टेज करें
git add .

# 3. कमिट संदेश लिखें
git commit -m "feat: complete MERN task management system with JWT auth, deadline tracking & responsive dashboard"

# 4. मुख्य ब्रांच को 'main' सेट करें
git branch -M main

# 5. अपने GitHub रिपॉजिटरी का रिमोट जोड़ें
git remote add origin https://github.com/omvadnere2930/cognevance_task-management.git

# 6. कोड को GitHub पर पुश करें
git push -u origin main
```

---

## 🔐 Environment Variables (`.env.example`)

```ini
# Server Port
PORT=3000

# Environment Mode
NODE_ENV=development

# MongoDB Connection String (Local MongoDB or Atlas URI)
# Local:
MONGODB_URI=mongodb://127.0.0.1:27017/cognevance_task_db
# Atlas Example:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cognevance_task_db?retryWrites=true&w=majority

# JWT Secret Key (Use a strong 32+ character random secret)
JWT_SECRET=super_secret_jwt_token_key_cognevance_task_manager_2026_xyz987

# JWT Expiry Time
JWT_EXPIRES_IN=7d

# Standalone Client URL (CORS origin)
CLIENT_URL=http://localhost:3000
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Access | Headers / Query Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/health` | Public | None | System status and MongoDB connection status |
| **POST** | `/auth/register` | Public | Body: `{ name, email, password }` | Register new user with bcrypt password hashing |
| **POST** | `/auth/login` | Public | Body: `{ email, password }` | Authenticate user & receive JWT token |
| **GET** | `/auth/me` | Protected | `Authorization: Bearer <token>` | Get logged-in user profile |
| **POST** | `/auth/logout` | Protected | `Authorization: Bearer <token>` | Invalidate user session |
| **GET** | `/tasks` | Protected | `?search=&status=&priority=&overdue=&sortBy=&order=` | Get user tasks with live filtering & sorting |
| **GET** | `/tasks/stats` | Protected | `Authorization: Bearer <token>` | Get dashboard summary metrics and completion rate |
| **POST** | `/tasks` | Protected | Body: `{ title, description, status, priority, dueDate }` | Create a new task |
| **GET** | `/tasks/:id` | Protected | `Authorization: Bearer <token>` | Get task details by ID (isolated by user ownership) |
| **PUT** | `/tasks/:id` | Protected | Body: `{ title, status, priority, ... }` | Update existing task |
| **DELETE**| `/tasks/:id` | Protected | `Authorization: Bearer <token>` | Delete task (ownership verified) |
| **POST** | `/tasks/seed` | Protected | `Authorization: Bearer <token>` | Load 5 demonstration sample tasks |

---

## 📮 Postman Collection Setup

इस रिपॉजिटरी में `postman_collection.json` फ़ाइल पहले से मौजूद है:

1. **Postman** खोलें।
2. ऊपरी बाएँ कोने में **Import** बटन पर क्लिक करें।
3. `postman_collection.json` फ़ाइल को ड्रैग-एंड-ड्रॉप करें या सेलेक्ट करें।
4. कलेक्शन में सभी रिक्वेस्ट्स (Register, Login, Get Tasks, Create Task, Stats, ইত্যাদি) उपलब्ध होंगी।
5. जब आप `Login` या `Register` करेंगे, तो Postman टेस्ट स्क्रिप्ट स्वचालित रूप से `jwt_token` वेरिएबल सेट कर देती है!

---

## 🛠️ सामान्य त्रुटि निवारण (Troubleshooting Guide)

### 1. `npm install` Error (ERESOLVE / Peer Dependencies)
- **कारण:** Node version या strict dependency conflict।
- **समाधान:**
  ```powershell
  npm install --legacy-peer-deps
  ```

### 2. MongoDB `ECONNREFUSED 127.0.0.1:27017`
- **कारण:** स्थानीय MongoDB डिमॅन रन नहीं हो रहा है।
- **समाधान:**
  ```powershell
  Start-Service MongoDB
  ```
  या [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) पर मुफ़्त क्लस्टर बनाकर `.env` में `MONGODB_URI` डालें। *(नोट: हमारा सर्वर इन-मेमोरी फ़ॉलबैक के साथ काम करना जारी रखता है, इसलिए एप्लिकेशन बिना रुके चलती है)*।

### 3. Vite / Port 3000 In Use Error
- **कारण:** कोई अन्य प्रक्रिया पोर्ट 3000 का उपयोग कर रही है।
- **समाधान:**
  ```powershell
  # पोर्ट 3000 की प्रक्रिया आईडी खोजें
  netstat -ano | findstr :3000
  # प्रक्रिया समाप्त करें (PID बदलें)
  Stop-Process -Id <PID> -Force
  ```

### 4. CORS Policy Block (`Access-Control-Allow-Origin`)
- **कारण:** फ्रंटएंड और बैकएंड के पोर्ट अलग होने पर ब्राउज़र द्वारा सुरक्षा ब्लॉक।
- **समाधान:** हमारे `server.ts` में `cors({ origin: '*', credentials: true })` पहले से कॉन्फ़िगर है, इसलिए यह त्रुटि नहीं आएगी।

### 5. `JsonWebTokenError` या `TokenExpiredError` (401 Unauthorized)
- **कारण:** टोकन की 7 दिन की अवधि समाप्त हो गई है या `JWT_SECRET` बदल दिया गया है।
- **समाधान:** फ्रंटएंड स्वचालित रूप से एक्सपायर टोकन को साफ़ करके यूज़र को लॉगिन स्क्रीन पर निर्देशित करता है। दोबारा लॉगिन करने पर नया वैध टोकन जारी हो जाता है।

---

## 🚀 डिप्लॉयमेंट निर्देश (Deployment Guide)

### 1. Render / Railway / Heroku पर डिप्लॉयमेंट:
- Build Command: `npm run build`
- Start Command: `npm start` (Runs `node server.js`)
- Environment Variables जोड़ें:
  - `PORT=3000`
  - `NODE_ENV=production`
  - `MONGODB_URI=<Your MongoDB Atlas Connection String>`
  - `JWT_SECRET=<Strong 32-character secret>`

### 2. Vercel / Netlify (Client-Only) + Separate Node API:
यदि आप बैकएंड और फ्रंटएंड को अलग-अलग होस्ट करना चाहते हैं:
- `/backend` फ़ोल्डर को Render / AWS EC2 पर डिप्लॉय करें।
- रूट डायरेक्टरी के फ्रंटएंड को Vercel पर होस्ट करें और `api.ts` में API बेस URL अपने बैकएंड डोमेन पर पॉइंट करें।

---

Developed with ❤️ as part of the **Cognevance Task Management System**.
