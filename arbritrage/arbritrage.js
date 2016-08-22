d3.select('#description').html(database[0].description);
var levels = d3.select('#levels')
    .selectAll('span')
    .data(d3.range(3, 7))
    .enter()
    .append('span');
levels
    .append('input')
    .attr('type', 'radio')
    .attr('name', 'level')
    .attr('id', function(d) {return 'radio' + d;})
    .on('click', reset);
levels
    .append('label')
    .attr('for', function(d) {return 'radio' + d;})
    .text(function(d) {return d;});
d3.select('#radio4').attr('checked', true);

var back = appendBack(d3.select('svg'));
var goods, prices, nodes, Q, active;

function reset(ngoods) {
    goods = ngoods;
    back.selectAll('*').remove();

    // draw arcs

    prices = initPrices(goods);
    for(var i = 0; i < goods; i++)
        for(var j = 0; j < goods; j++) {
            if(i == j) continue;

            var pos1 = nodePos(i);
            var pos2 = nodePos(j);
            var unit = pos1.sub(pos2).normalize();

            // arrow
            if(i < j) {
                // find control point for a nice smooth curve
                var avg = pos1.add(pos2).mult(0.5);
                var ortho = unit.ortho();
                var control = avg;  // line
                if(i == j-1 || (j+1)%goods == i) {
                    if((j+1)%goods == i)
                        ortho = ortho.mult(-1);
                    control = avg.sub(ortho.mult(30));
                }

                var path = d3.path();
                path.moveTo(pos1[0], pos1[1]);
                path.quadraticCurveTo(control[0], control[1], pos2[0], pos2[1]);
                back
                    .append('path')
                    .style('stroke', 'gray')
                    .style('fill', 'none')
                    .attr('d', path);
            }
            // text
            var p = pos1.add(unit.mult([-50-25, -30-25]));
            //p = p.add(ortho.mult(10));
            back
                .append('text')
                .style('fill', 'black')
                .style('font-size', '80%')
                .text(prices[j][i])
                .attr('x', p[0])
                .attr('y', p[1]);
        }

    // draw nodes

    nodes = Array(goods);
    for(var i = 0; i < goods; i++) {
        var pos = nodePos(i);

        var btn = new SvgButton(back, [100, 40])
            .pos(pos[0], pos[1])
            .text(database[0].goods[i].text);
        if(i == 0)
            btn.widget.classed('gold', true);
        nodes[i] = btn;
    }
    d3.selectAll('.btn').on('click', nodeClicked);

    // dynamics

    Q = Array(goods).fill(0);
    active = 0;
    Q[0] = 100;
    nodes[0].text(Q[0] + ' ' + database[0].goods[0].unit);
    nodes[0].widget.classed('primary', true);
}

function nodePos(i) {
    var angle = (i*2*Math.PI/goods) - (3*Math.PI/4);
    var DIST = 180;
    return [Math.cos(angle)*DIST, Math.sin(angle)*DIST];
}

function setActive(i) {
    if(nodes[i].widget.classed('disabled'))
        return;
    if(i == active)
        return;

    var j = active;
    var P = prices[j][i] / prices[i][j];
    Q[i] = P * Q[j];
    Q[j] = 0;

    nodes[i].text(Q[i].toFixed() + ' ' + database[0].goods[i].unit);
    nodes[j].text(database[0].goods[j].text);
    nodes[i].widget.classed('primary', true);
    nodes[j].widget.classed('primary', false);
    active = i;
}

function nodeClicked(d, i) {
    setActive(i);
}

reset(4);
