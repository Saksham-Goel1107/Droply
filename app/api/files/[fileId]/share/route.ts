import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files, fileShares } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { addHours } from "date-fns";
import bcrypt from "bcryptjs";

export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { password, expiryHours } = await request.json();

    const [file] = await db
      .select()
      .from(files)
      .where(eq(files.id, params.fileId));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (file.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareId = file.shareId || nanoid(10);

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const expiresAt = expiryHours ? addHours(new Date(), expiryHours) : null;

    await db
      .update(files)
      .set({
        isPublic: true,
        shareId,
        sharePassword: hashedPassword,
        shareExpiresAt: expiresAt,
      })
      .where(eq(files.id, params.fileId));

    const [share] = await db
      .insert(fileShares)
      .values({
        fileId: params.fileId,
        userId,
        password: hashedPassword,
        expiresAt,
      })
      .returning();

    return NextResponse.json({
      shareId,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/${shareId}`,
      expiresAt,
    });
  } catch (error) {
    console.error("Error sharing file:", error);
    return NextResponse.json(
      { error: "Failed to share file" },
      { status: 500 }
    );
  }
}
