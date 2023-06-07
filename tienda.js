//Faltan el scroll infinito y que se eliminen los elementos del carrito nada más.

window.onload = function() {
    updateCartUI();
    /**
	  * Función que añade las categorías al menú
	  * @param
	  * @return void
    */
    function añadirCategorias(){
        fetch('https://fakestoreapi.com/products/categories')
        .then(response => response.json())
        .then(json => {
            json.forEach(element => {
                let categoria = document.createElement('li');
                
                if (element.includes('women')){
                    categoria.innerHTML += `<li class="dropdown-Element" onclick="listarCategoria('women')">${element}</li>`;
                }
                else if (element.includes('men')){
                    categoria.innerHTML += `<li class="dropdown-Element" onclick="listarCategoria('men')">${element}</li>`;
                }
                if (element == 'electronics' || element == 'jewelery'){
                    categoria.innerHTML += `<li class="dropdown-Element" onclick="listarCategoria('${element}')">${element}</li>`;
                }
                document.getElementsByClassName('dropdown-menu')[0].appendChild(categoria);
            });
        })
    }
    añadirCategorias();
}

let categoria = '';
let titulo = '';
let cart = JSON.parse(localStorage.getItem('cart')) || [];


/**
     * Función que guarda el carrito y dropdown
     * @param 
     * @return void
*/
function updateCartUI() {
    const cartBadge = document.getElementsByClassName('cart-badge');
    const checkoutButton = document.getElementById('checkoutButton');
    const cartTotalElement = document.getElementById('cartTotal');
    let resetCart = document.getElementById('cartItems');
    resetCart.innerHTML = '';

    if (cart.length === 0) {
        let elemento = document.createElement('li');
        elemento.className += "dropdown-Element";
        elemento.innerHTML = 'Sin artículos en la cesta';
        document.getElementById('cartItems').append(elemento);
        cartTotalElement.innerText = '$0';
        checkoutButton.disabled = true;
        cartBadge[0].innerText = 0;
    } 
    else {
        let total = 0;
        let contador = 0;

        cart.forEach(element => {
            const cartElement = document.createElement('li');
            cartElement.classList.add('dropdown-Element');
            cartElement.innerHTML = `
            <div class="d-flex justify-content-between align-Elements-center">
                <span>${element.name}</span>
                <div>
                <button class="btn btn-sm btn-primary me-1" onclick="deleteElement('${element.id}')">-</button>
                <span>${element.quantity}</span>
                <button class="btn btn-sm btn-primary ms-1" onclick="addElement('${element.id}')">+</button>
                </div>
            </div>
            `;
            
            document.getElementById('cartItems').append(cartElement);
            //document.getElementById(cartItems).appendChild(cartElement);

            total += element.price * element.quantity;
            contador += 1;
        });

        cartTotalElement.innerText = `$${total.toFixed(2)}`;
        checkoutButton.disabled = false;
        cartBadge[0].innerHTML = contador;
    }
}

/**
     * Función para añadir un elemento del carrito en el localstorage
     * @param {int} id - id del producto
     * @param {string} titulo - nombre del producto
     * @param {int} price - precio del producto
     * @return void
*/
function addElement(id, title, price) {
    const existingElement = cart.find(element => element.id == id);

    if (existingElement) {
        existingElement.quantity++;
    } 
    else {
        const newElement = {
            id: id,
            name: title,
            price: price,
            quantity: 1
        };
        cart.push(newElement);
    }

    updateCartUI();
    saveCart();
}

/**
     * Función para eliminar un elemento del carrito en el localstorage
     * @param {int} id - id del producto
     * @return void
*/
function deleteElement(id) {
    const deleteElement = cart.find(Element => Element.id == id);

    if (deleteElement) {
        deleteElement.quantity--;

        if (deleteElement.quantity == 0) {
            cartDelete = cart.filter( element => element.id != id);
            cart = cartDelete;
        }
    }
    updateCartUI();
    saveCart();
}

/**
     * Función que guardar los elementos actuales del carrito en el localstorage
     * @param
     * @return void
*/
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
     * Función para finalizar la compra.
     * @param
     * @return void
