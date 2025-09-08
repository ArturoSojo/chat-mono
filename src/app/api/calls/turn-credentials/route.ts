import { NextResponse } from "next/server";
import crypto from "crypto";
export async function POST() {
  const ttl = 600;
  const username = `${Math.floor(Date.now()/1000)+ttl}:ephemeral`;
  const secret = process.env.TURN_SHARED_SECRET!;
  const credential = crypto.createHmac("sha1", secret).update(username).digest("base64");
  return NextResponse.json({
    ttl,
    iceServers: [
      { urls: ["stun:stun.l.google.com:19302"] },
      { urls: [`turn:${process.env.TURN_HOST}:3478`], username, credential },
      { urls: [`turns:${process.env.TURN_HOST}:5349`], username, credential }
    ]
  });
}
