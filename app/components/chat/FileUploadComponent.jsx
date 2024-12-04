import { MdOutlineCloudUpload, MdDelete } from "react-icons/md";

const FileUploadComponent = ({ profileImage, setProfileImage, setImageBase64, fileInputRef, handleImageUpload, handleRemoveImage }) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="fileInput"
        ref={fileInputRef}
      />
      <label
        htmlFor="fileInput"
        className="flex items-center gap-4 w-full mt-1 py-4 px-4 border border-neutral-800 rounded-lg cursor-pointer focus:ring-2 focus:ring-accent-600 outline-none bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300"
      >
        <MdOutlineCloudUpload className="text-accent-600" /> <span>Upload Image</span>
      </label>

      {profileImage && (
        <div className="relative">
          <img
            src={profileImage}
            alt="Preview"
            className="block my-10 rounded-lg border mx-auto h-auto w-[100%]"
            style={{ maxWidth: '300px' }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
};
export default FileUploadComponent;
