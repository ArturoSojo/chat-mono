import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { token, deviceId, platform="web", appVersion } = await req.json();
  if (!token || !deviceId) return NextResponse.json({ code:"invalid_token" }, { status:400 });
  const db = getFirestore(adminApp);
  const uid = req.headers.get("x-user-id") || "anonymous"; // reemplaza por verificación real de ID Token
  const ref = db.doc(`users/${uid}/devices/${deviceId}`);
  await ref.set({
    fcmToken: token, platform, appVersion,
    userAgent: req.headers.get("user-agent") || "",
    lastSeen: new Date(), createdAt: new Date()
  }, { merge: true });
  return NextResponse.json({ ok: true, updated: true });
}
