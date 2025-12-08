"use client";

import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { deleteUploadedFileAction } from "@/actions/actions";
import { toast } from "sonner";

export default function ProfileUpload({
  onUpload,
  initialImage,
}: {
  onUpload: (url: string) => void;
  initialImage?: string;
}) {
  const [preview, setPreview] = useState(initialImage || "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialImage) setPreview(initialImage);
  }, [initialImage]);

  const extractKey = (url: string) => url.split("/").pop() ?? "";

  const deleteAvatar = async () => {
    if (!preview) return;

    toast.loading("Deleting...", { id: "delete-avatar" });
    setIsUploading(true);

    const key = extractKey(preview);
    await deleteUploadedFileAction(key);

    setPreview("");
    onUpload("");

    toast.success("Avatar removed", { id: "delete-avatar" });
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar wrapper */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md border">
        {/* Avatar content */}
        <div
          className={`
            w-full h-full flex items-center justify-center 
            ${isUploading ? "opacity-50 blur-[1px]" : ""}
            transition
          `}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <Camera className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Overlay when hovering or uploading */}
        <div
          className={`
            absolute inset-0 bg-black/40 flex items-center justify-center
            transition
            ${isUploading ? "opacity-100" : "opacity-0 hover:opacity-100/50"}
          `}
        >
          {/* Uploading spinner */}
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : (
            <UploadButton<OurFileRouter, "profileImage">
              endpoint="profileImage"
              onUploadBegin={() => {
                setIsUploading(true);
                toast.loading("Uploading photo...", { id: "upload-avatar" });
              }}
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                if (!url) {
                  toast.error("Upload failed", { id: "upload-avatar" });
                  setIsUploading(false);
                  return;
                }

                setPreview(url);
                onUpload(url);

                toast.success("Avatar updated!", { id: "upload-avatar" });
                setIsUploading(false);
              }}
              onUploadError={() => {
                toast.error("Failed to upload", { id: "upload-avatar" });
                setIsUploading(false);
              }}
              appearance={{
                container: "flex items-center justify-center",
                button:
                  "bg-transparent text-white p-0 hover:bg-transparent flex flex-col items-center",
              }}
              content={{
                button() {
                  return (
                    <div className="flex flex-col items-center">
                      <Camera className="w-8 h-8 text-white" />
                      <span className="text-xs mt-1">Change</span>
                    </div>
                  );
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Delete button */}
      {preview && (
        <button
          onClick={deleteAvatar}
          disabled={isUploading}
          className={`flex items-center gap-2 text-red-600 text-sm transition ${
            isUploading ? "opacity-40 cursor-not-allowed" : "hover:text-red-800"
          }`}
        >
          <Trash2 className="w-4 h-4" /> Remove Photo
        </button>
      )}
    </div>
  );
}
