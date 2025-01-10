# Images and videos backup app

Build with expressjs and react

## Features

- Store images and videos in the cloud.
- Download them when you want.
- Manage uploaded images and videos
- Manage user's profile details

## Tech Stack

### Backend

- **Frameword**: ExpressJS
- **Database**: MongoDB
- **Authentication**: session cookie
- **Storage**: Cloudinary (for media uploads)

### Frontend

- **Library**: React (with TypeScript)
- **UI Framework**: React Bootstrap
- **Routing**: React Router v6

### **Hosting**

- **Server**: Render
- **Front end**: Served by express app

## Installation

- Node.js 16+
- PostgreSQL / MongoDB database instance

### Backend setup

1. Fork and clone the repository.
2. Navigate to server folder.
   ```bash
   cd server
   ```
3. Configure the environment variables in .env
4. Install dependencies
   ```bash
   npm install
   ```
5. Run development server
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Access the app at 'http://localhost:5173'

## Deployment

### Frontend Deployment

1. ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the front end application
   ```bash
   npm run build
   ```
4. Deliver the index.html file in "dist" folder from express app

### Backend deployment

1. ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app
   ```bash
   npm start
   ```

## Contact

For any questions or feedback, please reach out to:

- **Email**: rohithashok19@gmail.com
- **GitHub**: [Roh1512](https://github.com/roh1512)
