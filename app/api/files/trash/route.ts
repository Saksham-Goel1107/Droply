import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileIds } = await request.json();

    // Handle both single file and bulk trash operations
    const fileIdArray = Array.isArray(fileIds) ? fileIds : [fileIds];

    // Verify ownership and update files
    const filesToUpdate = await db
      .select()
      .from(files)
      .where(eq(files.userId, userId));

    const validFileIds = filesToUpdate
      .filter(file => fileIdArray.includes(file.id))
      .map(file => file.id);

    if (validFileIds.length === 0) {
      return NextResponse.json(
        { error: "No valid files to move to trash" },
        { status: 400 }
      );
    }

    // Move files to trash
    await db
      .update(files)
      .set({
        isTrash: true,
        updatedAt: new Date(),
      })
      .where(eq(files.userId, userId));

    return NextResponse.json({
      message: "Files moved to trash successfully",
      movedCount: validFileIds.length,
    });
  } catch (error) {
    console.error("Error moving files to trash:", error);
    return NextResponse.json(
      { error: "Failed to move files to trash" },
      { status: 500 }
    );
  }
}
