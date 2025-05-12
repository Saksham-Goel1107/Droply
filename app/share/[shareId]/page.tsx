import { Metadata } from "next";
import SharedFileContent from "@/components/SharedFileContent";

export const metadata: Metadata = {
  title: "Shared File - Droply",
  description: "Access a shared file on Droply",
};

export default function SharedFilePage({
  params,
}: {
  params: { shareId: string };
}) {
  return <SharedFileContent shareId={params.shareId} />;
}
