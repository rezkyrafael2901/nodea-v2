import { NextRequest, NextResponse } from "next/server";
import { createVanaController, isValidSource } from "@/lib/vana-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, mode = "web" } = body;

    if (!sourceId || !isValidSource(sourceId)) {
      return NextResponse.json({ error: `Invalid or unsupported source: ${sourceId}` }, { status: 400 });
    }

    if (!process.env.VANA_APP_PRIVATE_KEY) {
      return NextResponse.json({ error: "Vana app private key not configured", devMode: true }, { status: 501 });
    }

    const controller = createVanaController(sourceId, mode);
    const baseUrl = process.env.VANA_APP_URL || "https://nodea.my.id";
    const returnUrl = `${baseUrl}/connect/return?source=${sourceId}&mode=${mode}`;

    const request_data = await controller.createAccessRequest({ returnUrl });

    return NextResponse.json({
      requestId: request_data.requestId,
      approvalUrl: request_data.approvalUrl,
      appAddress: request_data.appAddress,
      sourceId,
      mode,
    });
  } catch (error) {
    console.error("Vana request error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create access request";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
