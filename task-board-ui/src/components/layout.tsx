import Board from "../features/board/board";
import CustomSidebarToggle from "../features/nav/custom-sidebar-toggler";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col gap-4 p-4">
      <div className="flex items-center h-12  rounded-xl relative">
        <CustomSidebarToggle />
        {/* header */}
      </div>
      <div className="flex items-center h-32 rounded-xl gap-4">
        <div className="flex flex-1  bg-zinc-600/10 h-full rounded-xl items-center justify-center">
          Options
        </div>
        <div className="flex flex-1 bg-zinc-600/10 h-full rounded-xl items-center justify-center">
          Options
        </div>
        <div className="flex flex-1 bg-zinc-600/10 h-full rounded-xl items-center justify-center">
          Options
        </div>
      </div>
      <div className="flex  min-h-0  flex-1 bg-zinc-600/10 rounded-xl">
        <Board />
      </div>
      <div className="flex items-center justify-center h-24 bg-zinc-600/10 rounded-xl">
        footer
      </div>
    </div>
  );
}
