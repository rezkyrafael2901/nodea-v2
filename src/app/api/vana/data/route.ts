import { NextRequest, NextResponse } from "next/server";
import { createVanaController, isValidSource } from "@/lib/vana-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");
    const sourceId = searchParams.get("sourceId");
    const mode = searchParams.get("mode") === "full" ? "full" : "web";

    if (!requestId) return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
    if (!sourceId || !isValidSource(sourceId)) return NextResponse.json({ error: "Missing or invalid sourceId" }, { status: 400 });

    if (!process.env.VANA_APP_PRIVATE_KEY) {
      return NextResponse.json({ error: "VANA_APP_PRIVATE_KEY not configured", devMode: true }, { status: 501 });
    }

    const controller = createVanaController(sourceId, mode);
    const result = await controller.readApprovedData({ requestId });

    return NextResponse.json({ ...result, sourceId, mode, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Vana data error:", error);
    const msg = error instanceof Error ? error.message : "Failed to read approved data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
