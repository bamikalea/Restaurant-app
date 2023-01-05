import { menuArray } from "./data.js"


// renderMenu list

let orderList = []

function renderMenu(){
    let html = ""
    menuArray.forEach(function(item){
        html += `
        <div class="menu-item" ${item.id}>
            <img src=${item.emoji} alt="${item.name}-image">
            <div class="item-details">
                <h2 class="name">${item.name}</h2>
                <p class="ingredients">${item.ingredients}</p>
                <h3 class="price">$${item.price}</h3>
            </div>
            <img class="add-btn" src="./images/add-btn.svg" alt="add-btn" data-add="${item.id}">
        </div>
        `
    })
    document.getElementById("menu").innerHTML = html
}

function renderPage(){
    renderMenu()
    renderOrderList(orderList)
}

renderPage()


// click events listners

document.addEventListener("click", function(e){
    if(e.target.dataset.add){
        addselectedObj(e.target.dataset.add)
        renderPage()
    }
    else if(e.target.dataset.remove){
            removeItem(e.target.dataset.remove)
            renderPage()
    } 
    else if(e.target.dataset.addQty){
            increaseQty(e.target.dataset.addQty)
    } 
    else if(e.target.dataset.removeQty){
            decreaseQty(e.target.dataset.removeQty)
    } 
    else if(e.target.dataset.closeModal){
        document.getElementById("modal").style.display="none"      
    } 
    else if(e.target.dataset.pay){
        e.preventDefault()   
        document.getElementById("modal").style.display="none"
        document.getElementById("order").innerHTML = successMessage()
        orderList = [] 
        console.log(document.getElementById("modal"))
    } 
    else if(e.target.dataset.completeOrder){
        document.getElementById("container").innerHTML += paymentModal()
    } 
})


//add selected items to cart
function addselectedObj(itemId){
    const selectedObj =  menuArray.filter(function(item){
            return item.id.toString() === itemId
            })[0]

    //checks if item alreadu in cart
    if (orderList.some(item => item.id === selectedObj.id)) {
         alert("Already in cart")
    } else {
        orderList.push( {...selectedObj, 
            numberOfUnits: 1,
            subtotal : selectedObj.price })
    }
   
}


// remove selected item from cart
function removeItem(itemId){
    const itemToRemove = orderList.filter(function(item){
        return item.id.toString() === itemId
    })[0]
    const indexToRemove = orderList.indexOf(itemToRemove)
    orderList.splice(indexToRemove, 1)
}


// Get cart total
function getTotal(orderList){
    const totalPrice = orderList.reduce(function(prev, cur){
        return prev + cur.subtotal;
    }, 0)
    return `
        <div class="total-info">
            <h2 class="total">Total</h2>
            <h2 class="total-price">$${totalPrice}</h2>
        </div>
        <button class="btn" data-complete-order="complete-order">Complete order</button>
        `
}


// render order list
function renderOrderList(){
    let orderHtml = "<h2>Your Order</h2>"
    if (orderList.length > 0){
        orderList.forEach(function(item){
             orderHtml += `
            <div class="order-list">
                <div class="order-item">
                    <h2 class="name">${item.name}
                        <span id="remove" data-remove="${item.id}">Remove</span>
                    </h2>
                    <div class="order-qty">
                        <button data-remove-qty=${item.id}> - </button>
                        <input class="qty" id="qty" type="number" name="qty" data-qty="${item.id}" value="${item.numberOfUnits}"  min="1" >
                        <button data-add-qty=${item.id}> + </button>
                        <div class="sub-total">
                            <h3 class="price" id="item-total">$${item.subtotal}</h3>
                        </div>
                    </div>
                </div>
            </div>`
        })
    orderHtml += getTotal(orderList)
    document.getElementById("order").innerHTML = orderHtml
    } else {
        document.getElementById("order").innerHTML = ""
    }
}


// Increase qty on click
function increaseQty(itemId){
    const itemToIncrease = orderList.filter(function(item){
        return item.id.toString() === itemId
    })[0]
    if(itemToIncrease.numberOfUnits > 0){
        itemToIncrease.numberOfUnits++
        itemToIncrease.subtotal = itemToIncrease.numberOfUnits * itemToIncrease.price
        renderOrderList()
    }
}

// DECREASE ITEM ON CLICK
function decreaseQty(itemId){
    const itemToDecrease = orderList.filter(function(item){
        return item.id.toString() === itemId
    })[0]
    if(itemToDecrease.numberOfUnits > 1){
        itemToDecrease.numberOfUnits--
        itemToDecrease.subtotal = itemToDecrease.numberOfUnits * itemToDecrease.price
        renderOrderList()
    } else { alert("Item quantity cannot be less than one")}
}


// payment modal
function paymentModal(){
    return `
        <div class="modal" id="modal">
            <form action="POST">
                <img class="close-btn" id="close-btn" src="./images/close-btn.svg" alt="close-btn" data-close-modal="close-modal">
                <h2>Enter card details</h2>
                <input type="text" name="name" id="name-input" placeholder="Enter your name" required>
                <input type="number" name="card-number" id="card-number" placeholder="Enter card number" required>
                <input type="number" name="cvv" id="cvv-input" placeholder="Enter CVV" required >
                <button type="submit" class="btn" data-pay="pay">Pay</button>
            </form>
        </div> `
}

// success message
function successMessage(){
    return `
    <div class="success-message menu">
        <h2>Thanks,! Your order is on its way!</h2>
    </div>`
}