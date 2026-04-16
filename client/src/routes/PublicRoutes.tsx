import { Outlet, useLocation } from 'react-router'
import { useLayoutEffect } from 'react'

const PublicRoutes = () => {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
        {/* <Navbar fixable /> */}
        <Outlet />
    </>
  )
}

export default PublicRoutes