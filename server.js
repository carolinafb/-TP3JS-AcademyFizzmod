import express from "express";
import fs from "fs";
import * as operaciones from "./api/operaciones.js";

const app = express();

/* ---------------------- INCISO 1  --------------------------- */
/* -------- respuesta en base a la hora del servidor ---------- */
/* ------------------------------------------------------------ */
app.get("/", (req, res) => {
  let hs = new Date().getHours();
  console.log("HS del servidor:", hs);
  if (6 <= hs && hs <= 12) {
    res.send("<h1>Buenos dias!</h1>");
  } else {
    if (13 <= hs && hs <= 19) {
      res.send("<h1>Buenas tardes!</h1>");
    } else {
      //entre las 20hs y 5hs
      res.send("<h1>Buenas noches!</h1>");
    }
  }
});

/* ---------------------- INCISO 2  --------------------------- */
/* -respuesta objeto con numeros y su cantidad de repeticiones- */
/* ------------------------------------------------------------ */
app.get("/random", (req, res) => {
  let numeros = Array(21).fill(0);
  for (let i = 0; i < 10000; i++) {
    let num = Math.floor(Math.random() * (21 - 1)) + 1;
    numeros[num]++;
  }
  res.json({ ...numeros });
});

/* ---------------------- INCISO 3  --------------------------- */
/* --------------- leer el archivo package.json --------------- */
/* ------------------------------------------------------------ */
app.get("/info", async (req, res) => {
  try {
    let info = {
      contenidoStr: "",
      contenidoObj: {},
      size: 0,
    };
    let archivo = process.cwd() + "\\package.json";

    //Leo un archivo en forma asincrónica
    let page = await fs.promises.readFile(archivo, "utf-8");
    info.contenidoStr = page;
    info.contenidoObj = JSON.parse(page);
    info.size = page.length;
    console.log("RD ok");
    console.log("Objeto Info:", info);

    //Escribo un archivo en forma asincrónica
    await fs.promises.writeFile("./info.txt", JSON.stringify(info));
    console.log("WR ok");

    res.json(info);
  } catch (error) {
    res.send(
      `<h2 style="color:red;">ERROR 404: recurso <span style="color:orange;">${archivo}</span> no encontrado</h2>`
    );
    console.log(`Error en operación asincrónica de fs: ${error}`);
  }
});

/* ---------------------- INCISO 4  --------------------------- */
/* -- get ‘/operaciones’, que reciba por query-params dos ----- */
/* -- números y la operación a realizar entre ellos ----------- */

function validarParametros(num1, num2, operacion) {
  //valido que lleguen todos los parametros
  if (num1 && num2 && operacion) {
    //valido que se seleccione una operacion valida
    if (
      operacion == "suma" ||
      operacion == "resta" ||
      operacion == "multiplicacion" ||
      operacion == "division"
    ) {
      //valido que se manden numeros
      if (num1 != "NaN" && num2 != "NaN") {
        return true;
      }
    }
  }
  return false;
}

app.get("/operaciones", (req, res) => {
  let { num1, num2, operacion } = req.query;
  let n1 = parseInt(num1);
  let n2 = parseInt(num2);

  if (validarParametros(n1, n2, operacion)) {
    let result;
    switch (operacion) {
      case "suma":
        result = operaciones.suma(n1, n2);
        break;
      case "resta":
        result = operaciones.resta(n1, n2);
        break;
      case "multiplicacion":
        result = operaciones.multiplicacion(n1, n2);
        break;
      default:
        result = operaciones.division(n1, n2);
        break;
    }
    res.json({
      num1: n1,
      num2: n2,
      operacion: operacion,
      resultado: result,
    });
  } else {
    res.json({
      error: {
        num1: { valor: num1, tipo: typeof num1 },
        num2: { valor: num2, tipo: typeof num2 },
        operacion: { valor: operacion, tipo: typeof operacion },
      },
    });
  }
});

/* ----- MANEJO DE RUTAS NO DEFINIDAS (solo para get) --------- */
app.get("*", (req, res) => {
  let { url, method } = req;
  res.send(`<b>Ruta ${url} en método ${method} NO DEFINIDA</b>`);
});

/* ------------------------------------------------------------ */
/* ---------------- configuracion del servidor ---------------- */
/* ------------------------------------------------------------ */
const PORT = process.env.PORT || 8080;
app.set("PUERTO", PORT);

const server = app.listen(app.get("PUERTO"), () => {
  console.log(
    `Servidor express escuchando en el puerto ${server.address().port}`
  );
});
server.on("error", (error) => console.log(`Error en Servidor: ${error}`));
