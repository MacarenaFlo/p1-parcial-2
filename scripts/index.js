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
            card.setAttribute("class", "card col-8 mb-4");
            card.setAttribute("style", "width: 18rem;");
            card.dataset.id = producto.id;

            const cardBody = document.createElement("div");
            cardBody.setAttribute("class", "card-body");

            const nombreProducto = document.createElement("h3");
            nombreProducto.setAttribute("class", "card-title");
            nombreProducto.setAttribute("style", "font-size: 1.5rem;");
            nombreProducto.innerText = producto.nombre;

            const imagen = document.createElement("img");
            imagen.setAttribute("class", "card-img-top");
            imagen.setAttribute("src", producto.imagen);
            imagen.setAttribute("alt", producto.nombre);
            imagen.setAttribute("style", "width: 100%; height: 200px; object-fit: cover;");

            const descripcionProducto = document.createElement("p");
            descripcionProducto.setAttribute("class", "card-text");
            descripcionProducto.setAttribute("style", "font-size: 1.2rem;");
            descripcionProducto.innerText = producto.descripcion;

            const categoria = document.createElement("p");
            categoria.setAttribute("class", "card-text");
            categoria.setAttribute("style", "font-size: 1.2rem; font-weight: bold;");
            categoria.innerText =  producto.categoria;

            const precioProducto = document.createElement("p");
            precioProducto.setAttribute("class", "card-text");
            precioProducto.setAttribute("style", "font-size: 1.2rem;");
            precioProducto.innerText = `$${producto.precio}`;

            const botonAgregar = document.createElement("button");
            botonAgregar.setAttribute("class", "btn btn-primary");
            botonAgregar.setAttribute("style", "width: 100%;");
            botonAgregar.innerText = "Agregar al carrito";
            botonAgregar.addEventListener("click", () => {
                agregarAlCarrito(producto.id);
            });

            cardBody.appendChild(nombreProducto);
            cardBody.appendChild(imagen);
            cardBody.appendChild(descripcionProducto);
            cardBody.appendChild(precioProducto);
            cardBody.appendChild(botonAgregar);
            card.appendChild(cardBody);
            document.querySelector("#productos").appendChild(card);
        });

    })
   

    });





