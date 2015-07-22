var data = dataset || [],
    svgW = 900,
    svgH = 500,
    svg = d3.select('#svg')
        .attr('width', svgW)
        .attr('height', svgH),
    scaleX = d3.scale.linear().domain([1990, 2015]).range([10, 890]),
    scaleY = d3.scale.linear().domain([0, 1]).range([10, 490]),
    scaleY2 = d3.scale.linear().domain([0, 1]).range([10, 700]),    // used in animation
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

var jump = () => {
    d3.selectAll('circle')
        .transition()
        .duration(300)
        .delay(d => d.perc * 200)                   // Start with lowest first
        .attr('cy', d => svgH - scaleY2(d.perc))    // Apply new scale
        .attr('fill', 'green')                      // And change color
        .each('end', function () {                  // When animation ends...
            d3.select(this)                         // Find "this" circle...
                .transition()
                .duration(300)
                .attr('cy', d => svgH - scaleY(d.perc)) // Apply old scale
                .attr('fill', 'red')                    // And change color back
        });
};

btn.addEventListener('click', jump, false);

