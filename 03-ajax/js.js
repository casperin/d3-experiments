const margin = {top: 30, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    svg = d3.select('#svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        // `svg` isn't actually the <svg>, but rather a group inside it that
        // takes the margins into account.
        .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')'),

    // scales. Notice `rangeBoundBands`. The `.01` is the margin between each
    // bar. Also notice that one is ordinal, and the other a range.
    xScale = d3.scale.ordinal().rangeRoundBands([0, width], .01),
    yScale = d3.scale.linear().range([height, 0]),

    xAxis = d3.svg.axis().scale(xScale).orient('bottom'),
    yAxis = d3.svg.axis().scale(yScale).orient('left'),

    // Making sure we are working with numbers.
    type = d => {
        d.value = +d.value;
        return d;
    },

    // Our big callback func that populates the svg with data once it's loaded.
    populate = data => {
        // Ordinal scales take an array of each 'label' on the axis.
        xScale.domain(data.map(d => d.name));
        yScale.domain([0, d3.max(data, d => d.value)]);

        const bar = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'bar')
            .attr('transform', d => 'translate(' + xScale(d.name) + ', 0)');

        bar.append('rect')
            .attr('y', d => yScale(d.value))
            .attr('height', d => height - yScale(d.value))
            .attr('width', xScale.rangeBand());

        bar.append('text')
            .attr('x', xScale.rangeBand() / 2)
            .attr('y', d => yScale(d.value) + 3)
            .attr('dy', '.75em')
            .text(d => d.value);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
                .attr('dy', '-1em')
                .style('text-anchor', 'middle')
                .text('Frequency');
    };

d3.csv('data.csv', type, populate);
