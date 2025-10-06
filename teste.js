const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json"); // chave privada do Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(fcmToken: string) {
  const message = {
    notification: {
      title: "🚀 Notificação FCM",
      body: "Enviada direto pelo Firebase!",
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Mensagem enviada:", response);
  } catch (error) {
    console.error("Erro:", error);
  }
}
