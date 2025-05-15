import { useState } from "react"
import { supabase } from "../../supabaseClient"

const ImageUploader = ({ onImageUploaded }) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      setError(null)

      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `library-services/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from("images").getPublicUrl(filePath)

      // Call the callback with the image URL
      onImageUploaded(data.publicUrl)
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        {preview && (
          <img src={preview || "/placeholder.svg"} alt="Preview" className="h-24 w-36 object-cover rounded" />
        )}
        <div className="flex-1">
          <label className="block w-full px-4 py-2 text-sm text-center text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
            {uploading ? "Uploading..." : "Select Image"}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>
          <p className="mt-1 text-xs text-gray-500">Recommended size: 800x600 pixels, max 2MB</p>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
}

export default ImageUploader
