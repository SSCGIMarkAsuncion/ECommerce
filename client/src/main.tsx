import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { RouterProvider, } from "react-router";
import { ROUTER } from './Utils/Routes';
import { UserContextProvider } from './Context/User';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={ROUTER} />
    </UserContextProvider>
  </StrictMode>,
)
