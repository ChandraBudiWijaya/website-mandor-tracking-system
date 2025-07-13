<div align="center">
<h1 align="center">📍 WEBSITE-MANDOR-TRACKING-SYSTEM 📍</h1>

<p align="center"><i>Transforming Operations with Real-Time Precision and Insight</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-last%20friday-informational?style=flat-square" />
  <img src="https://img.shields.io/badge/javascript-96.8%25-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/languages-3-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-green.svg?style=flat-square" />
</p>

### Built with the tools and technologies:

![JSON](https://img.shields.io/badge/JSON-black?style=for-the-badge&logo=json)
![Markdown](https://img.shields.io/badge/Markdown-black?style=for-the-badge&logo=markdown)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735?style=for-the-badge&logo=autoprefixer&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
</div>

---

## 📘 Description

**Website-Mandor-Tracking-System** is a web-based dashboard designed to **monitor workforce activity in plantation areas in real-time**. This system leverages **React**, **Firebase**, and **Leaflet.js** to deliver accurate information, location visualization, and comprehensive data management for employees and work areas.

---

## 🚀 Key Features

- 🔐 **Secure Authentication** — Login via Firebase Authentication with session timeout.
- 🗺️ **Live Dashboard** — Real-time map with clickable list of active employees.
- 📍 **Location History** — Playback of employee movement by selected date.
- 📊 **Daily Summary** — Donut chart visualizing inside/outside geofence time.
- 👥 **Employee Management** — CRUD operations with interactive forms.
- 🗂️ **Geofence Management** — Draw/edit work areas using polygons on map.
- 🌙 **Modern UI** — Responsive design, dark mode, and frosted-glass login look.

---

## 🛠️ Technology Stack

### Frontend:
- ⚛️ React.js
- 🧭 React Router
- 🎨 Material-UI v5 & Emotion
- 💨 Tailwind CSS
- 🌍 Leaflet & React-Leaflet
- ✏️ Leaflet-Draw
- 📈 Chart.js & React-Chartjs-2
- 📚 React Pro Sidebar

### Backend & Database

- Firebase (Authentication & Firestore)

---

## 📁 Project Structure

```
src/
├── api/              # Firebase config
├── assets/           # Images, SVGs, etc.
├── components/       # Shared UI components
├── context/          # Global context (Auth, Theme)
├── features/         # Main app modules
│   ├── auth/         # Login page
│   ├── dashboard/    # Map & employee list
│   ├── history/      # Location history & chart
│   └── management/   # Employee & geofence management
├── hooks/            # Custom hooks
└── theme/            # Theme settings
```

---

## 🧰 Installation & Setup

### 1. Prerequisites

- Node.js v14+
- npm or Yarn

### 2. Clone the Repository

```bash
git clone https://github.com/chandrabudiwijaya/website-mandor-tracking-system.git
cd website-mandor-tracking-system
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Firebase Configuration

Create a `.env` file in the root folder and add the following:

```
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
```

### 5. Run the Application

```bash
npm start
```

Open your browser at `http://localhost:3000`

---

## 💻 Usage

### 🔐 Login

Log in using an account registered in Firebase Authentication.

### 📊 Dashboard

- Displays real-time location of workers.
- Click an employee name to zoom to their location.

### 🧭 Location History

- Choose an employee and date.
- Replay their movements and view inside/outside summary.

### 🛠️ Management

- Add/edit/delete employees.
- Draw and assign geofences to employees.

---

## ✨ Contribution

Pull requests are welcome! For major changes, please open an issue first.

---

## 📝 License

**License:** Apache License 2.0 © 2025 Chandra Budi Wijaya

This project is licensed under the [Apache License 2.0](./LICENSE).  
You are free to use, modify, and distribute this code **as long as proper credit is given**:

> Created by **Chandra Budi Wijaya**

Removing the author’s name or violating the license terms may result in legal consequences.

---

> This documentation is intended to help future development and deployment by backend, frontend, and operational teams.