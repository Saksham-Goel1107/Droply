import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileIds } = await request.json();

    const fileIdArray = Array.isArray(fileIds) ? fileIds : [fileIds];

    const filesToDelete = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isTrash, true)
        )
      );

    const validFileIds = filesToDelete
      .filter(file => fileIdArray.includes(file.id))
      .map(file => file.id);

    if (validFileIds.length === 0) {
      return NextResponse.json(
        { error: "No valid files to delete" },
        { status: 400 }
      );
    }

    await db
      .delete(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isTrash, true)
        )
      );

    return NextResponse.json({
      message: "Files deleted successfully",
      deletedCount: validFileIds.length,
    });
  } catch (error) {
    console.error("Error deleting files:", error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 }
    );
  }
}
