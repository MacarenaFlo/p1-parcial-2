"use strict";

/*
 * FLORES, MACARENA
 */

// Podria levantar los productos de un JSON o directamente estar escritos aca

let productos = [];
let ofertas = [];
let categorias = [];
let carrito = [];
let filtroSeleccionado = null;
let ordenPrecio = null;

document.addEventListener("DOMContentLoaded", () => {
	cargarCarritoDesdeStorage();

	// Cargar productos
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

	// Cargar ofertas
	fetch("./ofertas.json")
		.then((response) => response.json())
		.then((data) => {
			data.forEach((item) => {
				if (!ofertas.some((o) => o.id === item.id)) {
					const oferta = new Oferta(
						item.id,
						item.categoria,
						item.titulo,
						item.descripcion,
						item.detalle
					);
					ofertas.push(oferta);
				}
			});
		})
		.catch((error) => {
			console.error("Error al cargar ofertas:", error);
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
		const categoriaAnterior = filtroSeleccionado;
		filtroSeleccionado = null;
		mostrarProductos();
		mostrarFiltros();
		
	
		if (categoriaAnterior !== null) {
			mostrarOfertaEspecial("general");
		}
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
			const categoriaAnterior = filtroSeleccionado;
			filtroSeleccionado = categoria;
			mostrarProductos();
			mostrarFiltros();
			
			
			mostrarOfertaEspecial(categoria);
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

function mostrarOfertaEspecial(categoria) {
	const oferta = ofertas.find(o => o.categoria.toLowerCase() === categoria.toLowerCase());
	
	if (!oferta) return;
	
	// Crear el banner de oferta
	crearBannerOferta(oferta);
}

function crearBannerOferta(oferta) {
	
	const bannerExistente = document.querySelector("#bannerOferta");
	if (bannerExistente) {
		bannerExistente.remove();
	}
	
	// Crear el banner
	const banner = document.createElement("div");
	banner.setAttribute("id", "bannerOferta");
	banner.setAttribute("class", "banner-oferta");
	
	banner.innerHTML = `
		<h4 class="banner-titulo">${oferta.titulo}</h4>
		<p class="banner-descripcion">${oferta.descripcion}</p>
		<p class="banner-detalle">${oferta.detalle}</p>
	`;
	
	
	document.body.appendChild(banner);
	
	setTimeout(() => {
		cerrarBannerOferta();
	}, 10000);
}

function cerrarBannerOferta() {
	const banner = document.querySelector("#bannerOferta");
	if (banner) {
		banner.style.opacity = "0";
		banner.style.transform = "translateX(100%)";
		banner.style.transition = "all 0.3s ease";
		setTimeout(() => {
			if (banner.parentNode) {
				banner.remove();
			}
		}, 300);
	}
}


window.cerrarBannerOferta = cerrarBannerOferta;

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
				imagen: producto.imagen,
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

function finalizarCompra() {
	if (carrito.length === 0) {
		alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
		return;
	}

	
	const modalCarritoInstance = bootstrap.Modal.getInstance(document.querySelector("#modalCarrito"));
	if (modalCarritoInstance) {
		modalCarritoInstance.hide();
	}

	// Mostrar modal de pago
	mostrarModalPago();
}

function procesarPago(datosTarjeta) {
	const total = totalCarrito();
	const cantidadItems = itemsEnCarrito();
	
	
	const datosCompra = {
		items: [...carrito], 
		total: total,
		cantidadItems: cantidadItems,
		tarjeta: datosTarjeta
	};
	
	
	vaciarCarrito();
	
	// Mostrar modal de confirmación de compra
	mostrarModalConfirmacion(datosCompra);
}

function crearHeaderModalConfirmacion() {
	const modalHeader = document.createElement("div");
	modalHeader.setAttribute("class", "modal-header button text-white");

	const modalTitle = document.createElement("h5");
	modalTitle.setAttribute("class", "modal-title");
	modalTitle.setAttribute("style", "font-weight: bold; font-size: 1.8em;");
	modalTitle.innerHTML = "✓ ¡Compra Exitosa!";

	const botonCerrar = document.createElement("button");
	botonCerrar.setAttribute("type", "button");
	botonCerrar.setAttribute("class", "btn-close btn-close-white");
	botonCerrar.addEventListener("click", () => {
		const modalInstance = bootstrap.Modal.getInstance(document.querySelector("#modalConfirmacion"));
		if (modalInstance) {
			modalInstance.hide();
		}
	});

	modalHeader.appendChild(modalTitle);
	modalHeader.appendChild(botonCerrar);
	return modalHeader;
}

function crearBodyModalConfirmacion(datosCompra) {
	const modalBody = document.createElement("div");
	modalBody.setAttribute("class", "modal-body");


	const mensajeDiv = document.createElement("div");
	mensajeDiv.setAttribute("class", "text-center mb-4");
	mensajeDiv.innerHTML = `
		<h4 class="text-success mb-3">¡Gracias por su compra!</h4>
		<p class="text-muted">Su pedido ha sido procesado exitosamente.</p>
	`;

	
	const resumenDiv = document.createElement("div");
	resumenDiv.setAttribute("class", "mb-4");
	
	const resumenTitle = document.createElement("h6");
	resumenTitle.setAttribute("class", "fw-bold mb-3 border-bottom pb-2");
	resumenTitle.innerText = "Resumen de tu pedido:";
	
	const productosDiv = document.createElement("div");
	productosDiv.setAttribute("class", "mb-3");
	
	datosCompra.items.forEach((item) => {
		const itemDiv = document.createElement("div");
		itemDiv.setAttribute("class", "d-flex justify-content-between align-items-center py-2 border-bottom");
		itemDiv.innerHTML = `
			<div>
				<h6 class="mb-1">${item.nombre}</h6>
				<small class="text-muted">Cantidad: ${item.cantidad} x ${formatearPrecio(item.precio)}</small>
			</div>
			<div class="text-end">
				<strong class="text-success">${formatearPrecio(item.precio * item.cantidad)}</strong>
			</div>
		`;
		productosDiv.appendChild(itemDiv);
	});

	
	const totalDiv = document.createElement("div");
	totalDiv.setAttribute("class", "mt-4 p-3 bg-light rounded");
	totalDiv.innerHTML = `
		<div class="d-flex justify-content-between mb-2">
			<span class="fw-bold">Total de items:</span>
			<span class="fw-bold">${datosCompra.cantidadItems}</span>
		</div>
		<div class="d-flex justify-content-between mb-2">
			<span class="fw-bold">Total pagado:</span>
			<span class="fw-bold  fs-5">${formatearPrecio(datosCompra.total)}</span>
		</div>
		<div class="d-flex justify-content-between">
			<span class="text-muted">Tarjeta utilizada:</span>
			<span class="text-muted">**** **** **** ${datosCompra.tarjeta.numero.slice(-4)}</span>
		</div>
	`;

	resumenDiv.appendChild(resumenTitle);
	resumenDiv.appendChild(productosDiv);

	modalBody.appendChild(mensajeDiv);
	modalBody.appendChild(resumenDiv);
	modalBody.appendChild(totalDiv);
	return modalBody;
}

function crearFooterModalConfirmacion() {
	const modalFooter = document.createElement("div");
	modalFooter.setAttribute("class", "modal-footer");

	const botonCerrar = document.createElement("button");
	botonCerrar.setAttribute("type", "button");
	botonCerrar.setAttribute("class", "btn btnModalCarrito");
	botonCerrar.innerText = "Continuar";
	botonCerrar.addEventListener("click", () => {
		const modalInstance = bootstrap.Modal.getInstance(document.querySelector("#modalConfirmacion"));
		if (modalInstance) {
			modalInstance.hide();
		}
	});

	modalFooter.appendChild(botonCerrar);
	return modalFooter;
}

function crearModalConfirmacion(datosCompra) {
	const modalExistente = document.querySelector("#modalConfirmacion");
	if (modalExistente) {
		const modalInstance = bootstrap.Modal.getInstance(modalExistente);
		if (modalInstance) {
			modalInstance.dispose();
		}
		modalExistente.remove();
	}

	const modal = document.createElement("div");
	modal.setAttribute("id", "modalConfirmacion");
	modal.setAttribute("class", "modal fade");
	modal.setAttribute("tabindex", "-1");

	const modalDialog = document.createElement("div");
	modalDialog.setAttribute("class", "modal-dialog modal-lg");

	const modalContent = document.createElement("div");
	modalContent.setAttribute("class", "modal-content");

	modalContent.appendChild(crearHeaderModalConfirmacion());
	modalContent.appendChild(crearBodyModalConfirmacion(datosCompra));
	modalContent.appendChild(crearFooterModalConfirmacion());
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	document.body.appendChild(modal);
	return modal;
}

function mostrarModalConfirmacion(datosCompra) {
	const modal = crearModalConfirmacion(datosCompra);
	const bootstrapModal = new bootstrap.Modal(modal, {
		backdrop: false,
		keyboard: true
	});
	bootstrapModal.show();
}

function validarTarjeta(datosTarjeta) {
	const errores = [];
	
	// Validar número de tarjeta (16 dígitos)
	if (!datosTarjeta.numero || datosTarjeta.numero.replace(/\s/g, '').length !== 16) {
		errores.push("El número de tarjeta debe tener 16 dígitos");
	}
	
	// Validar nombre (no vacío)
	if (!datosTarjeta.nombre || datosTarjeta.nombre.trim().length < 2) {
		errores.push("El nombre del titular es requerido");
	}
	
	// Validar fecha de vencimiento
	if (!datosTarjeta.vencimiento || !datosTarjeta.vencimiento.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
		errores.push("La fecha de vencimiento debe tener formato MM/AA");
	} else {
		const [mes, año] = datosTarjeta.vencimiento.split('/');
		const fechaActual = new Date();
		const añoActual = fechaActual.getFullYear() % 100;
		const mesActual = fechaActual.getMonth() + 1;
		
		if (parseInt(año) < añoActual || (parseInt(año) === añoActual && parseInt(mes) < mesActual)) {
			errores.push("La tarjeta está vencida");
		}
	}
	
	// Validar CVV (3 dígitos)
	if (!datosTarjeta.cvv || !datosTarjeta.cvv.match(/^\d{3}$/)) {
		errores.push("El CVV debe tener 3 dígitos");
	}
	
	return errores;
}

function crearHeaderModalPago() {
	const modalHeader = document.createElement("div");
	modalHeader.setAttribute("class", "modal-header");

	const modalTitle = document.createElement("h5");
	modalTitle.setAttribute("class", "modal-title");
	modalTitle.setAttribute("style", "font-weight: bold; color: #f706ae; font-size: 1.8em;");
	modalTitle.innerText = "Datos de Pago";

	const botonCerrar = document.createElement("button");
	botonCerrar.setAttribute("type", "button");
	botonCerrar.setAttribute("class", "btn-close");
	botonCerrar.addEventListener("click", () => {
		const modalInstance = bootstrap.Modal.getInstance(document.querySelector("#modalPago"));
		if (modalInstance) {
			modalInstance.hide();
		}
	});

	modalHeader.appendChild(modalTitle);
	modalHeader.appendChild(botonCerrar);
	return modalHeader;
}

function crearBodyModalPago() {
	const modalBody = document.createElement("div");
	modalBody.setAttribute("class", "modal-body");

	// Resumen de la compra
	const resumenDiv = document.createElement("div");
	resumenDiv.setAttribute("class", "mb-4 p-3 bg-light rounded");
	
	const resumenTitle = document.createElement("h6");
	resumenTitle.setAttribute("class", "fw-bold mb-2");
	resumenTitle.innerText = "Resumen de tu compra:";
	
	const resumenContent = document.createElement("div");
	resumenContent.innerHTML = `
		<div class="d-flex justify-content-between">
			<span>Total de productos:</span>
			<span class="fw-bold fs-3">${itemsEnCarrito()} items</span>
		</div>
		<div class="d-flex justify-content-between">
			<span>Total a pagar:</span>
			<span class="fw-bold fs-3">${formatearPrecio(totalCarrito())}</span>
		</div>
	`;
	
	resumenDiv.appendChild(resumenTitle);
	resumenDiv.appendChild(resumenContent);

	
	const form = document.createElement("form");
	form.setAttribute("id", "formPago");
	
	form.innerHTML = `
		<div class="mb-3">
			<label for="numeroTarjeta" class="form-label fw-bold">Número de Tarjeta</label>
			<input type="text" class="form-control" id="numeroTarjeta" placeholder="1234 5678 9012 3456" maxlength="19">
			<small class="text-muted">16 dígitos</small>
		</div>
		
		<div class="mb-3">
			<label for="nombreTitular" class="form-label fw-bold">Nombre del Titular</label>
			<input type="text" class="form-control" id="nombreTitular" placeholder="Como aparece en la tarjeta">
		</div>
		
		<div class="row">
			<div class="col-md-6 mb-3">
				<label for="fechaVencimiento" class="form-label fw-bold">Fecha de Vencimiento</label>
				<input type="text" class="form-control" id="fechaVencimiento" placeholder="MM/AA" maxlength="5">
			</div>
			<div class="col-md-6 mb-3">
				<label for="cvv" class="form-label fw-bold">CVV</label>
				<input type="text" class="form-control" id="cvv" placeholder="123" maxlength="3">
			</div>
		</div>
		
		<div id="erroresPago" class="alert alert-danger d-none"></div>
	`;

	
	const inputNumero = form.querySelector("#numeroTarjeta");
	inputNumero.addEventListener("input", (e) => {
		let valor = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
		valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
		e.target.value = valor;
	});


	const inputFecha = form.querySelector("#fechaVencimiento");
	inputFecha.addEventListener("input", (e) => {
		let valor = e.target.value.replace(/\D/g, '');
		if (valor.length >= 2) {
			valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
		}
		e.target.value = valor;
	});

	
	const inputCvv = form.querySelector("#cvv");
	inputCvv.addEventListener("input", (e) => {
		e.target.value = e.target.value.replace(/\D/g, '');
	});

	modalBody.appendChild(resumenDiv);
	modalBody.appendChild(form);
	return modalBody;
}

function crearFooterModalPago() {
	const modalFooter = document.createElement("div");
	modalFooter.setAttribute("class", "modal-footer");

	const botonCancelar = document.createElement("button");
	botonCancelar.setAttribute("type", "button");
	botonCancelar.setAttribute("class", "btnModalCarrito btn");
	botonCancelar.innerText = "Cancelar";
	botonCancelar.addEventListener("click", () => {
		const modalInstance = bootstrap.Modal.getInstance(document.querySelector("#modalPago"));
		if (modalInstance) {
			modalInstance.hide();
		}
	});

	const botonPagar = document.createElement("button");
	botonPagar.setAttribute("type", "button");
	botonPagar.setAttribute("class", "btnModalCarrito btn");
	botonPagar.innerText = `Pagar ${formatearPrecio(totalCarrito())}`;
	botonPagar.addEventListener("click", () => {
		const form = document.querySelector("#formPago");
		const erroresDiv = form.querySelector("#erroresPago");
		
		const datosTarjeta = {
			numero: form.querySelector("#numeroTarjeta").value.replace(/\s/g, ''),
			nombre: form.querySelector("#nombreTitular").value.trim(),
			vencimiento: form.querySelector("#fechaVencimiento").value,
			cvv: form.querySelector("#cvv").value
		};

		const errores = validarTarjeta(datosTarjeta);
		
		if (errores.length > 0) {
			erroresDiv.innerHTML = errores.join('<br>');
			erroresDiv.classList.remove('d-none');
			return;
		}

		erroresDiv.classList.add('d-none');
		
		
		const modalInstance = bootstrap.Modal.getInstance(document.querySelector("#modalPago"));
		if (modalInstance) {
			modalInstance.hide();
		}
		
		// Procesar pago
		procesarPago(datosTarjeta);
	});

	modalFooter.appendChild(botonCancelar);
	modalFooter.appendChild(botonPagar);
	return modalFooter;
}

function crearModalPago() {
	const modalExistente = document.querySelector("#modalPago");
	if (modalExistente) {
		const modalInstance = bootstrap.Modal.getInstance(modalExistente);
		if (modalInstance) {
			modalInstance.dispose();
		}
		modalExistente.remove();
	}

	const modal = document.createElement("div");
	modal.setAttribute("id", "modalPago");
	modal.setAttribute("class", "modal fade");
	modal.setAttribute("tabindex", "-1");

	const modalDialog = document.createElement("div");
	modalDialog.setAttribute("class", "modal-dialog modal-lg");

	const modalContent = document.createElement("div");
	modalContent.setAttribute("class", "modal-content");

	modalContent.appendChild(crearHeaderModalPago());
	modalContent.appendChild(crearBodyModalPago());
	modalContent.appendChild(crearFooterModalPago());
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	document.body.appendChild(modal);
	return modal;
}

function mostrarModalPago() {
	const modal = crearModalPago();
	const bootstrapModal = new bootstrap.Modal(modal, {
		backdrop: false, 
		keyboard: true
	});
	bootstrapModal.show();
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

	// Contenedor para imagen e información del producto
	const contenedorProducto = document.createElement("div");
	contenedorProducto.setAttribute("class", "d-flex align-items-center");

	
	const imagenProducto = document.createElement("img");
	imagenProducto.setAttribute("src", item.imagen);
	imagenProducto.setAttribute("alt", item.nombre);
	imagenProducto.setAttribute("class", "img-fluid me-3");
	imagenProducto.setAttribute("style", "width: 60px; height: 60px; object-fit: cover; border-radius: 8px;");

	const infoItem = document.createElement("div");
	infoItem.setAttribute("class", "flex-grow-1");
	infoItem.setAttribute("style", "font-weight: bold; color: #f706ae;");

	infoItem.innerHTML = `
        <h6 class="mb-1">${item.nombre}</h6>
        <small class="text-muted">Cantidad: ${item.cantidad}</small>
    `;

	contenedorProducto.appendChild(imagenProducto);
	contenedorProducto.appendChild(infoItem);

	const precioItem = document.createElement("div");
	precioItem.setAttribute("class", "text-end");
	precioItem.setAttribute("style","font-weight: bold; color: #f706ae; font-size: 1.2em;",
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

	itemCarrito.appendChild(contenedorProducto);
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

	
	const botonFinalizarCompra = modalFooter.querySelector("button:nth-of-type(2)");
	if (botonFinalizarCompra && botonFinalizarCompra.innerText === "Finalizar Compra") {
		if (carrito.length === 0) {
			botonFinalizarCompra.setAttribute("disabled", "true");
			botonFinalizarCompra.setAttribute("class", "btn btn-secondary");
		} else {
			botonFinalizarCompra.removeAttribute("disabled");
			botonFinalizarCompra.setAttribute("class", "btnModalCarrito btn");
		}
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

	const botonFinalizarCompra = crearBotonModal(
		"Finalizar Compra",
		"btnModalCarrito btn",
		() => {
			finalizarCompra();
		},
	);
	botonFinalizarCompra.setAttribute("type", "button");
	// Solo mostrar el botón si hay items en el carrito
	if (carrito.length === 0) {
		botonFinalizarCompra.setAttribute("disabled", "true");
		botonFinalizarCompra.setAttribute("class", "btn btn-secondary");
	}

	const botonContinuar = crearBotonModal(
		"Continuar Comprando",
		"btn btnModalCarrito",
		null,
	);
	botonContinuar.setAttribute("type", "button");
	botonContinuar.setAttribute("data-bs-dismiss", "modal");

	modalFooter.appendChild(totalInfo);
	modalFooter.appendChild(botonVaciar);
	modalFooter.appendChild(botonFinalizarCompra);
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
