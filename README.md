# Coding Challenge - Classroom Management App

# Project Setup and Run Instructions

## Prerequisites
- **Node.js**
- **npm**
- **apikeys.txt** file (provided in email)

## Setup and Running Instructions

Follow these steps to set up and run the project:

### 1. Set Up the Server (Express.js)

1. At the root of the project, navigate to the server folder

   ```bash
   cd /server
   ```

2. Rename .env.example to .env

    ```bash
   mv .env.example .env
   ```

3. **IMPORTANT:** Copy and paste everything from **apikeys.txt** provided in email to .env OR use your own keys.
  
4. Install the dependencies and start the server
   ```bash
   npm install
   npm run build
   npm run start
   ```

   The server application will be accessible at `http://localhost:3005`.

### 2. Set Up the Client (Next.js)

1. Come to the root of the project then navigate to the client folder

   ```bash
   cd /client
   ```

2. Rename the `.env.example` file to `.env`:

   ```bash
   mv .env.example .env
   ```
3. Install the dependencies and start the client
   ```bash
   npm install
   npm run build
   npm run start
   ```

  The client application will be accessible at `http://localhost:3000`.


# Project Structure

## Server directory breakdown
- **`src/`**: Contains the core application code.
  - `api/`: External APIs configuration for Twilio (SMS) and Postmark (Email).
  - `config/`: Firebase database configuration and Socket.io setup.
  - `controllers/`: Contains logic for handling API endpoint requests.
    - `authController.ts`: Handles sign in, sign up, create access code, validate access code, account set up (student), log out.
    - `chatController.ts`: Getting all available users for the chat application.
    - `lessonController.ts`: Handles assigning students to lessons, creating lessons, mark lessons completed.
    - `studentController.ts`: CRUD (Create, Read, Update, Delete) for managing students.
    - `verificationCodeController.ts`: Helper functions for adding, deleting, getting, checking access code from database.
  - `middlewares/`: Verifies JWT token and check user role before reaching to the specific controllers.
  - `models/`: Types definition for user and access code from database.
  - `routes/`: Routes definition of the entire application.
  - `schemas/`: Contains Zod objects for validating user inputs.
  - `utils`: Helper functions: generate random access code, password hasher and password compare.


## Client directory breakdown
- **`src/`**: Contains the core application code.
  - `app/`: File-system based routing.
    - `(auth)`: Contains pages relating to authentication: sign-in, sign-up, account set up (student).
    - `(protected)`: Contains pages for authenticated users.
      - `lessons/`: User with role 'instructor' can assign lessons to students. Role 'student' can view all assign lessons and mark completed.
      - `message/`: Chat application.
      - `profile/`: User can edit their profile details on this page.
      - `students/`: For user with role 'instructor' to manage all students.
    - `components/`: Contains all UI components for above pages.
      - `lesson/`: Includes lesson list and add lesson dialog (modal) components
      - `message/`: All components related to chat application.
      - `profile/`: Contains profile editing form.
      - `students-table`: Provides table for displaying all students and dialogs for adding, editing, deleting students.
      - `ui/`: Contains Shadcn UI components.
    - `hooks/`: Customed React hooks for displaying dialogs and tracking browser window size.
    - `lib/`: Contains Shadcn helper function.
    - `stores/`: Contains Zustand stores for state management of the entire application.
    - `middleware.ts`: Redirecting unauthenticated users by verifying JWT token.

## Application screenshots





   
