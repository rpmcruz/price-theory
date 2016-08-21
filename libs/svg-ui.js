// (C) 2016 Ricardo Cruz

/* Background organizing things using the center as the focal point */

function Background() {
    var svg = d3.select('svg');
    var back = svg
        .append('g')
        .attr('transform', 'translate(' + (svg.attr('width')/2) + ',' + (svg.attr('height')/2) + ')');
    this.widget = back;
}

/* A simple SVG button based on Bootstrap's look */

function SvgButton(parent, size)
{
    var btn = parent
        .append('g')
        .attr('class', 'btn');
    btn
        .on('mousedown', function() {btn.classed('pressed', true);})
        .on('mouseout', function() {btn.classed('pressed', false);})
        .on('mouseup', function() {btn.classed('pressed', false);});

    btn.append('rect')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', size[0])
        .attr('height', size[1]);
    btn.append('text')
        .attr('x', size[0]/2)
        .attr('y', size[1]/2);
    this.widget = btn;
    this.size = size;
}
SvgButton.prototype.text = function(text) {
    this.widget.select('text').text(text);
    return this;
};
SvgButton.prototype.pos = function(x, y) {
    this.widget.attr('transform', 'translate(' + (x-this.size[0]/2) + ',' + (y-this.size[1]/2) + ')');
    return this;
};
