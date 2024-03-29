
function actualizarTotal() {
    var precios = document.querySelectorAll('.precio');
    var total = 0;

    precios.forEach(function(precio) {
        if (precio.value !== '') {
            total += parseFloat(precio.value.replace(',', '.')); // Reemplazar comas por puntos para asegurar el parseo adecuado
        }
    });

    // Formatear el total con formato euro personalizado (puntos para los miles y comas para los decimales)
    var formattedTotal = formatEuro(total);
    
    document.getElementById('total').textContent = formattedTotal;
}
// Función para formatear el número en formato euro personalizado
function formatEuro(amount) {
    var parts = amount.toFixed(2).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',') + ' €';
}
//Funcion formato euro para los campos de los inputs
function formatEuroCamp(amount) {
    if (amount != ''){
        // Convertir el precio a número y asegurarse de tener solo 2 decimales
        amount = parseFloat(amount).toFixed(2);
    
        // Separar los miles con puntos y los decimales con comas
        var parts = amount.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(",") + " €";
    }
    
}

// Escuchar cambios en los precios y actualizar el total
var precios = document.querySelectorAll(".precio");
precios.forEach(function (precio) {
  precio.addEventListener("input", function () {
    actualizarTotal();
  });
});
document.addEventListener("DOMContentLoaded", function() {
});

// Función para cargar una imagen como Data URL
function loadImageAsDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  // Función para corregir la ortografía de los campos de descripción de obra
function corregirTodos() {
  var camposDescripcion = document.querySelectorAll('.descripcion');
  
  camposDescripcion.forEach(function(campo) {
      if (campo.value.trim() !== '') {
          corregirOrtografia(campo);
      }
  });
}

// Función para corregir ortografía utilizando LanguageTool
function corregirOrtografia(inputDescripcion) {
  var texto = inputDescripcion.value;

  fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'text=' + encodeURIComponent(texto) + '&language=es&enabledOnly=false'
  })
  .then(response => response.json())
  .then(data => {
      var matches = data.matches;

      var correccion = texto;
      matches.forEach(match => {
          correccion = correccion.substring(0, match.offset) + match.replacements[0].value + correccion.substring(match.offset + match.length);
      });

      inputDescripcion.value = correccion;
  })
  .catch(error => {
      console.error('Error al corregir ortografía:', error);
  });
}

