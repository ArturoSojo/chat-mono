import { getApps, initializeApp, cert, App } from "firebase-admin/app";

let adminApp: App;
if (!getApps().length) {
  const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString("utf8");
  adminApp = initializeApp({ credential: cert(JSON.parse(json)) });
} else {
  adminApp = getApps()[0]!;
}
export { adminApp };
