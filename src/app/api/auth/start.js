import { db } from "../../../lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, content } = req.body;

      const docRef = await db.collection("posts").add({
        title,
        content,
        createdAt: new Date(),
      });

      res.status(201).json({ id: docRef.id, message: "Post creado!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const snapshot = await db.collection("posts").get();
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}