*/
function handleCheckoutButtonClick() {
    cart = [];
    saveCart();
    updateCartUI();
    alert('¡Pedido realizado con éxito!');
}

/**
     * Función que oculta el main home y muestra el main productos
     * @param
     * @return void
*/
function mostrarOcultar(){
    var x = document.getElementById("main-home");
    var y = document.getElementById("main-products");
    if (y.style.visibility === "hidden") {
        y.style.visibility = "visible";
        y.style.display = "";
        x.style.visibility = "hidden";
        x.style.display = "none";
    }
}

/**
     * Función que elimina los cards clonados para no seguir añadiendo clones al final
     * @param
     * @return void
*/
function eliminarCards(){
    let div = document.getElementsByClassName("cloned-card");
    let longitud = div.length;
    for(i = 0; i<longitud; i++){
        div[0].remove();
    }  
}

/**
     * Función para mostrar todos los productos de la API
     * @param
     * @return void
*/
function mostrarTodo(){
    mostrarOcultar();
    eliminarCards();
    fetch(`https://fakestoreapi.com/products?sort=asc`)
        .then(res=>res.json())
        .then(json=>productos(json))
}

/**
     * Función para mandar maquetar los productos de una categoría concreta
     * @param {string} name  - nombre de la categoría a maquetar
     * @return void
*/
function listarCategoria(name){
    mostrarOcultar();
    eliminarCards();
    if (name.includes('women')){
        titulo = "women's clothing";
        categoria = "https://fakestoreapi.com/products/category/women's clothing"
        fetch("https://fakestoreapi.com/products/category/women's clothing?sort=asc")
            .then(res=>res.json())
            .then(json=>productos(json, titulo))
        /*fetch(`https://fakestoreapi.com/products/category/women\'s clothes`)
            .then(res=>res.json())
            .then(json=>productos(json, "women\'s clothes"))*/
    }
    else if (name.includes('men')){
        titulo = "men's clothing";
        categoria = "https://fakestoreapi.com/products/category/men's clothing"
        fetch("https://fakestoreapi.com/products/category/men's clothing?sort=asc")
            .then(res=>res.json())
            .then(json=>productos(json, titulo))
    }
    else{
        titulo = name;
        categoria = "https://fakestoreapi.com/products/category/"+name;
        fetch("https://fakestoreapi.com/products/category/"+name+"?sort=asc")
            .then(res=>res.json())
            .then(json=>productos(json, titulo))
    }
}

/**
     * Función para mandar maquetar los productos de forma ascendente o descendente 
     * según el select
     * @param {event} a - opción del select 
     * @return void
*/
function getOption(a) {
    const option = a.target.value;
    eliminarCards();
    if (categoria == ''){
        if (option === 'asc') 
            fetch(`https://fakestoreapi.com/products?sort=asc`)
                .then(res=>res.json())
                .then(json=>productos(json))
        else{
            fetch(`https://fakestoreapi.com/products?sort=desc`)
                .then(res=>res.json())
                .then(json=>productos(json))
        }
    }
    else{
        if (option === 'asc') 
            fetch(categoria+"?sort=asc")
                .then(res=>res.json())
                .then(json=>productos(json, titulo))
        else{
            fetch(categoria+"?sort=desc")
                .then(res=>res.json())
                .then(json=>productos(json, titulo))
        }
    }
}

/**
     * Función que maqueta los productos creando clones de una card vacía y ocultando la vacía
     * @param {json} json - todos los productos a maquetar
     * @param {string} titulo - titulo que se le dará a la página (nombre de la categoría a listar o por defecto)
     * @return void
*/
function productos(json, titulo="Todos nuestros productos"){
    let titulo2 = document.getElementById("titulo-mostrar");
    titulo2.innerHTML = titulo;
    let card = document.getElementById('card');
    json.forEach(element => {
        let cloneCard = card.cloneNode(true);
        let cardImage = cloneCard.getElementsByClassName("card-image");
        let cardTitle = cloneCard.getElementsByClassName("card-title");
        let cardPrice = cloneCard.getElementsByClassName("card-price");
        cloneCard.className += ' cloned-card';
        cloneCard.style.display = "";
        cloneCard.style.visibility = "visible";
        cardImage[0].src = element.image;
        cardTitle[0].innerHTML = element.title;
        cardPrice[0].innerHTML = element.price+'$';
        let botonMasInfo = cloneCard.getElementsByClassName("masInfo");
        botonMasInfo[0].addEventListener("click", ()=>{rellenaModal(element)})
        document.getElementById('cards-add').appendChild(cloneCard);
    });
    let ocultarCard = document.getElementById("card");
    //ocultarCard.style.display = "none";
}