// Función para generar el PDF
function generarPDF() {
// Obtener la ruta de la imagen de la cabecera y del pie de página
var headerImage = './banner.jpg'; // Ruta de la imagen de la cabecera
var footerImage = './footerbanner.jpg'; // Ruta de la imagen del pie de página

  var nombreCliente = document.getElementById("nombreCliente").value;
  var precioCocina = document.getElementById("precio_cocina").value;
  var precioSalon = document.getElementById("precio_salon").value;
  var precioBano1 = document.getElementById("precio_bano_1").value;
  var precioBano2 = document.getElementById("precio_bano_2").value;
  var precioCuarto1 = document.getElementById("precio_cuarto_1").value;
  var precioCuarto2 = document.getElementById("precio_cuarto_2").value;
  var precioCuarto3 = document.getElementById("precio_cuarto_3").value;
  var precioPatio = document.getElementById("precio_patio").value;
  var precioAnadido = document.getElementById("precio_anadido").value;
  var precioElectricidad = document.getElementById("precio_electricidad").value;
  var precioFontaneria = document.getElementById("precio_fontaneria").value;
   
  var fecha = new Date().toLocaleDateString("es-ES");

  var partesCasa = [];
  var descripciones = document.querySelectorAll(".descripcion");
  descripciones.forEach(function (descripcion) {
    var id = descripcion.id;
    var descripcionValor = descripcion.value.trim();
    var precioValor = parseFloat(
      document.getElementById(id).nextElementSibling.nextElementSibling.value
    );
    if (descripcionValor !== "" && !isNaN(precioValor)) {
      partesCasa.push({ descripcion: descripcionValor, precio: precioValor });
    }
  });
// Cargar las imágenes como Data URLs
loadImageAsDataUrl(headerImage, function(headerDataUrl) {
    loadImageAsDataUrl(footerImage, function(footerDataUrl) {
  var content = [
// Imagen de la cabecera
{
    image: headerDataUrl,
    width: 500,
    alignment: "center",
    margin: [0, 20, 0, 0]
  },
  // Resto del contenido del PDF
  // ...
  // Imagen del pie de página
  {
    image: footerDataUrl,
    width: 500,
    alignment: "center",
    margin: [0, 0, 0, 0],
    absolutePosition: { x: 40, y: 800 } // Ajustar la posición según sea necesario
  },
    {
      text: "Presupuesto obra " + nombreCliente,
      style: "header"
    },
    // Fecha actual justificada a la derecha
    {
      text: "Fecha: " + new Date().toLocaleDateString(),
      alignment: "right",
    },
    // Tabla de partes de la casa
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "auto"],
        body: [
          [
            { text: "Partes de la casa", style: "tableHeader" },
            { text: "Descripción de la obra", style: "tableHeader" },
            { text: "Precio", style: "tableHeader" },
          ],
          // Verificar si el campo no está vacío y agregar la fila
          precioSalon !== ""
            ? [
                { text: "Salón", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("salon").value || "",
                  style: "tableContent",
                },
                {
                text: formatEuroCamp(precioSalon),
                style: "tableContent",
                alignment: "right",
                },
              ]
            : [],
          precioCocina !== ""
            ? [
                { text: "Cocina", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("cocina").value || "",
                  style: "tableContent",
                },
                {
                text: formatEuroCamp(precioCocina),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioBano1 !== ""
            ? [
                { text: "Baño 1:", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("bano_1").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioBano1),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioBano2 !== ""
            ? [
                { text: "Baño 2:", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("bano_2").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioBano2),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioCuarto1 !== ""
            ? [
                { text: "Cuarto 1", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("cuarto_1").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioCuarto1),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioCuarto2 !== ""
            ? [
                { text: "Cuarto 2", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("cuarto_2").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioCuarto2),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioCuarto3 !== ""
            ? [
                { text: "Cuarto 2", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("cuarto_2").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioCuarto2),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioPatio !== ""
            ? [
                { text: "Patio", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("patio").value || "",
                  style: "tableContent",
                },
                { 
                text: formatEuroCamp(precioPatio), 
                style: "tableContent", 
                alignment: "right" },
              ]
            : [],
          precioElectricidad !== ""
            ? [
                { text: "Electricidad", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("electricidad").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioElectricidad),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioFontaneria !== ""
            ? [
                { text: "Fontanería", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("fontaneria").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioFontaneria),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
          precioAnadido !== ""
            ? [
                { text: "Añadido", style: "tableContent", noWrap: true },
                {
                  text: document.getElementById("anadido").value || "",
                  style: "tableContent",
                },
                {
                  text: formatEuroCamp(precioAnadido),
                  style: "tableContent",
                  alignment: "right",
                },
              ]
            : [],
        ].filter((row) => row.length > 0),
      },
    },
    // Precio total
    {
      text: "Precio Total: " + document.getElementById("total").innerText,
      alignment: "right",
      style: "total",
    },
  ];
  
  docDefinition = {
    pageSize: 'A4', // Tamaño de la página
    
    content: content,
    styles: {
      tableHeader: {
        alignment: "center",
        bold: true,
        fontSize: 13,
        color: "white",
        fillColor: "#34495E", // Azul
      },
      header: {
        fontSize: 24,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      fecha: {
        fontSize: 14,
        bold: true,
        alignment: "right",
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      partes: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      descripcion: {
        margin: [50, 0, 0, 10],
      },
      total: {
        fontSize: 16,
        bold: true,
        margin: [0, 20, 0, 0],
      },
      precios: {
        fontSize: 12,
        margin: [80, 0, 0, 0],
      },
    },
  };
  

  pdfMake
    .createPdf(docDefinition)
    .download("presupuesto_" + nombreCliente + ".pdf");
});
});
}
