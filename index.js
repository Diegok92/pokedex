const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

// Ruta para la página principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
