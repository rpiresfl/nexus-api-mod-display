start();

function start() {
    fillGameList();
    btnSubmitAPIKey = document.getElementById('btnSubmitAPIKey');
    btnSubmitAPIKey.onclick = function() {
        clearFields();
        requestModJSON();
    }
}

function fillGameList() {
    games = ['Skyrim', 'Fallout 4', 'Skyrim Special Edition', 'New Vegas', 'Oblivion', 'Fallout 3', 'Morrowind'];
    inputGame = document.getElementById('inputGame');
    games.forEach(game => {
        gameOption = document.createElement('option');
        gameOption.appendChild(document.createTextNode(game));
        gameOption.setAttribute('value', game.toLowerCase().replace(/ /g,''));
        inputGame.appendChild(gameOption);
    });
}

function clearFields() {
    fields = ['modName', 'modSummary', 'modAuthor', 'modVersion', 'modUploadDate', 'modUpdateDate', 'modDescription', 'modPicture'];
    fields.forEach(field => {
        document.getElementById(field).innerText = '';
    });
}

function requestModJSON() {
    inputAPIKey = document.getElementById('inputAPIKey').value;
    inputModID = document.getElementById('inputModID'). value;
    inputGame = document.getElementById('inputGame').value;

    if (!checkRequiredInfo(inputAPIKey, inputModID, inputGame)) {
        return false;
    }

    request = new XMLHttpRequest();
    url = 'https://api.nexusmods.com/v1/games/'+inputGame+'/mods/'+inputModID+'.json';

    request.open('GET', url, true);
    request.setRequestHeader('APIKEY', inputAPIKey);
    request.send();
    
    request.onload = function() {
        openRetrievedJSON(request.responseText);
    }
}

function checkRequiredInfo(inputAPIKey, inputModID, inputGame) {
    if ((inputAPIKey == '') || (inputModID == '') || (inputGame == '')) {
        alert('Please fill out all required information.');
        return false;
    } else {
        return true;
    }
}

function openRetrievedJSON(retrievedJSON) {
    parsedJSON = JSON.parse(retrievedJSON);
    document.getElementById('modName').innerText += ' '+ parsedJSON.name;
    document.getElementById('modSummary').innerText += ' '+ parsedJSON.summary;
    document.getElementById('modAuthor').innerText += ' '+ parsedJSON.author;
    document.getElementById('modVersion').innerText += ' '+ parsedJSON.version;
    document.getElementById('modUploadDate').innerText += ' '+ parseDate(parsedJSON.created_time);
    document.getElementById('modUpdateDate').innerText += ' '+ parseDate(parsedJSON.updated_time);
    document.getElementById('modDescription').innerHTML += ' '+ translateBBCode(parsedJSON.description);
    document.getElementById('modPicture').setAttribute('src', parsedJSON.picture_url);
}

function parseDate(date) {
    return date.substr(8, 2) +'-'+ date.substr(5, 2) +'-'+ date.substr(0, 4) +' '+ date.substr(11, 8);
}

function translateBBCode(bbCode) {
    tags = 
        [
            /\[b\](.*)\[\/b\]/g, '<strong>$1</strong>',
            /\[list\]/g, '<ul>',
            /\[\/list\]/g, '</ul>',
            /\[\*\]/g, '<li>',
            /\[\/\*\]/g, '</li>',
            /\[center\](.*)\[\/center\]/g, '<div align="center">$1</div>',
            /\[img\](.*)\[\/img\]/g, '<img src=\"$1\">',
            /\[i\](.*)\[\/i\]/g, '<em>$1</em>',
            /\[url=(.*)\](.*)\[\/url\]/g, '<a href=\"$1\">$2</a>',
            /\[size=(.*)\](.*)\[\/size\]/g, '<font size=\"$1\">$2</font>',
            /\[color=([^\]]*)\]([^\[]*)\[\/color\]/g, '<font style="color: $1;">$2</font>',
            /\[line\]/g, '<div class=\"line\"></div>',
            /\[heading\](.*)\[\/heading\]/g, '<h2>$1</h2>'
        ];


    for (i=0;i<tags.length;i+=2) {
        bbCode = bbCode.replace(tags[i], tags[i+1]);
    }

    return bbCode;
}