# Payment Hub EE — Operations Web App (React)

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)](https://reactjs.org/)
[![ShadCN UI](https://img.shields.io/badge/ShadCN%2FUI-latest-black)](https://ui.shadcn.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

> **Status:** 🚧 This project is currently under active development as part of [DMP 2026](https://github.com/openMF/ph-ee-operations-web-react/issues/2). Contributions are welcome.

---

## Overview

This is the new React-based Operations Web UI for **Payment Hub Enterprise Edition (PH-EE)** — a modern payment orchestration engine developed by [The Mifos Initiative](https://mifos.org/) that enables Digital Financial Service Providers (DFSPs) and governments to connect to real-time payment systems.

This application is a greenfield rewrite of the [existing Angular Operations App](https://github.com/openMF/ph-ee-operations-web), built from the ground up using **React** and **ShadCN/UI**. It targets the PH-EE 2.1 release (October 2026) and aims to replicate and extend the functionality of the Angular app in a more modular, maintainable, and testable architecture.

### What Does This App Do?

The Operations UI is the primary interface for PH-EE users to:

- Monitor and manage **G2P** (Government to Person), **P2G** (Person to Government), and **Voucher** payment transactions
- Manage **DFSP (Digital Financial Service Provider)** payment orchestration
- View **bulk transaction dashboards** with failure rates and performance metrics
- Authenticate via **Keycloak** with role-based access control (RBAC) — different views for different user roles
- Support both **GovStack** and **non-GovStack** deployment modes

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 18+](https://reactjs.org/) | Core UI framework |
| [ShadCN/UI](https://ui.shadcn.com/) | Component library built on Radix UI |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Keycloak](https://www.keycloak.org/) | Authentication and RBAC |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Recharts](https://recharts.org/) | Dashboard visualizations |
| [Axios](https://axios-http.com/) | HTTP client for API integration |

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x
- A running instance of the [PH-EE backend](https://github.com/openMF/ph-ee-start-here) **or** access to the sandbox/demo environment
- (Optional) A configured [Keycloak](https://www.keycloak.org/) instance if enabling OAuth/RBAC

---

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/<your-username>/ph-ee-operations-web-react.git
cd ph-ee-operations-web-react
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Update the values as needed:

```env
# Backend API
VITE_BACKEND_SERVER_URL=http://localhost:8080

# OAuth / Keycloak
VITE_OAUTH_ENABLED=true
VITE_OAUTH_SERVER_URL=http://localhost:8180/auth
VITE_OAUTH_REALM=<your-keycloak-realm>
VITE_OAUTH_CLIENT_ID=<your-keycloak-client-id>

# Tenant
VITE_PLATFORM_TENANT_ID=phdefault
```

> If OAuth is disabled (`VITE_OAUTH_ENABLED=false`), the app falls back to basic authentication. Contact your PH-EE administrator for the correct Keycloak realm and client ID values.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
ph-ee-operations-web-react/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (ShadCN + custom)
│   │   ├── ui/              # ShadCN base components
│   │   └── shared/          # App-level shared components
│   ├── pages/               # Route-level page components
│   │   ├── Transactions/    # G2P, P2G, Voucher transaction views
│   │   ├── Dashboard/       # Bulk transaction dashboards
│   │   └── Auth/            # Login and authentication
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer (Axios)
│   ├── lib/                 # Utilities and helpers
│   ├── types/               # TypeScript type definitions
│   ├── routes/              # React Router configuration
│   └── main.tsx             # App entry point
├── .env.example             # Environment variable template
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts           # Vite configuration
└── README.md
```

---

## Planned Features (MVP Scope)

The MVP replicates the core functionality of the existing Angular app:

- **Authentication** — Keycloak-based login with role-differentiated views (Admin, Operator, Viewer)
- **Transaction Management** — View, filter, and search G2P, P2G, and Voucher transactions
- **Bulk Payment Dashboard** — Overview of bulk transaction batches with status and failure rates
- **Reporting** — Performance metrics and transaction throughput visualizations
- **GovStack Support** — UI adapts for GovStack and non-GovStack deployment modes
- **Modular Architecture** — Components are designed for extensibility as new PH-EE capabilities are added

---

## Contributing

We welcome contributions! This project is part of **[DMP 2026](https://github.com/openMF/ph-ee-operations-web-react/issues/2)** by the Mifos Initiative.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes and write tests where applicable
4. Commit using conventional commits: `git commit -m "feat: add transaction filter component"`
5. Push to your fork: `git push origin feat/your-feature-name`
6. Open a Pull Request against the `dev` branch

### Branch Naming

| Type | Format |
|---|---|
| Feature | `feat/<short-description>` |
| Bug Fix | `fix/<short-description>` |
| Documentation | `docs/<short-description>` |
| Refactor | `refactor/<short-description>` |

### Code Style

- Follow the existing component structure and naming conventions
- Use ShadCN components before writing custom ones
- Write unit tests for new components using **Jest** and **React Testing Library**
- Run `npm run lint` before opening a PR

---

## Reference

- 📦 [Existing Angular Operations App](https://github.com/openMF/ph-ee-operations-web) — the app this project is replacing
- 📚 [PH-EE Documentation](https://mifos.gitbook.io/docs/payment-hub-ee/overview) — backend API and data dictionary
- 🎨 [GovStack UI Design Wireframes](https://govstack-global.atlassian.net/wiki/spaces/GH/pages/251527172/UI+Design+Wireframes+-+Delivery+Milestone+1) — design reference
- 🏠 [Mifos Community](https://mifos.org/resources/community/) — community hub and calendar
- 💬 [Mifos Discourse Forum](https://discourse.mifos.org/) — developer discussions
- 🔗 [Mifos Slack](https://mifos.short.gy/slack) — primary communication channel

---

## Mentors

- [@DavidH-1](https://github.com/DavidH-1)
- [@IOhacker](https://github.com/IOhacker)

---

## License

This project is licensed under the [Mozilla Public License 2.0](./LICENSE).
