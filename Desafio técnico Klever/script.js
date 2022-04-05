function loadIndex() {
    let err = findGetParameter("err");

    if (err) {
        alert(decodeURI(err));
    }

    let tokens = getTokens();
    if(tokens == {})
        return;

    let tokensList = document.getElementById('tokensList');
    let count = 0;
    Object.keys(tokens).forEach(function (tokenName) {

        let tokenBalance = formatCurrency(tokens[tokenName]);

        let data = document.createElement("div");

        data.setAttribute("data-id", count);

        data.classList.add("data-list");

        let button = document.createElement('a');

        let btnImg = document.createElement('img');

        btnImg.setAttribute("src", "assets/edit.png");

        button.append(btnImg);

        button.classList.add("edit-btn");

        button.setAttribute("onclick", `editTokenBtn("${tokenName}")`);

        let text = document.createElement("p");

        text.append(tokenName);

        text.classList.add("d-inline-block");

        let span = document.createElement("span");

        span.classList.add("balance"); 

        span.append(tokenBalance);

        text.append(span);

        data.append(button);

        data.append(text);    

        tokensList.append(data); 

        count ++;
    });

    function formatCurrency(currency) {

        let moneyFormatter  = new Intl.NumberFormat();

        let formatted = moneyFormatter.format(currency);

        return formatted;
    }
}

function editTokenBtn(tokenName) {
    let tokens = getTokens();

    if(tokens[tokenName]) {
        window.location.href = `editToken.html?edit=${tokenName}`;
    } else {
        window.location.href = "index.html";
    }
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;z
}

function loadEditPage() {

    let edit = findGetParameter("edit");
    
    if(!edit)
        window.location.href = "index.html";

    let oldToken = document.getElementById("OldToken");

    let formToken = document.getElementById("Token");

    let formBalance = document.getElementById("Balance");

    let tokens = getTokens();

    formBalance.value = tokens[edit];

    oldToken.value = edit;

    formToken.value = edit;  
}

function handleRemove() {
    let oldToken = document.getElementById("OldToken");

    let tokens = getTokens();
    
    if(tokens[oldToken.value]) {
        
        if(confirm("Delete this token?")) {
            deleteToken(oldToken.value);
        }
    }
    
    window.location.href = "index.html";
}

function handleEdit() {
    let token = document.getElementById("Token");

    let balance = document.getElementById("Balance");

    let oldToken = document.getElementById("OldToken");

    let tokens = getTokens();

    let editBalance = balance.value.replace(",", ".");

    editBalance = parseFloat(editBalance);

    if(!token.value) {
        sendToIndex("Token must be filled");
        return;
    }

    if(tokens[oldToken.value]) {

        if (!editBalance) {
            editBalance = tokens[oldToken.value];
        }
        if (oldToken.value != token.value) {
            deleteToken(oldToken.value);
        }

        addToken(token.value, editBalance);
    }

    sendToIndex();
}

function addToken(tokenName, balance) {
    let data = getTokens();
    
    data[tokenName] = balance;

    let json = JSON.stringify(data);

    localStorage.setItem("tokens", json);
}

function deleteToken(tokenName) {
    let data = getTokens();
    
    data[tokenName] = undefined;

    let json = JSON.stringify(data);

    localStorage.setItem("tokens", json);
}

function getTokens() {
    let data = {};

    let tokens = localStorage.getItem('tokens');

    if (tokens && tokens != "null")
    {
        data = JSON.parse(tokens);
    }

    return data;
}

function sendToAddToken() {
    window.location.href='addToken.html'
}

function sendToIndex(msg) {
    if (msg) {

        window.location.href='index.html?err=' + encodeURI(msg); 
    } else {
        window.location.href='index.html';
    }
    
}

function saveNewToken() {
    let tokens = getTokens();

    let tokenName = document.getElementById("Token").value;

    let balance = document.getElementById("Balance").value;

    balance = balance.replace(",", ".");

    if(!tokenName || !balance || tokens[tokenName]) {

        sendToIndex("All fields are mandatory.");

    } else {
        
        addToken(tokenName, parseFloat(balance));
        sendToIndex();
    }
}