# Payment Hub EE Operations Web

A web dashboard for managing [Mifos Payment Hub EE](https://mifos.org/payment-hub-ee/) operations — bulk payments, vouchers, account mapping, G2P configuration, RBAC, and reporting.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI and type safety |
| Vite | Build tooling and dev server |
| Tailwind CSS v4 + ShadCN (Nova) | Styling and accessible UI components |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state management and caching |
| Axios | HTTP client with per-request tenant header injection |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env` (see [Environment Variables](#environment-variables) below).

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Folder Structure

```
src/
├── components/
│   └── shared/
│       └── AppLayout.tsx       # Sidebar + header shell for protected routes
├── config/
│   └── constants.ts            # App-wide constants (tenants, app name)
├── lib/
│   ├── api/
│   │   └── client.ts           # Axios instance with X-TenantId interceptor
│   └── utils.ts                # Tailwind class merge utility (cn)
└── pages/
    ├── SplashScreen.tsx
    ├── LoginPage.tsx
    ├── Dashboard.tsx
    ├── PaymentHub.tsx
    ├── Vouchers.tsx
    ├── AccountMapper.tsx
    ├── G2PConfig.tsx
    ├── Settings.tsx
    ├── RBACConfig.tsx
    └── Reporting.tsx
```

## Routes

| Path | Component | Layout |
|---|---|---|
| `/splash` | SplashScreen | — |
| `/login` | LoginPage | — |
| `/` | Dashboard | AppLayout |
| `/payment-hub` | PaymentHub | AppLayout |
| `/vouchers` | Vouchers | AppLayout |
| `/account-mapper` | AccountMapper | AppLayout |
| `/g2p-config` | G2PConfig | AppLayout |
| `/settings` | Settings | AppLayout |
| `/rbac` | RBACConfig | AppLayout |
| `/reporting` | Reporting | AppLayout |

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the PH-EE operations API |
| `VITE_BULK_CONNECTOR_URL` | URL for the bulk connector service |
| `VITE_KEYCLOAK_URL` | Keycloak authentication server URL |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client ID for this application |
| `VITE_TENANT_ID` | Default tenant identifier |

The active tenant is also stored in `localStorage` under the key `tenant` and is sent with every API request as the `X-TenantId` header.
