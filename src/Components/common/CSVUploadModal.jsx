import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/utils/axios";

export default function CSVUploadModal({
  open,
  onClose,
  uploadUrl,
  onSuccess,
}) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(0);
      const res = await api.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percent);
        },
      });

      setMessage(res.data.message || "Upload successful!");
      setProgress(0);

      if (onSuccess) onSuccess(); // refresh parent
    } catch (err) {
      console.error(err);
      setMessage("Upload failed!");
      setProgress(0);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative">
        <button
          onClick={() => {
            setMessage("");
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">
          Import CSV File
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleUpload}
          className="mb-4"
        />

        {progress > 0 && (
          <div className="text-sm text-blue-500">
            Uploading... {progress}%
          </div>
        )}

        {message && (
          <p className="mt-2 px-4 py-2 text-sm text-green-700 bg-green-100 rounded-md border border-green-200 shadow-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
