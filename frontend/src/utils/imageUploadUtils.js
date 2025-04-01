// imageUploadUtils.js

/**
 * Uploads a base64 image to the server
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} - The path to the uploaded image
 */
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.path; // Path to the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Processes the editor content by uploading base64 images and updating HTML
 * @param {string} htmlContent - The original HTML content from the editor
 * @param {Array<File>} imageFiles - Array of image files extracted from the content
 * @returns {Promise<Object>} - Object containing updated content and array of image paths
 */
export const processEditorContent = async (htmlContent, imageFiles) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const imgElements = doc.querySelectorAll("img");
  const uploadedImagePaths = [];

  // Process each image
  for (let i = 0; i < imageFiles.length; i++) {
    try {
      // Upload the image
      const imagePath = await uploadImage(imageFiles[i]);
      uploadedImagePaths.push(imagePath);

      // Update the corresponding img element in the HTML
      if (imgElements[i]) {
        imgElements[i].setAttribute("src", imagePath);
      }
    } catch (error) {
      console.error(`Failed to upload image ${i}:`, error);
    }
  }

  // Get the updated HTML content
  const updatedContent = doc.body.innerHTML;

  return {
    updatedContent,
    uploadedImagePaths,
  };
};
