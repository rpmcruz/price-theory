// logic initializes vector of goods and matrix of prices

function greatest_common_divisor(a, b) {
    // euclid's algorithm
    if(b == 0)
        return a;
    return greatest_common_divisor(b, a % b);
}

function Logic(nodes) {
    this.nodes = nodes;

    this.goods = [];
    for(var i = 0; i < nodes; i++)
        this.goods.push({
            q: i == 0 ? 100 : 0
        });

    // initialization of prices matrix is tricky: we only want one arbritrage
    // opportunity which means prices assymetry through only one pathway

    this.prices = new Array(nodes*nodes);
    // 1. set all one
    for(var i = 0; i < nodes; i++)
        for(var j = 0; j < nodes; j++)
            this.prices[i*nodes+j] = {i:i, j:j, p:1};
    // 2. randomize it: we must randomize while keeping pathways symmetric
    for(var i = 0; i < nodes; i++)
        for(var j = 0; j < nodes; j++)
            if(i != j) {
                var u = Math.floor(Math.random() * 4);
                this.prices[i*nodes+j].p += u;
                for(var l = 0; l < nodes; l++)
                    if(l != i && l != j)
                        this.prices[l*nodes+j].p += u;
            }
    // 3. benefit one price so people can find an arbritrage pathway
    var i = Math.floor(Math.random() * nodes);
    var j = i;
    while(i == j)
        j = Math.floor(Math.random() * nodes);
    this.prices[i*nodes+j].p += 1 + Math.floor(Math.random() * 2);
    // 4. normalize prices (dividing by greatest common divisor)
    for(var i = 0; i < nodes; i++)
        for(var j = 0; j < nodes; j++)
            if(i != j) {
                var gcd = greatest_common_divisor(
                    this.prices[i*nodes+j].p, this.prices[j*nodes+i].p);
                this.prices[i*nodes+j].p /= gcd;
                this.prices[j*nodes+i].p /= gcd;
            }
}
