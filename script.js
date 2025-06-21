let distritoSeleccionado = null;
let imagenActual = 0;
let imagenes = [];
let textos = {};

const modal = document.getElementById("modal");
const imgCarrusel = document.getElementById("imagen-carrusel");
const pie = document.getElementById("pie-de-foto");
const nombreDistrito = document.getElementById("nombre-distrito");

// Cerrar modal
document.getElementById("cerrar").onclick = () => {
  modal.classList.add("hidden");
};

// Botones del carrusel
document.getElementById("prev").onclick = () => {
  if (imagenActual > 0) {
    imagenActual--;
    mostrarImagen();
  }
};
document.getElementById("next").onclick = () => {
  if (imagenActual < imagenes.length - 1) {
    imagenActual++;
    mostrarImagen();
  }
};

// Cargar textos de pie de foto
fetch("data/textos.json")
  .then((res) => res.json())
  .then((data) => {
    textos = data;
  });

// Cargar mapa SVG
fetch("mapa/buenos-aires.svg")
  .then((res) => res.text())
  .then((svgText) => {
    document.getElementById("mapa-container").innerHTML = svgText;

    // Agregar eventos a cada path
    const paths = document.querySelectorAll("svg path");
    paths.forEach((path) => {
      const id = path.id || path.getAttribute("id") || generarIdDesdeNombre(path.getAttribute("aria-describedby"));
      if (id) path.setAttribute("id", id.toLowerCase().replace(/\s+/g, "-"));

      path.addEventListener("click", () => {
        distritoSeleccionado = path.id;
        cargarGaleria(distritoSeleccionado);
      });
    });
  })
  .catch((error) => {
    console.error("Error al cargar el mapa:", error);
  });

// Mostrar una imagen del carrusel
function mostrarImagen() {
  const src = imagenes[imagenActual];
  imgCarrusel.src = src;
  pie.textContent = textos[distritoSeleccionado]?.[imagenActual] || "";
}

// Cargar galería de imágenes para un distrito
function cargarGaleria(distrito) {
  imagenes = [];
  imagenActual = 0;
  nombreDistrito.textContent = distrito.replace(/-/g, " ").toUpperCase();

  // Intentar cargar hasta 50 imágenes
  const intentos = Array.from({ length: 50 }, (_, i) => {
    const img = new Image();
    const src = `imagenes/${distrito}/${i + 1}.jpg`;

    return new Promise((resolve) => {
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  });

  Promise.all(intentos).then((resultados) => {
    imagenes = resultados.filter((r) => r !== null);
    if (imagenes.length === 0) {
      alert("Este distrito aún no tiene imágenes.");
    } else {
      mostrarImagen();
      modal.classList.remove("hidden");
    }
  });
}

// En caso de que no haya id en los paths, lo intentamos derivar de aria-describedby
function generarIdDesdeNombre(aria) {
  if (!aria) return null;
  const label = document.getElementById(aria);
  if (!label) return null;
  return label.textContent.trim().toLowerCase().replace(/\s+/g, "-");
}
