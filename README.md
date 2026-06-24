# Payment Hub EE - Operations Web App (React)

This repository contains the React-based rewrite of the Payment Hub EE Operations Web App. The goal is to achieve feature parity with the existing Angular Operations App through an MVP release targeted for version 2.1.0 (October 2026).

It is currently work in progress and not recommended for production deployment.

The `main` branch contains release code. All PRs should be submitted to the `dev` branch first, and will be merged to `main` at a release.

This project is part of **C4GT DMP 2026** under [The Mifos Initiative](https://mifos.org).

##  Tech Stack

- **React + TypeScript** – Frontend architecture
- **Vite** – Build tool
- **Tailwind CSS v4 + ShadCN UI (Radix Nova)** – UI and styling
- **React Router v6** – Routing
- **TanStack Query** – Server state management
- **Axios** – HTTP client
- **Keycloak** – Authentication and RBAC (OAuth2)

##  Project Structure

```
src/
├── modules/              # Feature modules, one per domain area
│   ├── auth/              # Keycloak integration, login, protected routes
│   ├── dashboard/          # Dashboard module cards
│   ├── payment-hub/        # Main Batches, Sub Batches, Transfers
│   ├── vouchers/            # Voucher Management (G2P)
│   ├── account-mapper/       # Beneficiary account mapping
│   ├── g2p-config/            # G2P Payment Configuration
│   ├── settings/                # App settings
│   └── rbac/                      # Role configuration and user management
├── components/
│   ├── ui/                # ShadCN UI primitives
│   └── shared/             # Shared components (AppLayout, DataTable, StatusBadge)
├── lib/
│   ├── api/                # Axios client setup, API interceptors
│   └── keycloak/            # Keycloak auth context and hooks
├── config/                  # Environment config, constants
├── types/                     # Shared TypeScript types
├── App.tsx                      # Root component
├── index.css                      # Tailwind base layer and theme
├── main.tsx                         # React entry point, router setup
└── vite-env.d.ts                      # Vite TypeScript definitions

root/
├── components.json          # ShadCN CLI config
├── index.html                 # App HTML shell
├── eslint.config.js             # Linting rules
├── .env.example                   # Environment variable template
└── .gitignore
```

##  Prerequisites

- Node.js and npm installed
- Access to a running Payment Hub EE backend instance (or use mock data during early development)
- A configured Keycloak realm for authentication (once auth integration begins)

##  Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/openMF/ph-ee-operations-web-react.git

# 2. Move into the project directory
cd ph-ee-operations-web-react

# 3. Install dependencies
npm install

# 4. Copy environment variables and configure them
cp .env.example .env

# 5. Start the development server
npm run dev
```

Navigate to `http://localhost:5173/` to view the app. It will automatically reload if you change any source files.

##  Environment Variables

Copy `.env.example` to `.env` and adjust the values as needed.

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the Payment Hub Operations backend services |
| `VITE_BULK_CONNECTOR_URL` | URL for Bulk Import Batch creation backend services |
| `VITE_KEYCLOAK_URL` | Keycloak auth server URL |
| `VITE_KEYCLOAK_REALM` | Keycloak realm used for authentication |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client identifier for this app |
| `VITE_TENANT_ID` | Default Platform Tenant Identifier used in API calls |

##  Routes

| Route | Description |
|---|---|
| `/splash` | Animated landing screen |
| `/login` | Login with Keycloak authentication |
| `/` | Dashboard with module cards |
| `/payment-hub` | Main Batches, Sub Batches, Transfers |
| `/vouchers` | Voucher Management (list and create) |
| `/account-mapper` | Beneficiary account mapping (list and create) |
| `/g2p-config` | G2P Payment Configuration (list and create) |
| `/settings` | App settings |
| `/rbac` | Role configuration and user management |
| `/reporting` | Reporting dashboard (in development) |

##  Building for Production

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

##  Contributing

Contributions are welcome to improve the project.

- All PRs should target the `dev` branch
- Reference the relevant Jira ticket in your PR title, e.g. `PHEE-XXX: short description`
- For design references, see the Figma file (link to be added)
- For backend integration questions or access, reach out to the project mentors

##  Related Links

- [Angular Operations App (reference implementation)](https://github.com/openMF/ph-ee-operations-web)
- [Jira Epic — PHEE-363](https://mifosforge.jira.com/browse/PHEE-363)
- [The Mifos Initiative](https://mifos.org)