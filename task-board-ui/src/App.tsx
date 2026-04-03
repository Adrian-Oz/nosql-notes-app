import "./App.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./features/nav/app-sidebar";

import Layout from "./components/layout";
import { useEffect } from "react";
import { useAuthStore } from "./features/auth/useAuthStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import LayoutSkeleton from "./components/layout-skeleton";
function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="absolute inset-0 bg-background -z-10" />
      <AppSidebar />
      <main className="w-full overflow-y-hidden">
        {!isAuthLoading && <Layout />}
        {isAuthLoading && <LayoutSkeleton />}
      </main>
    </SidebarProvider>
  );
}

export default App;
