// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Image, Tag, Eye } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createBlog } from "@/features/createBlogSlice";

function CreateBlog() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [categories, setCategories] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleCategoriesChange = (e) => {
    setCategories(e.target.value);
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleImagesUploaded = (images) => {
    setUploadedImages(images);
  };

  const handlePublish = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !categories.trim()) {
      toast.error(
        "Please fill in the title, content, and at least one category"
      );
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (categories) {
      const categoriesArray = categories
        .split(",")
        .map((category) => category.trim())
        .filter((category) => category.length > 0);

      if (categoriesArray.length > 0) {
        formData.append("categories", categoriesArray.join(","));
      }
    }

    formData.append("published", "true");

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    uploadedImages.forEach((imageObj) => {
      formData.append("images", imageObj.file);
    });

    dispatch(createBlog(formData))
      .unwrap()
      .then((res) => {
        toast.success("Blog post created successfully!");
        navigate(`/blog/${res}`);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to create blog post");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    return () => {
      uploadedImages.forEach((imageObj) => {
        if (imageObj.previewUrl) {
          URL.revokeObjectURL(imageObj.previewUrl);
        }
      });

      if (coverImage) {
        URL.revokeObjectURL(URL.createObjectURL(coverImage));
      }
    };
  }, [uploadedImages, coverImage]);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto"
      >
        <div className="mb-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center"
          >
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
              Create New Article
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              className="group flex items-center justify-center text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              onClick={handlePublish}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish"}
              <Save className="ml-2 h-4 w-4 transform group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Blog Creation Form or Preview */}
        {isPreviewMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="p-6 border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                  {title || "Untitled Article"}
                </h2>

                {categories && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.split(",").map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {category.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {coverImage && (
                  <div className="w-full mb-6">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="prose dark:prose-invert prose-purple max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: content || "<p>No content yet.</p>",
                  }}
                />
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Title Input */}
            <Card className="p-4 border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-300">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                className="text-xl md:text-2xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </Card>

            {/* Cover Image Upload */}
            <Card className="p-6 border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-300">
              <div className="flex items-center justify-center">
                {coverImage ? (
                  <div
                    className="relative w-full group cursor-pointer"
                    onClick={() =>
                      document.getElementById("coverImageInput").click()
                    }
                  >
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-white font-medium">
                        Change Cover Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-300"
                    onClick={() =>
                      document.getElementById("coverImageInput").click()
                    }
                  >
                    <Image className="h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-2" />
                    <p className="text-zinc-600 dark:text-zinc-300 font-medium">
                      Upload Cover Image
                    </p>
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">
                      Recommended size: 1200 x 600px
                    </p>
                  </div>
                )}
                <input
                  id="coverImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </div>
            </Card>

            <Card className="p-4 border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                <Input
                  value={categories}
                  onChange={handleCategoriesChange}
                  placeholder="Enter categories separated by commas (e.g., Technology, Science, Culture)"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-zinc-800 dark:text-zinc-200"
                />
              </div>
              {categories && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {categories.split(",").map(
                    (category, index) =>
                      category.trim() && (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                        >
                          {category.trim()}
                        </span>
                      )
                  )}
                </div>
              )}
            </Card>

            {/* Rich Text Editor with image handling */}
            <Card className="p-4 border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-300">
              <RichTextEditor
                content={content}
                onChange={setContent}
                onImagesUploaded={handleImagesUploaded}
                isDarkMode={false} // You can make this dynamic based on your theme
                className="min-h-64 text-zinc-800 dark:text-zinc-200"
              />
            </Card>

            {/* Image Upload Status */}
            {uploadedImages.length > 0 && (
              <Card className="p-4 border-2 border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center mb-3">
                  <Image className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h3 className="font-medium text-zinc-800 dark:text-zinc-200">
                    {uploadedImages.length}{" "}
                    {uploadedImages.length === 1 ? "image" : "images"} ready for
                    publication
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadedImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative h-16 w-16 rounded overflow-hidden"
                    >
                      <img
                        src={img.previewUrl}
                        alt="Article image"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Preview & Publish Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex justify-between"
        >
          <Button
            variant="outline"
            className="group relative overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 transition-all duration-300"
            onClick={togglePreview}
          >
            <span className="relative z-10 flex items-center">
              {isPreviewMode ? "Edit" : "Preview"}
              <Eye className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </Button>

          <Button
            className="group flex items-center justify-center text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            onClick={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
            <Save className="ml-2 h-4 w-4 transform group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CreateBlog;
