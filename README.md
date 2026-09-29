# HackConnect

**Find your team. Build something remarkable.**

HackConnect is a hackathon discovery and skill-matched team formation platform built for college students. Instead of scrambling through WhatsApp groups or teaming up with whoever's available, students build a skill profile, discover teammates whose skills complement their own, form teams through an invite/accept workflow, and register for hackathons as a complete team.

Originally conceived as a college project under the working title **HackMate**, HackConnect has evolved into a full-stack application with a MongoDB-backed backend, JWT authentication, role-based access control, and a custom skill-matching algorithm.

---

## Features

### For Students

* **Skill-based team matching** — recommendations prioritize complementary skills rather than simply matching students with identical skills.
* **Hackathon discovery** — browse hackathons with filters for domain, mode, and month.
* **Automatic filtering** — hackathons that have passed their end date are automatically hidden.
* **Invite-based team formation** — send invitations to potential teammates and accept or decline incoming requests.
* **Flexible recruitment** — any team member can recruit another student, not only the team leader.
* **Team uniqueness** — a student can only belong to one team per hackathon, enforced at the database level.
* **Team registration** — once the required roster is complete, the team leader can register the entire team.
* **Public student profiles** — view skills, bio, GitHub, LinkedIn, and hackathons attended.
* **Team departure** — students can leave an unregistered team, with leadership automatically transferred when necessary.

### For Organizers / Admins

* **Hackathon management** — create, edit, and delete hackathon listings.
* **Team-size configuration** — define the required team size for each hackathon.
* **Registration management** — view teams and students registered for each hackathon.
* **Analytics dashboard** — view student counts, upcoming and past hackathons, domain breakdowns, and recent registration activity.
* **Student directory** — search students and access their public profiles.

---

## Tech Stack

### Frontend — `hackconnect2`

* React 19
* Vite
* React Router v7
* Tailwind CSS v4
* Framer Motion
* Three.js via `@react-three/fiber`
* Axios
* lucide-react

### Backend — `hackconnect2-backend`

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcryptjs
* CORS
* dotenv
* Nodemon

### Database

MongoDB is used as the primary database.

The application uses five core collections:

* `users`
* `hackathons`
* `registrations`
* `teams`
* `teamrequests`

The backend uses compound unique indexes to help prevent duplicate registrations, duplicate relationships, and race conditions during team creation.

---

## Matching Algorithm

HackConnect uses a custom recommendation algorithm implemented in:

```text
hackconnect2-backend/utils/matching.js
```

The algorithm produces a **0–100 compatibility score** between two students using a weighted combination of skill coverage and skill similarity.

### 1. Coverage Ratio — 70%

The coverage ratio measures how many of the candidate's skills are skills that the current student does not already possess.

This gives higher scores to candidates who can **fill skill gaps** within a team.

### 2. Jaccard Similarity — 30%

Jaccard similarity measures the proportion of shared skills relative to the combined skill set.

This provides a smaller preference for candidates who have some common skills, helping maintain a degree of shared technical vocabulary within a team.

### Formula

```text
score = (coverageRatio × 0.7 + jaccardSimilarity × 0.3) × 100
```

The system intentionally uses a simple and explainable formula rather than a black-box recommendation model.

> Note: the matching system is based on coverage ratio and Jaccard similarity. It is not a cosine-similarity implementation.

---

## Project Structure

```text
HackConnect/
│
├── hackconnect2/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/                   # Route-level pages
│   │   ├── components/              # Shared UI components
│   │   ├── context/                 # Authentication and toast contexts
│   │   ├── services/                # API and frontend services
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── hackconnect2-backend/            # Node/Express backend
│   ├── config/                      # Backend configuration
│   ├── middleware/                  # JWT and role middleware
│   ├── models/                      # Mongoose models
│   ├── routes/                      # API routes
│   ├── scripts/                     # Utility scripts
│   ├── utils/                       # Matching and helper functions
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 18 or later
* npm
* MongoDB running locally, or access to a MongoDB connection string

---

### 1. Clone the Repository

```bash
git clone https://github.com/dakshchaudhary16/HackConnect.git
cd HackConnect
```

---

### 2. Install Frontend Dependencies

```bash
cd hackconnect2
npm install
```

---

### 3. Install Backend Dependencies

From the repository root:

```bash
cd ../hackconnect2-backend
npm install
```

---

## Environment Variables

### Backend

Create:

```text
hackconnect2-backend/.env
```

Add:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hackconnect
JWT_SECRET=replace_this_with_a_long_random_string
PORT=5050
```

### Frontend

Create:

```text
hackconnect2/.env
```

Add:

```env
VITE_API_URL=http://localhost:5050/api
```

> `.env` files are intentionally excluded from Git using `.gitignore`. Never commit real database credentials, JWT secrets, API keys, or other sensitive configuration.

The backend uses port **5050** by default rather than 5000 because port 5000 can be occupied by macOS services such as AirPlay Receiver on some systems.

If you change the backend port, update `VITE_API_URL` accordingly.

---

## Seed an Admin Account

From the backend directory:

```bash
cd hackconnect2-backend
npm run seed:admin
```

This creates a development administrator account:

```text
Email:    admin@hackconnect.com
Password: admin123
```

These credentials are intended for **local development/demo use only**.

