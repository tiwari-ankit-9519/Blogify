import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, loginUser, userProfile } from "@/features/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AuthCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress;

      if (!email) {
        toast.error("Authentication failed: No email found.");
        navigate("/login");
        return;
      }

      const provider = "google";
      const providerId = user.id;

      const userData = {
        email,
        name: user.fullName || user.firstName || "New User",
        image: user.imageUrl || "",
        provider,
        providerId,
      };

      dispatch(loginUser(userData))
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          dispatch(userProfile());
        })
        .catch(() => {
          dispatch(createUser(userData))
            .unwrap()
            .then((res) => {
              toast.success(res.message);
              dispatch(userProfile());
            })
            .catch((err) => {
              toast.error(err);
              navigate("/login");
            });
        });
    }
  }, [isLoaded, isSignedIn, user, dispatch, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-screen h-[calc(100vh-4rem)] flex justify-center items-center text-2xl font-inter">
      <div className="text-center">
        <p className="text-2xl">Authenticating...</p>
        <p className="text-sm">Please wait while we verify your identity.</p>
      </div>
    </div>
  );
}

export default AuthCallback;
