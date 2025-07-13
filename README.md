# Mandor Tracking System
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/ChandraBudiWijaya/website-mandor-tracking-system.git)

A web-based dashboard for the Mandor Tracking System, built with React, Material-UI, and Firebase. This dashboard helps supervisors efficiently manage and monitor plantation operations, featuring real-time foreman tracking, daily activity summaries, and geofence management.

## Table of Contents
- [Mandor Tracking System](#mandor-tracking-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Setup and Installation](#setup-and-installation)
  - [Usage](#usage)

## Features

-   **Secure Authentication**: Robust login system using Firebase Authentication (Email/Password) with session timeout for inactivity.
-   **Live Dashboard**: Real-time map displaying the current location of all employees, with a selectable and collapsible employee list.
-   **Location History**: Review the historical path of an employee for a specific date, with playback controls (play, pause, speed adjustment) to visualize movement over time.
-   **Daily Summary**: View a detailed summary of daily operational data, including a doughnut chart that visualizes time spent inside versus outside the designated work area.
-   **Employee Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing employee data.
-   **Geofence Management**: Create, edit, and delete designated work areas (Geofences) by drawing polygons on a map and assigning them to specific employees.
-   **Modern UI**: A responsive and visually appealing user interface built with Material-UI, featuring a light/dark mode toggle and a "frosted glass" aesthetic on the login page.

## Technology Stack

**Frontend:**
-   **React.js**: Core UI library.
-   **React Router**: For client-side routing and navigation.
-   **Material-UI (MUI_v5)** & **Emotion**: For UI components and styling.
-   **Tailwind CSS**: For utility-first styling.
-   **Leaflet** & **React-Leaflet**: For interactive maps.
-   **Leaflet-Draw**: For drawing and editing geofences on the map.
-   **Chart.js** & **React-Chartjs-2**: For creating summary charts.
-   **React Pro Sidebar**: For the collapsible sidebar navigation.

**Backend / Database:**
-   **Firebase**:
    -   **Authentication**: For user login management.
    -   **Firestore**: As the NoSQL database for storing employee data, location logs, geofences, and daily summaries.

## Project Structure

The project is structured to separate concerns, making it modular and maintainable.

```
src/
├── api/              # Firebase configuration and initialization.
├── assets/           # Static assets like images and SVGs.
├── components/       # Shared, reusable UI components (Navbar, Sidebar, etc.).
├── context/          # React Context for global state (Authentication, Theme).
├── features/         # Core application modules, divided by feature.
│   ├── auth/         # Login page and related components.
│   ├── dashboard/    # Real-time tracking dashboard, map, and employee list.
│   ├── history/      # Location history page, map, summary panel, and hooks.
│   └── management/   # Employee and Geofence management pages and modals.
├── hooks/            # Custom reusable hooks (e.g., useEmployees, useGeofences).
└── theme/            # Theme configuration for Material-UI (light/dark modes).
```

## Setup and Installation

To run this project locally, follow these steps:

**1. Prerequisites:**
-   Node.js (v14.x or higher)
-   npm (v8.x or higher) or Yarn

**2. Clone the Repository:**
```bash
git clone https://github.com/chandrabudiwijaya/website-mandor-tracking-system.git
cd website-mandor-tracking-system
```

**3. Install Dependencies:**
```bash
npm install
```
or
```bash
yarn install
```

**4. Set Up Environment Variables:**
Create a `.env` file in the root of the project and add your Firebase project configuration. You can find these credentials in your Firebase project console.
```
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
```

**5. Start the Development Server:**
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## Usage

-   **Login**: Use the credentials configured in your Firebase Authentication to log in.
-   **Dasbor (Dashboard)**: View the live location of all active employees. Click on an employee from the list to focus the map on their location.
-   **Riwayat (History)**: Select an employee and a date to view their travel path. Use the playback controls to see their movement chronologically. A summary chart will show the time spent within their assigned geofence.
-   **Manajemen (Management)**:
    -   **Karyawan (Employees)**: Add new employees, update their details, or remove them from the system.
    -   **Area Kerja (Work Areas)**: Define geofences by drawing on the map, assign them to employees, and manage existing areas.