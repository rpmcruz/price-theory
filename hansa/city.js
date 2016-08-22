//////////////////////////////// City

/*
We loosely use symbols from macroeconomics.
Internally, our unit of account is labor; imports, exports, etc are all
measured in labor costs. Externally, we present everything in terms of
quantities to the user.
*/

const commodities = 2;

function City(id, name, x, y) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = 275-y;
    // economic variables
    // population (pop) -- total laborers
    this.pop = Math.round(d3.randomNormal(1000, 200)());
    // productivity (z) -- products-per-laborer
    this.z = new Array(commodities);
    var rnorm = d3.randomNormal(1, 0.1);
    for(var c = 0; c < commodities; c++) {
        var r = rnorm();
        this.z[c] = Math.max(0.1, r);
    }
    this.league = -1;
}

City.prototype.postConstructor = function(cities) {
    for(var i = 0; i < cities.length; i++) {
        cities[i].ex = new Array(commodities);
        for(var c = 0; c < commodities; c++)
            // exports, in laborers
            cities[i].ex[c] = new Array(cities.length).fill(0);
    }
}

City.prototype.save = function(player) {
    this.oldutility = this.getMaxUtility(this.league).utility;
    this.oldex = this.ex.slice();
    this.oldleague = this.league;
    if(player != this.league) {
        // exports are reset if different league
        for(var c = 0; c < commodities; c++)
            this.ex[c] = new Array(cities.length).fill(0);
        this.league = player;
    }
}

City.prototype.restore = function() {
    this.ex = this.oldex;
    this.league = this.oldleague;
}

City.prototype.accept = function() {
    if(this.oldleague != this.league) {
        // reset IM when changing league
        // EX already reset on save()
        for(var c = 0; c < commodities; c++)
            for(var i = 0; i < cities.length; i++)
                if(cities[i].league != this.league)
                    cities[i].ex[c][this.id] = 0;
        this.node.classed('player' + this.league, true);
    }
}

City.prototype.propose = function() {
    return this.getMaxUtility().utility > this.oldutility;
}

City.prototype.canExport = function(c) {
    var emp = 0;
    for(var _c = 0; _c < commodities; _c++)
        for(var i = 0; i < cities.length; i++)
            if(cities[i].league == this.league)
                emp += this.ex[_c][i];
    var unemployed = Math.max(0, this.pop - emp);
    var ret = unemployed * this.z[c];
    return ret;
}

City.prototype.setExports = function(other, c, ex) {
    this.ex[c][other.id] = ex / this.z[c];
}

function getTradeBalance(city1, city2, c) {
    return city1.ex[c][city2.id] - city2.ex[c][city1.id];
}

/*
Exponential utility function
https://en.wikipedia.org/wiki/Exponential_utility

U(l0,l1) := (1-exp(-a*(z0*l0+im0)))/2 + (1-exp(-a*(z1*l1+im1)))/2

The utility is an internal function. Externally, utility should be obtained
by the utility maximization function, which provides the best utility for
whatever is pretended to test against.

This maximization was calculated using Lagrange maximization:
       Maximize utility (as defined above) changing l1,l2
       subject to l1,l2 >= 0 and l1+l2 <= n

In python/scipy:

from sympy import *
a, z0, l0, n0, z1, l1, n1, pop, im0, im1, ex = symbols('a z0 l0 n0 z1 l1 n1 pop im0 im1 ex')
# 2 variables
U = ((1-exp(-a*(z0*l0+im0))) + (1-exp(-a*(z1*l1+im1))))/2
dU_dl0 = diff(U, l0)
dU_dl1 = diff(U, l1)
s = solve((dU_dl0-dU_dl1, l0+l1-pop-ex), l0, l1)
print s
*/

var a = 0.001;

City.prototype.getMaxUtility = function() {
    var ex = 0;
    var im = new Array(commodities).fill(0);

    // only if already belongs to league should IM/EX count
    for(var c = 0; c < commodities; c++)
        for(var i = 0; i < cities.length; i++)
            if(cities[i].league == this.league)
                ex += this.ex[c][i];
    for(var c = 0; c < commodities; c++)
        for(var i = 0; i < cities.length; i++)
            if(i != this.id && cities[i].league == this.league)
                im[c] += cities[i].ex[c][this.id];

    var z0 = this.z[0];
    var z1 = this.z[1];

    var l0 = (a*z1*(this.pop-ex) + a*(im[1]-im[0]) - Math.log(z1/z0))/(a*(z0 + z1));
    var l1 = (a*z0*(this.pop-ex) + a*(im[0]-im[1]) + Math.log(z1/z0))/(a*(z0 + z1));

    if(l0 < 0) {
        l0 = 0;
        l1 = this.pop - ex;
    }
    else if(l1 < 0) {
        l0 = this.pop - ex;
        l1 = 0;
    }

    var utility = ((1-Math.exp(-a*(z0*l0+im[0]))) + (1-Math.exp(-a*(z1*l1+im[1]))))/2;
    return {utility: utility, prod0: l0*z0, prod1: l1*z1};
}

