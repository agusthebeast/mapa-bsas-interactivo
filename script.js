// Cargar el SVG del mapa y colocarlo dentro del contenedor
fetch("mapa/buenos-aires.svg")
  .then(response => {
    if (!response.ok) throw new Error("No se pudo cargar el mapa");
    return response.text();
  })
  .then(svgText => {
    // Insertar el SVG en el contenedor
    document.getElementById("mapa-container").innerHTML = svgText;

    // Aplicar estilo a todos los paths (distritos)
    const paths = document.querySelectorAll("svg path");
    paths.forEach(path => {
      path.style.fill = "#753BBD"; // color violeta
      path.style.stroke = "#ffffff";
      path.style.strokeWidth = "1";
      path.style.cursor = "pointer";

      // Evento clic (por ahora solo muestra el nombre del distrito)
      path.addEventListener("click", () => {
        alert("Distrito: " + path.id.replaceAll("-", " ").toUpperCase());
      });
    });
  })
  .catch(error => {
    console.error("Error al cargar el archivo SVG:", error);
    document.getElementById("mapa-container").innerHTML =
      "<p>No se pudo cargar el mapa.</p>";
  });
