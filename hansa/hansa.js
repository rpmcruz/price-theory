//////////////////////////////// Initialization

const playersColors = [
    'black', 'blue', 'green', 'brown'
];

const cities = [
    new City(0, 'London', 357, 264),
    new City(1, 'Hamburg', 468, 199),
    new City(2, 'Lisbon', 36, 139),
    new City(3, 'Madrid', 108, 98),
    new City(4, 'Paris', 352, 176),
    new City(5, 'Bologne', 377, 8),
    new City(6, 'Prague', 420, 105),
    new City(7, 'Antwerp', 405, 207),
];

for(var i = 0; i < cities.length; i++)
    cities[i].postConstructor(cities);

var selectedi = -1;
var selected = [null, null];

d3.select('svg')
    .selectAll('city')
    .data(cities)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('cx', function(city) {return city.x;})
    .attr('cy', function(city) {return city.y;})
    .attr('r', 10)
    .on('mouseover', function() {
        d3.select(this).attr('r', 14);
    })
    .on('mouseout', function() {       
        d3.select(this)
            .transition()
            .duration(50)
            .ease(d3.easeLinear)
            .attr('r', 10);
    })
    .on('click', function(city) {
        if(locked) return;

        selectedi = (selectedi+1) % 2;
        if(selected[selectedi] != null)
            city.node.classed('selected' + selectedi, false);

        selected[selectedi] = city;
        city.node.classed('selected' + selectedi, true);

        setEnableCity(selectedi, city);
        setEnableTrade(selected[0], selected[1]);
    })
    .each(function(city) {city.node = d3.select(this);});

// UI
setEnableCity(0, null);
setEnableCity(1, null);
setEnableTrade(null, null);

//////////////////////////////// Form Events

function updateTrade(c, value) {
    var chr = 'input' + String.fromCharCode(48 + c);
    for(var i = 0; i < 2; i++) {
        var chr2 = chr + String.fromCharCode(65 + i);
        var v = (i == 0 && value < 0) || (i == 1 && value > 0) ?
            Math.floor(Math.abs(value)) : 0;
        document.getElementById(chr2).innerHTML = v;
    }
}

function tradeChanged(c, value) {
    updateTrade(c, value);
    if(!locked)
        lockMap();

    if(value >= 0) {
        selected[0].setExports(selected[1], c, value);
        selected[1].setExports(selected[0], c, 0);
    }
    else {
        selected[0].setExports(selected[1], c, 0);
        selected[1].setExports(selected[0], c, -value);
    }

    updateCityInfo(0, selected[0], 'white');
    updateCityInfo(1, selected[1], 'white');
}

function propose() {
    var feedback = document.getElementById('feedback');
    var button = document.getElementById('propose');

    if(!locked)
        lockMap();
    if(selected[0] == null || selected[1] == null) {
        endTurn();
        return;
    }

    var accepted0 = selected[0].propose();
    var accepted1 = selected[1].propose();

    if(accepted0 && accepted1) {
        selected[0].accept();
        selected[1].accept();
        var feedback = document.getElementById('feedback');
        feedback.innerHTML = 'We accept joining your league!';
        feedback.style.color = 'green';
    }
    else {
        selected[0].restore();
        selected[1].restore();

        var text;
        if(!accepted0 && !accepted1)
            text = 'Not a good deal for either!';
        else if(!accepted0)
            text = selected[0].name + ': not a good deal!';
        else//(!accepted1)
            text = selected[1].name + ': not a good deal!';
        var feedback = document.getElementById('feedback');
        feedback.innerHTML = text;
        feedback.style.color = 'red';
    }
    button.innerHTML = 'End Turn';
    button.onclick = endTurn;

    updateCityInfo(0, selected[0], accepted0 ? 'green' : 'red');
    updateCityInfo(1, selected[1], accepted1 ? 'green' : 'red');

    var trade1 = document.getElementById('trade1');
    trade1.disabled = true;
    var trade2 = document.getElementById('trade1');
    trade2.disabled = true;
}

function endTurn() {
    var feedback = document.getElementById('feedback');
    var button = document.getElementById('propose');
    feedback.innerHTML = '';
    button.disabled = true;
    playerTurn(1);
}

var delay = 1500;

