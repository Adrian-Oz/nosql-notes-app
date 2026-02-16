import { createPortal } from "react-dom";

export default function AddIssue() {
  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return;
  return createPortal(
    <div className="inset-0 z-10 flex items-center justify-center h-screen w-screen absolute  ">
      <div className="h-250 w-375 border"> </div>
    </div>,

    portalRoot,
  );
}
