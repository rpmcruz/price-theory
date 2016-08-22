katex.render('U(x) = \\sum_{i=1}^2 (1-\\exp(-\\alpha_ix_i)) / 2', d3.select('#eq').node());

var graph = new DynGraph(d3.select('#plot'), [0, 100], [0, 100])
    .xaxis('Bread')
    .yaxis('Wine');
new DynPlot(graph, [[0, 100], [100, 0]]);
var point = new DynScatter(graph, [0, 0]);

function Smile(parent, diameter) {
    parent.append('circle').attr('class', 'face').attr('r', width/2-5);
    parent.append('circle').attr('class', 'eye').attr('r', 20).attr('cx', -50).attr('cy', -50);
    parent.append('circle').attr('class', 'eye').attr('r', 20).attr('cx', +50).attr('cy', -50);

    this.lineFunction = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) {return d.x;})
        .y(function(d) {return d.y;});
    var pts = [{x: -85, y: 30}, {x: 0, y: 0}, {x: +85, y: 30}];
    this.smile = parent.append('path')
        .attr('class', 'smile')
        .attr('transform', 'translate(0, 60)')
        .attr('d', this.lineFunction(pts));
}
Smile.prototype.value = function(value) {
    var height = 30;
    var y = -height * (value*2-1);
    var pts = [{x: -85, y: y}, {x: 0, y: 0}, {x: +85, y: y}];
    this.smile
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr('d', this.lineFunction(pts));
    return this;
};

var svg = d3.select('svg');
var back = appendBack(svg);

var width = Math.min(svg.attr('width'), svg.attr('height'));
var smile = new Smile(back, width);

const alphas = [0.01, 0.05];
const utility = new Utility(alphas);

d3.selectAll('.good').on('input', function() {
    var goods = [
        parseInt(d3.select('#good1').property('value')),
        parseInt(d3.select('#good2').property('value'))
    ];

    var spending = goods[0] + goods[1];
    var money = 100 - spending;

    if(money < 0) {
        /* Set a maximum using the budget. We do not use <input max=xx> because
           that would change the ticks of the slider which would look odd */
        var i = parseInt(this.id.slice(-1))-1;
        d3.select(this).property('value', goods[i] + money);
        money = 0;
        goods = [  // recalculate
            parseInt(d3.select('#good1').property('value')),
            parseInt(d3.select('#good2').property('value'))
        ];
    }

    const utils = utility.get(goods) / utility.get([60, 40]);

    d3.select('#money').text('$' + money);
    d3.select('#utility').text(utils.toFixed(3));
    smile.value(utils);
    d3.select('#good1-value').text(goods[0]);
    d3.select('#good2-value').text(goods[1]);
    point.reset(goods);
});
