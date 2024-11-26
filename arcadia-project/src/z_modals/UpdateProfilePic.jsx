import React, { useState } from "react";
import { supabase } from "./../supabaseClient.js";

const UpdateProfilePic = ({ isOpen, onClose, user }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.userPicture || "/placeholder.svg");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Log to verify modal visibility
  console.log("Modal open?", isOpen);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/png", "image/jpeg", "image/jpg"];
      if (validFormats.includes(file.type)) {
        setUploadedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setErrorMessage("");
      } else {
        setErrorMessage("Only PNG, JPEG, or JPG formats are allowed.");
      }
    }
  };

  const handleSave = async () => {
    if (!uploadedFile) {
      setErrorMessage("Please upload a file before saving.");
      return;
    }

    setIsSaving(true);
    try {
      // Define file path and upload to Supabase storage
      const filePath = `public/${user.userEmail}/${uploadedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, uploadedFile, { upsert: true });

      if (uploadError) {
        setErrorMessage("Failed to upload file.");
        return;
      }

      // Get the public URL of the uploaded file
      const { data: fileUrlData, error: urlError } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      if (urlError || !fileUrlData?.publicUrl) {
        setErrorMessage("Failed to retrieve uploaded file URL.");
        return;
      }

      // Update user record in the database
      const { error: updateError } = await supabase
        .from("user_accounts")
        .update({ userPicture: fileUrlData.publicUrl })
        .eq("userEmail", user.userEmail);

      if (updateError) {
        setErrorMessage("Failed to update user profile.");
        return;
      }

      // Successfully saved the profile picture
      setErrorMessage("");
      onClose(); // Close the modal
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Update Profile Picture</h2>
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={previewUrl}
              alt={`${user.name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-medium text-gray-800">{user.name}</h2>
        </div>
        <div className="space-y-6">
          <label htmlFor="fileUpload" className="genWhiteButtons cursor-pointer">
            Upload Image
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".png, .jpeg, .jpg"
            className="hidden"
            onChange={handleFileUpload}
          />
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
        <div className="flex justify-center space-x-4 mt-8">
          <button onClick={handleSave} className="modifyButton" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="cancelButton" disabled={isSaving}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePic;
