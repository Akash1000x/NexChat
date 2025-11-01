import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
// import { TanStackDevtools } from "@tanstack/react-devtools"

// import Header from '../components/Header'

// import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import type { QueryClient } from "@tanstack/react-query"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import ThemeToggle from "@/components/ui/theme-toggle"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <ThemeToggle />
        <Outlet />
        <Toaster />
      </SidebarProvider>
      {/* <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      /> */}
    </ThemeProvider>
  ),
})
