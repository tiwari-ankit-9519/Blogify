import { useAuth, useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

function GoogleSignInButton() {
  const { signIn } = useSignIn();
  const { signOut } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signOut();
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth/callback",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert(
        error.errors?.[0]?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-3 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="w-5 h-5"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.75c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.54H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l2.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84c.86-2.6 3.3-4.5 6.16-4.5z"
        />
      </svg>
      <span className="text-zinc-700 dark:text-zinc-200">
        Continue with Google
      </span>
    </Button>
  );
}

export default GoogleSignInButton;
