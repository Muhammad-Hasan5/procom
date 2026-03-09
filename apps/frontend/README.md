# ProCom Frontend

React + Vite frontend for the ProCom API (projects, tasks, notes, members).

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set your API base URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   (Use the port where your backend runs; ensure CORS allows this origin and credentials.)

## Run

- Development: `npm run dev`
- Build: `npm run build`
- Preview production build: `npm run preview`

## Features

- **Auth**: Sign up, sign in, sign out. Session via HTTP-only cookies.
- **Projects**: List (with search), create, open, overview, tasks, notes, members.
- **Tasks**: Kanban board (To do, In progress, Review, Done). Create, edit, change status, delete.
- **Notes**: List, create, edit content with save. Pin and archive.
- **Members**: View owner and members; add/remove members (owner only).

Protected routes redirect unauthenticated users to `/login`.
