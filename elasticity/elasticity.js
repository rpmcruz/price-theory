var labels = ['Weather', 'Fashion', 'Meat Price'];
var L1 = ['Terrible', 'Bad', 'Good', 'Great'];
var L2 = ['Last Year', 'No', 'Yes', 'Very hip'];
var L3 = ['$1.00', '$2.00', '$3.00', '$4.00'];

// S=supply, D=demand, P=price
// Qs(P) = a0 + (a1*X0 + a2*X2)*P
// Qd(P) = b0  + (b1*X1  + b2*X2)*P

var betaA = [0, 2, 0, 1];
var betaB = [100, 0, -2, -1];

function P(X) {
    var XA = X.mult(betaA);
    var XB = X.mult(betaB);
    return (XB[0]-XA[0]) / (XA[1]+XA[2]+XA[3]-(XB[1]+XB[2]+XB[3]));
}

function Q(X) {
    var XA = X.mult(betaA);
    var XB = X.mult(betaB);
    return XA[0] + (XA[1]+XA[2]+XA[3])*P(X);
}

function getRectIntersection(xA, yA, xB, yB) {
    // this code returns a rect that inside the constrains of the plot --
    // we make sure it is inside the plot to avoid going over the axis

    var m = (yB-yA) / (xB-xA);
    var b = yA - xA*m;

    var x0 = 0, y0 = b;
    y0 = Math.min(Math.max(0, y0), Pmax);
    if(m != 0)
        x0 = (y0-b)/m;

    var x1 = Qmax, y1 = Qmax*m+b;
    y1 = Math.min(Math.max(0, y1), Pmax);
    if(m != 0)
        x1 = (y1-b)/m;

    return [[x0, y0], [x1, y1]];
}

var idx = d3.shuffle(d3.range(Math.pow(4, 3))).slice(0, 6);
var Xs = idx.map(function(i) {
    return [1, (i%4), (Math.floor(i/4)%4), Math.floor(i/16)];
});

var Qmax = Q([1,3,0,0]);
var Pmax = P([1,3,0,0]);

// CREATE TABLE

var table = d3.select('table');

var tr = table.append('tr');
tr.append('th').html('Point');
tr.append('th').html('Weather');
tr.append('th').html('Fashion');
tr.append('th').html('Meat Price');

function addPoints(Xs) {
    console.log('add points: ' + Xs);
    // table
    var tr = table.selectAll('tr.value')
        .data(Xs)
        .enter()
        .append('tr')
        .attr('class', 'value')
        .on('mouseover', function(d, i) {
            this.className = 'hl';
            var g = svg.selectAll('.point').nodes()[i];
            var t = g.childNodes[0];
            d3.select(t).transition().duration(200).attr('r', 6);
            t = g.childNodes[1];
            d3.select(t).style('font-weight', 'bold');
        })
        .on('mouseout', function(d, i) {
            this.className = '';
            var g = svg.selectAll('.point').nodes()[i];
            var t = g.childNodes[0];
            d3.select(t).transition().duration(200).attr('r', 4);
            t = g.childNodes[1];
            d3.select(t).style('font-weight', 'normal');
        });
    tr
        .style('color', 'white')
        .style('border-color', 'white')
        .transition()
        .duration(250)
        .ease(d3.easeLinear)
        .style('border-color', 'black')
        .style('color', 'black');
    tr.append('td')
        .html(function(X, i) {return i == 0 ? 'P' : String.fromCharCode(64+i);})
        .attr('class', 'point');
    tr.append('td').html(function(X, i) {return L1[X[1]]});
    tr.append('td').html(function(X, i) {return L2[X[2]]});
    tr.append('td').html(function(X, i) {return L3[X[3]]});

    // plot
    var points = svg.selectAll('.point')
        .data(Xs)
        .enter()
        .append('g')
        .attr('class', 'point')
        .attr('transform', function(X) {
            return 'translate(' + x(Q(X)) + ',' + y(P(X)) + ')'});
    points
        .style('fill-opacity', 1e-6)
        .transition()
        .duration(250)
        .ease(d3.easeLinear)
        .style('fill-opacity', 1);
    points.append('circle')
        .attr('fill', 'black')
        .attr('r', 4);
    points.append('text')
        .attr('dx', 5).attr('dy', 5)
        .attr('dominant-baseline', 'text-before-edge')
        .style('text-anchor', 'begin')
        .style('cursor', 'default')
        .text(function(X, i) {
            return i == 0 ? 'P' : String.fromCharCode(64+i);
        });

    // lines between P and all other points
    var lines = background.selectAll('.line')
        .data(Xs.slice(1))
        .enter()
        .append('g')
        .attr('class', 'line')
        .on('mouseover', function() {
            d3.select(this.childNodes[1])
                .transition()
                .duration(200)
                .ease(d3.easeLinear)
                .attr('stroke', 'rgb(160,160,160)')
                .attr('stroke-width', 2);
        })
        .on('mouseout', function(d, i) {
            d3.select(this.childNodes[1])
                .transition()
                .duration(200)
                .ease(d3.easeLinear)
                .attr('stroke', 'rgb(200,200,200)')
                .attr('stroke-width', 1);
        })
        .on('click', function(d, i) {
            console.log('clicked: ' + i + ' ' + d);
        });
    lines.append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 18)
        .attr('stroke-opacity', 0)
        .each(function(B) {
            var A = Xs[0];
            var pts = getRectIntersection(Q(A), P(A), Q(B), P(B));
            d3.select(this)
                .attr('x1', x(pts[0][0]))
                .attr('y1', y(pts[0][1]))
                .attr('x2', x(pts[1][0]))
                .attr('y2', y(pts[1][1]));
        });
    lines.append('line')
        .attr('class', 'line2')
        .attr('stroke', 'rgb(200,200,200)')
        .attr('stroke-width', 1)
        .each(function(B) {
            var A = Xs[0];
            var pts = getRectIntersection(Q(A), P(A), Q(B), P(B));
            d3.select(this)
                .attr('x1', x(pts[0][0]))
                .attr('y1', y(pts[0][1]))
                .attr('x2', x(pts[1][0]))
                .attr('y2', y(pts[1][1]));
        });
}

// CREATE PLOT

var width = 350, height = 280;
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    innerwidth = width - margin.left - margin.right,
    innerheight = height - margin.top - margin.bottom;

var x = d3.scaleLinear().domain([0, Qmax]).range([0, innerwidth]);
var y = d3.scaleLinear().domain([0, Pmax]).range([innerheight, 0]);

var svg = d3.select('#plot').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var background = svg.append('g');

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + innerheight + ')')
    .call(d3.axisBottom(x));
svg.append('text')
        .attr('x', innerwidth)
        .attr('y', innerheight-6)
        .style('text-anchor', 'end')
        .text('Quantity of Wool sold per year');
svg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y));
svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Price of Wool');

// WRITE TEXT

addPoints(Xs.slice(0, 1));

d3.select('#text')
    .html('Point <b>P</b> represents current price and quantity of wool. ')
    .append('button')
        .text('See historical points')
        .on('click', function() {
            addPoints(Xs);
            d3.select('#text')
                .html('Choose whichever point is in the same <u>demand</u> line as <b>P</b>.');
        });
