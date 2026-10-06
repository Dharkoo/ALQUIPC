const PRECIO_DIA_EQUIPO = 35000; //[cite: 3]

document.getElementById('factura-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Captura de datos[cite: 3]
  const cliente = document.getElementById('cliente').value;
  const idCliente = document.getElementById('idCliente').value;
  const telefono = document.getElementById('telefono').value;
  const email = document.getElementById('email').value;
  const tipoServicio = document.getElementById('tipoServicio').value;
  const numEquipos = parseInt(document.getElementById('numEquipos').value);
  const diasIniciales = parseInt(document.getElementById('diasIniciales').value);
  const diasAdicionales = parseInt(document.getElementById('diasAdicionales').value);

  // Validación de mínimo 2 equipos[cite: 3]
  if (numEquipos < 2) {
    alert("El número mínimo de equipos a alquilar es 2.");
    return;
  }

  // Cálculos base[cite: 3]
  const valorAlquiler = numEquipos * diasIniciales * PRECIO_DIA_EQUIPO;

  // Cálculo de días adicionales con descuento progresivo (2% por día, tope de 50% para no quebrar la empresa)[cite: 3]
  let valorDiasAdicionalesBruto = numEquipos * diasAdicionales * PRECIO_DIA_EQUIPO;
  let porcentajeDescAdicional = Math.min(diasAdicionales * 0.02, 0.50); //[cite: 3]
  let valorDiasAdicionales = valorDiasAdicionalesBruto * (1 - porcentajeDescAdicional);

  // Ajustes según tipo de servicio[cite: 3]
  let ajusteServicio = 0;
  if (tipoServicio === "Fuera de la ciudad") {
    ajusteServicio = (valorAlquiler + valorDiasAdicionales) * 0.05; // 5% incremento[cite: 3]
  } else if (tipoServicio === "Dentro del establecimiento") {
    ajusteServicio = -((valorAlquiler + valorDiasAdicionales) * 0.05); // 5% descuento[cite: 3]
  }

  // Total acumulado
  const totalPagar = valorAlquiler + valorDiasAdicionales + ajusteServicio;

  // Formato exacto de salida de la imagen recibida[cite: 2]
  const salida = 
`                'A L Q U I P C'

Cliente                   ${cliente}
Id_Cliente                ${idCliente}
Teléfono                  ${telefono}
E-mail                    ${email}

Tipo de servicio:         ${tipoServicio}
Numero de Equipos:        ${numEquipos}
No. Días Iniciales:       ${diasIniciales}
Valor Alquiler:           $ ${valorAlquiler}
No. Días adicionales:     ${diasAdicionales}
Valor días adicionales:   $ ${Math.round(valorDiasAdicionales)}
Descuentos/Ajustes:       $ ${Math.round(ajusteServicio)}

Total a pagar:            $ ${Math.round(totalPagar)}

Factura generada por el  S E N A

Gracias por utilizar nuestros servicios...!!!`;

  // Despliegue en consola gráfica[cite: 2]
  document.getElementById('output-terminal').textContent = salida;
});