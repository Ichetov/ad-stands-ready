
import { HomePage } from '@/pages/home/ui/HomePage'
import { StandDetailsPage } from '@/pages/stand-details/ui/StandDetailsPage'
import { RequestPage } from '@/pages/request/ui/RequestPage'
import { AdminLoginPage } from '@/pages/admin-login/ui/AdminLoginPage'
import { AdminStandsPage } from '@/pages/admin-stands/ui/AdminStandsPage'
import { AdminStandCreatePage } from '@/pages/admin-stand-create/ui/AdminStandCreatePage'
import { AdminStandEditPage } from '@/pages/admin-stand-edit/ui/AdminStandEditPage'
import { ProtectedAdminRoute } from '@/processes/protected-admin-route/ui/ProtectedAdminRoute'
import { AdminLayout } from '@/widgets/admin-layout/ui/AdminLayout'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/stands/:slug',
    element: <StandDetailsPage />
  },
  {
    path: '/request',
    element: <RequestPage />
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />
  },
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: 'stands',
            element: <AdminStandsPage />
          },
          {
            path: 'stands/new',
            element: <AdminStandCreatePage />
          },
          {
            path: 'stands/:id/edit',
            element: <AdminStandEditPage />
          }
        ]
      }
    ]
  }
])