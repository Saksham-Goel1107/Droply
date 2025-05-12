"use client";

import { Button } from "@heroui/button";
import { ChevronRight, Home, RefreshCcw, Trash } from "lucide-react";

interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>;
  onFolderClick: (folderId: string | null, index: number) => void;
  onRefresh: () => void;
  onEmptyTrash: () => void;
  onRestoreAll?: () => void;
  trashCount: number;
  activeTab: string;
}

export default function FolderNavigation({
  folderPath,
  onFolderClick,
  onRefresh,
  onEmptyTrash,
  onRestoreAll,
  trashCount,
  activeTab,
}: FolderNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 overflow-x-auto">
        <Button
          variant="light"
          size="sm"
          onClick={() => onFolderClick(null, -1)}
          startContent={<Home className="h-4 w-4" />}
        >
          Home
        </Button>
        {folderPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-default-400" />
            <Button
              variant="light"
              size="sm"
              onClick={() => onFolderClick(folder.id, index)}
            >
              {folder.name}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        {activeTab === "trash" && trashCount > 0 && (
          <>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onClick={onRestoreAll}
              startContent={<RefreshCcw className="h-4 w-4" />}
            >
              Restore All
            </Button>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              onClick={onEmptyTrash}
              startContent={<Trash className="h-4 w-4" />}
            >
              Empty Trash
            </Button>
          </>
        )}
        <Button
          variant="light"
          size="sm"
          onClick={onRefresh}
          startContent={<RefreshCcw className="h-4 w-4" />}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
