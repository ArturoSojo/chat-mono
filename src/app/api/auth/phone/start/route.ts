import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebaseAdmin";
import crypto from "crypto";

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/; // E.164 format

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (typeof phone !== "string" || !PHONE_REGEX.test(phone)) {
      return NextResponse.json({ code: "invalid_phone" }, { status: 400 });
    }

    const db = getFirestore(adminApp);

    // Rate limiting: max 3 requests per hour per phone number
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db
      .collection("phoneSessions")
      .where("phone", "==", phone)
      .where("createdAt", ">=", oneHourAgo)
      .get();
    if (recent.size >= 3) {
      return NextResponse.json({ code: "rate_limited" }, { status: 429 });
    }

    const sessionId = crypto.randomUUID();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save session to Firestore
    await db.collection("phoneSessions").doc(sessionId).set({
      phone,
      otp,
      createdAt: new Date(),
      attempts: 0,
    });

    // Send SMS via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;
    if (!accountSid || !authToken || !from) {
      console.error("Twilio environment variables not set");
      return NextResponse.json({ code: "server_error" }, { status: 500 });
    }

    const params = new URLSearchParams({ To: phone, From: from, Body: `Tu código es ${otp}` });
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error(await response.text());
      return NextResponse.json({ code: "sms_failed" }, { status: 500 });
    }

    return NextResponse.json({ sessionId, captchaRequired: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ code: "server_error" }, { status: 500 });
  }
}

