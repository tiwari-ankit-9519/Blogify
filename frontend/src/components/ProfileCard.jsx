import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  CalendarDays,
  Shield,
  MessageSquare,
  ThumbsUp,
  BookOpen,
  Edit3,
  Save,
  X,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { updateProfile, resetUpdateStatus } from "@/features/authSlice";
import toast from "react-hot-toast";

function ProfileCard({ user, formattedDate }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { updateLoading, updateError, updateSuccess } = useSelector(
    (state) => state.auth
  );

  const blogCount = user?.blogs?.length || 0;
  const commentCount = user?.comments?.length || 0;
  const likeCount = user?.likes?.length || 0;

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(user?.image || null);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        password: "",
        confirmPassword: "",
        image: null,
      });
      setPreviewImage(user.image || null);
    }
  }, [user]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      dispatch(resetUpdateStatus());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(resetUpdateStatus());
    }
  }, [updateSuccess, updateError, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserData({
      ...userData,
      image: file,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      (userData.password || userData.confirmPassword) &&
      userData.password !== userData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
      return;
    }

    const formData = new FormData();
    if (userData.name.trim()) formData.append("name", userData.name);
    if (userData.email.trim() && user?.provider !== "GOOGLE")
      formData.append("email", userData.email);
    if (userData.bio.trim()) formData.append("bio", userData.bio);
    if (userData.password) formData.append("password", userData.password);
    if (userData.image) formData.append("image", userData.image);
    dispatch(updateProfile(formData));
  };

  const handleCancel = () => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      password: "",
      confirmPassword: "",
      image: null,
    });
    setPreviewImage(user?.image || null);
    setPasswordError("");
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const isGoogleUser = user?.provider === "GOOGLE";

  return (
    <div className="w-full backdrop-blur-sm">
      <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/90 dark:bg-zinc-900/80 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Glass morphism header */}
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 dark:from-blue-600 dark:via-indigo-700 dark:to-violet-800">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_70%)]"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/20 blur-2xl"></div>
              <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors z-10"
            >
              <Edit3 size={16} />
            </button>
          ) : (
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={handleCancel}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
              >
                <X size={16} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={updateLoading}
                className="bg-green-500/70 hover:bg-green-600/70 rounded-full p-2 text-white transition-colors"
              >
                {updateLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Profile section */}
        <div className="relative px-6 -mt-16">
          {/* Profile image with animated border */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-70 group-hover:opacity-90 transition duration-500"></div>
              <div className="relative">
                {isEditing ? (
                  <div className="relative">
                    <img
                      className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-zinc-900"
                      src={previewImage || "https://via.placeholder.com/150"}
                      alt={userData.name || "Profile"}
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                    >
                      <Camera size={16} />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </button>
                  </div>
                ) : (
                  <img
                    className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-zinc-900"
                    src={user?.image || "https://via.placeholder.com/150"}
                    alt={user?.name || "Profile"}
                  />
                )}
                {!isEditing && (
                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-900"></span>
                )}
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="mt-4 text-center">
            {isEditing ? (
              <div className="mx-auto max-w-md">
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 
                             bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                             focus:border-transparent outline-none transition-all text-center font-bold text-lg"
                  placeholder="Your name"
                />

                <div className="mt-4">
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={isGoogleUser}
                    className={`w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                               focus:border-transparent outline-none transition-all text-center
                               ${
                                 isGoogleUser
                                   ? "opacity-60 cursor-not-allowed"
                                   : ""
                               }`}
                    placeholder="Your email"
                  />
                  {isGoogleUser && (
                    <p className="mt-1 text-xs text-amber-500 flex items-center justify-center gap-1">
                      <AlertTriangle size={12} />
                      Google-authenticated users cannot change their email
                    </p>
                  )}
                </div>

                {/* Add bio textarea */}
                <div className="mt-4">
                  <textarea
                    name="bio"
                    value={userData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                               focus:border-transparent outline-none transition-all text-center"
                    placeholder="Write a short bio about yourself"
                  />
                </div>

                <div className="mt-4">
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                               focus:border-transparent outline-none transition-all text-center"
                    placeholder="New password (optional)"
                  />
                </div>

                <div className="mt-2">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                               focus:border-transparent outline-none transition-all text-center"
                    placeholder="Confirm new password"
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-500 text-center">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // View mode
              <>
                <h1 className="text-2xl font-bold leading-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                  {user?.name}
                </h1>

                <div className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 capitalize">
                    {user?.role?.toLowerCase() || "User"}
                  </p>
                </div>

                {user?.bio && (
                  <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm max-w-md mx-auto">
                    {user.bio}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Stats row - keep visible in both modes */}
          <div className="mt-6 grid grid-cols-3 gap-2 mb-6">
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/30 mb-1">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {blogCount}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Blogs</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800/30 mb-1">
                <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {commentCount}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Comments
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-800/30 mb-1">
                <ThumbsUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {likeCount}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Likes</p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 p-4 backdrop-blur-sm mb-6 border border-zinc-100 dark:border-zinc-700/30">
            <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Email Address
                </p>
                <p className="truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600">
                <CalendarDays className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Member Since
                </p>
                <p>{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
