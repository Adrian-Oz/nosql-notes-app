import AuthForm from "./auth-form";

import { useAuthModalStore } from "@/features/auth/useAuthStore";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthContainer() {
  const toggleAuthModal = useAuthModalStore((s) => s.toggleAuthModal);
  const isOpen = useAuthModalStore((s) => s.isAuthModalOpen);
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
        >
          <div
            className="flex h-full flex-col items-center justify-center p-6 md:p-10"
            onClick={toggleAuthModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 150 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-full min-h-[70%] min-w-[50%] max-w-sm md:max-w-3xl h-5/6 flex flex-col justify-center z-5"
              style={{
                willChange: "opacity, transform",
                transform: "translateZ(0)",
              }}
            >
              <AuthForm />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot,
  );
}
