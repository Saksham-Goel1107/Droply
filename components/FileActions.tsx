"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Trash, Star, ExternalLink, FileDown } from "lucide-react";
import type { File } from "@/lib/db/schema";
import axios from "axios";
import ShareModal from "@/components/ui/ShareModal";

interface FileActionsProps {
  file: File;
  onStar: () => void;
  onDelete: () => void;
  onShare: () => void;
  onDownload: () => void;
  isInTrash?: boolean;
}

export default function FileActions({
  file,
  onStar,
  onDelete,
  onShare,
  onDownload,
  isInTrash = false,
}: FileActionsProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleShare = async (options: { password?: string; expiryHours?: number }) => {
    try {
      const response = await axios.post(`/api/files/${file.id}/share`, {
        ...options,
        userId: file.userId,
      });

      const { shareUrl } = response.data;
      if (!shareUrl) {
        throw new Error("No share URL returned");
      }

      return response.data;
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {!isInTrash && (
          <>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color={file.isStarred ? "warning" : "default"}
              onClick={onStar}
              className="text-default-600 hover:text-warning"
            >
              <Star
                className={`h-4 w-4 ${file.isStarred ? "fill-warning-500" : ""}`}
              />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={() => setShareModalOpen(true)}
              className="text-default-600 hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={onDownload}
              className="text-default-600 hover:text-primary"
            >
              <FileDown className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          color="danger"
          onClick={onDelete}
          className="text-danger hover:text-danger-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShare}
        fileName={file.name}
      />
    </>
  );
}


