"use strict";

/*
 * FLORES, MACARENA
 */

// Podria levantar los productos de un JSON o directamente estar escritos aca

let productos = [];
let categorias = [];
let carrito = [];
let filtroSeleccionado = null;
let ordenPrecio = null;

document.addEventListener("DOMContentLoaded", () => {
	cargarCarritoDesdeStorage();

	fetch("./productos.json")
		.then((response) => response.json())
		.then((data) => {
			data.forEach((item) => {
				if (!productos.some((p) => p.id === item.id)) {
					const producto = new Producto(
						item.id,
						item.nombre,
						item.descripcion,
						item.precio,
						item.categorias,
						item.imagen,
					);
					productos.push(producto);
				}
			});
			mostrarProductos();
			mostrarFiltros();
		});
});

function listarCategorias() {
	for (const producto of productos) {
		producto.categorias.forEach((categoria) => {
			if (!categorias.includes(categoria)) {
				categorias.push(categoria);
			}
		});
	}
}

function mostrarFiltros() {
	listarCategorias();
	const contenedorFiltros = document.querySelector("#filtros");
	contenedorFiltros.innerHTML = "";

	const titulo = document.createElement("h3");
	titulo.innerText = "Filtros";
	titulo.setAttribute("class", "d-none");
	contenedorFiltros.appendChild(titulo);

	const contenedorBotones = document.createElement("div");
	contenedorBotones.setAttribute("class", "d-flex flex-wrap gap-2 mb-3");

	// Botón para mostrar todos los productos
	const botonTodos = document.createElement("button");
	botonTodos.innerText = "Todos";
	botonTodos.setAttribute(
		"class",
		filtroSeleccionado === null ? "btn btn-primary" : "btn btn-secondary",
	);
	botonTodos.addEventListener("click", () => {
		filtroSeleccionado = null;
		mostrarProductos();
		mostrarFiltros();
	});
	contenedorBotones.appendChild(botonTodos);

	categorias.forEach((categoria) => {
		const boton = document.createElement("button");
		boton.innerText = categoria;
		boton.setAttribute(
			"class",
			filtroSeleccionado === categoria
				? "btn btn-primary"
				: "btn btn-secondary",
		);
		boton.addEventListener("click", () => {
			filtroSeleccionado = categoria;
			mostrarProductos();
			mostrarFiltros();
		});
		contenedorBotones.appendChild(boton);
	});

	contenedorFiltros.appendChild(contenedorBotones);

	// Contenedor para los botones de ordenamiento
	const contenedorOrden = document.createElement("div");
	contenedorOrden.setAttribute("class", "contenedor-orden d-flex gap-2 mb-3 align-items-center justify-content-center");

	const labelOrden = document.createElement("span");
	labelOrden.innerText = "Ordenar por precio:";
	labelOrden.setAttribute("class", "fw-bold fs-4");
	labelOrden.setAttribute("style", "color: #d0e0e3; margin-right: 1em;");
	contenedorOrden.appendChild(labelOrden);

	// Botón "Sin orden"
	const botonSinOrden = document.createElement("button");
	botonSinOrden.innerText = "Sin orden";
	botonSinOrden.setAttribute(
		"class",
		ordenPrecio === null ? "btn btn-primary" : "btn btn-secondary",
	);
	botonSinOrden.addEventListener("click", () => {
		ordenPrecio = null;
		mostrarProductos();
		mostrarFiltros();
	});
	contenedorOrden.appendChild(botonSinOrden);

	// Botón "Menor a mayor"
	const botonMenorMayor = document.createElement("button");
	botonMenorMayor.innerText = "Menor a mayor ↑";
	botonMenorMayor.setAttribute(
		"class",
		ordenPrecio === "asc" ? "btn btn-primary" : "btn btn-secondary",
	);
	botonMenorMayor.addEventListener("click", () => {
		ordenPrecio = "asc";
		mostrarProductos();
		mostrarFiltros();
	});
	contenedorOrden.appendChild(botonMenorMayor);

	// Botón "Mayor a menor"
	const botonMayorMenor = document.createElement("button");
	botonMayorMenor.innerText = "Mayor a menor ↓";
	botonMayorMenor.setAttribute(
		"class",
		ordenPrecio === "desc" ? "btn btn-primary" : "btn btn-secondary",
	);
	botonMayorMenor.addEventListener("click", () => {
		ordenPrecio = "desc";
		mostrarProductos();
		mostrarFiltros();
	});
	contenedorOrden.appendChild(botonMayorMenor);

	contenedorFiltros.appendChild(contenedorOrden);
}

