# CashBook Integration Guide

## Key Changes
1. **Authentication**:
   - Added `useAuthStore` (Zustand) for managing user state.
   - Implemented `ProtectedRoute` to secure dashboard routes.
   - Updated `Login.tsx` and `SignUp.tsx` to connect with backend APIs.
   - Added HTTP-only cookie support via Axios interceptors.

2. **State Management**:
   - Integrated **React Query** for server state management (Cashbooks, Entries).
   - Created custom hooks: `useCashbooks` and `useEntries`.
   - Improved UI responsiveness with loading states and toast notifications.

3. **API Client**:
   - Created a centralized Axios client in `src/api/client.ts`.
   - Configured automatic token refresh handling.

## How to Run
1. **Backend**:
   - Ensure the backend is running at `http://localhost:5000`.
   - Configure `.env` in the backend with database and JWT secrets.

2. **Frontend**:
   - Install dependencies: `npm install`.
   - Set `VITE_API_BASE_URL` in `.env`.
   - Run development server: `npm run dev`.

## Environment Variables
Create a `.env` file in the root of the UI project:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```
