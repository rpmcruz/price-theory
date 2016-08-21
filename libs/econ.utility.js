// (C) 2016 Ricardo Cruz

function Utility(alphas)
{
    this.as = alphas;
}

Utility.prototype.get = function(goods)
{
    var ret = 0;
    for(var i = 0; i < goods.length; i++)
        ret += (1-Math.exp(-this.as[i]* goods[i])) / goods.length;
    return ret;
};
