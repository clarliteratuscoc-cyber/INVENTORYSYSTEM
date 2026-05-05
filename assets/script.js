let isLoggedIn = false;

// HIDE SYSTEM ON LOAD
window.onload = function(){
    document.getElementById("products").style.display = "none";
    document.getElementById("addProduct").style.display = "none";
    document.getElementById("contact").style.display = "none";
};

// LOGIN
function login(){
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if(user === "admin" && pass === "1234"){
        isLoggedIn = true;

        document.getElementById("loginMsg").innerHTML = "Login Successful!";

        document.getElementById("products").style.display = "block";
        document.getElementById("addProduct").style.display = "block";
        document.getElementById("contact").style.display = "block";

        document.getElementById("products").scrollIntoView({behavior:"smooth"});
    } else {
        document.getElementById("loginMsg").innerHTML = "Invalid Login!";
    }
}

// LOGOUT
function logout(){
    isLoggedIn = false;

    document.getElementById("products").style.display = "none";
    document.getElementById("addProduct").style.display = "none";
    document.getElementById("contact").style.display = "none";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    document.getElementById("loginMsg").innerHTML = "Logged out!";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// NAV PROTECTION
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", function(e){
        let target = this.getAttribute("href");

        if(!isLoggedIn && target !== "#home" && !this.classList.contains("logout")){
            e.preventDefault();
            alert("Please login first!");
        }
    });
});

// PRODUCTS
let products = JSON.parse(localStorage.getItem("products")) || [];

// ADD
function addProduct(){
    if(!isLoggedIn){
        alert("Login required!");
        return;
    }

    let name = document.getElementById("pname").value.trim().toLowerCase();
    let qty = document.getElementById("pqty").value;
    let price = document.getElementById("pprice").value;

    //  CHECK EMPTY
    if(name === "" || qty === "" || price === ""){
        alert("Please fill out all fields!");
        return;
    }

    //  CHECK NEGATIVE PRICE
    if(price < 0){
        alert("Price cannot be negative!");
        return;
    }

    //  CHECK DUPLICATE
    let isDuplicate = products.some(p =>
        p.name.toLowerCase() === name &&
        p.qty == qty &&
        p.price == price
    );

    if(isDuplicate){
        alert("Product already added. Enter another product.");
        return;
    }

    let product = {
        id: Date.now(),
        name,
        qty,
        price
    };

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();

    // CLEAR INPUTS
    document.getElementById("pname").value = "";
    document.getElementById("pqty").value = "";
    document.getElementById("pprice").value = "";
}

// DISPLAY
function displayProducts(){
    let list = document.getElementById("productList");
    list.innerHTML = "";

    if(products.length === 0){
        list.innerHTML = "<p>No product yet. Please add first.</p>";
        return;
    }

    products.forEach(p => {
        list.innerHTML += `
        <div class="merch-items">
            <h3>${p.name}</h3>
            <p>Quantity: ${p.qty}</p>
            <p>Price: ₱${p.price}</p>
            <button class="edit-btn" onclick="editProduct(${p.id})">Edit</button>
            <button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button>
        </div>
        `;
    });
}

// DELETE
function deleteProduct(id){
    products = products.filter(p => p.id !== id);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

// EDIT
function editProduct(id){
    let p = products.find(prod => prod.id === id);

    let newName = prompt("Edit Name:", p.name);
    let newQty = prompt("Edit Quantity:", p.qty);
    let newPrice = prompt("Edit Price:", p.price);

    // CANCEL CHECK
    if(newName === null || newQty === null || newPrice === null){
        return;
    }

    newName = newName.trim().toLowerCase();

    // EMPTY CHECK
    if(newName === "" || newQty === "" || newPrice === ""){
        alert("Invalid input!");
        return;
    }

    // NEGATIVE PRICE CHECK
    if(newPrice < 0){
        alert("Price cannot be negative!");
        return;
    }

    // DUPLICATE CHECK
    let isDuplicate = products.some(prod =>
        prod.id !== id &&
        prod.name.toLowerCase() === newName &&
        prod.qty == newQty &&
        prod.price == newPrice
    );

    if(isDuplicate){
        alert("Product already added. Enter another product.");
        return;
    }

    // UPDATE PRODUCT
    p.name = newName;
    p.qty = newQty;
    p.price = newPrice;

    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

// SEARCH
function searchProduct(){
    let keyword = document.getElementById("search").value.toLowerCase();

    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(keyword)
    );

    let list = document.getElementById("productList");
    list.innerHTML = "";

    //  NO RESULT MESSAGE
    if(filtered.length === 0){
        list.innerHTML = "<p>No product found.</p>";
        return;
    }

    filtered.forEach(p => {
        list.innerHTML += `
        <div class="merch-items">
            <h3>${p.name}</h3>
            <p>Quantity: ${p.qty}</p>
            <p>Price: ₱${p.price}</p>
        </div>
        `;
    });
}

// LOAD
displayProducts();