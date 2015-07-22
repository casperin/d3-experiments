// Make sure we have a dataset of some sort (created in index.html)
var dataset = dataset || [],

    // Constants
    svgW    = 900,
    svgH    = 500,
    basePadding = 50,
    padding = {
        left:   basePadding * 2,
        right:  basePadding * 4,  // Extra padding to the right to allow for labels
        top:    basePadding,
        bottom: basePadding
    },

    // x and y-coordinates of the x-bounds on our canvas that we can operate within.
    xRange = [
        padding.left,           // x-min
        svgW - padding.right    // x-max
    ],
    yRange = [
        svgH - padding.bottom,  // y-min
        padding.top             // y-max
    ],
    // radius bounds (for circle radius)
    radiusRange = [2, 30],
    // color bounds (rgb min and max)
    colorRange = [0, 255],

    // Apply width and height to our svg canvas and assign it to `svg` for
    // later use.
    svg = d3.select('#svg')
        .attr('width', svgW)
        .attr('height', svgH),

    // Helper function to get the max property
    getMax = prop => d3.max(dataset, (d) => d[prop]),

    // We need to scale our input data (domain) to fit our canvas (range). We
    // use .rangeRound() to round off decimals (avoids anti aliasing).
    scaleX = d3.scale.linear().domain([0, getMax('x')]).rangeRound(xRange),
    scaleY = d3.scale.linear().domain([0, getMax('y')]).rangeRound(yRange),
    scaleR = d3.scale.linear().domain([0, getMax('r')]).rangeRound(radiusRange);
    scaleS = d3.scale.linear().domain([0, getMax('s')]).rangeRound(colorRange),

    formatPoint = d3.format(".1%"); // formatPoint(.1234) => "12.3%"



/**
 * Creating and adding circles.
 */
svg
    .selectAll('circle')                // We select them, even if they are not there (yet)
    .data(dataset)                      // Feed the dataset
    .enter()                            // Let d3 create an element for each data point
    .append('circle')                   // Append them to our canvas
    .attr('class', 'circle')            // Add class 'circle'
    .attr('cx',     d => scaleX(d.x))   // Position x
    .attr('cy',     d => scaleY(d.y))   // Position y
    .attr('r',      d => scaleR(d.r))   // Apply radius
    .attr('fill',   d => 'rgba(' + scaleS(d.s) + ', 0, 0,  1)');    // Apply color



/**
 * Creating and adding labels, using more or less the same technique.
 */

// Simple helper function to create the text that we wish to display in our labels.
var createLabel = d => '[' + formatPoint(d.x) + ', ' +
                             formatPoint(d.y) + ', ' +
                             formatPoint(d.r) + ', ' +
                             formatPoint(d.s) + ']';
svg
    .selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(createLabel)
    .attr('class', 'label')
    .attr('x', d => scaleX(d.x))        // Position label
    .attr('y', d => scaleY(d.y) - scaleR(d.r) - 2); // -2 to move it up two px



/**
 * Creating and adding axes.
 */

// Axes are mostly created and drawn by d3.
var xAxis = d3.svg.axis().scale(scaleX).ticks(10).tickFormat(formatPoint).orient('bottom'),
    yAxis = d3.svg.axis().scale(scaleY).ticks(10).tickFormat(formatPoint).orient('left');

// x-axis
svg
    .append('g')                    // Make group that will contain x-axis values and ticks
    .attr('class', 'axis x-axis')   // Give group a class (each tick will have .tick)
    .attr('transform', 'translate(0,' + (svgH - padding.bottom) + ')')  // Move it to bottom of our canvas
    .call(xAxis);                   // Create the axis

// y-axis
svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', 'translate(' + padding.left + ', 0)')
    .call(yAxis);

