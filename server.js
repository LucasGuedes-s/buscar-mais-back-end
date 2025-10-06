const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const { MercadoPagoConfig, Payment } = require("mercadopago");

config();

const app = express();
app.use(cors());
app.use(express.json());


const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json"); // chave privada do Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(fcmToken) {
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

sendNotification('egFzgxBCRISfOWPdu-okGM:APA91bHrY8GGFfMi37ZMaC8A3_SIwDer9OY_h_1Do_wPtiHAOYZyoEozYC42wUnqfaGeo4uzyD3Lp06ZwXTLU_Y5gkwYfkHwrlSAPdK90d1DwF2y_77gDn0')

// Inicializa o cliente do Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000 },
});
const payment = new Payment(mpClient);

// Rota para criar pagamento via PIX
app.post("/criar-pix", async (req, res) => {
  const { valor, descricao, emailComprador } = req.body;
  if (!valor || !descricao || !emailComprador) {
    return res.status(400).json({ error: "Dados incompletos para o pagamento" });
  }

  try {
    const body = {
      transaction_amount: parseFloat(valor),
      description: descricao,
      payment_method_id: "pix",
      payer: {
        email: emailComprador,
        first_name: "Cliente",
        last_name: "Teste",
        identification: {
          type: "CPF",
          number: "13388443424" // precisa ser válido
        }
      }
    };

    const response = await payment.create({ body });
    console.log(JSON.stringify(response, null, 2));
    // Envia dados básicos para o front-end, sem tentar gerar QR Code aqui
    res.json({
      id: response.id || null,
      status: response.status || "pending",
      transaction_data: {
        qr_code: response.point_of_interaction?.transaction_data?.qr_code || null,
        qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64 || null,
        ticket_url: response.point_of_interaction?.transaction_data?.ticket_url || null,
      }
    });
  } catch (error) {
    console.error("Erro ao criar pagamento PIX:", error);
    res.status(500).json({ error: "Erro ao criar pagamento PIX", details: error });
  }
});

// Rotas existentes
const produtosRoutes = require("./routes/produtos");
const usuariosRoutes = require("./routes/usuarios");
const estabelecimentoRoutes = require("./routes/estabelecimento");

app.use(produtosRoutes);
app.use(usuariosRoutes);
app.use(estabelecimentoRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
