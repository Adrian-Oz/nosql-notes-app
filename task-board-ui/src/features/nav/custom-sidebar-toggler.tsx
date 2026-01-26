import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeftSquare, ChevronRightSquare } from "lucide-react";
export default function CustomSidebarToggle() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button
      variant={"ghost"}
      onClick={toggleSidebar}
      className="max-w-12 absolute top-1 left-0"
    >
      {state === "collapsed" && <ChevronRightSquare />}
      {state === "expanded" && <ChevronLeftSquare />}
    </Button>
  );
}
