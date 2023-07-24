const items_cart_buttons = document.querySelectorAll(".cart-button")
const product_list = document.querySelector(".product-list")
const total_price = document.querySelector(".total-price")

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
            alert(responseData.message)
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