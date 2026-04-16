import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import rtlPlugin from 'stylis-rtl'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import PublicRoutes from './routes/PublicRoutes'
import HomePage from './pages/Home'
import SupplierPage from './pages/Supplier'
import MaterialsPage from './pages/Materials'
import { useEffect } from 'react'
import axios from 'axios'
import TransactionsPage from './pages/Transactions'

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
})

const theme = createTheme({
  direction: 'rtl',
})

// Configure axios baseURL from environment variable
// Development: uses Vite proxy (/..)
// Production: uses deployed API endpoint
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
axios.defaults.baseURL = apiBaseURL

function App() {
  useEffect(() => {
    document.documentElement.dir = 'rtl'
  }, [])

  return (
    <>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
        <ToastContainer 
          position='top-right' 
          autoClose={2000}
        />
        <Routes>
          <Route path='/' element={<PublicRoutes />}>
            <Route index element={<HomePage />}/>
            <Route path='suppliers' element={<SupplierPage />}/>
            <Route path='materials' element={<MaterialsPage />}/>
            <Route path='transactions' element={<TransactionsPage />}/>
          </Route>
        </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </>
  )
}

export default App
