// (C) 2016 Ricardo Cruz

/*
We are using here the exponential utility function:
https://en.wikipedia.org/wiki/Exponential_utility

In the case of two goods:
U(x0,x1) := (1-exp(-a*x0))/2 + (1-exp(-a*x1))/2

# Slope

If alpha is positive then the person is risk-averse and utility is diminishing.
If alpha is zero then this is a linear function.
Alpha is a vector since it can differ for the different goods.

# Range

The range of the utility is [0,1].

Notice1: we do not divide by a, like in wikipedia.

Notice2: this range is in the infinity. If you want u=1 when x=some maximum,
then divide u(x) by u(max).
*/

function Utility(alphas)
{
    this.as = alphas;
}

Utility.prototype.get = function(goods)
{
    var ret = 0;
    for(var i = 0; i < goods.length; i++)
        ret += (1-Math.exp(-this.as[i]* goods[i]));
    return ret;
};
