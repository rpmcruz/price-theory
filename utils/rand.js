// http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html

function gauss_rand(mean, sd) {
    if (mean == undefined)
        mean = 0.0;
    if (sd == undefined)
        sd = 1.0;
    var V1, V2, S;
    do {
        var U1 = Math.random();
        var U2 = Math.random();
        V1 = 2 * U1 - 1;
        V2 = 2 * U2 - 1;
        S = V1 * V1 + V2 * V2;
    } while (S > 1);

    X = Math.sqrt(-2 * Math.log(S) / S) * V1;
    X = mean + sd * X;
    //Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
    //Y = mean + sd * Y ;
    return X;
}
