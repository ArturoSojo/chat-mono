import { messaging } from "./firebaseClient";
import { getToken } from "firebase/messaging";

export async function registerPush(deviceId: string) {
  if (!messaging) return;
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js") });
  await fetch("/api/notifications/register", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, deviceId, platform: "web" }),
  });
}