function playerTurn(player) {
    var status = document.getElementById('turn');
    if(player > 0) {
        status.innerHTML = 'AI #' + player + ' turn: please wait.';
        status.style.backgroundColor = playersColors[player+1];
        status.style.color = 'white';
        status.style.fontWeight = 'bold';
        computerTurn(player);

        // the timeout is used as a delay/pause
        setTimeout(function() {
            playerTurn((player+1) % (playersColors.length-1));
        }, delay);
    }
    else {
        var button = document.getElementById('propose');
        button.innerHTML = 'Propose';
        button.onclick = propose;
        button.disabled = false;
        unlockMap();

        status.innerHTML = "> It's your turn.";
        status.style.color = playersColors[1];
        status.style.backgroundColor = 'white';
        status.style.fontWeight = 'normal';

        // the first time the person is playing takes more time -- to make it
        // clear it's AI turn -- but afterwards it's faster
        delay = 500;
    }
}

//////////////////////////////// Form Enable

function updateCityInfo(i, city, utilityColor) {
    if(city == null) {
        var name = getCityInput('city', i);
        name.innerHTML = 'City ' + String.fromCharCode(65 + i);
        getCityInput('utility', i).innerHTML = 0;
        getCityInput('value1', i).innerHTML = 0;
        getCityInput('value2', i).innerHTML = 0;
        getCityInput('maxprod1', i).innerHTML = 0;
        getCityInput('maxprod2', i).innerHTML = 0;
    }
    else {
        var name = getCityInput('city', i);
        name.innerHTML = city.name;
        name.style.color = i == 0 ? 'blue' : 'green';
        var u = city.getMaxUtility();
        getCityInput('utility', i).innerHTML = (u.utility*100).toFixed(2);
        getCityInput('value1', i).innerHTML = u.prod0.toFixed();
        getCityInput('value2', i).innerHTML = u.prod1.toFixed();
        getCityInput('maxprod1', i).innerHTML = (city.pop * city.z[0]).toFixed();
        getCityInput('maxprod2', i).innerHTML = (city.pop * city.z[1]).toFixed();
    }
    getCityInput('utility', i).style.color = utilityColor;
}

function getCityInput(id, i) {
    var chr = id + String.fromCharCode(65 + i);
    return document.getElementById(chr);
}

function setEnableCity(i, city) {
    var color = city != null ? 'black' : 'gray';
    var fields = ['city', 'lutility', 'lprod1', 'lprod2', 'value1', 'value2'];
    for(var k = 0; k < fields.length; k++)
        getCityInput(fields[k], i).style.color = color;
    fields = ['utility', 'prod1', 'prod2'];
    for(var k = 0; k < fields.length; k++)
        getCityInput(fields[k], i).style.borderColor = color;
    getCityInput('utility', i).style.backgroundColor = color;
    updateCityInfo(i, city, 'white');
}

function getTradeInput(id, i) {
    var chr = id + String.fromCharCode(49 + i);
    return document.getElementById(chr);
}

function setEnableTrade(city1, city2) {
    var selected = city2 != null;
    var color = selected ? 'black' : 'gray';
    document.getElementById('trade1').disabled = !selected;
    document.getElementById('trade2').disabled = !selected;
    document.getElementById('propose').disabled = !selected;
    document.getElementById('ltrade').style.color = color;
    document.getElementById('input0A').style.color = color;
    document.getElementById('input0B').style.color = color;
    document.getElementById('input1A').style.color = color;
    document.getElementById('input1B').style.color = color;
    if(city2 != null) {
        for(var c = 0; c < commodities; c++) {
            var NX = getTradeBalance(city1, city2, c);
            var field = getTradeInput('trade', c);
            field.min = -city2.canExport(c) + (NX < 0 ? NX : 0);
            field.max = +city1.canExport(c) + (NX > 0 ? NX : 0);
            field.value = NX;
            updateTrade(c, NX);
        }
    }
    else {
        for(var c = 0; c < commodities; c++) {
            getTradeInput('trade', c).value = 0;
            updateTrade(c, 0);
        }
    }
}

var locked = false;

function lockMap() {
    hover = null;
    locked = true;
    for(var i = 0; i < cities.length; i++)
        if(cities[i] != selected[0] && cities[i] != selected[1])
            cities[i].node.classed('locked', true);
    if(selected[0] != null && selected[1] != null) {
        selected[0].save(0);
        selected[1].save(0);
    }
}

function unlockMap() {
    locked = false;
    selected[0] = null;
    selected[1] = null;
    for(var i = 0; i < cities.length; i++) {
        cities[i].node.classed('locked', false);
        cities[i].node.classed('selected0', false);
        cities[i].node.classed('selected1', false);
    }
    setEnableCity(0, null);
    setEnableCity(1, null);
    setEnableTrade(null, null);
}