/**
     * Función que crea un modal con más información de un producto concreto
     * @param {} element - datos del elemento del que queremos crear y mostrar el modal
     * @return void
*/
function rellenaModal(element){
    let cardImage = document.getElementsByClassName("card-image");    
    let cardRating = document.getElementsByClassName("card-rating");
    let cardRatingCount = document.getElementsByClassName("card-rating-count");
    let cardDescription = document.getElementsByClassName("card-description");
    let cardPrice = document.getElementsByClassName("card-price");
    let footer = document.getElementsByClassName("addOnclick");
    cardImage[1].src = element.image;
    cardRating[0].innerHTML = element.rating["rate"];
    cardRatingCount[0].innerHTML = '('+element.rating["count"]+')';
    cardDescription[0].innerHTML = element.description;
    cardPrice[1].innerHTML = element.price+'$';
    footer[0].addEventListener('click', ()=>{addElement(element.id, element.title, element.price)});
}

let inicio = 0;
let fin = 0;

/**
     * Función que define los bloques de cuantos en cuantos y de qué forma mostrar los productos
     * @param 
     * @return void
*/
function bloqueScroll(){
    fin = fin + 8;
    let elementos = [];
    fetch('https://fakestoreapi.com/products?limit='+fin)
        .then(res=>res.json())
        .then(json=> {
            eliminarCards();
            elementos = json;
            let titulo2 = document.getElementById("titulo-mostrar");
            titulo2.innerHTML = titulo;
            for (i=inicio; i<fin || i<elementos.length; i++){
                //producto(elementos[i]);
                producto(elementos[i]);
            };
        });
}

/**
     * Función que el scrollInfinito
     * @param 
     * @return void
*/
function scrollF(){
    mostrarOcultar();
    eliminarCards();
    bloqueScroll();
    window.addEventListener('scroll', function() {
        const {scrollHeight,scrollTop,clientHeight} = document.documentElement;
        if (scrollTop + clientHeight > scrollHeight - 5) {
            bloqueScroll();
        }
    });
}

/**
     * Función que maqueta los productos creando clones de una card vacía y ocultando la vacía
     * @param {array} elemento - producto a maquetar
     * @param {string} titulo - titulo que se le dará a la página (nombre de la categoría a listar o por defecto)
     * @return void
*/
function producto(element){
    let card = document.getElementById('card');
    let cloneCard = card.cloneNode(true);
    let cardImage = cloneCard.getElementsByClassName("card-image");
    let cardTitle = cloneCard.getElementsByClassName("card-title");
    let cardPrice = cloneCard.getElementsByClassName("card-price");
    cloneCard.className += ' cloned-card';
    cloneCard.style.display = "";
    cloneCard.style.visibility = "visible";
    cardImage[0].src = element.image;
    cardTitle[0].innerHTML = element.title;
    cardPrice[0].innerHTML = element.price+'$';
    let botonMasInfo = cloneCard.getElementsByClassName("masInfo");
    botonMasInfo[0].addEventListener("click", ()=>{rellenaModal(element)})
    document.getElementById('cards-add').appendChild(cloneCard);
    let ocultarCard = document.getElementById("card");
    //ocultarCard.style.display = "none";
}

function newUser(event){
    event.preventDefault();
    let user = document.getElementById("email");
    let pass = document.getElementById("psw");
    fetch('https://fakestoreapi.com/auth/login',{
            method:'POST',
            body:JSON.stringify({
                email: user.value,
                password: pass.value
            })
        })
            .then(res=>res.json())
            .then(json=>console.log(json))
}

function logIn(){
    console.log('Usuario logeado');
    alert('¡Bienvenid@!');
}