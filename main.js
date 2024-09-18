import * as THREE from 'three';

// Inicializar la escena, la cámara y el renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Configuración de la cámara
camera.position.z = 10;

// Crear una función para generar un rectángulo solo con contorno
function crearRectanguloConContorno(x, y, ancho, alto, color = 0x00ff00) {
    const geometry = new THREE.PlaneGeometry(ancho, alto);
    const edges = new THREE.EdgesGeometry(geometry); // Crear el contorno
    const material = new THREE.LineBasicMaterial({ color: color });
    const linea = new THREE.LineSegments(edges, material); // Crear el contorno como líneas
    linea.position.set(x, y, 0); // Posicionar el rectángulo en el espacio
    return linea;
}

// Parámetros para las funciones seno y coseno
const numRectangulos = 50;  // Cantidad de rectángulos
const amplitud = 2;         // Amplitud de la función seno/coseno
const frecuencia = 1;       // Frecuencia de las funciones seno/coseno
const anchoRect = 0.2;      // Ancho de cada rectángulo
const separacion = 0.5;     // Separación entre las dos funciones
const faseCoseno = Math.PI / 2; // Desfase del coseno (90 grados)
const limiteX = (numRectangulos / 2) * anchoRect * 2; // Limite X para el bucle

// Arrays para guardar los rectángulos
const rectangulosSeno = [];
const rectangulosCoseno = [];

// Crear los rectángulos siguiendo las formas de las funciones seno y coseno
for (let i = 0; i < numRectangulos; i++) {
    const x = (i - numRectangulos / 2) * anchoRect * 2;   // Distribuir los rectángulos a lo largo del eje X
    
    // Función seno (mantener altura constante)
    const altoRectSeno = amplitud;  // Altura fija para mantener el tamaño constante
    const rectanguloSeno = crearRectanguloConContorno(x, 0, anchoRect, altoRectSeno, 0x00ff00);
    scene.add(rectanguloSeno);     // Añadir a la escena
    rectangulosSeno.push(rectanguloSeno);

    // Función coseno desfasado
    const altoRectCoseno = amplitud;  // Altura fija para mantener el tamaño constante
    const rectanguloCoseno = crearRectanguloConContorno(x, 0, anchoRect, altoRectCoseno, 0xff0000);
    scene.add(rectanguloCoseno);     // Añadir a la escena
    rectangulosCoseno.push(rectanguloCoseno);
}

// Animación de las funciones seno y coseno para simular un bucle infinito
let tiempo = 0;
function animate() {
    requestAnimationFrame(animate);
    
    tiempo += 0.02;  // Incrementar el tiempo para animación

    // Animar los rectángulos del seno
    for (let i = 0; i < numRectangulos; i++) {
        const x = (i - numRectangulos / 2) * anchoRect * 2;
        const xSeno = x + tiempo; // Desplazamiento horizontal
        const ySeno = amplitud * Math.sin(frecuencia * xSeno); // Altura del seno en esa posición
        rectangulosSeno[i].position.x = xSeno % (2 * limiteX) - limiteX; // Ajustar posición para bucle infinito
        rectangulosSeno[i].position.y = ySeno / 2;
    }

    // Animar los rectángulos del coseno desfasado
    for (let i = 0; i < numRectangulos; i++) {
        const x = (i - numRectangulos / 2) * anchoRect * 2;
        const xCoseno = x + tiempo; // Desplazamiento horizontal
        const yCoseno = amplitud * Math.cos(frecuencia * xCoseno + faseCoseno); // Altura del coseno desfasado
        rectangulosCoseno[i].position.x = xCoseno % (2 * limiteX) - limiteX; // Ajustar posición para bucle infinito
        rectangulosCoseno[i].position.y = yCoseno / 2;
    }

    renderer.render(scene, camera);
}

// Iniciar la animación
animate();

// Ajustar el tamaño de la ventana cuando se redimensiona
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
