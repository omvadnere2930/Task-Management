import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Terminal,
  FolderTree,
  BookOpen,
  Server,
  ShieldAlert,
  Github,
  Database,
  Send,
  Code,
} from 'lucide-react';

export const DocumentationView = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('hinglish');
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const postmanJsonString = JSON.stringify(
    {
      info: {
        _postman_id: 'cognevance-task-management-v1',
        name: 'Cognevance Task Management System API',
        description:
          'Complete REST API collection for user authentication and task CRUD operations.',
        schema:
          'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: [
        {
          name: 'Auth',
          item: [
            {
              name: 'Register User',
              request: {
                method: 'POST',
                header: [{ key: 'Content-Type', value: 'application/json' }],
                body: {
                  mode: 'raw',
                  raw: '{\n  "name": "Om Vadnere",\n  "email": "om@example.com",\n  "password": "Password123!"\n}',
                },
                url: {
                  raw: '{{base_url}}/api/auth/register',
                  host: ['{{base_url}}'],
                  path: ['api', 'auth', 'register'],
                },
              },
            },
            {
              name: 'Login User',
              request: {
                method: 'POST',
                header: [{ key: 'Content-Type', value: 'application/json' }],
                body: {
                  mode: 'raw',
                  raw: '{\n  "email": "om@example.com",\n  "password": "Password123!"\n}',
                },
                url: {
                  raw: '{{base_url}}/api/auth/login',
                  host: ['{{base_url}}'],
                  path: ['api', 'auth', 'login'],
                },
              },
            },
            {
              name: 'Get Current Profile (Me)',
              request: {
                method: 'GET',
                header: [
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                url: {
                  raw: '{{base_url}}/api/auth/me',
                  host: ['{{base_url}}'],
                  path: ['api', 'auth', 'me'],
                },
              },
            },
            {
              name: 'Logout User',
              request: {
                method: 'POST',
                header: [
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                url: {
                  raw: '{{base_url}}/api/auth/logout',
                  host: ['{{base_url}}'],
                  path: ['api', 'auth', 'logout'],
                },
              },
            },
          ],
        },
        {
          name: 'Tasks',
          item: [
            {
              name: 'Get All Tasks (Filtered & Sorted)',
              request: {
                method: 'GET',
                header: [
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                url: {
                  raw: '{{base_url}}/api/tasks?status=Pending&priority=High&sortBy=dueDate&order=asc',
                  host: ['{{base_url}}'],
                  path: ['api', 'tasks'],
                  query: [
                    { key: 'status', value: 'Pending' },
                    { key: 'priority', value: 'High' },
                    { key: 'sortBy', value: 'dueDate' },
                    { key: 'order', value: 'asc' },
                  ],
                },
              },
            },
            {
              name: 'Get Task Dashboard Stats',
              request: {
                method: 'GET',
                header: [
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                url: {
                  raw: '{{base_url}}/api/tasks/stats',
                  host: ['{{base_url}}'],
                  path: ['api', 'tasks', 'stats'],
                },
              },
            },
            {
              name: 'Create Task',
              request: {
                method: 'POST',
                header: [
                  { key: 'Content-Type', value: 'application/json' },
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                body: {
                  mode: 'raw',
                  raw: '{\n  "title": "Setup Production MongoDB Atlas",\n  "description": "Configure cloud database cluster with TLS encryption and user access rules.",\n  "status": "In Progress",\n  "priority": "High",\n  "dueDate": "2026-10-25T18:00:00.000Z"\n}',
                },
                url: {
                  raw: '{{base_url}}/api/tasks',
                  host: ['{{base_url}}'],
                  path: ['api', 'tasks'],
                },
              },
            },
            {
              name: 'Update Task',
              request: {
                method: 'PUT',
                header: [
                  { key: 'Content-Type', value: 'application/json' },
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                body: {
                  mode: 'raw',
                  raw: '{\n  "status": "Completed"\n}',
                },
                url: {
                  raw: '{{base_url}}/api/tasks/{{task_id}}',
                  host: ['{{base_url}}'],
                  path: ['api', 'tasks', '{{task_id}}'],
                },
              },
            },
            {
              name: 'Delete Task',
              request: {
                method: 'DELETE',
                header: [
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                url: {
                  raw: '{{base_url}}/api/tasks/{{task_id}}',
                  host: ['{{base_url}}'],
                  path: ['api', 'tasks', '{{task_id}}'],
                },
              },
            },
            {
              name: 'Seed Sample Tasks',
              request: {
                method: 'POST',
                header: [
                  { key: 'Authorization', value: 'Bearer {{jwt_token}}' },
                ],
                url: {
                  raw: '{{base_url}}/api/tasks/seed',
                  host: ['{{base_url}}'],
                  path: ['api', 'tasks', 'seed'],
                },
              },
            },
          ],
        },
      ],
      variable: [
        { key: 'base_url', value: 'http://localhost:3000' },
        { key: 'jwt_token', value: 'YOUR_JWT_TOKEN_HERE' },
        { key: 'task_id', value: 'YOUR_TASK_OBJECT_ID' },
      ],
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                MERN Stack Developer Hub & Documentation
              </h2>
              <p className="text-xs text-slate-500">
                Cognevance Task Management System • Full JS/JSX Architecture Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('hinglish')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'hinglish'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>सरल भाषा में गाइड (Hinglish)</span>
          </button>
          <button
            onClick={() => setActiveTab('powershell')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'powershell'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Windows PowerShell Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'github'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub Repo Instructions</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'api'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>REST API Documentation</span>
          </button>
          <button
            onClick={() => setActiveTab('postman')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'postman'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Postman Collection</span>
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'troubleshoot'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Troubleshooting</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* TAB 1: Hinglish Explanation */}
          {activeTab === 'hinglish' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <h3 className="font-bold text-indigo-900 text-base mb-1">
                  नमस्ते! यह पूरा MERN Stack (Pure JS & JSX) आर्किटेक्चर गाइड है
                </h3>
                <p className="text-xs text-indigo-800">
                  Yeh application clean JavaScript (.js) aur React JSX (.jsx) me develop kiya gaya hai.
                  Niche har layer ka asaan shabdon me explanation diya gaya hai:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2 text-sm">
                    <Database className="h-4 w-4 text-emerald-600" />
                    1. MongoDB & Mongoose Models (JS)
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>
                      <strong>User Model:</strong> Name, Email (unique), Password (bcrypt hashed, 10 rounds salt). Password response me leak nahi hota.
                    </li>
                    <li>
                      <strong>Task Model:</strong> Title, Description, Status (Pending, In Progress, Completed), Priority (Low, Medium, High), DueDate, Timestamps, aur User reference ID.
                    </li>
                    <li>
                      <strong>User Isolation:</strong> Har task specific user se linked hota hai. Koi doosra user kisi aur ke tasks read ya delete nahi kar sakta!
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2 text-sm">
                    <Server className="h-4 w-4 text-indigo-600" />
                    2. Express Controllers & Middleware (JS)
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>
                      <strong>JWT Auth Middleware:</strong> Request header me se <code>Bearer &lt;token&gt;</code> check karta hai. Valid hone par <code>req.user</code> attach hota hai.
                    </li>
                    <li>
                      <strong>Centralized Error Handling:</strong> Duplicate email, invalid ObjectId (CastError), validation failure sab JSON format me handle hote hain.
                    </li>
                    <li>
                      <strong>Query Filtering:</strong> Search, Status filter, Priority filter, Overdue check aur Sorting backend query me fast execute hote hain.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2 text-sm">
                    <Code className="h-4 w-4 text-blue-600" />
                    3. React Frontend State & UI (JSX)
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>
                      <strong>AuthContext:</strong> LocalStorage me token save karta hai, page refresh par user automatically login rehta hai.
                    </li>
                    <li>
                      <strong>Deadline Countdown:</strong> Har task ka due date calculate karke "Overdue by X days", "Due Today", ya "Due in X days" live display karta hai.
                    </li>
                    <li>
                      <strong>Visual Dashboard:</strong> 6 metric cards, sprint progress bar, aur overdue alert banner.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2 text-sm">
                    <FolderTree className="h-4 w-4 text-purple-600" />
                    4. Folder Structure (JS & JSX)
                  </h4>
                  <div className="text-[11px] font-mono bg-slate-900 text-slate-200 p-2.5 rounded-lg overflow-x-auto">
                    {`cognevance_task-management/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js, taskController.js
│   ├── middleware/auth.js, errorHandler.js, validator.js
│   ├── models/User.js, Task.js
│   ├── routes/authRoutes.js, taskRoutes.js, index.js
│   └── services/storageService.js
├── src/
│   ├── components/Navbar.jsx, TaskDashboard.jsx,
│   │              TaskFilters.jsx, TaskList.jsx,
│   │              TaskModal.jsx, AuthModal.jsx, DocumentationView.jsx
│   ├── context/AuthContext.jsx
│   ├── services/api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server.js (Express server)
├── .env.example
├── postman_collection.json
└── README.md`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Windows PowerShell Setup & Run */}
          {activeTab === 'powershell' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">
                  Windows PowerShell Setup & Run Commands
                </h3>
                <button
                  onClick={() =>
                    handleCopy(
                      'ps1',
                      `# 1. Clone repository\ngit clone https://github.com/omvadnere2930/cognevance_task-management.git\ncd cognevance_task-management\n\n# 2. Copy environment file\nCopy-Item .env.example .env\n\n# 3. Install all dependencies\nnpm install\n\n# 4. Start MongoDB service (if running locally)\nStart-Service MongoDB\n\n# 5. Start unified full-stack development server\nnpm run dev\n\n# 6. Open in Browser\nStart-Process "http://localhost:3000"`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  {copiedKey === 'ps1' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedKey === 'ps1' ? 'Copied Script!' : 'Copy All Commands'}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono space-y-2 overflow-x-auto">
                  <div className="text-slate-400"># Step 1: Clone repo and navigate into project folder</div>
                  <div className="text-emerald-400">git clone https://github.com/omvadnere2930/cognevance_task-management.git</div>
                  <div className="text-emerald-400">cd cognevance_task-management</div>

                  <div className="text-slate-400 pt-2"># Step 2: Create .env from template</div>
                  <div className="text-emerald-400">Copy-Item .env.example .env</div>

                  <div className="text-slate-400 pt-2"># Step 3: Install all required npm packages</div>
                  <div className="text-emerald-400">npm install</div>

                  <div className="text-slate-400 pt-2"># Step 4: Ensure MongoDB is running on Windows</div>
                  <div className="text-emerald-400">Get-Service MongoDB</div>
                  <div className="text-emerald-400">Start-Service MongoDB</div>

                  <div className="text-slate-400 pt-2"># Step 5: Start Dev Server on port 3000</div>
                  <div className="text-emerald-400">npm run dev</div>

                  <div className="text-slate-400 pt-2"># Step 6: Open application in default browser</div>
                  <div className="text-emerald-400">Start-Process "http://localhost:3000"</div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <strong className="block font-semibold mb-1">
                    PowerShell Execution Policy Tip:
                  </strong>
                  Agar PowerShell me <code>File cannot be loaded because running scripts is disabled</code> error aaye, toh admin terminal me yeh run karein:
                  <div className="font-mono bg-amber-100 p-1.5 rounded mt-1 text-[11px] select-all">
                    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GitHub Commands */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">
                  GitHub Repository Setup Instructions
                </h3>
                <button
                  onClick={() =>
                    handleCopy(
                      'git',
                      `# Initialize Git\ngit init\n\n# Add all files\ngit add .\n\n# Commit with professional message\ngit commit -m "feat: complete MERN task management system in JS and JSX with JWT auth & dashboard"\n\n# Rename branch to main\ngit branch -M main\n\n# Add your remote GitHub repo\ngit remote add origin https://github.com/omvadnere2930/cognevance_task-management.git\n\n# Push to GitHub\ngit push -u origin main`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  {copiedKey === 'git' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedKey === 'git' ? 'Copied Git Script!' : 'Copy Git Commands'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2.5">
                <div className="text-slate-400"># 1. Initialize local repository</div>
                <div className="text-emerald-400">git init</div>

                <div className="text-slate-400 pt-1"># 2. Add all source files, documentation and config</div>
                <div className="text-emerald-400">git add .</div>

                <div className="text-slate-400 pt-1"># 3. Commit initial release</div>
                <div className="text-emerald-400">
                  git commit -m "feat: initial commit of cognevance_task-management MERN system in JS and JSX"
                </div>

                <div className="text-slate-400 pt-1"># 4. Set branch to main</div>
                <div className="text-emerald-400">git branch -M main</div>

                <div className="text-slate-400 pt-1"># 5. Link GitHub repository</div>
                <div className="text-emerald-400">
                  git remote add origin https://github.com/omvadnere2930/cognevance_task-management.git
                </div>

                <div className="text-slate-400 pt-1"># 6. Push to remote</div>
                <div className="text-emerald-400">git push -u origin main</div>
              </div>
            </div>
          )}

          {/* TAB 4: REST API Documentation */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                REST API Endpoint Reference
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Endpoint</th>
                      <th className="py-2.5 px-3">Access</th>
                      <th className="py-2.5 px-3">Headers / Payload</th>
                      <th className="py-2.5 px-3">Success Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-600">GET</td>
                      <td className="py-2 px-3 font-mono">/api/health</td>
                      <td className="py-2 px-3 text-slate-500">Public</td>
                      <td className="py-2 px-3 text-slate-500">None</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-600">POST</td>
                      <td className="py-2 px-3 font-mono">/api/auth/register</td>
                      <td className="py-2 px-3 text-slate-500">Public</td>
                      <td className="py-2 px-3 font-mono text-[11px]">{`{ name, email, password }`}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">201 Created</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-600">POST</td>
                      <td className="py-2 px-3 font-mono">/api/auth/login</td>
                      <td className="py-2 px-3 text-slate-500">Public</td>
                      <td className="py-2 px-3 font-mono text-[11px]">{`{ email, password }`}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-600">GET</td>
                      <td className="py-2 px-3 font-mono">/api/auth/me</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 text-slate-500">Authorization header</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-600">POST</td>
                      <td className="py-2 px-3 font-mono">/api/auth/logout</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 text-slate-500">Authorization header</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-600">GET</td>
                      <td className="py-2 px-3 font-mono">/api/tasks</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 text-[11px] text-slate-600">?search=&status=&priority=&overdue=&sortBy=</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-600">GET</td>
                      <td className="py-2 px-3 font-mono">/api/tasks/stats</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 text-slate-500">Authorization header</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-600">POST</td>
                      <td className="py-2 px-3 font-mono">/api/tasks</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 font-mono text-[11px]">{`{ title, description, status, priority, dueDate }`}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">201 Created</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-amber-600">PUT</td>
                      <td className="py-2 px-3 font-mono">/api/tasks/:id</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 font-mono text-[11px]">{`Partial task fields`}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-rose-600">DELETE</td>
                      <td className="py-2 px-3 font-mono">/api/tasks/:id</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 text-slate-500">Authorization header</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">200 OK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-purple-600">POST</td>
                      <td className="py-2 px-3 font-mono">/api/tasks/seed</td>
                      <td className="py-2 px-3 text-indigo-600 font-semibold">JWT Bearer</td>
                      <td className="py-2 px-3 text-slate-500">Populates 5 demo tasks</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">201 Created</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Postman Collection */}
          {activeTab === 'postman' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Postman Collection (v2.1.0)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Copy and import directly into Postman via "Import" - "Raw text"
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('postman', postmanJsonString)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  {copiedKey === 'postman' ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedKey === 'postman' ? 'Copied JSON!' : 'Copy Postman JSON'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-200 text-xs p-4 rounded-xl font-mono max-h-96 overflow-y-auto">
                {postmanJsonString}
              </pre>
            </div>
          )}

          {/* TAB 6: Troubleshooting Guide */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                Troubleshooting Common MERN Errors
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-800 mb-1 text-sm text-rose-700">
                    1. npm install error (ERESOLVE / peer dependencies)
                  </h4>
                  <p className="text-slate-600 mb-2">
                    <strong>Cause:</strong> Node version mismatch or strict dependency resolution conflict.
                  </p>
                  <p className="font-semibold text-slate-700">Solution:</p>
                  <div className="font-mono bg-slate-100 p-2 rounded text-[11px] select-all">
                    npm install --legacy-peer-deps
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-800 mb-1 text-sm text-amber-700">
                    2. MongooseServerSelectionError / ECONNREFUSED 127.0.0.1:27017
                  </h4>
                  <p className="text-slate-600 mb-2">
                    <strong>Cause:</strong> Local MongoDB service bandh hai ya installed nahi hai.
                  </p>
                  <p className="font-semibold text-slate-700">Solution:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>PowerShell me run karein: <code>Start-Service MongoDB</code></li>
                    <li>Ya MongoDB Atlas cluster URI <code>.env</code> file me daalein.</li>
                    <li>Built-in in-memory fallback enabled hai isliye server bina MongoDB ke bhi chalega!</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-800 mb-1 text-sm text-indigo-700">
                    3. CORS Policy Error
                  </h4>
                  <p className="text-slate-600 mb-2">
                    <strong>Cause:</strong> Port differences between frontend and backend.
                  </p>
                  <p className="font-semibold text-slate-700">Solution:</p>
                  <p className="text-slate-600">
                    <code>server.js</code> me <code>cors({`{ origin: '*', credentials: true }`})</code> enabled hai.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-800 mb-1 text-sm text-purple-700">
                    4. JsonWebTokenError / TokenExpiredError
                  </h4>
                  <p className="text-slate-600 mb-2">
                    <strong>Cause:</strong> 7 days passed or JWT secret changed.
                  </p>
                  <p className="font-semibold text-slate-700">Solution:</p>
                  <p className="text-slate-600">
                    Frontend automatically session expire hone par clean login screen dikhata hai.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Cognevance Task Management • Production Ready in JS/JSX</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
