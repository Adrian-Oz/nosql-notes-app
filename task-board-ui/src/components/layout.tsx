import { BoardDebug } from "@/dev/board-debug";
import Board from "../features/board/board";
import CustomSidebarToggle from "../features/nav/custom-sidebar-toggler";

import { Toaster } from "sonner";
import IssueDialog from "@/features/board/issue-dialog";
import TagDialog from "@/features/tags/tag-dialog";
import AuthContainer from "@/features/auth/auth-container";
import AuthButtons from "@/features/auth/auth-buttons";

// import TagList from "@/features/tags/tag-list";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col gap-4 p-4">
      <Toaster />
      <IssueDialog />
      <TagDialog />
      <AuthContainer />
      <div className="flex items-center h-12 justify-between  rounded-xl relative   ">
        <CustomSidebarToggle />
        <div className="ml-auto mr-2">
          <AuthButtons />
        </div>
        {/* header */}
      </div>
      <div className="flex items-center h-32 rounded-xl gap-4">
        <div className="flex flex-1  bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center">
          <BoardDebug />
        </div>
        <div className="flex flex-1 bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center">
          {/* <TagList /> used for debug */}
        </div>
        <div className="flex flex-1 bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center"></div>
      </div>
      <div className="flex  min-h-0  flex-1 bg-(--surface-1) border border-white/5 rounded-xl">
        <Board />
      </div>
      <div className="flex items-center justify-center h-24 bg-(--surface-1) border border-white/5 rounded-xl">
        There is only local persistence while signed out, all data from demo
        would be lost on signing in, and replaced with stored boards , merge
        maybe in future
      </div>
    </div>
  );
}
