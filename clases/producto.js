class Producto {
	constructor(id, nombre, descripcion, precio, categorias, imagen) {
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.precio = precio;
		this.categorias = categorias; // Array de categorías
		this.imagen = imagen;
	}

	// Metodo que devuelve si la categoria existe en el producto
	tieneCategoria(categoria) {
		return this.categorias.includes(categoria);
	}
}
