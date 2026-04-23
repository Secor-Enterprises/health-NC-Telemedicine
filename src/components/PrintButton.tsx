import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/types";

/** Roles permitted to print clinical/operational documents. */
const PRINT_ALLOWED_ROLES: ReadonlyArray<UserRole> = ["admin", "doctor", "clerk"];

interface PrintButtonProps {
  /** Optional label override. Defaults to "Print". */
  label?: string;
  /** Optional document title to use during printing (restored after). */
  documentTitle?: string;
  /** ButtonProps passthroughs */
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
}

/**
 * Triggers the browser's native print dialog. Works on Windows, macOS, and
 * Linux with any installed printer (USB, network, CUPS, AirPrint, or
 * "Save as PDF") because it uses the standard window.print() flow.
 *
 * Access is restricted to administrators, doctors, and registration clerks.
 * Patients (and unauthenticated visitors) will not see the button.
 *
 * Pages should add `print-area` to the region they want printed and
 * `no-print` to UI chrome they want hidden.
 */
export function PrintButton({
  label = "Print",
  documentTitle,
  variant = "outline",
  size = "sm",
  className,
}: PrintButtonProps) {
  const { user } = useAuth();

  if (!user || !PRINT_ALLOWED_ROLES.includes(user.role)) {
    return null;
  }

  const handlePrint = () => {
    const previousTitle = document.title;
    if (documentTitle) {
      // Most browsers use document.title as the default print/PDF filename.
      document.title = documentTitle;
    }
    // Defer to next tick so the title change is committed first.
    window.setTimeout(() => {
      window.print();
      if (documentTitle) {
        // Restore after the print dialog closes.
        window.setTimeout(() => {
          document.title = previousTitle;
        }, 500);
      }
    }, 0);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={`no-print ${className ?? ""}`}
    >
      <Printer className="mr-1 h-4 w-4" />
      {label}
    </Button>
  );
}