Change the password before using the application in any real deployment.

---

## Running the Application

The frontend and backend run as separate development servers.

### Terminal 1 — Backend

```bash
cd HackConnect/hackconnect2-backend
npm run dev
```

The backend runs on:

```text
http://localhost:5050
```

### Terminal 2 — Frontend

```bash
cd HackConnect/hackconnect2
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

If that port is unavailable, Vite will automatically use the next available port.

The frontend communicates with the backend through:

```text
VITE_API_URL=http://localhost:5050/api
```

---

## API Overview

| Method | Endpoint                          | Description                           |
| ------ | --------------------------------- | ------------------------------------- |
| POST   | `/api/auth/register`              | Create a student account              |
| POST   | `/api/auth/login`                 | Log in as a student or organizer      |
| GET    | `/api/hackathons`                 | List active hackathons                |
| GET    | `/api/hackathons/:id`             | Get hackathon details                 |
| GET    | `/api/teams/matches`              | Get ranked teammate recommendations   |
| POST   | `/api/teams/invite`               | Invite a student to a team            |
| GET    | `/api/teams/requests`             | Get incoming and outgoing invitations |
| POST   | `/api/teams/requests/:id/accept`  | Accept a team invitation              |
| POST   | `/api/teams/requests/:id/decline` | Decline a team invitation             |
| POST   | `/api/teams/:teamId/register`     | Register a completed team             |
| POST   | `/api/teams/:teamId/leave`        | Leave an unregistered team            |
| PUT    | `/api/profile`                    | Update your own profile               |
| GET    | `/api/profile/:id`                | View another student's profile        |
| GET    | `/api/admin/hackathons`           | List admin hackathon data             |
| POST   | `/api/admin/hackathons`           | Create a hackathon                    |
| PUT    | `/api/admin/hackathons/:id`       | Update a hackathon                    |
| DELETE | `/api/admin/hackathons/:id`       | Delete a hackathon                    |
| GET    | `/api/admin/analytics`            | Get dashboard analytics               |
| GET    | `/api/admin/students`             | Get the student directory             |

Protected team and administrator endpoints require a valid JWT. Administrator endpoints additionally require the appropriate organizer/admin role.

---

## Authentication

HackConnect uses **JWT-based authentication**.

The general authentication flow is:

```text
User
  │
  ├── Register / Login
  │
  ▼
Backend
  │
  ├── Validate credentials
  ├── Hash / verify password
  └── Generate JWT
  │
  ▼
Frontend
  │
  └── Stores authentication state
        │
        ▼
   Axios API requests
        │
        └── JWT attached automatically
```

The backend validates the token through authentication middleware before allowing access to protected resources.

---

## Team Formation Flow

A typical team-building workflow is:

```text
Create Profile
      │
      ▼
Set Skills
      │
      ▼
Browse / Discover Hackathon
      │
      ▼
View Recommended Teammates
      │
      ▼
Send Team Invitation
      │
      ▼
Accept / Decline
      │
      ▼
Build Complete Team
      │
      ▼
Team Leader Registers
      │
      ▼
Hackathon Registration
```

This allows students to form teams based on actual skill requirements rather than relying only on existing social groups.

---

## Security & Data Protection

The project follows several basic security practices:

* Passwords are hashed using `bcryptjs`.
* Authentication uses signed JWT tokens.
* Protected API routes use authentication middleware.
* Admin functionality uses role-based authorization.
* MongoDB unique indexes help prevent duplicate records.
* Environment variables are excluded from version control.
* Database credentials and JWT secrets are not stored in source code.

For production deployment, additional security measures such as HTTPS, secure cookie/token handling, rate limiting, input validation, production secrets management, and stronger authentication policies should be added.

---

## Known Limitations

The current version is primarily designed as a full-stack college project and local development application.

Current limitations include:

* No real-time team chat.
* No real-time notification system.
* No avatar/image upload system.
* Currently configured primarily for local development.
* Production deployment and infrastructure hardening have not yet been implemented.
* JWT secret configuration requires a secure production secret.
* A student can currently be a team's leader while also having an unresolved pending invitation to another team for the same hackathon.

These are potential areas for future development.

---

## Future Improvements

Potential future enhancements include:

* Real-time team chat using WebSockets.
* Push/in-app notifications.
* Profile picture and media uploads.
* Email notifications for team invitations.
* Advanced recommendation models.
* Hackathon poster OCR and automatic event extraction.
* Automated skill extraction from resumes/GitHub profiles.
* Production deployment with managed MongoDB.
* Advanced admin analytics.
* Team activity and collaboration history.

---

## License

A license has not yet been specified.

If the project is eventually released as open source, an appropriate license such as MIT can be added through a `LICENSE` file.

---

## Author

**Daksh Chaudhary**

B.Tech Computer Science & Engineering
SRM Institute of Science and Technology

GitHub: `https://github.com/dakshchaudhary16`

---

## Project Status

HackConnect is an actively developed full-stack project.

The current version includes:

* React frontend
* Node.js/Express backend
* MongoDB database
* JWT authentication
* Role-based access control
* Skill-based teammate matching
* Team invitation and formation workflow
* Hackathon discovery
* Team registration
* Student profiles
* Organizer dashboard and management tools
