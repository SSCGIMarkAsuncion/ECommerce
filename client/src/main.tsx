import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { RouterProvider, } from "react-router";
import { ROUTER } from './Utils/Routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ROUTER} />
  </StrictMode>,
)
