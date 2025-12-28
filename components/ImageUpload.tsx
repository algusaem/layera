"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

type Props = {
  onFileChange: (file: File | null) => void;
  label?: string;
};

const ImageUpload = ({ onFileChange, label = "Image" }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileChange(file);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend text-base">{label}</legend>

      {previewUrl ? (
        <div className="relative w-32 h-32">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-base-content/20 rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
          <Upload size={24} className="text-secondary/40 mb-2" />
          <span className="text-sm text-secondary/50">Click to upload</span>
          <span className="text-xs text-secondary/30 mt-1">
            JPEG, PNG, WebP, GIF (max 5MB)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </fieldset>
  );
};

export default ImageUpload;
