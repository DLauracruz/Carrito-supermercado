/*jshint esversion: 6 */

//variables
const carrito = document.getElementById('carrito');
const productos = document.getElementById('lista-cursos');
const listaProd = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');


//Listeners
cargaEventListeners();

function cargaEventListeners() {

    //Dispara cuando se presiona "Agregar carrito"
    productos.addEventListener('click', comprarProducto);

    //Cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarProducto);

    //Al vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    //al cargar el documento, mostrar LS
    document.addEventListener('DOMContentLoaded', leerLocalStorage);

}


//Funciones

//Funcion que añade el producto al curso
function comprarProducto(e) {
    e.preventDefault();

    //Delegation para agregar carrito
    if (e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.parentElement.parentElement;

        //Enviamos los productos seleccionados para tomar sus datos
        leerDatosProducto(producto);
    }

}

//Lee los datos del producto
function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h4').textContent,
        precio: producto.querySelector('.precio span').textContent,
        id: producto.querySelector('a').getAttribute('data-id')
    };

    insertarCarrito(infoProducto);

}

//Muestra el producto seleccionado en el carrito
function insertarCarrito(producto) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>
    <img src="${producto.imagen}" width=100>
    </td>
    <td>${producto.titulo}</td>
    <td>${producto.precio}</td>
    <td>
        <a href="#" class="borrar-curso" data-id="${producto.id}">X 
        </a>
    </td>
    `;
    listaProd.appendChild(row);
    guardarProductoLocalStorage(producto);

}

//Elimina el curso del carrito en el DOM
function eliminarProducto(e) {
    e.preventDefault();

    let producto,
        productoId;
    if (e.target.classList.contains('borrar-curso')) {

        e.target.parentElement.parentElement.remove();
        producto = e.target.parentElement.parentElement;
        productoId = producto.querySelector('a').getAttribute('data-id');

    }

    eliminarProductoLocalStorage(productoId);
}

//Elimina los productos del carrito en el DOM
function vaciarCarrito() {

    while (listaProd.firstChild) {
        listaProd.removeChild(listaProd.firstChild);
    }

    //vaciar LS completo
    vaciarLocalStorage();
    return false;
}

//Almacena cursos en el carrito a Local Storage
function guardarProductoLocalStorage(producto) {
    let productos;

    //Toma el valor de un Array con datos de LS o vacío
    productos = obtenerProductosLocalStorage();

    //El prod seleccionado se agrega al Array
    productos.push(producto);

    localStorage.setItem('productos', JSON.stringify(productos));
}

//Comprueba que hay elementos en LS
function obtenerProductosLocalStorage() {
    let productosLS;

    //comprobamos si hay algo en LocalStorage
    if (localStorage.getItem('productos') === null) {
        productosLS = [];
    } else {
        productosLS = JSON.parse(localStorage.getItem('productos'));
    }
    return productosLS;
}

//Imprime los productos de LocalStorage en el carrito
function leerLocalStorage() {
    let productosLS;

    productosLS = obtenerProductosLocalStorage();

    productosLS.forEach(function(producto) {

        //construir el template
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
            <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${producto.id}">X 
                </a>
            </td>
            `;
        listaProd.appendChild(row);
    });
}

//Elimina el producto por el Id en el LS
function eliminarProductoLocalStorage(producto) {
    let productosLS;
    //Obtenemos el arreglos de los productos
    productosLS = obtenerProductosLocalStorage();
    //Iterar comparar el ID del producto borrado con los del LS
    productosLS.forEach(function(productoLS, index) {
        if (productoLS.id === producto) {
            productosLS.splice(index, 1);
        }
    });
    //Añadimos el arreglo actual a LS
    localStorage.setItem('productos', JSON.stringify(productosLS));

}

//Elimina todos los productos de LS
function vaciarLocalStorage() {
    localStorage.clear();
}