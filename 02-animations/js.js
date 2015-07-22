var data = dataset || [],
    svgW = 900,
    svgH = 500,
    svg = d3.select('#svg')
        .attr('width', svgW)
        .attr('height', svgH),
    scaleX = d3.scale.linear().domain([1990, 2015]).range([10, 890]),
    scaleY = d3.scale.linear().domain([0, 1]).range([10, 490]),
    btn = document.getElementById('btn');

// Add some circles to canvas (see 01-basic if this makes no sense).
var circles = svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('cx', d => scaleX(d.year))
    .attr('cy', d => svgH - scaleY(d.perc))
    .attr('r', 10)
    .attr('fill', 'red');

var dropCircles = () => {
    // Modify our scale to have a different rage.
    var newScaleY = scaleY.range([10, 200]);

    d3.selectAll('circle')
        .transition()
        .duration(1000)
        .delay(d => d.perc * 500)                   // Don't start at the same time
        .attr('cy', d => svgH - newScaleY(d.perc))  // Apply new scale
        .attr('fill', 'green');                     // And change color

    // Note: Since the data points are not sorted, the animation will happen in
    // random order.
};

btn.addEventListener('click', dropCircles, false);

