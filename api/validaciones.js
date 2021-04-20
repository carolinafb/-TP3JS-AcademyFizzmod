export const validarParametros = (num1, num2, operacion) => {
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
};
