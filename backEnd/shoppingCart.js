
function removeFromCart(item){
    $.post('http://localhost:3000/removeFromCart',item, function(data) {
        console.log(data);
        console.log("Added to cart");
        window.location.reload()
    });
}


function generateTable(data) {
    const table = document.createElement('table');
    const headers = Object.keys(data[0]);
    const headerRow = table.insertRow();
  
    // Add table headers
    headers.forEach(headerText => {
        if (headerText != "_id" && headerText != "game_id" ){
            const header = document.createElement('th');
            const textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        }
      
    });
  
    // Add table rows and cells
    data.forEach(item => {
    const row = table.insertRow();
    Object.entries(item).forEach(([key, value]) => {
        if (key !== '_id' && key != 'game_id') {
            const cell = row.insertCell();
            const textNode = document.createTextNode(value);
            cell.appendChild(textNode);
        }
    });
    const buttonCell = row.insertCell();
    const button = document.createElement('button');
    button.textContent = 'Remove From Cart';
    button.addEventListener('click', function(){
        removeFromCart(item);
    });
    buttonCell.appendChild(button);
    });
  
    return table;
}

function loadTable() {
    $.get('http://localhost:3000/getCart', function(data) {
        console.log(data);
        const container = document.getElementById("cartList");
        const table = generateTable(data);
        container.appendChild(table);
    });
}

function clearCart(){
    $.post("http://localhost:3000/clearCart", function(data){
        console.log("Cart Cleared")
        window.location.reload();
    })
}