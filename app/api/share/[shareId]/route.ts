import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files, fileShares } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

export async function POST(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const { password } = await request.json();

    const [file] = await db
      .select()
      .from(files)
      .where(eq(files.shareId, params.shareId));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (!file.isPublic) {
      return NextResponse.json({ error: "File is not shared" }, { status: 403 });
    }

    if (file.shareExpiresAt && new Date(file.shareExpiresAt) < new Date()) {
      return NextResponse.json({ error: "Share link has expired" }, { status: 403 });
    }

    if (file.sharePassword) {
      if (!password) {
        return NextResponse.json(
          { error: "Password required", requiresPassword: true },
          { status: 403 }
        );
      }

      const passwordValid = await bcrypt.compare(password, file.sharePassword);
      if (!passwordValid) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 403 }
        );
      }
    }    
    let [share] = await db
      .select()
      .from(fileShares)
      .where(eq(fileShares.fileId, file.id));

    if (!share) {
      [share] = await db
        .insert(fileShares)
        .values({
          fileId: file.id,
          userId: file.userId,
          password: file.sharePassword,
          expiresAt: file.shareExpiresAt,
        })
        .returning();
    }

    await db
      .update(fileShares)
      .set({
        accessCount: (share?.accessCount || 0) + 1,
        lastAccessedAt: new Date(),
      })
      .where(eq(fileShares.fileId, file.id));

    return NextResponse.json({
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      fileUrl: file.fileUrl,
      thumbnailUrl: file.thumbnailUrl,
    });
  } catch (error) {
    console.error("Error accessing shared file:", error);
    return NextResponse.json(
      { error: "Failed to access file" },
      { status: 500 }
    );
  }
}
