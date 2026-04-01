import { lazy, Suspense } from "react";
import { GuestGuard } from "../../auth/guard";
import { Outlet } from "react-router-dom";
import AuthSplitLayout from "../../layouts/auth-split/auth-split-layout";

const SignInPage = lazy(() => import('../../auth/views/sign-in-view'));
const SignUpPage = lazy(() => import('../../auth/views/sign-up-view'));

export const authRoutes = [{
    path: 'auth',
    element: (
        <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
        </Suspense>
    ),
    children: [
        {
            index: true,
            element: (
                <GuestGuard>
                    <AuthSplitLayout>
                        <SignInPage />
                    </AuthSplitLayout>
                </GuestGuard>
            ),
        },
        {
            path: 'sign-up',
            element: (
                <GuestGuard>
                    <AuthSplitLayout>
                        <SignUpPage />
                    </AuthSplitLayout>
                </GuestGuard>
            ),
        },
        {
            path: '*',
            element: (
                <GuestGuard>
                    <AuthSplitLayout>
                        <SignInPage />
                    </AuthSplitLayout>
                </GuestGuard>
            ),
        },
    ],
}];