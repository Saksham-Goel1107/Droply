"use client";

import { useState } from "react";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Progress } from "@heroui/progress";
import { Lock, FileDown, Image } from "lucide-react";
import axios from "axios";

interface SharedFileContentProps {
  shareId: string;
}

export default function SharedFileContent({ shareId }: SharedFileContentProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [file, setFile] = useState<{
    name: string;
    type: string;
    size: number;
    fileUrl: string;
    thumbnailUrl?: string;
  } | null>(null);
  const accessFile = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/share/${shareId}`, {
        password,
      });
      
      if (response.data.requiresPassword) {
        setRequiresPassword(true);
        if (password) {
          addToast({
            title: "Incorrect Password",
            description: "The password you entered is incorrect. Please try again.",
            color: "danger",
          });
        }
        return;
      }

      setFile(response.data);
    } catch (error: any) {
      console.error("Error accessing file:", error);
      setRequiresPassword(error.response?.data?.requiresPassword || false);
      
      const errorMessage = error.response?.data?.error || "Failed to access the file";
      addToast({
        title: "Error",
        description: errorMessage === "Invalid password" 
          ? "The password you entered is incorrect. Please try again."
          : errorMessage,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;
    
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      // Get the blob data
      const blob = await response.blob();

      // Create a download link
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      addToast({
        title: "Download Started",
        description: `${file.name} will be downloaded shortly.`,
        color: "success",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      addToast({
        title: "Download Failed",
        description: "Failed to download the file. Please try again.",
        color: "danger",
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto pt-12 px-4">
        <Card className="p-6 space-y-4">
          <Progress
            isIndeterminate
            color="primary"
            size="sm"
            className="max-w-full"
          />
          <p className="text-center text-default-600">Loading shared file...</p>
        </Card>
      </div>
    );
  }

  if (!file && requiresPassword) {
    return (
      <div className="container max-w-3xl mx-auto pt-12 px-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-center">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-center">Protected File</h1>
          <p className="text-default-600 text-center">
            This file is password protected. Please enter the password to access it.
          </p>          <form
            onSubmit={(e) => {
              e.preventDefault();
              accessFile();
            }}
            className="space-y-4"
          >
            <Input
              type="password"
              label="Password"
              placeholder="Enter file password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isDisabled={!password.trim()}
            >
              Access File
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (!file) {
    accessFile();
    return null;
  }

  return (
    <div className="container max-w-3xl mx-auto pt-12 px-4">
      <Card className="p-6 space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            {file.type.startsWith("image/") ? (
              <Image className="w-8 h-8 text-primary" />
            ) : (
              <FileDown className="w-8 h-8 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold truncate">{file.name}</h1>
            <p className="text-default-600">
              {file.size < 1024
                ? `${file.size} B`
                : file.size < 1024 * 1024
                ? `${(file.size / 1024).toFixed(1)} KB`
                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
            </p>
          </div>
        </div>

        {file.type.startsWith("image/") && file.thumbnailUrl && (
          <div className="relative max-h-[70vh] overflow-hidden rounded-lg bg-default-100">
            <img
              src={file.thumbnailUrl}
              alt={file.name}
              className="w-full h-full object-contain"
              style={{ maxHeight: 'calc(70vh - 2rem)' }}
            />
          </div>
        )}

        <Button
          color="primary"
          className="w-full"
          onClick={handleDownload}
          startContent={<FileDown className="w-4 h-4" />}
        >
          Download File
        </Button>
      </Card>
    </div>
  );
}
