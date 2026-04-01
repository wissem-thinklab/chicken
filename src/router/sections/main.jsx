import { lazy } from 'react'
import { AuthGuard } from '../../auth/guard'
import { Outlet } from 'react-router-dom'
import Layout from '../../layouts/main-layout/layout'

const GamePage = lazy(() => import('../../pages/game'))

export const mainRoutes = [
  {
    path: '/',
    element: (
        <AuthGuard>
            <Layout>
                <Outlet />
            </Layout>
        </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <GamePage />
      }
    ]
  }
]