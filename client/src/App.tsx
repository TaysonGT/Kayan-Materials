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
import InvoicesPage from './pages/Invoices'
import SingleInvoicePage from './pages/Invoices/SingleInvoice'

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
})

const theme = createTheme({
  direction: 'rtl',
})

// Configure axios
// All API calls use /api prefix (see src/api/*.ts files)
// Development: Vite proxy intercepts /api/* and forwards to backend
// Production: Server/Netlify handles /api routing
axios.defaults.baseURL = import.meta.env.DEV? 'http://localhost:5000': import.meta.env.VITE_BACKEND_URL || '/';

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
            <Route path='/invoices'>
              <Route index path='/invoices' element={<InvoicesPage />}/>
              <Route path='/invoices/:invoiceId' element={<SingleInvoicePage />}/>
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </>
  )
}

export default App
