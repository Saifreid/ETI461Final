// Function to generate HTML table from JSON data




function getCookie(name){
    let cookieArr = document.cookie.split(";");
    for (const cookie of cookieArr){
        let cookiePair = cookie.split('=');
        if(name == cookiePair[0].trim()){
            return decodeURIComponent(cookiePair[1]);
        }
    }
}


function addToCart(item){
    let userCookie = getCookie("user");
    console.log(userCookie);
    $.post('http://localhost:3000/addToCart',item, document.cookie, function(data) {
        console.log(data);
        console.log("Added to cart");
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
    button.textContent = 'Add to Cart';
    button.addEventListener('click', function(){
        addToCart(item);
    });
    buttonCell.appendChild(button);
    });
  
    return table;
}

function loadTable() {
    $.get('http://localhost:3000/getGames', function(data) {
        console.log(data);
        const container = document.getElementById("gameList");
        const table = generateTable(data);
        container.appendChild(table);
    });
}


