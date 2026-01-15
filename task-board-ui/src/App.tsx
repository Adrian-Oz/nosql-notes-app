import "./App.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/sidebar";

import Layout from "./components/layout/layout";

function App() {
  // return <Layout />;
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Layout />
      </main>
    </SidebarProvider>
  );
}

export default App;
