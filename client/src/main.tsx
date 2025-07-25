import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { RouterProvider, } from "react-router";
import { ROUTER } from './Utils/Routes';
import { UserContextProvider } from './Context/User';
import NotifyProvider from './Context/Notify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotifyProvider>
    <UserContextProvider>
      <RouterProvider router={ROUTER} />
    </UserContextProvider>
    </NotifyProvider>
  </StrictMode>,
)
