'use strict';

/*
 * APELLIDO, NOMBRE | APELLIDO, NOMBRE
 */

// Podria levantar los productos de un JSON o directamente estar escritos aca

document.addEventListener("DOMContentLoaded", () => {

    fetch("./productos.json")
        .then(response => response.json())
        .then(productos => {

            productos.forEach(producto => {

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
                    mostrarDetallesProducto(producto.id);


                });


                const categoria = document.createElement("p");
                categoria.setAttribute("class", "categoria");
                categoria.innerText = producto.categoria;

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

                cardBody.appendChild(categoria);
                cardBody.appendChild(nombreProducto);
                cardBody.appendChild(imagen);
                cardBody.appendChild(descripcionProducto);
                cardBody.appendChild(precioProducto);
                cardBody.appendChild(botonVerMas);
                cardBody.appendChild(botonAgregar);

                card.appendChild(cardBody);
                document.querySelector("#productos").appendChild(card);
            });

        })


});




