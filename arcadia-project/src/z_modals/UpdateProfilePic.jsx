import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";

const UpdateProfilePic = ({ isOpen, onClose }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("/placeholder.svg");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(currentUser);
    setPreviewUrl(currentUser.userPicture || "/placeholder.svg");
  }, []);

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
        setErrorMessage("PNG, JPEG, or JPG are the only acceptable files.");
      }
    }
  };

  const handleSave = async () => {
    if (!uploadedFile) {
      setErrorMessage("No image uploaded.");
      return;
    }

    try {
      // Upload the image to Supabase Storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${user.userID}-${Date.now()}.${fileExt}`;
      
      // Changed bucket name to 'avatars' which is more commonly used
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, uploadedFile);

      if (error) throw new Error(error.message);

      // Get the public URL of the uploaded image
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (urlError) throw new Error(urlError.message);

      try {
        console.log('Attempting to update user_accounts table...');
        const { data, error: updateError } = await supabase
          .from('user_accounts')
          .update({ userPicture: publicUrl })
          .eq('userID', user.userID);

        if (updateError) throw updateError;

        console.log('Update successful:', data);
       
        setTimeout(() => {
          window.location.reload();
      }, 2000); 
      } catch (updateError) {
        console.error('Error updating user_accounts:', updateError);
        setErrorMessage(`Error updating profile: ${updateError.message}`);
      }


      // Update local storage
      const updatedUser = { ...user, userPicture: publicUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Successfully updated
      onClose();
      toast.success("Profile picture updated successfully!", {
        autoClose: 2000, // 3 seconds
    });
    } catch (err) {
      setErrorMessage(err.message);
      console.error("Error details:", err); // Added for debugging
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
              alt={`${user?.userFName}'s profile photo`}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-medium text-gray-800">{`${user?.userFName} ${user?.userLName}`}</h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Accepted formats: (PNG, JPEG, JPG):
            </span>
            <label
              htmlFor="fileUpload"
              className="genWhiteButtons cursor-pointer"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="fileUpload"
              accept=".png, .jpeg, .jpg"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="flex items-center">
            <span className="w-40 text-sm font-medium text-gray-600">Image Uploaded:</span>
            <input
              type="text"
              value={uploadedFile ? uploadedFile.name : ""}
              className="input-bar"
              readOnly
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="modifyButton"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="cancelButton"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePic;

