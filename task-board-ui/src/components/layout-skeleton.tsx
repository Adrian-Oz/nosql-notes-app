import CustomSidebarToggle from "../features/nav/custom-sidebar-toggler";

// import TagList from "@/features/tags/tag-list";

export default function LayoutSkeleton() {
  return (
    <div className="h-screen flex flex-col gap-4 p-4  ">
      <div className="flex items-center h-12 justify-between  rounded-xl relative   ">
        <CustomSidebarToggle />
        <div className="ml-auto mr-2"></div>
      </div>
      <div className="flex items-center h-32 rounded-xl gap-4">
        <div className="flex flex-1  bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center animate-pulse"></div>
        <div className="flex flex-1 bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center animate-pulse"></div>
        <div className="flex flex-1 bg-(--surface-1) border border-white/5 h-full rounded-xl items-center justify-center animate-pulse"></div>
      </div>
      <div className="flex  min-h-0  flex-1 bg-(--surface-1) border border-white/5 rounded-xl animate-pulse"></div>
      <div className="flex items-center justify-center h-24 bg-(--surface-1) border border-white/5 rounded-xl animate-pulse"></div>
    </div>
  );
}
