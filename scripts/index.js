'use strict';

/*
 * APELLIDO, NOMBRE | APELLIDO, NOMBRE
 */

// Podria levantar los productos de un JSON o directamente estar escritos aca

let productos = [];
let categorias = [];
let carrito = [];
let filtroSeleccionado = null;

document.addEventListener("DOMContentLoaded", () => {

    fetch("./productos.json")
        .then(response => response.json())
        .then(data => {

            data.forEach(item => {
                const producto = new Producto(
                    item.id,
                    item.nombre,
                    item.descripcion,
                    item.precio,
                    item.categorias,
                    item.imagen
                );
                productos.push(producto);
            });
            mostrarProductos();
            mostrarFiltros();
        });
});

function listarCategorias() {
    for (const producto of productos) {
        producto.categorias.forEach(categoria => {
            if (!categorias.includes(categoria)) {
                categorias.push(categoria);
            }
        });
    }
}

function mostrarFiltros() {
    listarCategorias(); // Asegurarse de que las categorías estén actualizadas
    const contenedorFiltros = document.querySelector("#filtros");
    contenedorFiltros.innerHTML = ""; // Limpiar el contenedor

    const titulo = document.createElement("h3");
    titulo.innerText = "Filtros";
    titulo.setAttribute("class", "d-none");
    contenedorFiltros.appendChild(titulo);

    const contenedorBotones = document.createElement("div");
    contenedorBotones.setAttribute("class", "d-flex flex-wrap gap-2");

    // Botón para mostrar todos los productos
    const botonTodos = document.createElement("button");
    botonTodos.innerText = "Todos";
    botonTodos.setAttribute("class", filtroSeleccionado === null ? "btn btn-primary" : "btn btn-secondary");
    botonTodos.addEventListener("click", () => {
        filtroSeleccionado = null;
        mostrarProductos();
        mostrarFiltros();
    });
    contenedorBotones.appendChild(botonTodos);

    categorias.forEach(categoria => {
        const boton = document.createElement("button");
        boton.innerText = categoria;
        boton.setAttribute("class", filtroSeleccionado === categoria ? "btn btn-primary" : "btn btn-secondary");
        boton.addEventListener("click", () => {
            filtroSeleccionado = categoria;
            mostrarProductos();
            mostrarFiltros();
        });
        contenedorBotones.appendChild(boton);
    });

    contenedorFiltros.appendChild(contenedorBotones);
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        const itemExistente = carrito.find(item => item.id === idProducto);
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        }
        actualizarCarrito();
    }
}

// Limpiar el contenedor del carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

function itemsEnCarrito() {
    let items = 0;
    for (const item of carrito) {
        items += item.cantidad;
    }
    return items;
}

function totalCarrito() {
    let total = 0;
    for (const item of carrito) {
        total += item.precio * item.cantidad;
    }
    return total;
}

function actualizarCarrito() {
    const cantidadItems = document.querySelector("#cantidadItems");
    cantidadItems.innerText = itemsEnCarrito();
    const total = document.querySelector("#totalCarrito");
    total.innerText = totalCarrito();
}

function mostrarProductos() {
    const contenedor = document.querySelector("#productos");
    contenedor.innerHTML = ""; // Limpiar el contenedor
    // Filtrar los productos según el filtro seleccionado
    const productosFiltrados = filtroSeleccionado === null
        ? productos
        : productos.filter(producto => producto.tieneCategoria(filtroSeleccionado));

    productosFiltrados.forEach(producto => {

                const card = document.createElement("div");
                card.setAttribute("class", "card mb-4");

                card.dataset.id = producto.id;

                const cardBody = document.createElement("div");
                cardBody.setAttribute("class", "card-body");

                const nombreProducto = document.createElement("h3");
                nombreProducto.setAttribute("class", "nombre-producto");
                nombreProducto.innerText = producto.nombre;

                const imagen = document.createElement("img");
                imagen.setAttribute("class", "card-img-top");
                imagen.setAttribute("src", producto.imagen);
                imagen.setAttribute("alt", producto.nombre);


                const descripcionProducto = document.createElement("p");
                descripcionProducto.setAttribute("class", "card-text text-truncate");
                descripcionProducto.innerText = producto.descripcion;

                const botonVerMas = document.createElement("button");
                botonVerMas.setAttribute("class", "detalle");
                botonVerMas.setAttribute("style", "width: 100%;");
                botonVerMas.innerText = "Ver más";
                botonVerMas.addEventListener("click", () => {
                    mostrarProductos();
                });


                const categorias = document.createElement("p");
                categorias.setAttribute("class", "categoria");
                categorias.innerText = producto.categorias.length > 0 ? producto.categorias.join(", ") : "Sin categoría";

                const precioProducto = document.createElement("p");
                precioProducto.setAttribute("class", "card-text");
                precioProducto.setAttribute("style", "font-weight: bold; color: #f706ae; font-size: 2em; text-align: end");

                precioProducto.innerText = `$${producto.precio}`;

                const botonAgregar = document.createElement("button");
                botonAgregar.setAttribute("class", "btn");
                botonAgregar.setAttribute("style", "width: 100%;");
                botonAgregar.innerText = "Agregar al carrito";
                botonAgregar.addEventListener("click", () => {
                    agregarAlCarrito(producto.id);
                });

                cardBody.appendChild(categorias);
                cardBody.appendChild(nombreProducto);
                cardBody.appendChild(imagen);
                cardBody.appendChild(descripcionProducto);
                cardBody.appendChild(precioProducto);
                cardBody.appendChild(botonVerMas);
                cardBody.appendChild(botonAgregar);

                card.appendChild(cardBody);
                document.querySelector("#productos").appendChild(card);
            });

}