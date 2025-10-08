# Q&A Platform for Programming Issues
A Q&A platform where programmers can post questions, reply with solutions, and discuss coding topics.
Users can create accounts, manage their posts, and participate in threaded discussions with nested replies.
The platform includes a rating system for upvoting or downvoting replies, a search feature to filter posts by keyword or user, and admin moderation tools for managing users and content.

## How to Run the Application
- **Create a `.env` File** – In the root of the project folder, add the following configuration:

  ```bash
  MYSQL_ROOT_PASSWORD=<your_mysql_root_password>
  MYSQL_DATABASE=<your_database_name>

  DB_HOST=mysql
  DB_USER=root
  DB_PASSWORD=<your_mysql_root_password>
  DB_NAME=<your_database_name>
  DB_PORT=3306
  ```
- **Build the Containers** – Make sure Docker is installed and running, then in the project directory run:
 ```docker
docker compose build
 ```
- **Start the Containers** – After the build completes, run the following command to start the services:
 ```docker
docker compose up
 ```
- **Access the Application** – Once the containers are running, open your browser and go to: http://localhost:5173/
- The frontend will launch automatically and connect to the backend and database.

## Tech Stack
- **JavaScript** – Primary language used for both frontend and backend development.  
- **ReactJS** – Frontend framework for creating dynamic and fast user interfaces.  
- **Node.js** – Backend runtime for executing JavaScript server-side.  
- **Express.js** – Backend framework for handling API routes and middleware.  
- **MySQL** – Relational database for storing user data, posts, and replies.  
- **Axios** – For sending HTTP requests between the frontend and backend.  
- **dotenv** – For managing environment variables securely.  
- **Docker** – For containerizing and deploying the entire stack consistently.  
- **Vite** – Build tool for fast frontend development.