function agregarAlCarrito(idProducto) {
	const producto = productos.find((p) => p.id === idProducto);
	if (producto) {
		const itemExistente = carrito.find((item) => item.id === idProducto);
		if (itemExistente) {
			itemExistente.cantidad += 1;
		} else {
			carrito.push({
				id: producto.id,
				nombre: producto.nombre,
				precio: producto.precio,
				cantidad: 1,
			});
		}
		actualizarCarrito();
		guardarCarritoEnStorage();
	}
}

// Limpiar el contenedor del carrito
function vaciarCarrito() {
	carrito = [];
	actualizarCarrito();
	guardarCarritoEnStorage();
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
	total.innerText = formatearPrecio(totalCarrito());
}

// Funciones para manejar localStorage del carrito
function formatearPrecio(numero) {
	return numero.toLocaleString('es-AR', {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

function guardarCarritoEnStorage() {
	localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeStorage() {
	const carritoGuardado = localStorage.getItem("carrito");
	if (carritoGuardado) {
		carrito = JSON.parse(carritoGuardado);
		actualizarCarrito();
	}
}

function crearBotonModal(texto, clases, callback) {
	const boton = document.createElement("button");
	boton.setAttribute("class", clases);
	boton.innerText = texto;
	boton.addEventListener("click", callback);
	return boton;
}

function crearItemCarrito(item) {
	const itemCarrito = document.createElement("div");
	itemCarrito.setAttribute(
		"class",
		"d-flex justify-content-between align-items-center border-bottom py-2",
	);

	const infoItem = document.createElement("div");
	infoItem.setAttribute("class", "flex-grow-2 fs-1");
	infoItem.setAttribute("style", "font-weight: bold; color: #f706ae;");

	infoItem.innerHTML = `
        <h6 class="mb-1">${item.nombre}</h6>
        <small class="text-muted">Cantidad: ${item.cantidad}</small>
    `;

	const precioItem = document.createElement("div");
	precioItem.setAttribute("class", "text-end");
	precioItem.setAttribute(
		"style",
		"font-weight: bold; color: #f706ae; font-size: 3em;",
	);
	precioItem.innerHTML = `
        <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
        <br>
        <small class="text-muted">${formatearPrecio(item.precio)} c/u</small>
    `;

	const botonesItem = document.createElement("div");
	botonesItem.setAttribute("class", "d-flex flex-column gap-1");

	const botonAumentar = crearBotonModal(
		"+",
		"btnModalCarrito btn btn-sm ",
		() => {
			agregarAlCarrito(item.id);
			actualizarContenidoModal();
		},
	);

	const botonDisminuir = crearBotonModal(
		"-",
		"btnModalCarrito btn btn-sm ",
		() => {
			disminuirDelCarrito(item.id);
			actualizarContenidoModal();
		},
	);

	const botonEliminar = crearBotonModal(
		"×",
		"btnModalCarrito btn btn-sm ",
		() => {
			eliminarDelCarrito(item.id);
			actualizarContenidoModal();
		},
	);

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

	modalBody.innerHTML = "";

	if (carrito.length === 0) {
		const mensajeVacio = document.createElement("p");
		mensajeVacio.setAttribute("class", "text-center text-muted");
		mensajeVacio.innerText = "Tu carrito está vacío";
		modalBody.appendChild(mensajeVacio);
	} else {
		carrito.forEach((item) => modalBody.appendChild(crearItemCarrito(item)));
	}

	const totalInfo = modalFooter.querySelector(".me-auto");
	if (totalInfo) {
		totalInfo.innerHTML = `<strong>Total: ${itemsEnCarrito()} items - ${formatearPrecio(totalCarrito())}</strong>`;
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
		carrito.forEach((item) => modalBody.appendChild(crearItemCarrito(item)));
	}
	return modalBody;
}

function crearFooterModal() {
	const modalFooter = document.createElement("div");
	modalFooter.setAttribute("class", "modal-footer");

	const totalInfo = document.createElement("div");
	totalInfo.setAttribute("class", "me-auto fs-4");
	totalInfo.innerHTML = `<strong>Total: ${itemsEnCarrito()} items - ${formatearPrecio(totalCarrito())}</strong>`;

	const botonVaciar = crearBotonModal(
		"Vaciar Carrito",
		"btnModalCarrito btn",
		() => {
			vaciarCarrito();
			actualizarContenidoModal();
		},
	);
	botonVaciar.setAttribute("type", "button");

	const botonContinuar = crearBotonModal(
		"Continuar Comprando",
		"btn btnModalCarrito",
		null,
	);
	botonContinuar.setAttribute("type", "button");
	botonContinuar.setAttribute("data-bs-dismiss", "modal");

	modalFooter.appendChild(totalInfo);
	modalFooter.appendChild(botonVaciar);
	modalFooter.appendChild(botonContinuar);
	return modalFooter;
}

function crearModalCarrito() {
	const modalExistente = document.querySelector("#modalCarrito");
	if (modalExistente) {
		modalExistente.remove();
	}

	const modal = document.createElement("div");
	modal.setAttribute("id", "modalCarrito");
	modal.setAttribute("class", "modal fade");
	modal.setAttribute("tabindex", "-1");

	const modalDialog = document.createElement("div");
	modalDialog.setAttribute("class", "modal-dialog modal-lg");

	const modalContent = document.createElement("div");
	modalContent.setAttribute("class", "modal-content");

	modalContent.appendChild(crearHeaderModal());
	modalContent.appendChild(crearBodyModal());
	modalContent.appendChild(crearFooterModal());
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	document.body.appendChild(modal);
	return modal;
}

function mostrarModalCarrito() {
	const modal = crearModalCarrito();
	const bootstrapModal = new bootstrap.Modal(modal, {
		backdrop: false, // No se porque tuve que poner esto para evitar que se genere un modal dentro de otro. TODO: REVISAR
	});
	bootstrapModal.show();
}

function disminuirDelCarrito(idProducto) {
	const itemExistente = carrito.find((item) => item.id === idProducto);
	if (itemExistente) {
		if (itemExistente.cantidad > 1) {
			itemExistente.cantidad -= 1;
		} else {
			eliminarDelCarrito(idProducto);
			return;
		}
		actualizarCarrito();
		guardarCarritoEnStorage();
	}
}

function eliminarDelCarrito(idProducto) {
	const index = carrito.findIndex((item) => item.id === idProducto);
	if (index !== -1) {
		carrito.splice(index, 1);
		actualizarCarrito();
		guardarCarritoEnStorage();
	}
}

function mostrarProductos() {
	const contenedor = document.querySelector("#productos");
	contenedor.innerHTML = "";
	const productosFiltrados =
		filtroSeleccionado === null
			? productos
			: productos.filter((producto) =>
					producto.tieneCategoria(filtroSeleccionado),
				);

	if (ordenPrecio === "asc") {
		productosFiltrados.sort((a, b) => a.precio - b.precio);
	} else if (ordenPrecio === "desc") {
		productosFiltrados.sort((a, b) => b.precio - a.precio);
	}

	productosFiltrados.forEach((producto) => {
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
		botonVerMas.setAttribute("class", "btn btnModalCarrito");
		botonVerMas.setAttribute("style", "width: 100%;");
		botonVerMas.innerText = "Ver más";
		botonVerMas.addEventListener("click", () => {
			mostrarModalProducto(producto.id);
		});

		const categorias = document.createElement("p");
		categorias.setAttribute("class", "categoria");
		categorias.innerText =
			producto.categorias.length > 0
				? producto.categorias.join(", ")
				: "Sin categoría";

		const precioProducto = document.createElement("p");
		precioProducto.setAttribute("class", "card-text");
		precioProducto.setAttribute(
			"style",
			"font-weight: bold; color: #f706ae; font-size: 2em; text-align: end",
		);

		precioProducto.innerText = formatearPrecio(producto.precio);

		const botonAgregar = document.createElement("button");
		botonAgregar.setAttribute("class", "btn btnModalCarrito");
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

function crearHeaderModalProducto(producto) {
	const modalHeader = document.createElement("div");
	modalHeader.setAttribute("class", "modal-header");

	const modalTitle = document.createElement("h5");
	modalTitle.setAttribute("class", "modal-title");
	modalTitle.setAttribute(
		"style",
		"font-weight: bold; color: #f706ae; font-size: 2em;",
	);
	modalTitle.innerText = producto.nombre;

	const botonCerrar = document.createElement("button");
	botonCerrar.setAttribute("type", "button");
	botonCerrar.setAttribute("class", "btn-close");
	botonCerrar.addEventListener("click", () => {
		const modalInstance = bootstrap.Modal.getInstance(
			document.querySelector("#modalProducto"),
		);
		if (modalInstance) {
			modalInstance.hide();
		}
	});

	modalHeader.appendChild(modalTitle);
	modalHeader.appendChild(botonCerrar);
	return modalHeader;
}

function crearBodyModalProducto(producto) {
	const modalBody = document.createElement("div");
	modalBody.setAttribute("class", "modal-body");
	modalBody.setAttribute(
		"style",
		"font-weight: 400; color: #000000; font-size: 1.6em;",
	);

	const imagenContainer = document.createElement("div");
	imagenContainer.setAttribute("class", "text-center mb-3");

	const imagen = document.createElement("img");
	imagen.setAttribute("class", "img-fluid");
	imagen.setAttribute("src", producto.imagen);
	imagen.setAttribute("alt", producto.nombre);
	imagen.setAttribute("style", "max-height: 300px; object-fit: cover;");

	imagenContainer.appendChild(imagen);

	const descripcion = document.createElement("div");
	descripcion.setAttribute("class", "mb-3");
	descripcion.setAttribute(
		"style",
		"font-weight: 400; color: #000000; font-size: 1em;",
	);
	descripcion.innerHTML = `
        <h6 class="fw-bold fs-4">Descripción:</h6>
        <p class="text-muted">${producto.descripcion}</p>
    `;

	// Categorías
	const categoriasDiv = document.createElement("div");
	categoriasDiv.setAttribute("class", "mb-3");
	categoriasDiv.setAttribute(
		"style",
		"font-weight: 400; color: #000000; font-size: 1em;",
	);

	const categoriasTitle = document.createElement("h6");
	categoriasTitle.setAttribute("class", "fw-bold fs-4");
	categoriasTitle.innerText = "Categorías:";

	const categoriasBadges = document.createElement("div");
	categoriasBadges.setAttribute("class", "d-flex flex-wrap gap-1");

	producto.categorias.forEach((categoria) => {
		const badge = document.createElement("span");
		badge.setAttribute("class", "badge bg-secondary");
		badge.setAttribute("style", "font-size: 1.5em; padding: 0.5em 2em;");

		badge.innerText = categoria;
		categoriasBadges.appendChild(badge);
	});

	categoriasDiv.appendChild(categoriasTitle);
	categoriasDiv.appendChild(categoriasBadges);

	const precioDiv = document.createElement("div");
	precioDiv.setAttribute("class", "text-center mb-3");
	precioDiv.setAttribute(
		"style",
		"font-weight: bold; color: #f706ae; font-size: 1.5em;",
	);
	precioDiv.innerHTML = `
        <h3 class="precio fw-bold">${formatearPrecio(producto.precio)}</h3>
    `;

	modalBody.appendChild(imagenContainer);
	modalBody.appendChild(descripcion);
	modalBody.appendChild(categoriasDiv);
	modalBody.appendChild(precioDiv);

	return modalBody;
}

function crearFooterModalProducto(producto) {
	const modalFooter = document.createElement("div");
	modalFooter.setAttribute("class", "modal-footer");

	const botonCerrar = document.createElement("button");
	botonCerrar.setAttribute("type", "button");
	botonCerrar.setAttribute("class", "btn btnModalCarrito ");
	botonCerrar.innerText = "Cerrar";
	botonCerrar.addEventListener("click", () => {
		const modalInstance = bootstrap.Modal.getInstance(
			document.querySelector("#modalProducto"),
		);
		if (modalInstance) {
			modalInstance.hide();
		}
	});

	const botonAgregar = document.createElement("button");
	botonAgregar.setAttribute("type", "button");
	botonAgregar.setAttribute("class", "btn btnModalCarrito ");
	botonAgregar.innerText = "Agregar al carrito";
	botonAgregar.addEventListener("click", () => {
		agregarAlCarrito(producto.id);

		const modalInstance = bootstrap.Modal.getInstance(
			document.querySelector("#modalProducto"),
		);
		if (modalInstance) {
			modalInstance.hide();
		}
	});

	modalFooter.appendChild(botonCerrar);
	modalFooter.appendChild(botonAgregar);
	return modalFooter;
}

function crearModalProducto(producto) {
	const modalExistente = document.querySelector("#modalProducto");
	if (modalExistente) {
		const modalInstance = bootstrap.Modal.getInstance(modalExistente);
		if (modalInstance) {
			modalInstance.dispose();
		}
		modalExistente.remove();
	}

	const modal = document.createElement("div");
	modal.setAttribute("id", "modalProducto");
	modal.setAttribute("class", "modal fade");
	modal.setAttribute("tabindex", "-1");

	const modalDialog = document.createElement("div");
	modalDialog.setAttribute("class", "modal-dialog modal-lg");

	const modalContent = document.createElement("div");
	modalContent.setAttribute("class", "modal-content");

	modalContent.appendChild(crearHeaderModalProducto(producto));
	modalContent.appendChild(crearBodyModalProducto(producto));
	modalContent.appendChild(crearFooterModalProducto(producto));
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	document.body.appendChild(modal);
	return modal;
}

function mostrarModalProducto(idProducto) {
	const producto = productos.find((p) => p.id === idProducto);
	if (!producto) return;

	const modal = crearModalProducto(producto);
	const bootstrapModal = new bootstrap.Modal(modal, {
		backdrop: false, // Desactivar completamente el backdrop
		keyboard: true,
	});

	bootstrapModal.show();
}
