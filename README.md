# Task Tracker App

A simple task management app where users can:

- Register and log in
- Create projects
- Create, view, update, and delete tasks within projects

##  Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT (JSON Web Tokens)


## Setup

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ronit1808/Tracker.git
   cd Tracker/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a .env file and add:**
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Routes
- POST /api/auth/register - Register a user

- POST /api/auth/login - Login and receive token

- GET /api/projects - Get all projects (authenticated)

- POST /api/projects - Create a new project

- GET /api/tasks/:projectId - Get tasks for a project

- POST /api/tasks/:projectId - Create task under project

- PUT /api/tasks/:taskId - Update task

- DELETE /api/tasks/:taskId - Delete task


