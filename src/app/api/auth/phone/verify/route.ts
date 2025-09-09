import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, code } = await req.json();
    if (typeof sessionId !== "string" || typeof code !== "string") {
      return NextResponse.json({ code: "invalid_request" }, { status: 400 });
    }

    const db = getFirestore(adminApp);
    const ref = db.collection("phoneSessions").doc(sessionId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ code: "invalid_session" }, { status: 400 });
    }

    const data = snap.data()!;
    if (data.otp !== code) {
      await ref.update({ attempts: (data.attempts || 0) + 1 });
      return NextResponse.json({ code: "invalid_code" }, { status: 400 });
    }

    await ref.delete();
    return NextResponse.json({ phone: data.phone, ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ code: "server_error" }, { status: 500 });
  }
}
