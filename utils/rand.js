function randn(mean, sd) {
    // http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html
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
    Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
    Y = mean + sd * Y ;
    return [X, Y];
}

// random vector

function fisher_yates(n) {
    // see https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    X = new Array(n);
    for(var i = 0; i < n; i++)
        X[i] = i;
    for(var i = 0; i <= n-2; i++) {
        var j = Math.floor(Math.random()*(n-i));
        // exchange a[i] and a[i+j]
        var t = X[i];
        X[i] = X[i+j];
        X[i+j] = t;
    }
    return X;
}
