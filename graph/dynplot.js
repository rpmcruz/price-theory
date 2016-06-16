const MARGIN = {top:10, left:75, bottom:60, right:15};
const WIDTH = 600 - MARGIN.left - MARGIN.right;
const HEIGHT = 350 - MARGIN.top - MARGIN.bottom;

var Dynplot = function(container, xlim, ylim)
{
    var plot = this;
    this.xscale = d3.scale.linear().domain([0, xlim]).range([0, WIDTH]);
    this.yscale = d3.scale.linear().domain([0, ylim]).range([HEIGHT, 0]);

    this.line = d3.svg.line()
        .x(function(d) {return plot.xscale(d[0]);})
        .y(function(d) {return plot.yscale(d[1]);})
        .interpolate('monotone');

    this.svg = d3.select('#graph').append('svg')
        .attr('width', WIDTH + MARGIN.left + MARGIN.right)
        .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
    this.graph = this.svg.append('g')
        .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

    // overlay hack to make sure there is always something under the mouse
    this.graph.append('rect')
        .attr('class', 'overlay')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('fill', 'none')
    this.graph
        .attr('pointer-events', 'all')
        .on('mouseover', function() {
            plot.graph.selectAll('circle.control').transition().delay(50)
                .ease('linear').attr('r', 5);
        })
        .on('mouseout', function() {
            plot.graph.selectAll('circle.control').transition().delay(100)
                .ease('linear').attr('r', 0);
        });
}

Dynplot.prototype.xaxis = function(title)
{
    var xaxis = d3.svg.axis().scale(this.xscale).orient('bottom');
    this.graph.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + HEIGHT + ')')
        .call(xaxis);
    if(title)
        this.graph.append('text')
            .attr('class', 'x title')
            .attr('alignment-baseline', 'text-after-edge')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(' + (WIDTH/2) + ',' +
                (HEIGHT+MARGIN.bottom-5) + ')')
            .text(title);
};

Dynplot.prototype.yaxis = function(title)
{
    var yaxis = d3.svg.axis().scale(this.yscale).ticks(4).orient('left');
    this.graph.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(yaxis);
    if(title)
        this.svg.append('text')
            .attr('class', 'y title')
            .attr('alignment-baseline', 'text-before-edge')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0,' + (HEIGHT/2) + ')rotate(-90)')
            .text(title);
};

Dynplot.prototype.addLine = function(klass, data, interactive) {
    var plot = this;
    var path = this.graph.selectAll('path.' + klass)
        .data([data]).enter().append('path')
        .attr('class', klass + ' line')
        .attr('d', function(d) {return plot.line(d);});

    if(interactive) {
        var plot = this;
        var dragListener = d3.behavior.drag()
            .on('dragstart', function(d) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed('dragging', true);
            })
            .on('drag', function(d, i) {
                var x = d3.event.x, y = d3.event.y;
                x = Math.min(
                    Math.max(x, plot.xscale(data[i][0])),
                    plot.xscale(data[i+2][0]));
                d[0] = plot.xscale.invert(x);
                d[1] = plot.yscale.invert(y);
                d3.select(this).attr('cx', x).attr('cy', y);

                var path = plot.graph.selectAll('path.' + klass)
                    .data([data])
                    .attr('d', function(d) {return plot.line(d);});
            })
            .on('dragend', function(d) {
                d3.select(this).classed('dragging', false);
            });
        var controls = this.graph.selectAll('circle.control')
            .data(data)
            .enter()
            .append('circle')
            .filter(function(d) {
                var xlim = plot.xscale.domain();
                return d[0] > xlim[0] && d[0] < xlim[1];
            })
            .attr('class', klass + ' control')
            .attr('cx', function(d) {return plot.xscale(d[0]);})
            .attr('cy', function(d) {return plot.yscale(d[1]);})
            .call(dragListener);
    }
    return path;
}

function getIntersection(c1, c2) {
    // pretty fast code to find the intersection between two SVG paths
    c1 = c1.node();
    c2 = c2.node();
    var p1 = c1.getPointAtLength(0), p2 = c2.getPointAtLength(0);
    var oldp1 = p1, oldp2 = p2;
    var i = 0, j = 0;
    for(var x = 0; x < WIDTH; x += 10) {
        while(p1.x < x)
            p1 = c1.getPointAtLength(++i);
        while(p2.x < x)
            p2 = c2.getPointAtLength(++j);
        if(Math.sign(p1.y-p2.y) != Math.sign(oldp1.y-oldp2.y))
            return {x:(p1.x+p2.x+oldp1.x+oldp2.x)/4,
                    y:(p1.y+p2.y+oldp1.y+oldp2.y)/4};
        oldp1 = p1;
        oldp2 = p2;
    }
    return null;
}

Dynplot.prototype.addIntersection = function(c1, c2) {
    var pt = getIntersection(c1, c2);
    if(pt != null)
        this.graph.append('circle')
            .attr('class', 'intersection')
            .attr('cx', pt.x)
            .attr('cy', pt.y)
            .attr('r', 6);
}
