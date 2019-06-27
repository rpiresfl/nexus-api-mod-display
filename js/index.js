start();

function start() {
    btnSubmitAPIKey = document.getElementById('btnSubmitAPIKey');
    btnSubmitAPIKey.onclick = function() {
        requestModJSON();
    }
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
    clearFields();

    parsedJSON = JSON.parse(retrievedJSON);
    document.getElementById('modName').innerText += ' '+ parsedJSON.name;
    document.getElementById('modSummary').innerText += ' '+ parsedJSON.summary;
    document.getElementById('modAuthor').innerText += ' '+ parsedJSON.author;
    document.getElementById('modVersion').innerText += ' '+ parsedJSON.version;
    document.getElementById('modUploadDate').innerText += ' '+ parseDate(parsedJSON.created_time);
    document.getElementById('modUpdateDate').innerText += ' '+ parseDate(parsedJSON.updated_time);
    document.getElementById('modDescription').innerHTML += ' '+ organizeDescription(parsedJSON.description);
    document.getElementById('modPicture').setAttribute('src', parsedJSON.picture_url);
}

function clearFields() {
    fields = ['modName', 'modSummary', 'modAuthor', 'modVersion', 'modUploadDate', 'modUpdateDate', 'modDescription', 'modPicture'];
    fields.forEach(field => {
        document.getElementById(field).innerText = '';
    });
}

function parseDate(date) {
    return date.substr(8, 2) +'-'+ date.substr(5, 2) +'-'+ date.substr(0, 4) +' '+ date.substr(11, 8);
}

function organizeDescription(description) {
    description = description.replace(/\[b\]/g, '<strong>');
    description = description.replace(/\[\/b\]/g, '</strong>');

    description = description.replace(/\[list\]/g, '<ul>');
    description = description.replace(/\[\/list\]/g, '</ul>');

    description = description.replace(/\[\*\]/g, '<li>');
    description = description.replace(/\[\/\*\]/g, '</li>');

    description = description.replace(/\[center\]/g, '<div align="center">');
    description = description.replace(/\[\/center\]/g, '</div>');

    description = description.replace(/\[img\]/g, '<img src="');
    description = description.replace(/\[\/img\]/g, '">');

    //Link replacement WIP
    //description = description.replace(/\[url=\]/g, '<a href="');
    description = description.replace(/\[\/url\]/g, '"</a>');

    return description;
}