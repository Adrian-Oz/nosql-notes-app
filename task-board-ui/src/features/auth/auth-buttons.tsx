import { Button } from "@/components/ui/button";
import { useAuthModalStore, useAuthStore } from "./useAuthStore";
import { useAuthActions } from "./authActions";

export default function AuthButtons() {
  const user = useAuthStore((s) => s.user);
  const { signOut } = useAuthActions();
  const toggleAuthModal = useAuthModalStore((s) => s.toggleAuthModal);
  return (
    <div>
      {user && (
        <Button
          className="bg-(--surface-3) text-white text-xl"
          variant={"secondary"}
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </Button>
      )}
      {!user && (
        <Button
          className="bg-(--surface-3) text-white text-xl"
          variant={"secondary"}
          onClick={() => {
            toggleAuthModal();
          }}
        >
          Sign In
        </Button>
      )}
    </div>
  );
}
