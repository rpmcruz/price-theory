// (C) 2016 Ricardo Cruz

function DynGraph(container, xlim, ylim, margins) {
    const MARGINS = {top:10, left:40, bottom:40, right:15};
    if(!margins)
        margins = MARGINS;
    this.width = container.attr('width') - margins.left - margins.right;
    this.height = container.attr('height') - margins.top - margins.bottom;

    this.xscale = d3.scaleLinear().domain(xlim).range([0, this.width]);
    this.yscale = d3.scaleLinear().domain(ylim).range([this.height, 0]);

    this.container = container;
    this.graph = container
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
}
DynGraph.prototype.xaxis = function(title) {
    this.graph
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + this.width + ')')
        .call(d3.axisBottom(this.xscale));
    if(title)
        this.graph.append('text')
            .attr('class', 'x title')
            .attr('alignment-baseline', 'text-before-edge')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(' + (this.width/2) + ',' + (this.height+22) + ')')
            .text(title);
    return this;
};
DynGraph.prototype.yaxis = function(title) {
    this.graph.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(this.yscale));
    if(title)
        this.graph.append('text')
            .attr('class', 'y title')
            .attr('alignment-baseline', 'text-after-edge')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(-20,' + (this.height/2) + ') rotate(-90)')
            .text(title);
    return this;
};

function DynPlot(graph, pts) {
    this.graph = graph;
    var line = d3.line()
        .x(function(d) {return graph.xscale(d[0]);})
        .y(function(d) {return graph.yscale(d[1]);});
    this.path = graph.graph
        .append('path')
        .data([pts])
        .attr('class', 'plot')
        .attr('d', line);
}

function DynScatter(graph, pts) {
    this.graph = graph;
    this.pts = graph.graph
        .append('circle')
        .data([pts])
        .attr('class', 'scatter')
        .attr('r', 5)
        .attr('cx', function(d) { return graph.xscale(d[0]); })
        .attr('cy', function(d) { return graph.yscale(d[1]); });
}
DynScatter.prototype.reset = function(pts) {
    var graph = this.graph;
    this.pts
        .data([pts])
        .transition()
        .attr('cx', function(d) { return graph.xscale(d[0]); })
        .attr('cy', function(d) { return graph.yscale(d[1]); });
    return this;
};
