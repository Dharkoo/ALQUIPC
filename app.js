// Constante base según los requerimientos del negocio ($35.000 por día/equipo)[cite: 3]
const PRECIO_DIA_EQUIPO = 35000;
const MIN_LONGITUD_NOMBRE = 3;
// Referencias a los elementos del formulario y la terminal
const form = document.getElementById('factura-form');
const inputCliente = document.getElementById('cliente');
const inputIdCliente = document.getElementById('idCliente');
const inputTelefono = document.getElementById('telefono');
const inputEmail = document.getElementById('email');
const inputTipoServicio = document.getElementById('tipoServicio');
const inputNumEquipos = document.getElementById('numEquipos');
const inputDiasIniciales = document.getElementById('diasIniciales');
const inputDiasAdicionales = document.getElementById('diasAdicionales');
const outputTerminal = document.getElementById('output-terminal');

// =================================================================
// 1. VALIDACIONES EN TIEMPO REAL (Restricción de caracteres)
// =================================================================

// Bloquear números y caracteres especiales en el nombre del cliente
inputCliente.addEventListener('input', function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
});

// Bloquear letras en Teléfono e ID Cliente (Solo números)
inputTelefono.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});

inputIdCliente.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// =================================================================
// 2. PROCESAMIENTO Y VALIDACIÓN FINAL AL ENVIAR
// =================================================================

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const MIN_LONGITUD_NOMBRE = 3;
  const cliente = inputCliente.value.trim();
  const idCliente = inputIdCliente.value.trim();
  const telefono = inputTelefono.value.trim();
  const email = inputEmail.value.trim();
  const tipoServicio = inputTipoServicio.value;
  const numEquipos = parseInt(inputNumEquipos.value) || 0;
  const diasIniciales = parseInt(inputDiasIniciales.value) || 0;
  const diasAdicionales = parseInt(inputDiasAdicionales.value) || 0;

  // --- Validación: Nombre del cliente no vacío ---
  if (cliente === '') {
    alert("El nombre del cliente no puede estar vacío ni contener solo espacios.");
    inputCliente.focus();
    return;
  }
  if (cliente.length < MIN_LONGITUD_NOMBRE) {
  alert(`El nombre del cliente debe tener al menos ${MIN_LONGITUD_NOMBRE} caracteres.`);
  inputCliente.focus();
  return;
  }

  // --- Validación: ID Cliente ---
  if (idCliente === '') {
    alert("El ID del cliente es obligatorio.");
    inputIdCliente.focus();
    return;
  }
  

  // --- Validación: Teléfono (mínimo 7 dígitos) ---
  if (telefono === '' || telefono.length < 7) {
    alert("Por favor ingrese un número de teléfono válido (mínimo 7 dígitos).");
    inputTelefono.focus();
    return;
  }

  // --- Validación: Formato de correo electrónico ---
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    alert("Ingrese un correo electrónico con un formato válido (ejemplo: usuario@correo.com).");
    inputEmail.focus();
    return;
  }

  // --- Validación: Número de equipos (Mínimo 2) ---[cite: 3]
  if (numEquipos < 2) {
    alert("Requerimiento ALQUIPC: El número mínimo de equipos a alquilar es de 2.");
    inputNumEquipos.focus();
    return;
  }

  // --- Validación: Días iniciales y adicionales ---[cite: 3]
  if (diasIniciales < 1) {
    alert("El número de días iniciales debe ser al menos 1.");
    inputDiasIniciales.focus();
    return;
  }

  if (diasAdicionales < 0) {
    alert("El número de días adicionales no puede ser negativo.");
    inputDiasAdicionales.focus();
    return;
  }

  if (diasAdicionales > 30) {
    alert("El número de días adicionales no puede ser mayor a 30.");
    inputDiasAdicionales.focus();
    return;
  }

  // =================================================================
  // 3. CÁLCULOS DE FACTURACIÓN
  // =================================================================

  // Valor base del alquiler inicial ($35.000 x Equipos x Días Iniciales)[cite: 3]
  const valorAlquiler = numEquipos * diasIniciales * PRECIO_DIA_EQUIPO;

  // Cálculo de Días Adicionales:
  // Regla: 2% por día adicional[cite: 3].
  // Mejora para proteger a la empresa: Se fija un tope máximo del 50% de descuento[cite: 3].
  const valorBrutoDiasAdicionales = numEquipos * diasAdicionales * PRECIO_DIA_EQUIPO;
  const porcentajeDescAdicional = Math.min(diasAdicionales * 0.02, 0.1); // Máximo 50% de descuento[cite: 3]
  const montoDescuentoDiasAdicionales = valorBrutoDiasAdicionales * porcentajeDescAdicional;
  const valorNetoDiasAdicionales = valorBrutoDiasAdicionales - montoDescuentoDiasAdicionales;

  // Ajustes por Tipo de Servicio:
  // - Fuera de la ciudad: +5% de incremento[cite: 3].
  // - Dentro del establecimiento: -5% de descuento adicional[cite: 3].
  const subtotalFactura = valorAlquiler + valorNetoDiasAdicionales;
  let incrementoServicio = 0;
  let descuentoServicio = 0;

  if (tipoServicio === "Fuera de la ciudad") {
    incrementoServicio = subtotalFactura * 0.05; //[cite: 3]
  } else if (tipoServicio === "Dentro del establecimiento") {
    descuentoServicio = subtotalFactura * 0.05; //[cite: 3]
  }

  // Descuentos totales a reflejar en la factura
  const totalDescuentos = montoDescuentoDiasAdicionales + descuentoServicio;

  // Valor Total Final a Pagar
  const totalAPagar = subtotalFactura + incrementoServicio - descuentoServicio -montoDescuentoDiasAdicionales;

  // =================================================================
  // 4. GENERACIÓN DE LA SALIDA FORMATO SENA[cite: 2]
  // =================================================================
  const salidaFactura = 
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
Valor días adicionales:   $ ${Math.round(valorNetoDiasAdicionales)}
Aumentos del lugar:       $ ${Math.round(incrementoServicio)}
Descuentos del lugar:     $ ${Math.round(descuentoServicio)}
Descuentos Dias ADD:      $ ${Math.round(montoDescuentoDiasAdicionales)}
Total Descuentos:         $ ${Math.round(totalDescuentos)}

Total a pagar:            $ ${Math.round(totalAPagar)}

Factura generada por el  S E N A

Gracias por utilizar nuestros servicios...!!!`;

  // Imprimir resultado en la consola interactiva[cite: 2]
  outputTerminal.textContent = salidaFactura;
});
