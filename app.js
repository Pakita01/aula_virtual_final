const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const path = require("path");
const loginRouter = require("./controllers/login");
const usersRouters = require("./controllers/User"); 
const pagoRouter = require("./routes/pagoRoutes"); // CRUD pagos
const leccionRouter = require("./routes/leccionRoutes"); // CRUD notas/lecciones
const tareaRoutes = require("./routes/tareaRoutes"); // CRUD tareas
const notaRoutes = require("./routes/notaRoutes"); // CRUD notas
const { userExtractor } = require("./middleware/auth");
const logoutRouter = require("./controllers/logout");
const { MONGO_URI } = require("./config");
const { PAGE_URL } = require("./config");
//const forroRouter = require('./routes/forroRoutes');


(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Middleware
app.use(cors({
  origin: PAGE_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas BackEnd

app.use("/api/User", usersRouters);
app.use("/api/login", loginRouter); 
app.use("/api/logout", logoutRouter); 
app.use("/api/notas", leccionRouter); // CRUD notas/lecciones
app.use("/api/pagos", userExtractor , pagoRouter);
app.use("/api/lecciones", leccionRouter);

// Nuevas rutas API para Tareas y Notas Asignadas
app.use("/api/tareas", tareaRoutes); // <-- Ruta para gestionar tareas
app.use("/api/notas-asignadas", notaRoutes); // <-- Ruta para gestionar notas (calificaciones)
// Rutas FrontEnd
app.use("/", express.static(path.join(__dirname, "views","home")));
app.use("/admin", express.static(path.join(__dirname, "views", "admin"))); // Página principal admin/index.html
app.use("/modules", express.static(path.join(__dirname, "views", "modules")))
app.use('/styles', express.static(path.join(__dirname, "views", "styles")));
app.use('/verify/:id/:token', express.static(path.join(__dirname, "views", "verify")));
app.use("/signup", express.static(path.join(__dirname, "views", "signup")));
app.use("/login", express.static(path.join(__dirname, "views", "login")));
app.use("/pagos", express.static(path.join(__dirname, "views","modules", "pagos"))); // Página pagos
app.use("/notas", express.static(path.join(__dirname, "views", "modules","notas"))); // Página notas
app.use("/components", express.static(path.join(__dirname, "views", "components")));
app.use('/img', express.static(__dirname + '/img'));
app.use('/verify/:token', express.static(path.resolve("views", "verify")));

// Morgan
app.use(morgan('tiny'))

module.exports = app;