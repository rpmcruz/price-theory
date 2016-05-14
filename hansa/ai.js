// Returns winning player

function hasWon() {
    var player = cities[0].league;
    if(player == -1)
        return -1;
    for(var i = 1; i < cities.length; i++)
        if(cities[i] != player)
            return -1;
    return player;
}

function computerTurn(player) {
    if(hasWon() == player)
        return;

    var city0, city1;
    do {
        city0 = cities[Math.floor(Math.random()*cities.length)];
        city1 = cities[Math.floor(Math.random()*cities.length)];
    } while(city0 == city1 || (city0.league == player && city1.league == player));

    var fraction = 0.10;
    var c = Math.floor(Math.random()*2);
    city0.save(player);
    city1.save(player);
    city0.setExports(city1, c, city0.canExport(c)*fraction);
    city1.setExports(city0, 1-c, city1.canExport(1-c)*fraction);
    if(city0.propose() && city1.propose()) {
        city0.accept();
        city1.accept();
        console.log('AI accepted !');
    }
    else {
        city0.restore();
        city1.restore();
    }
}
