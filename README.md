# AI-Powered Resume Builder

This is a web-based application that helps users build professional resumes with the assistance of AI. It provides a user-friendly interface to enter personal information, work experience, education, skills, and more, and then generates a polished resume. The application is built as a Progressive Web App (PWA), allowing for offline use and installation on various devices.

## How It Works

The application allows users to:
- Create an account and log in to save their resume data.
- Fill out various sections of a resume, including personal details, professional summary, work experience, education, skills, projects, and achievements.
- Use an AI assistant to help generate or improve content for different resume sections.
- Preview the resume in real-time.
- Download the final resume as a PDF.
- Manage their profile and settings.

The frontend is built with React and Vite, communicating with a Supabase backend for data storage, authentication, and serverless functions.

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) for UI components
  - Progressive Web App (PWA)
- **Backend & Database:**
  - [Supabase](https://supabase.io/) (PostgreSQL, Authentication, Storage, Edge Functions)
- **AI Services:**
  - [Google Gemini API](https://ai.google.dev/)
  - [DeepSeek API](https://www.deepseek.com/) (as a fallback)
- **Error Tracking:**
  - [Sentry](https://sentry.io/)
- **Deployment:**
  - Netlify/Vercel or similar for the frontend
  - Supabase for the backend services.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/) (which includes npm)

You also need a Supabase account to set up the backend.
- [Supabase](https://supabase.io/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/haroonriazhr/Resume-Genie---BOLT-Hackathon
    cd Resume-Genie---BOLT-Hackathon
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Supabase:**
    - Go to [Supabase](https://supabase.io/), create a new project.
    - Navigate to the SQL Editor and run the migration files located in the `supabase/migrations` directory to set up your database schema.
    - Create a `.env` file in the root of your project.
    - Copy your Project URL and `anon` public key into the `.env` file like this:

    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **Set up AI Services (Optional):**
    - To enable AI-powered content generation, you need API keys from Google and/or DeepSeek.
    - Get your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Get your DeepSeek API key from the [DeepSeek Platform](https://platform.deepseek.com/api_keys).
    - Add the keys to your `.env` file:

    ```env
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    VITE_DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
    ```
    > **Note:** The application will fall back to providing sample content if no API keys are configured.

5.  **Set up Sentry (Optional):**
    - If you want to use Sentry for error tracking, create an account at [Sentry.io](https://sentry.io/).
    - Create a new project and get your DSN.
    - Add the DSN to your `.env` file:

    ```env
    VITE_SENTRY_DSN=YOUR_SENTRY_DSN
    ```

6.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

---
This README provides a comprehensive overview for new developers or users to understand, set up, and contribute to the project.
