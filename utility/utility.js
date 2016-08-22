katex.render('U(x) = \\sum_{i=1}^2 (1-\\exp(-\\alpha_ix_i)) / 2', d3.select('#eq').node());

var graph = new DynGraph(d3.select('svg'), [0, 100], [0, 100], {top: 40, bottom: 40, left: 40, right: 40})
    .xaxis('Bread')
    .yaxis('Wine');
new DynPlot(graph, [[0, 100], [100, 0]]);

function Smile(graph) {
    this.g = graph.graph.append('g')
        .attr('transform', 'translate(' + graph.xscale(0) + ',' + graph.yscale(0) + ')');

    this.g.append('circle').attr('class', 'face-shadow').attr('r', 25);
    this.g.append('circle').attr('class', 'face').attr('r', 25);
    this.g.append('circle').attr('class', 'eye').attr('r', 4).attr('cx', -10).attr('cy', -10);
    this.g.append('circle').attr('class', 'eye').attr('r', 4).attr('cx', +10).attr('cy', -10);

    this.lineFunction = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) {return d.x;})
        .y(function(d) {return d.y;});
    var pts = [{x: -14, y: 10}, {x: 0, y: 0}, {x: +14, y: 10}];
    this.smile = this.g.append('path')
        .attr('class', 'smile')
        .attr('transform', 'translate(0, 7)')
        .attr('d', this.lineFunction(pts));
    this.graph = graph;
}
Smile.prototype.value = function(value) {
    var y = -10 * (value*2-1);
    var pts = [{x: -14, y: y}, {x: 0, y: 0}, {x: +14, y: y}];
    this.smile
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr('d', this.lineFunction(pts));
    return this;
};
Smile.prototype.pos = function(pos) {
    var x = this.graph.xscale(pos[0]);
    var y = this.graph.yscale(pos[1]);
    this.g
        .transition()
        .attr('transform', 'translate(' + x + ',' + y + ')');
}

var smile = new Smile(graph);

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
    smile.pos(goods);
});
