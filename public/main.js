const product_list = document.querySelector(".product-list")
const total_price = document.querySelector(".total-price")
const check_out = document.querySelector(".check-out")
const finish_container = document.querySelector(".finish")
const submit_basket = document.getElementById("submit_basket")

const logout = document.getElementById("logout");
const login = document.getElementById("login");
const register = document.getElementById("register");
const control = document.getElementById("controlpanel");
const naorders = document.getElementById("naorders");
const products = document.getElementById("products");
const prodData = document.getElementById("prodData");



function populateProducts() {
    fetch("/populateProds", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((responseData) => {
        if(responseData.success){
            responseData.products.forEach((product) => {
                prodData.innerHTML += `
                <div class="card">
                <div class="card-body">
                  <div class="product">
                    <div class="product-content">
                      <div class="product-image">
                        <img src="${product.imgURL}" alt="Marijuana" style="height: 250px; width: 250px;" class="rounded">
                      </div>
                      <div class="product-description">
                        <h4 class="product-name">${product.prodName}</h4>
                        <p>${product.description}</p>
                        <h2 style="color: black;">Price: <span class="product-price">${product.price}</span>€/gram</h2>
                        <input id="value-${product.id}" type="number" required style="width: 150px;" placeholder="Amount (grams)">
                        <button id="${product.prodId}" class="btn btn-primary add-to-cart cart-button">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              `;
            })
        }
    })
}

function checkSessionStatus() {
    fetch("/check-session", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((responseData) => {
        if (responseData.sessionActive == true) {
            logout.style.display = "block";
            control.style.display = "block";
            control.innerHTML = `<a class="nav-link bg-success rounded text-light" onclick=""><i class="fa-solid fa-user"></i> ` + responseData.username + `</a>`;
            login.style.display = "none";
            register.style.display = "none";
        }
    })
    .catch((error) => {
        console.log("ERROR: " + error);
    });
}

function checkOrders() {
    fetch("/check-orders", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((responseData) => {
        if (responseData.success){
            naorders.style.display = "none";
            products.style.display = "table";
            let orders = responseData.orders;
            let ordersHtml = ""; // Store order HTML rows
            orders.forEach((order) => {
                let productsData = JSON.parse(order.products);
                let productsInfo = ""; // Store concatenated product details
                let totalPrice = 0; // Accumulate total price
                productsData.forEach((product) => {
                    productsInfo += `${product.name} (${product.amount}) - `;
                    totalPrice += parseFloat(product.total_price);
                });
                productsInfo = productsInfo.slice(0, -3); // Remove the trailing " - "
                
                ordersHtml += `
                    <tr>
                        <td>${order.orderId}</td>
                        <td>${productsInfo}</td>
                        <td>${totalPrice.toFixed(2)}$</td>
                        <td>${order.payment}</td>
                        <td>${order.address}</td>
                        <td>${order.date}</td>
                        <td><button class="btn btn-danger mt-2" onclick="cancelOrder('${order.orderId}')">Cancel ORDER</button></td>
                    </tr>
                `;
            });
            products.innerHTML += ordersHtml; // Replace the entire table content
        } else {
            naorders.style.display = "block";
            naorders.innerText = "You don't have any active orders!";
            products.style.display = "none";
        }
    })
    .catch((error) => {
        console.log("ERROR: " + error);
    });
}




function cancelOrder(id) {
    const confirmation = window.confirm("Are you sure you want to cancel this order?");

    if (!confirmation) {
        return; // User canceled the action, do nothing
    }

    fetch("/cancel-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: id }) // Assuming id is a parameter, wrap it inside an object
    })
    .then((response) => response.json())
    .then((responseData) => {
        if (responseData.message === "Order cancelled") {
            alert("Order cancelled"); // Move the alert here if you want to show it after the fetch is successful
            window.location.href = "/dashboard.html"; // Redirect after order cancellation
        }
    })
    .catch((error) => {
        // Handle fetch or server errors here
        console.error("Error occurred:", error);
    });
}



logout.addEventListener("click", () => {
    eventToSend = {
        logout: true
    }
    fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventToSend)
    })
    .then((response) => response.json())
    .then((responseData) => {
        if (responseData.message == "Logged out") {
            logout.style.display = "none";
            login.style.display = "block";
            alert("You have been logged out")
            window.location.href = "/";
        }
    })
});

function checkOrder(){
    fetch("/check-order", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((responseData) => {
        if(responseData.message == "Order placed"){
            // destroy selected products elements and total price
            product_list.innerHTML = "";
            total_price.innerHTML = "0";
            
            window.location.href = "/";
        }
    })
    .catch((error) => {
        console.log("ERROR: " + error);
    })
}


// Call the function to check session status on page load
document.addEventListener("DOMContentLoaded", () => {
    checkSessionStatus();
    checkOrders();
    checkOrder();
    populateProducts();

    // Attach event listener to the container that holds the cart buttons
    const productContainer = document.getElementById("prodData");
    productContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("cart-button")) {
            const button = event.target;
            const amount = button.previousElementSibling.value;
            
            if (amount <= 0) {
                alert("Please enter a valid amount");
                return;
            }
            
            const name = button.parentElement.querySelector(".product-name").innerText;
            const price = button.parentElement.querySelector(".product-price").innerText;
            
            const dataToSend = {
                name: name,
                prodId: button.id,
                price: price,
                amount: amount,
            };

            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.message == "Price or name has been changed, please try again") {
                    alert(responseData.message);
                    return;
                }
                if (responseData.message == "Product added to cart") {
                    if (cartItems.hasOwnProperty(name)) {
                        cartItems[name].amount += parseInt(amount, 10);
                        const existingItemElement = cartItems[name].element;
                        existingItemElement.innerText = `${name} - Amount: ${cartItems[name].amount}`;
                    } else {
                        const newItemElement = document.createElement("li");
                        newItemElement.innerText = `${name} - Amount: ${amount}`;
                        product_list.appendChild(newItemElement);
                        cartItems[name] = {
                            amount: parseInt(amount, 10),
                            element: newItemElement,
                        };
                    }
                }
                total_price.innerHTML = `${responseData.totalPrice}`;
            })
            .catch((error) => {
                console.log("ERROR: " + error);
            });
        }
    });
});

const cartItems = {};


check_out.addEventListener("click", () => {
    if(total_price.innerHTML == "0"){
        alert("Your cart is empty");
        return;
    }else{
        finish_container.style.display = "block";
    }
    
})

submit_basket.addEventListener("click", () => {
    let payment = document.querySelector(".paymentMethod").value;
    let address = document.querySelector(".address").value;
    let username = document.querySelector(".username").value;
    let email = document.querySelector(".email").value;
    let dataToSendBasket = {
        payment: payment,
        address: address,
        username: username,
        email: email
    }

    fetch(`/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSendBasket)
    })
    .then((response) => response.json())
    .then((responseData) => {
        if(responseData.message == "Order completed"){

            window.location.href = "/";
            alert("Order completed");
        }
    })
    .catch((error) => {
        console.log("ERROR: " + error);
    })
})

