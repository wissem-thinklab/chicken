import { useRoutes } from "react-router-dom";
import { authRoutes } from "./auth";
import { mainRoutes } from "./main";

export function Router() {
    return useRoutes([
        
        ...authRoutes,
        ...mainRoutes,

        {
            path: '*',
            element: <div>404</div>
        }
    ])
}