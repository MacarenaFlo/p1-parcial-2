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

// Funciones auxiliares para crear elementos del modal
function crearBotonModal(texto, clases, callback) {
    const boton = document.createElement("button");
    boton.setAttribute("class", clases);
    boton.innerText = texto;
    boton.addEventListener("click", callback);
    return boton;
}

function crearItemCarrito(item) {
    const itemCarrito = document.createElement("div");
    itemCarrito.setAttribute("class", "d-flex justify-content-between align-items-center border-bottom py-2");

    const infoItem = document.createElement("div");
    infoItem.innerHTML = `
        <h6 class="mb-1">${item.nombre}</h6>
        <small class="text-muted">Cantidad: ${item.cantidad}</small>
    `;

    const precioItem = document.createElement("div");
    precioItem.setAttribute("class", "text-end");
    precioItem.innerHTML = `
        <strong>$${(item.precio * item.cantidad).toFixed(2)}</strong>
        <br>
        <small class="text-muted">$${item.precio} c/u</small>
    `;

    const botonesItem = document.createElement("div");
    botonesItem.setAttribute("class", "d-flex flex-column gap-1");

    const botonAumentar = crearBotonModal("+", "btn btn-sm btn-outline-success", () => {
        agregarAlCarrito(item.id);
        actualizarContenidoModal();
    });

    const botonDisminuir = crearBotonModal("-", "btn btn-sm btn-outline-warning", () => {
        disminuirDelCarrito(item.id);
        actualizarContenidoModal();
    });

    const botonEliminar = crearBotonModal("×", "btn btn-sm btn-outline-danger", () => {
        eliminarDelCarrito(item.id);
        actualizarContenidoModal();
    });

    botonesItem.appendChild(botonAumentar);
    botonesItem.appendChild(botonDisminuir);
    botonesItem.appendChild(botonEliminar);

    itemCarrito.appendChild(infoItem);
    itemCarrito.appendChild(precioItem);
    itemCarrito.appendChild(botonesItem);

    return itemCarrito;
}

function actualizarContenidoModal() {
    const modalExistente = document.querySelector("#modalCarrito");
    if (!modalExistente) return;

    const modalBody = modalExistente.querySelector(".modal-body");
    const modalFooter = modalExistente.querySelector(".modal-footer");

    // Limpiar y recrear el body
    modalBody.innerHTML = "";

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.setAttribute("class", "text-center text-muted");
        mensajeVacio.innerText = "Tu carrito está vacío";
        modalBody.appendChild(mensajeVacio);
    } else {
        carrito.forEach(item => modalBody.appendChild(crearItemCarrito(item)));
    }

    // Actualizar total en el footer
    const totalInfo = modalFooter.querySelector(".me-auto");
    if (totalInfo) {
        totalInfo.innerHTML = `<strong>Total: ${itemsEnCarrito()} items - $${totalCarrito().toFixed(2)}</strong>`;
    }
}

function crearHeaderModal() {
    const modalHeader = document.createElement("div");
    modalHeader.setAttribute("class", "modal-header");

    const modalTitle = document.createElement("h5");
    modalTitle.setAttribute("class", "modal-title");
    modalTitle.innerText = "Mi Carrito de Compras";

    const botonCerrar = document.createElement("button");
    botonCerrar.setAttribute("type", "button");
    botonCerrar.setAttribute("class", "btn-close");
    botonCerrar.setAttribute("data-bs-dismiss", "modal");

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(botonCerrar);
    return modalHeader;
}

function crearBodyModal() {
    const modalBody = document.createElement("div");
    modalBody.setAttribute("class", "modal-body");

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.setAttribute("class", "text-center text-muted");
        mensajeVacio.innerText = "Tu carrito está vacío";
        modalBody.appendChild(mensajeVacio);
    } else {
        carrito.forEach(item => modalBody.appendChild(crearItemCarrito(item)));
    }
    return modalBody;
}

function crearFooterModal() {
    const modalFooter = document.createElement("div");
    modalFooter.setAttribute("class", "modal-footer");

    const totalInfo = document.createElement("div");
    totalInfo.setAttribute("class", "me-auto");
    totalInfo.innerHTML = `<strong>Total: ${itemsEnCarrito()} items - $${totalCarrito().toFixed(2)}</strong>`;

    const botonVaciar = crearBotonModal("Vaciar Carrito", "btn btn-outline-danger", () => {
        vaciarCarrito();
        actualizarContenidoModal();
    });
    botonVaciar.setAttribute("type", "button");

    const botonContinuar = crearBotonModal("Continuar Comprando", "btn btn-primary", null);
    botonContinuar.setAttribute("type", "button");
    botonContinuar.setAttribute("data-bs-dismiss", "modal");

    modalFooter.appendChild(totalInfo);
    modalFooter.appendChild(botonVaciar);
    modalFooter.appendChild(botonContinuar);
    return modalFooter;
}

function crearModalCarrito() {
    // Eliminar modal existente si existe
    const modalExistente = document.querySelector("#modalCarrito");
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear estructura del modal
    const modal = document.createElement("div");
    modal.setAttribute("id", "modalCarrito");
    modal.setAttribute("class", "modal fade");
    modal.setAttribute("tabindex", "-1");

    const modalDialog = document.createElement("div");
    modalDialog.setAttribute("class", "modal-dialog modal-lg");

    const modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");

    // Ensamblar el modal
    modalContent.appendChild(crearHeaderModal());
    modalContent.appendChild(crearBodyModal());
    modalContent.appendChild(crearFooterModal());
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    // Agregar al DOM
    document.body.appendChild(modal);
    return modal;
}

function mostrarModalCarrito() {
    const modal = crearModalCarrito();
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

function disminuirDelCarrito(idProducto) {
    const itemExistente = carrito.find(item => item.id === idProducto);
    if (itemExistente) {
        if (itemExistente.cantidad > 1) {
            itemExistente.cantidad -= 1;
        } else {
            eliminarDelCarrito(idProducto);
            return; // Evitar doble actualización
        }
        actualizarCarrito();
    }
}

function eliminarDelCarrito(idProducto) {
    const index = carrito.findIndex(item => item.id === idProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }
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