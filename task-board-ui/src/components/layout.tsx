import { BoardDebug } from "@/dev/board-debug";
import Board from "../features/board/board";
import CustomSidebarToggle from "../features/nav/custom-sidebar-toggler";

import { Toaster } from "sonner";
import AddIssueForm from "@/features/board/issue-dialog";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col gap-4 p-4">
      <div className="flex items-center h-12  rounded-xl relative">
        <CustomSidebarToggle />
        <Toaster />
        <AddIssueForm />
        {/* header */}
      </div>
      <div className="flex items-center h-32 rounded-xl gap-4">
        <div className="flex flex-1  bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center">
          <BoardDebug />
        </div>
        <div className="flex flex-1 bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center">
          {/* <AddIssueForm /> */}
        </div>
        <div className="flex flex-1 bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center">
          Options
        </div>
      </div>
      <div className="flex  min-h-0  flex-1 bg-(--surface-1) border border-white/5 rounded-xl">
        <Board />
      </div>
      <div className="flex items-center justify-center h-24 bg-(--surface-1) border border-white/5 rounded-xl">
        footer
      </div>
    </div>
  );
}
