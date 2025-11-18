
// קובץ זה מייצג את הלוגיקה שתרוץ ב-Firebase Cloud Functions
// (נדרש פרויקט Blaze בתשלום ופריסה נפרדת)

// const { initializeApp } = require("firebase-admin/app");
// const { getFirestore, Timestamp } = require("firebase-admin/firestore");
// const { onDocumentCreated } = require("firebase-functions/v2/firestore");
// const { getStorage } = require("firebase-admin/storage");
// const { Gemini } = require("@google/generative-ai"); // דוגמה
// const nodemailer = require("nodemailer"); // דוגמה לשליחת מייל

// initializeApp();
// const db = getFirestore();
// const storage = getStorage();
// const gemini = new Gemini(process.env.GEMINI_API_KEY);

/**
 * ===================================================================
 * פונקציה 1: אוטומציית הזמנה
 * ===================================================================
 * טריגר: יצירת הודעה חדשה ב-`messages` עם `type == "ORDER"`.
 */
exports.onNewOrder = 
  // onDocumentCreated("messages/{msgId}", async (event) => {
  async function onNewOrderMessageCreated(eventStub) {
    // 1. בדיקה שזו הזמנה
    // if (eventStub.data.type !== "ORDER") return null;
    
    const orderPayload = eventStub.data.orderPayload;
    const customerId = eventStub.data.senderId;
    
    // 2. יצירת הזמנה ב-`orders` (עבור הנהגים)
    // await db.collection("orders").add({
    //   ...orderPayload,
    //   status: "חדש",
    //   customerId: customerId,
    //   createdAt: serverTimestamp()
    // });
    
    // 3. יצירת PDF (דמה)
    // const pdfBuffer = await createPDF(orderPayload);
    // const pdfUrl = await uploadToStorage(pdfBuffer, `orders/${eventStub.id}.pdf`);
    const pdfUrl = "https://example.com/dummy.pdf";
    
    // 4. שליחת מייל למנהל (דמה)
    // await sendEmail("h.saban@sidor.com", "הזמנה חדשה התקבלה", `...`);

    // 5. תגובה אוטומטית ללקוח (עם `replyTo`)
    // await db.collection("messages").add({
    //   roomId: eventStub.data.roomId,
    //   senderId: "system",
    //   senderName: "Sidor מערכת",
    //   text: `הזמנתך התקבלה בהצלחה! לצפייה במסמך ההזמנה: ${pdfUrl}`,
    //   type: "TEXT",
    //   createdAt: serverTimestamp(),
    //   replyTo: {
    //     ownerId: customerId,
    //     originalMessageId: eventStub.id,
    //     originalMessageText: "הזמנה חדשה"
    //   }
    // });
    
    console.log("Order processed and PDF link sent.");
};


/**
 * ===================================================================
 * פונקציה 2: הצ'אט-בוט (24/7)
 * ===================================================================
 * טריגר: יצירת הודעה חדשה ב-`messages` עם `type != "ORDER"` ומ-`senderId` של לקוח.
 */
exports.sidorChatbot = 
  // onDocumentCreated("messages/{msgId}", async (event) => {
  async function onNewCustomerMessage_Chatbot(eventStub) {
    // ---- הדמיית לוגיקה ----
    console.log("Chatbot triggered...");
    
    // 1. קבלת נתוני ההודעה
    const msgData = eventStub.data; // { senderId, roomId, text, type, ... }
    const msgId = eventStub.id;
    
    // 2. בדיקה: האם זו הודעת לקוח? 
    // const customerDoc = await db.collection('customers').doc(msgData.senderId).get();
    // if (!customerDoc.exists || msgData.type === "ORDER") {
    //   return console.log("Bot skipping message (not a customer or is an order).");
    // }
    
    // 3. בדיקה: האם עובד הגיב לאחרונה?
    // const fiveMinutesAgo = Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);
    // const recentReplies = await db.collection("messages")
    //   .where("roomId", "==", msgData.roomId)
    //   .where("createdAt", ">", fiveMinutesAgo)
    //   .where("replyTo.ownerId", "==", msgData.senderId)
    //   .get();
    // const humanReplied = recentReplies.docs.some(doc => doc.data().senderId !== 'sidor-bot-uid');
    
    // if (humanReplied) {
    //   return console.log("Bot skipping message (human already replied).");
    // }
    
    // 4. יצירת התראה לארגון (צפצוף/הבהוב)
    // await db.collection("org_alerts").add({
    //   roomId: msgData.roomId,
    //   messageId: msgId,
    //   senderName: msgData.senderName,
    //   text: msgData.text,
    //   createdAt: serverTimestamp()
    // });
    
    // 5. הבנת כוונה (Gemini API)
    const prompt = `
      אתה "סידור", עוזר AI 24/7 של חברת חומרי בניין. 
      לקוח שלח הרגע הודעה מפרויקט שנקרא "פרויקט X". 
      ההודעה: "${msgData.text}".
      
      המטרות שלך:
      1. תן לו תחושה שרואים אותו (גם אם זה לילה).
      2. נסה להבין אם הוא צריך עזרה בהזמנה, מידע על מוצר, או תמיכה.
      3. אם הוא שואל על מוצר, השתמש בכלי 'searchProducts'.
      4. אם הוא שואל על הזמנה קודמת, השתמש בכלי 'searchPastOrders'.
      
      נסח תשובה קצרה, מקצועית וידידותית בעברית.
    `;
    
    // const geminiResponse = await gemini.generateContent(prompt, [searchProducts, searchPastOrders]);
    // const botText = geminiResponse.text;
    const botText = "הדמיית תשובת בוט: שלום! קיבלתי את פנייתך. אני בודק אותה ואעדכן אותך מיד כשאמצא תשובה. (אני בוט, נציג אנושי יצטרף בקרוב אם צריך)."; // תשובת דמה
    
    // 6. שליחת תגובת הבוט (עם `replyTo` כדי שהלקוח יראה)
    // await db.collection("messages").add({
    //   roomId: msgData.roomId,
    //   senderId: "sidor-bot-uid",
    //   senderName: "סידור (עוזר AI)",
    //   text: botText,
    //   type: "TEXT",
    //   createdAt: serverTimestamp(),
    //   replyTo: {
    //     ownerId: msgData.senderId, // ה-UID של הלקוח
    //     originalMessageId: msgId,
    //     originalMessageText: msgData.text
    //   }
    // });
    
    console.log("Bot reply sent.");
};


/**
 * ===================================================================
 * פונקציה 3: ניקוי התראות
 * ===================================================================
 */
exports.onHumanReply =
  // onDocumentCreated("messages/{msgId}", async (event) => {
  async function onHumanReply_ClearAlert(eventStub) {
    const msgData = eventStub.data;
    
    // 1. בדיקה שזו תגובה אנושית ללקוח
    // const userDoc = await db.collection('users').doc(msgData.senderId).get();
    // if (!userDoc.exists || !msgData.replyTo) {
    //   return console.log("Not a human reply, alert stays.");
    // }
    
    // 2. מצא ומחק את ההתראה
    // const q = query(collection(db, "org_alerts"), where("roomId", "==", msgData.roomId));
    // const snapshot = await getDocs(q);
    // if (!snapshot.empty) {
    //   const batch = writeBatch(db);
    //   snapshot.docs.forEach(doc => batch.delete(doc.ref));
    //   await batch.commit();
    //   console.log(`Alert for room ${msgData.roomId} cleared.`);
    // }
};
