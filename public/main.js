const items_cart_buttons = document.querySelectorAll(".cart-button")
const product_list = document.querySelector(".product-list")
const total_price = document.querySelector(".total-price")
const check_out = document.querySelector(".check-out")
const finish_container = document.querySelector(".finish")
const submit_basket = document.getElementById("submit_basket")

const logout = document.getElementById("logout");
const login = document.getElementById("login");

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
            login.style.display = "none";
        } else {
            console.log("Session is not active");
        }
    })
    .catch((error) => {
        console.log("ERROR: " + error);
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
        }
    })
});

// Call the function to check session status on page load
document.addEventListener("DOMContentLoaded", checkSessionStatus);

items_cart_buttons.forEach((button) => {
    button.addEventListener("click", () => {    
        const amount = button.previousElementSibling.value
        if (amount <= 0) {
            alert("Please enter a valid amount")
            return
        }
        // get h4 value from parent element
        const name = button.parentElement.querySelector(".product-name").innerText
        const price = button.parentElement.querySelector(".product-price").innerText
        const dataToSend = {
            name: name,
            prodId: button.id,
            price: price,
            amount: amount
        }

        fetch(`/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend)
        })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.message == "Product added to cart"){
                product_list.innerHTML += `<li>${name} - Amount: ${amount}</li>`;
            }
            total_price.innerHTML = `${responseData.totalPrice}`
        })
        .catch((error) => {
            console.log("ERROR: " + error);
        })
    })
})

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
        console.log(responseData);
        if(responseData.message == "Order completed"){

            window.location.href = "/";
            alert("Order completed");
        }
    })
    .catch((error) => {
        console.log("ERROR: " + error);
    })
})

