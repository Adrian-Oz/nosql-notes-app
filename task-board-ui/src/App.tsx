import "./App.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./features/nav/app-sidebar";

import Layout from "./components/layout";

function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="absolute inset-0 bg-background -z-10" />
      <AppSidebar />
      <main className="w-full overflow-y-hidden">
        <Layout />
      </main>
    </SidebarProvider>
  );
}

export default App;
