"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Link } from "lucide-react";
import { Lock } from "lucide-react";
import { Copy } from "lucide-react";
import { Share2 } from "lucide-react";
import { Clock } from "lucide-react";
import { Facebook } from "lucide-react";
import { Twitter } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { addToast } from "@heroui/toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (options: {
    password?: string;
    expiryHours?: number;
  }) => Promise<{ shareUrl: string }>;
  fileName: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  onShare,
  fileName,
}: ShareModalProps) {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("never");
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const handleShare = async () => {
    if (isPasswordProtected && !password.trim()) {
      addToast({
        title: "Password Required",
        description: "Please enter a password for the shared link.",
        color: "warning",
      });
      return;
    }

    setIsSharing(true);
    try {
      const expiryHours = expiry === "never" ? undefined :
        expiry === "3hours" ? 3 :
        expiry === "5hours" ? 5 :
        expiry === "24hours" ? 24 : undefined;

      const result = await onShare({
        password: isPasswordProtected ? password : undefined,
        expiryHours,
      });

      setShareUrl(result.shareUrl);

      const shareDetails = [];
      if (isPasswordProtected) shareDetails.push("password protection");
      if (expiryHours) shareDetails.push(`${expiryHours}-hour expiration`);
      
      addToast({
        title: "Link Created",
        description: `Share link created${shareDetails.length ? ` with ${shareDetails.join(" and ")}` : ""}.`,
        color: "success",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
      addToast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        color: "danger",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        addToast({
          title: "Copied!",
          description: "Share link copied to clipboard.",
          color: "success",
        });
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  const shareToWhatsApp = () => {
    if (shareUrl) {
      const text = `Check out this file: ${fileName}\n${shareUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const shareToTwitter = () => {
    if (shareUrl) {
      const text = `Check out this file: ${fileName}`;
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(text)}`,
        "_blank"
      );
    }
  };

  const shareToFacebook = () => {
    if (shareUrl) {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank"
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <span>Share {fileName}</span>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {!shareUrl ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Password Protection</span>
                  </div>
                  <Switch
                    checked={isPasswordProtected}
                    onChange={setIsPasswordProtected}
                  />
                </div>

                {isPasswordProtected && (
                  <Input
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password"
                  />
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Link Expiry</span>
                  </div>
                  <Select
                    value={expiry}
                    onChange={(value) => setExpiry(value)}
                    options={[
                      { label: "Never", value: "never" },
                      { label: "3 hours", value: "3hours" },
                      { label: "5 hours", value: "5hours" },
                      { label: "24 hours", value: "24hours" },
                    ]}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm">Share Link</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={shareUrl}
                    startContent={<Link className="h-4 w-4" />}
                  />
                  <Button
                    isIconOnly
                    variant="flat"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Share on Social Media</label>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    color="success"
                    variant="flat"                    onClick={shareToWhatsApp}
                    startContent={<MessageCircle className="h-4 w-4" />}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    className="flex-1"
                    color="primary"
                    variant="flat"
                    onClick={shareToTwitter}
                    startContent={<Twitter className="h-4 w-4" />}
                  >
                    Twitter
                  </Button>
                  <Button
                    className="flex-1"
                    color="primary"
                    variant="flat"
                    onClick={shareToFacebook}
                    startContent={<Facebook className="h-4 w-4" />}
                  >
                    Facebook
                  </Button>
                </div>
              </div>

              {isPasswordProtected && (
                <div className="rounded-lg bg-warning-50 p-3 text-warning-600 text-sm">
                  Remember to share the password with the recipient separately.
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" color="default" onClick={onClose}>
            {shareUrl ? "Done" : "Cancel"}
          </Button>
          {!shareUrl && (
            <Button
              color="primary"
              onClick={handleShare}
              isLoading={isSharing}
              isDisabled={isPasswordProtected && !password}
            >
              Create Link
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}