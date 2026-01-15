import { SidebarTrigger } from "../ui/sidebar";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-center flex-2/10">
        <SidebarTrigger />
        Controlls
      </div>
      <div className="flex items-center justify-center flex-7/10 bg-zinc-600">
        Board
      </div>
      <div className="flex items-center justify-center flex-1/10">footer</div>
    </div>
  );
}
