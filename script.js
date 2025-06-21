let imagenActual = 0;
let imagenes = [];
let piesDeFoto = [];
let distritoSeleccionado = "";

// Cargar el mapa SVG dentro del contenedor
fetch("mapa/buenos-aires.svg")
  .then(res => res.text())
  .then(svg => {
    document.getElementById("mapa-container").innerHTML = svg;

    // Agregar eventos a cada path del SVG
    document.querySelectorAll("svg path").forEach(path => {
      path.addEventListener("click", () => {
        distritoSeleccionado = path.id;
        cargarGaleria(distritoSeleccionado);
      });
    });
  })
  .catch(err => {
    console.error("No se pudo cargar el mapa SVG:", err);
  });

// Cargar galería de imágenes para un distrito
async function cargarGaleria(distrito) {
  try {
    const textoRes = await fetch("data/textos.json");
    const textoJson = await textoRes.json();
    piesDeFoto = textoJson[distrito] || [];

    imagenes = [];
    for (let i = 1; i <= 50; i++) {
      const url = `imagenes/${distrito}/${i}.jpg`;
      const existe = await fetch(url).then(r => r.ok);
      if (existe) imagenes.push(url);
    }

    if (imagenes.length === 0) {
      alert("Este distrito aún no tiene imágenes.");
      return;
    }

    imagenActual = 0;
    mostrarImagen();
    document.getElementById("nombre-distrito").innerText = distrito.replaceAll("-", " ");
    document.getElementById("modal").classList.remove("hidden");

  } catch (err) {
    console.error("Error al cargar la galería:", err);
  }
}

// Mostrar una imagen en el carrusel
function mostrarImagen() {
  const img = document.getElementById("imagen-carrusel");
  const pie = document.getElementById("pie-de-foto");

  img.src = imagenes[imagenActual];
  pie.innerText = piesDeFoto[imagenActual] || "Sin descripción";
}

// Navegación del carrusel
document.getElementById("cerrar").addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});

document.getElementById("next").addEventListener("click", () => {
  imagenActual = (imagenActual + 1) % imagenes.length;
  mostrarImagen();
});

document.getElementById("prev").addEventListener("click", () => {
  imagenActual = (imagenActual - 1 + imagenes.length) % imagenes.length;
  mostrarImagen();
});
