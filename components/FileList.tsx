"use client";

import { useEffect, useState, useMemo } from "react";
import { Folder, Star, Trash, X, ExternalLink, FileDown, RefreshCcw } from "lucide-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { formatDistanceToNow, format } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";
import axios from "axios";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import FileEmptyState from "@/components/FileEmptyState";
import FileIcon from "@/components/FileIcon";
import FileActions from "@/components/FileActions";
import FileLoadingState from "@/components/FileLoadingState";
import FileTabs from "@/components/FileTabs";
import FolderNavigation from "@/components/FolderNavigation";
import FileActionButtons from "@/components/FileActionButtons";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  // Selection handlers
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const newSelection = new Set(filteredFiles.map((file) => file.id));
    setSelectedFiles(newSelection);
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedFiles).map((fileId) =>
          axios.post(
            `/api/files/${fileId}/${activeTab === "trash" ? "delete" : "trash"}`
          )
        )
      );

      addToast({
        title:
          activeTab === "trash" ? "Files Deleted" : "Files Moved to Trash",
        description: `Successfully ${
          activeTab === "trash" ? "deleted" : "moved to trash"
        } ${selectedFiles.size} files`,
        color: "success",
      });

      clearSelection();
      fetchFiles();
    } catch (error) {
      console.error("Error performing bulk delete:", error);
      addToast({
        title: "Error",
        description: "Failed to delete files. Please try again.",
        color: "danger",
      });
    }
  };

  const handleBulkRestore = async () => {
    try {
      await Promise.all(
        Array.from(selectedFiles).map((fileId) =>
          axios.patch(`/api/files/${fileId}/trash`)
        )
      );

      addToast({
        title: "Files Restored",
        description: `Successfully restored ${selectedFiles.size} files`,
        color: "success",
      });

      clearSelection();
      fetchFiles();
    } catch (error) {
      console.error("Error performing bulk restore:", error);
      addToast({
        title: "Error",
        description: "Failed to restore files. Please try again.",
        color: "danger",
      });
    }
  };

  const handleRestoreAll = async () => {
    try {
      // Get all files in trash
      const trashedFiles = files.filter((file) => file.isTrash);
      
      await Promise.all(
        trashedFiles.map((file) =>
          axios.patch(`/api/files/${file.id}/trash`)
        )
      );

      addToast({
        title: "All Files Restored",
        description: `Successfully restored ${trashedFiles.length} files from trash`,
        color: "success",
      });

      fetchFiles();
    } catch (error) {
      console.error("Error restoring all files:", error);
      addToast({
        title: "Error",
        description: "Failed to restore all files. Please try again.",
        color: "danger",
      });
    }
  };

  const handleBulkShare = async () => {
    try {
      if (selectedFiles.size === 0) return;

      // Get details of selected files
      const selectedFileDetails = Array.from(selectedFiles).map(id => 
        files.find(f => f.id === id)
      ).filter(f => f !== undefined);

      if (selectedFileDetails.length === 0) return;

      // Share each file and collect share URLs
      const shareResponses = await Promise.all(
        selectedFileDetails.map(async (file) => {
          if (!file) return null;
          try {
            const response = await axios.post(`/api/files/${file.id}/share`);
            return {
              name: file.name,
              shareUrl: response.data.shareUrl
            };
          } catch (error) {
            console.error(`Error sharing file ${file.name}:`, error);
            return null;
          }
        })
      );

      // Filter out any failed shares
      const successfulShares = shareResponses.filter(r => r !== null);
      const failedCount = shareResponses.length - successfulShares.length;

      // Show success toast with number of files shared
      addToast({
        title: 'Files Shared',
        description: `Successfully shared ${successfulShares.length} files${failedCount > 0 ? `. ${failedCount} files failed.` : ''}`,
        color: 'success',
      });

    } catch (error) {
      console.error('Error sharing files:', error);
      addToast({
        title: 'Share Failed',
        description: 'Failed to share selected files. Please try again.',
        color: 'danger',
      });
    }
  };

  const handleBulkDownload = async () => {
    try {
      if (selectedFiles.size === 0) return;

      // Get details of selected files
      const selectedFileDetails = Array.from(selectedFiles).map(id => 
        files.find(f => f.id === id)
      ).filter(f => f !== undefined) as FileType[];

      if (selectedFileDetails.length === 0) return;

      // Show loading toast
      addToast({
        title: 'Preparing Downloads',
        description: `Preparing ${selectedFileDetails.length} files for download...`,
        color: 'primary',
      });

      // Download each file
      const downloadPromises = selectedFileDetails.map(async (file) => {
        try {
          // For images, use optimized download URL
          if (file.type.startsWith("image/")) {
            const downloadUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
            return { success: true, name: file.name };
          } else {
            // For other file types, use direct URL
            const response = await fetch(file.fileUrl);
            if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
            return { success: true, name: file.name };
          }
        } catch (error) {
          console.error(`Error downloading ${file.name}:`, error);
          return { success: false, name: file.name };
        }
      });

      const results = await Promise.all(downloadPromises);
      const successCount = results.filter(r => r.success).length;
      const failedCount = results.length - successCount;

      // Show success toast
      if (successCount > 0) {
        addToast({
          title: 'Downloads Started',
          description: `Started downloading ${successCount} files${failedCount > 0 ? `. ${failedCount} files failed.` : ''}.`,
          color: 'success',
        });
      }

      if (failedCount > 0) {
        addToast({
          title: 'Some Downloads Failed',
          description: `${failedCount} files failed to download. Please try again.`,
          color: 'warning',
        });
      }

    } catch (error) {
      console.error('Error downloading files:', error);
      addToast({
        title: 'Download Failed',
        description: 'Failed to download selected files. Please try again.',
        color: 'danger',
      });
    }
  };


 

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) {
        url += `&parentId=${currentFolder}`;
      }

      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      addToast({
        title: "Error Loading Files",
        description: "We couldn't load your files. Please try again later.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch files when userId, refreshTrigger, or currentFolder changes
  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  // Filter files based on active tab
  const filteredFiles = useMemo(() => {
    switch (activeTab) {
      case "starred":
        return files.filter((file) => file.isStarred && !file.isTrash);
      case "trash":
        return files.filter((file) => file.isTrash);
      case "all":
      default:
        return files.filter((file) => !file.isTrash);
    }
  }, [files, activeTab]);

  // Count files in trash
  const trashCount = useMemo(() => {
    return files.filter((file) => file.isTrash).length;
  }, [files]);

  // Count starred files
  const starredCount = useMemo(() => {
    return files.filter((file) => file.isStarred && !file.isTrash).length;
  }, [files]);

  const handleStarFile = async (fileId: string) => {
    try {
      await axios.patch(`/api/files/${fileId}/star`);

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      addToast({
        title: file?.isStarred ? "Removed from Starred" : "Added to Starred",
        description: `"${file?.name}" has been ${
          file?.isStarred ? "removed from" : "added to"
        } your starred files`,
        color: "success",
      });
    } catch (error) {
      console.error("Error starring file:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the star status. Please try again.",
        color: "danger",
      });
    }
  };

  const handleTrashFile = async (fileId: string) => {
    try {
      const response = await axios.patch(`/api/files/${fileId}/trash`);
      const responseData = response.data;

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isTrash: responseData.isTrash } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      addToast({
        title: responseData.isTrash ? "Moved to Trash" : "Restored from Trash",
        description: `"${file?.name}" has been ${
          responseData.isTrash ? "moved to trash" : "restored"
        }`,
        color: "success",
      });
    } catch (error) {
      console.error("Error trashing file:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the file status. Please try again.",
        color: "danger",
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const fileToDelete = files.find((f) => f.id === fileId);
      if (!fileToDelete) {
        throw new Error("File not found");
      }
      const fileName = fileToDelete.name;

      if (!fileToDelete.isTrash) {
        // Move to trash first
        const trashResponse = await axios.patch(`/api/files/${fileId}/trash`);
        if (!trashResponse.data.success) {
          throw new Error(trashResponse.data.error || "Failed to move file to trash");
        }
        
        // Update local state
        setFiles(files.map(file => 
          file.id === fileId ? { ...file, isTrash: true } : file
        ));

        addToast({
          title: "Moved to Trash",
          description: `"${fileName}" has been moved to trash`,
          color: "success",
        });
        setDeleteModalOpen(false);
      } else {
        // Permanently delete from trash
        const deleteResponse = await axios.delete(`/api/files/${fileId}/delete`);
        if (!deleteResponse.data.success) {
          throw new Error(deleteResponse.data.error || "Failed to delete file");
        }

        setFiles(files.filter((file) => file.id !== fileId));
        addToast({
          title: "File Permanently Deleted",
          description: `"${fileName}" has been permanently removed`,
          color: "success",
        });
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error handling file:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't process your request. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await axios.delete(`/api/files/empty-trash`);

      // Remove all trashed files from local state
      setFiles(files.filter((file) => !file.isTrash));

      // Show toast
      addToast({
        title: "Trash Emptied",
        description: `All ${trashCount} items have been permanently deleted`,
        color: "success",
      });

      // Close modal
      setEmptyTrashModalOpen(false);
    } catch (error) {
      console.error("Error emptying trash:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't empty the trash. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleDownloadFile = async (file: FileType) => {
    try {
      // Show loading toast
      addToast({
        title: "Preparing Download",
        description: `Getting "${file.name}" ready for download...`,
        color: "primary",
      });

      // For images, optimize download URL with ImageKit
      const url = file.type.startsWith("image/") 
        ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`
        : file.fileUrl;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      addToast({
        title: "Download Started",
        description: `${file.name} is being downloaded.`,
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

  // Function to open image in a new tab with optimized view
  const openImageViewer = (file: FileType) => {
    if (file.type.startsWith("image/")) {
      // Create an optimized URL with ImageKit transformations for viewing
      // Using higher quality and responsive sizing for better viewing experience
      const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
      window.open(optimizedUrl, "_blank");
    }
  };

  // Navigate to a folder
  const navigateToFolder = async (folderId: string | null, folderName: string | null, index: number = -1) => {
    try {
      // Clear any existing selection
      clearSelection();

      if (folderId === null) {
        // Going to root
        setCurrentFolder(null);
        setFolderPath([]);
        if (onFolderChange) {
          onFolderChange(null);
        }
        return;
      }

      // Get the file info to ensure it's a folder
      const response = await axios.get(`/api/files/${folderId}`);
      const folder = response.data;

      if (!folder || !folder.isFolder) {
        throw new Error("Invalid folder");
      }

      setCurrentFolder(folderId);
      
      if (index >= 0) {
        // Clicking a folder in the path
        const newPath = folderPath.slice(0, index + 1);
        setFolderPath(newPath);
      } else {
        // New folder navigation
        if (folder.parentId === null) {
          // Root level folder
          setFolderPath([{ id: folderId, name: folderName || folder.name }]);
        } else {
          setFolderPath([...folderPath, { id: folderId, name: folderName || folder.name }]);
        }
      }

      // Notify parent component about folder change
      if (onFolderChange) {
        onFolderChange(folderId);
      }
    } catch (error) {
      console.error("Error navigating to folder:", error);
      addToast({
        title: "Navigation Failed",
        description: "We couldn't open this folder. Please try again.",
        color: "danger",
      });
    }
  };

  // Navigate to specific folder in path
  const navigateToPathFolder = (index: number) => {
    // Clear any existing selection
    clearSelection();

    if (index < 0) {
      // Navigate to root
      setCurrentFolder(null);
      setFolderPath([]);
      if (onFolderChange) {
        onFolderChange(null);
      }
    } else {
      // Navigate to specific folder in path
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      const newFolderId = newPath[index].id;
      setCurrentFolder(newFolderId);
      if (onFolderChange) {
        onFolderChange(newFolderId);
      }
    }
  };

  // Handle file or folder click
  const handleItemClick = async (file: FileType) => {
    if (file.isFolder) {
      // Navigate to the folder, passing -1 for index since it's a new folder navigation
      await navigateToFolder(file.id, file.name, -1);
    } else if (file.type.startsWith("image/")) {
      openImageViewer(file);
    }
  };

  if (loading) {
    return <FileLoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          files={files}
          starredCount={starredCount}
          trashCount={trashCount}
        />

        {selectedFiles.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-600">
              {selectedFiles.size} selected
            </span>
            {activeTab === "trash" ? (
              <>
                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  onClick={handleBulkRestore}
                  startContent={<RefreshCcw className="h-4 w-4" />}
                >
                  Restore Selected
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onClick={() => setBulkDeleteModalOpen(true)}
                  startContent={<Trash className="h-4 w-4" />}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onClick={() => setBulkDeleteModalOpen(true)}
                  startContent={<Trash className="h-4 w-4" />}
                >
                  Move to Trash
                </Button>
                <Button
                  variant="flat"
                  size="sm"
                  onClick={handleBulkShare}
                  startContent={<ExternalLink className="h-4 w-4" />}
                >
                  Share
                </Button>
                <Button
                  variant="flat"
                  size="sm"
                  onClick={handleBulkDownload}
                  startContent={<FileDown className="h-4 w-4" />}
                >
                  Download
                </Button>
              </>
            )}
            <Button
              variant="flat"
              size="sm"
              onClick={clearSelection}
              startContent={<X className="h-4 w-4" />}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      <FolderNavigation
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onFolderClick={(folderId, index) => {
          navigateToFolder(folderId, folderPath[index]?.name || null, index);
        }}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
        onRestoreAll={handleRestoreAll}
      />

      <Divider className="my-4" />

      {/* Files table */}
      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} />
      ) : (
        <Card
          shadow="sm"
          className="border border-default-200 bg-default-50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table
              aria-label="Files table"
              isStriped
              color="default"
              selectionMode="multiple"
              selectedKeys={selectedFiles}
              onSelectionChange={(selection) => {
                if (selection === "all") {
                  selectAll();
                } else if (selection.size === 0) {
                  clearSelection();
                } else {
                  setSelectedFiles(selection as Set<string>);
                }
              }}
              classNames={{
                base: "min-w-full",
                th: "bg-default-100 text-default-800 font-medium text-sm",
                td: "py-4",
              }}
            >
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn className="hidden sm:table-cell">Type</TableColumn>
                <TableColumn className="hidden md:table-cell">Size</TableColumn>
                <TableColumn className="hidden sm:table-cell">
                  Added
                </TableColumn>
                <TableColumn width={240}>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    className={`hover:bg-default-100 transition-colors ${
                      file.isFolder || file.type.startsWith("image/")
                        ? "cursor-pointer"
                        : ""
                    }`}
                    onClick={() => handleItemClick(file)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileIcon file={file} />
                        <div>
                          <div className="font-medium flex items-center gap-2 text-default-800">
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                              {file.name}
                            </span>
                            {file.isStarred && (
                              <Tooltip content="Starred">
                                <Star
                                  className="h-4 w-4 text-yellow-400"
                                  fill="currentColor"
                                />
                              </Tooltip>
                            )}
                            {file.isFolder && (
                              <Tooltip content="Folder">
                                <Folder className="h-3 w-3 text-default-400" />
                              </Tooltip>
                            )}
                            {file.type.startsWith("image/") && (
                              <Tooltip content="Click to view image">
                                <ExternalLink className="h-3 w-3 text-default-400" />
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-xs text-default-500 sm:hidden">
                            {formatDistanceToNow(new Date(file.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-xs text-default-500">
                        {file.isFolder ? "Folder" : file.type}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-default-700">
                        {file.isFolder
                          ? "-"
                          : file.size < 1024
                          ? `${file.size} B`
                          : file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(1)} KB`
                          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="text-default-700">
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        <div className="text-xs text-default-500 mt-1">
                          {format(new Date(file.createdAt), "MMMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <FileActions
                        file={file}
                        onStar={() => handleStarFile(file.id)}
                        onDelete={() => {
                          if (file.isTrash) {
                            setSelectedFile(file);
                            setDeleteModalOpen(true);
                          } else {
                            handleTrashFile(file.id);
                          }
                        }}
                        onShare={() => {}}
                        onDownload={() => handleDownloadFile(file)}
                        isInTrash={file.isTrash}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Permanent Deletion"
        description={`Are you sure you want to permanently delete this file?`}
        icon={X}
        iconColor="text-danger"
        confirmText="Delete Permanently"
        confirmColor="danger"
        onConfirm={() => {
          if (selectedFile) {
            handleDeleteFile(selectedFile.id);
          }
        }}
        isDangerous={true}
        warningMessage={`You are about to permanently delete "${selectedFile?.name}". This file will be permanently removed from your account and cannot be recovered.`}
      />

      {/* Empty trash confirmation modal */}
      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description={`Are you sure you want to empty the trash?`}
        icon={Trash}
        iconColor="text-danger"
        confirmText="Empty Trash"
        confirmColor="danger"
        onConfirm={handleEmptyTrash}
        isDangerous={true}
        warningMessage={`You are about to permanently delete all ${trashCount} items in your trash. These files will be permanently removed from your account and cannot be recovered.`}
      />

      <ConfirmationModal
        isOpen={bulkDeleteModalOpen}
        onOpenChange={setBulkDeleteModalOpen}
        onConfirm={handleBulkDelete}
        title={activeTab === "trash" ? "Delete Files" : "Move to Trash"}
        description={
          activeTab === "trash"
            ? `Are you sure you want to permanently delete ${selectedFiles.size} files? This action cannot be undone.`
            : `Are you sure you want to move ${selectedFiles.size} files to trash?`
        }
      />
    </div>
  );
}
