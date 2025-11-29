# Total Life Daily

A health and wellness blog platform mirroring [daily.totallife.com](https://daily.totallife.com/), featuring
science-backed content built on Total Life's five essential pillars: Nourishment, Restoration, Mindset, Relationships,
and Vitality.

## Project Structure

```
total-life-daily/
├── frontend/          # Next.js web application
├── backend/           # Python FastAPI server (coming soon)
└── README.md          # This file
```

## Quick Start

### Prerequisites

Before you begin, make sure you have these installed on your computer:

1. **Node.js** (v18 or higher)
    - Download from: https://nodejs.org/
    - Choose the LTS (Long Term Support) version
    - Run the installer and follow the prompts
    - Restart your terminal after installation

2. **npm** (comes with Node.js)
    - Verify installation by running: `node --version` and `npm --version`

### Running the Frontend (Website)

1. **Open a terminal** (Command Prompt, PowerShell, or Terminal)

2. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

3. **Install dependencies** (only needed the first time, or when packages change):
   ```bash
   npm install
   ```
   This downloads all the required packages. It may take a few minutes.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **View the website:**
    - Open your web browser
    - Go to: **http://localhost:3000**
    - You should see the Total Life Daily homepage!

6. **Stop the server:**
    - Go back to your terminal
    - Press `Ctrl + C` to stop the server

### Common Commands

| Command         | What it does                                    |
|-----------------|-------------------------------------------------|
| `npm install`   | Downloads all required packages                 |
| `npm run dev`   | Starts the development server at localhost:3000 |
| `npm run build` | Creates a production-ready build                |
| `npm run start` | Runs the production build                       |
| `npm run lint`  | Checks code for errors and style issues         |

### Troubleshooting

**"npm is not recognized"**

- Node.js isn't installed or not in your PATH
- Try reinstalling Node.js and restart your terminal

**"Port 3000 is already in use"**

- Another application is using port 3000
- Either close that application, or run: `npm run dev -- -p 3001` to use a different port

**Page shows errors**

- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

**Changes not showing up**

- The dev server has hot-reload, changes should appear automatically
- If not, try refreshing the page or restarting the dev server

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Framer Motion** - Animation library

### Backend (Coming Soon)

- **FastAPI** - Python web framework
- **Python 3.11+** - Backend language

## Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [Design System](./frontend/DESIGN_SYSTEM.md) - Colors, typography, and component styles

