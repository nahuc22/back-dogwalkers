import express from "express";
import bodyParser from "body-parser"; // opcional si usas express.json()
import router from "./router/router"; // Importa tus rutas
import dotenv from "dotenv";
import { initializeFirebase } from "./services/firebaseService";

dotenv.config();

// Inicializar Firebase Admin
try {
  initializeFirebase();
} catch (error) {
  console.error('⚠️  Error al inicializar Firebase:', error);
  console.log('ℹ️  La app funcionará sin Firebase Auth');
}

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parser middleware
app.use(express.json());
app.use(bodyParser.json()); 

app.get("/info", (req, res) => {
    res.send("Estoy aquí");
});

// Health check endpoint - para despertar el servidor y verificar estado
app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

app.use("/api", router);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server accessible from emulator at http://10.0.2.2:${PORT}`);
});
