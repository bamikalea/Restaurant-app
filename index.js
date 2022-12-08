import { menuArray } from "./data.js"

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

document.addEventListener("click", function(e){
    if(e.target.dataset.add){
        addSelectedItem(e.target.dataset.add)
        renderPage()
    }
    else if(e.target.dataset.remove){
            removeItem(e.target.dataset.remove)
            renderPage()
    } 
    else if(e.target.dataset.closeModal){
        document.getElementById("modal").style.display="none"      
    } 
    else if(e.target.dataset.pay){
        e.preventDefault()   
        document.getElementById("modal").style.display="none"
        document.getElementById("order").innerHTML = successMessage()
        orderList = [] 
    } 
    else if(e.target.dataset.completeOrder){
        document.getElementById("container").innerHTML += paymentModal()
    } 
})


function addSelectedItem(itemId){
    const selectedItem =  menuArray.filter(function(item){
            return item.id.toString() === itemId
            })[0]
    orderList.push(selectedItem)
}

function removeItem(itemId){
    const itemToRemove = orderList.filter(function(item){
        return item.id.toString() === itemId
    })[0]
    const indexToRemove = orderList.indexOf(itemToRemove)
    orderList.splice(indexToRemove, 1)
}

function getTotal(orderList){
    const totalPrice = orderList.reduce(function(prev, cur){
        return prev + cur.price;
    }, 0)
    return `
    <div class="total-info">
        <h2 class="total">Total</h2>
        <h2 class="total-price">$${totalPrice}</h2>
    </div>
    <button class="btn" data-complete-order="complete-order">Complete order</button>
    `
}

function renderOrderList(){
    let orderHtml = "<h2>Your Order</h2>"
    if (orderList.length > 0){
        orderList.forEach(function(item){
            orderHtml += `
            <div class="order-list">
                <div class="order-item">
                    <h2 class="name">${item.name}
                    <span id="remove" data-remove="${item.id}">Remove</span></h2>
                    <h3 class="price">$${item.price}</h3>
                </div>
            </div>`
        })
    orderHtml += getTotal(orderList)
    document.getElementById("order").innerHTML = orderHtml
    } else {
        document.getElementById("order").innerHTML = ""
    }
}

function paymentModal(){
    return `
        <div class="modal" id="modal">
            <form action="POST">
                <img class="close-btn" id="close-btn" src="./images/close-btn.svg" alt="close-btn" data-close-modal="close-modal">
                <h2>Enter card details</h2>
                <input type="text" name="name" id="name-input" placeholder="Enter your name" required>
                <input type="number" name="card-number" id="card-number" placeholder="Enter card number" required>
                <input type="number" name="cvv" id="cvv-input" placeholder="Enter CVV" required >
                <button  type="submit" class="btn" data-pay="pay">Pay</button>
            </form>
        </div>`
}

function successMessage(){
    return `
    <div class="success-message menu">
        <h2>Thanks, James! Your order is on its way!</h2>
    </div>`
}