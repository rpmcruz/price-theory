// logic initializes vector of goods and matrix of prices

function gcd(a, b) {
    // euclid's algorithm
    if(b == 0)
        return a;
    return gcd(b, a % b);
}

// initialization of prices matrix is tricky: we only want one arbritrage
// opportunity which means prices assymetry through only one pathway

function initPrices(goods) {
    var prices = new Array(goods);
    // 1. set all one
    for(var i = 0; i < goods; i++) {
        prices[i] = new Array(goods);
        for(var j = 0; j < goods; j++)
            prices[i][j] = 1;
    }
    // 2. randomize it: we must randomize while keeping pathways symmetric
    for(var i = 0; i < goods; i++)
        for(var j = 0; j < goods; j++)
            if(i != j) {
                var u = Math.floor(Math.random() * 4);
                prices[i][j] += u;
                for(var l = 0; l < goods; l++)
                    if(l != i && l != j)
                        prices[l][j] += u;
            }
    // 3. benefit one price so people can find an arbritrage pathway
    var i = Math.floor(Math.random() * goods);
    var j = i;
    while(i == j)
        j = Math.floor(Math.random() * goods);
    prices[i][j] += 1 + Math.floor(Math.random() * 2);
    // 4. normalize prices (dividing by greatest common divisor)
    for(var i = 0; i < goods; i++)
        for(var j = 0; j < goods; j++)
            if(i != j) {
                var div = gcd(prices[i][j], prices[j][i]);
                prices[i][j] /= div;
                prices[j][i] /= div;
            }
    return prices;
}
