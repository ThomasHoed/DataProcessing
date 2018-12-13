/*
name: Thomas Hoedeman
student number: 10318070
source World Hapiness Report: https://www.kaggle.com/unsdsn/world-happiness#2016.csv
source Happy Planet Index: happyplanetindex.org/s/hpi-data-2016.xlsx
Data edited for the purpose of this assigment
*/
window.onload = function(){

    // Title head
    d3.select("head").append("title").text("Happiness");

    // footer
    d3.select("html").append("footer").append("p").text("Thomas Hoedeman, 10318070");
    d3.select("footer").append("source").attr("id", "source").text("Sources:");
    d3.select("#source").append("a").attr("href", "https://www.kaggle.com/unsdsn/world-happiness#2016.csv").html("<br>World Happiness Report<br>");
    d3.select("#source").append("a").attr("href", "http://happyplanetindex.org/countries").html("Happy Planet Index<br>");

    dataLocation = "Data/Combination_hpi-data-2016_%26_worldhappiness2016.json"
    // dataLocation = "https://raw.githubusercontent.com/ThomasHoed/DataProcessing/master/Homework/Week6/Data/Combination_hpi-data-2016_%26_worldhappiness2016.json"
    d3.json(dataLocation).then(function(data) {
        makeScatterPlot(data)
    })

    function getScatterData(data, factor1, factor2){

        var countries = Object.keys(data);
        var scatterData = [];
        countries.forEach(function(country){
            let array = [];
            array.push(data[country][factor1]);
            array.push(data[country][factor2]);
            array.push(country);
            array.push(data[country]["Population"].replace(/,/g, ''));
            array.push(data[country]["Region"]);
            array.push(factor1);
            array.push(factor2);

            scatterData.push(array)
            delete array;
        });
        return scatterData
    }

    function getPieData(data){

        output = {};
        var names = ["Economy", "Family", "Life Expectancy", "Freedom", "Government Corruption", "Generosity", "Dystopia Residual","Happiness Score", "Happiness Rank"];
        var values = [];
        for(i = 0; i < names.length; i++){

            values.push(data[names[i]]);
        }
        output["values"] = values
        output["names"] = names

        return output
    }

    function makePieChart(data, country){

        var country_data = data[country];
        //  source: https://bl.ocks.org/adamjanes/53eedf0b915fd8b20f04fd08bc24ff00  & https://github.com/kthotav/D3Visualizations/blob/master/Pie_Charts/js/pie.js

        var margin =  {top: 50, bottom: 50, left: 50, right: 50 }
        var width = 560,
            height = 280,
            radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
            .range(['#b35806','#f1a340','#fee0b6','#d8daeb','#998ec3','#542788']);

        var pie = d3.pie()
            .value(function(d) { return d; })
            .sort(null);


        var arc = d3.arc()
            .innerRadius(radius - 50)
            .outerRadius(radius - 10);

        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);


        var svgPie = d3.select("#piechart").append("svg")
            .attr("width", width +  margin.left + margin.right)
            .attr("height", height +  margin.top + margin.bottom )
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var all_data = getPieData(country_data)

        var piedata =  all_data.values.slice(0,6)
        var pieLabels =  all_data.names.slice(0,6)

        var path = svgPie.datum(piedata).selectAll("path")
                .data(pie)
                .attr("class", "pie")
                .enter().append("path")
                .style("stroke", "black")
                .attr("fill", function(d, i) { return color(i); })
                .attr("d", arc)
                .each(function(d) { this._current = d; })
                .on("mouseover", function(d, i){
                    svgPie.selectAll('text').html(function(){
                        return  all_data.names[i] + ': ' + Math.round(all_data.values[i]*100)/100;
                        });
                })
                .on("mouseout", function(d, i){svgPie.selectAll('text').html(country)});

        svgPie.append("text")
            .attr("transform", function(d) {
            var _d = arc.centroid(d);
            _d[0] *= 1.5;	//multiply by a constant factor
            _d[1] *= 1.5;	//multiply by a constant factor
            return "translate(" + _d + ")";
            })
            .attr("dy", ".50em")
            .attr("stroke-width", 15)
            .style("text-anchor", "middle")
            .html(country);
    }

    function updatePie(data, country){
        var country_data = data[country];
        var all_data = getPieData(country_data)
        var piedata =  all_data.values.slice(0,6)
        var pieLabels =  all_data.names.slice(0,6)
        console.log(pie);
        var pie = d3.pie()
            .value(function(d) { return d; })
            .sort(null);

        d3.selectAll('#piechart').selectAll('g').datum(piedata).selectAll("path").data(pie);
        log

    }

    function makeScatterPlot(input_data){
        country = "Netherlands"
        makePieChart(input_data, country)

        factor1 = "Happiness Score"
        factor2 = "Happy Planet Index"
        var data = getScatterData(input_data, factor1, factor2)
        var margin = getMargins()

        var svg = d3.select("#scatterplot")
            .append("svg")
            .attr("class", "scatterPlot")
            .attr("width", margin.w + margin.left + margin.right)
            .attr("height", margin.h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        scales = makeScales(data);
        xScale = scales[0];
        yScale = scales[1];
        popScale = scales[2];

        coords = regressionCoords(data, svg, xScale, yScale);

        svg.append('line')
            .attr('id', 'regressionline')
            .attr('x1', function(d) { return xScale(coords[0][0]); })
            .attr('y1', function(d) { return yScale(coords[1][0]); })
            .attr('x2', function(d) { return xScale(coords[0][1]); })
            .attr('y2', function(d) { return yScale(coords[1][1]); })
            .attr('stroke', 'red')
            .style("stroke", "red")
            .style('opacity', .90)
            .attr('stroke-width', 5)

        drawDots(data, svg, xScale, yScale, popScale, input_data, factor1, factor2);

        makeAxis(xScale, yScale, margin, svg, data[1]);

        legendOrdinal = makeLegend(data, svg, margin);
        svg.select(".legendOrdinal")
        .call(legendOrdinal);

        title = "How does happiness relate to socio-economic factors?"
        addTitle(svg, margin, title)

        // headers = getHeaders(input_data)
        makeMenu(input_data, svg)
    }

    function makeScales(data){
        var margin = getMargins();

        // // Get data in arrays
        let xData = [];
        let yData = [];
        let popData = [];
        data.forEach(function(country){
            xData.push(country[0]);
            yData.push(country[1]);
            popData.push(country[3]);
        });
        // scales
        console.log(xData);

        var yScale = d3.scaleLinear()
            .range([margin.h - margin.bottom, margin.top])
            .domain([Math.min.apply(Math, yData)* 0.95, Math.max.apply(Math, yData) * 1.05]);

        var xScale = d3.scaleLinear()
            .range([margin.left, margin.w -  margin.right])
            .domain([Math.min.apply(Math, xData) * 0.95, Math.max.apply(Math, xData) * 1.05]);

        var popScale = d3.scaleLinear()
            .range([4, 20])
            .domain([Math.min.apply(Math, popData), Math.max.apply(Math, popData)/10]);

        return [xScale, yScale, popScale];
    }

    function makeColorMapping(data){
        //  source colors: http://colorbrewer2.org/#type=diverging&scheme=BrBG&n=10
        let colors =  ['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#c7eae5','#80cdc1','#35978f','#01665e','#003c30'];

        //  get regions
        let regions = new Set();
        data.forEach(function(country){
            regions.add(country[4])
        })
        let colorMapping = {};
        let i = 0;
        regions.forEach(function(region){
            colorMapping[region] = colors[i];
            i += 1;
        });

        return colorMapping;

    }

    function getMargins(){
        var margins = {top: 40, right: 150, bottom: 40, left: 60};
        margins.w = 900;
        margins.h = 590;
        margins.r = Math.min(margins.w, margins.h) / 2;
        return margins
    }

    function drawDots(data, svg, xScale, yScale, popScale, input_data){
        //  source colors: http://colorbrewer2.org/#type=diverging&scheme=BrBG&n=10
        var colorMapping = makeColorMapping(data);
        tip = makeTip(factor1, factor2);
        svg.call(tip)

        svg.selectAll("circle")
             .data(data)
             .enter()
             .append("circle")
             .attr('class', 'dot')
             .attr("cx", function(d) {return xScale(d[0]);})
             .attr("cy", function(d) {return yScale(d[1]);})
             .attr("r", function(d)  {
                 let size = popScale(d[3])
                 if(size > 18){
                     size = 18
                 }
                 return size
             })
             .style("stroke", "black")
             .attr("fill", function(d) {
                 return colorMapping[d[4]]
             })
             .on('mouseover', tip.show)
             .on('mouseout', tip.hide)
             .on('click', function(d){
                 updatePie(input_data, d[2])
             });
    }

    function makeTip(title){
        // source: http://bl.ocks.org/Caged/6476579
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .attr('id', "tooltip")
            .offset([-10, 0])
            .html(function(d) {
                return "<span style='color:white'>" + "Country: " + d[2] + "<br>Population: " + Math.round(d[3]/100000)/10 + " Million"+ "<br>"+ d[5]+ ": " + d[0]+ " || " + d[6] + ": " + Math.round(d[1]*100)/100 + " </span>";});

        return tip
    }

    function makeAxis(xScale, yScale, margin, svg, data){
        // y
        svg.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate("+(margin.left -5)+", 0)")
            .attr("stroke-width", 2)
            .call(d3.axisLeft(yScale))
            .attr("font-family", "sans-serif").attr("font-size", "12px");

        // ylabel
        svg.append("text")
            .attr("class", "yLabel")
            .text(data[6])
            .attr("y", margin.top - 10)
            .attr("x", margin.left)
            .style("text-anchor", "middle")
            // .attr("transform", "rotate(-90)");

        // x
        svg.append("g")
            .attr("class", "xAxis")
            .attr("stroke-width", 2)
            .attr("transform", "translate("+ 0 + "," + (margin.h - margin.bottom) + ")")
            .call(d3.axisBottom(xScale))
            .attr("font-family", "sans-serif").attr("font-size", "12px").attr("text-anchor", "middle");

        // xlabel
        svg.append("text")
            .text(data[5])
            .attr("y", margin.h)
            .attr("x", (margin.w - margin.left - margin.right)/2)
            .style("text-anchor", "start");

    }

    function makeLegend(data, svg, margin){

        let colorMapping = makeColorMapping(data);
        let regions = Object.keys(colorMapping);
        let colors = Object.values(colorMapping);
        // legend scale
        var ordinal = d3.scaleOrdinal()
        .domain(regions)
        .range(colors);

        // code found on https://d3-legend.susielu.com/#color-ordinal
        svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("font-size", "12px")
        .attr("transform", "translate("+ (margin.w -  margin.right) +","+ margin.top +")");


        var legendOrdinal = d3.legendColor()

        //d3 symbol creates a path-string,
        .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
        .shapePadding(2)

        //use cellFilter to hide the "e" cell
        .cellFilter(function(d){ return d.label !== "e" })
        .scale(ordinal);

        return legendOrdinal
    }

    function addTitle(svg, margin, title){
        svg.append("text")
            .attr("class", "title")
            .text(title)
            .attr("x", margin.w/2)
            .attr("y", 0)
            .attr("font-family", "sans-serif").attr("font-weight","bold").attr("font-size", "22px").attr("fill", "black").attr("text-anchor", "middle");

    }

    function regressionCoords(data, svg, xScale, yScale){
        // // Get data in arrays
        let values_x = [];
        let values_y = [];
        data.forEach(function(country){
            values_x.push(Number(country[0]));
            values_y.push(Number(country[1]));
        });

        // following part of code is adapted from https://dracoblue.net/dev/linear-least-squares-in-javascript/
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var count = 0;

        /*
         * We'll use those variables for faster read/write access.
         */
        var x = 0;
        var y = 0;
        var values_length = values_x.length;

        if (values_length != values_y.length) {
            throw new Error('The parameters values_x and values_y need to have same size!');
        }

        /*
         * Nothing to do.
         */
        if (values_length === 0) {
            return [ [], [] ];
        }

        /*
         * Calculate the sum for each of the parts necessary.
         */
        for (var v = 0; v < values_length; v++) {
            x = values_x[v];
            y = values_y[v];
            sum_x += x;
            sum_y += y;
            sum_xx += x*x;
            sum_xy += x*y;
            count++;
        }

        /*
         * Calculate m and b for the formular:
         * y = x * m + b
         */
        var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
        var b = (sum_y/count) - (m*sum_x)/count;

        /*
         * We will make the x and y result line now
         */
        var result_values_x = [];
        var result_values_y = [];

        for (var v = 0; v < values_length; v++) {
            x = values_x[v];
            y = x * m + b;
            result_values_x.push(x);
            result_values_y.push(y);
        }

        // console.log(result_values_x);
        // console.log(result_values_y);

        var x_min = Math.min.apply(Math, result_values_x)
        var x_max = Math.max.apply(Math, result_values_x)
        var x_min_index = result_values_x.indexOf(x_min)
        var x_max_index = result_values_x.indexOf(x_max)

        var x = [x_min, x_max];
        var y = [result_values_y[x_min_index], result_values_y[x_max_index]];

        return [x, y]
    }

    function makeMenu(data, svg){
        headers =  Object.keys(data["Netherlands"]);
        for(i = headers.length - 1; i >= 0; i--){
            if (headers[i] == "Happiness Rank" || headers[i] == "Happiness Score" || headers[i] == "Region" || headers[i] == "GDP"){
                headers.splice(i, 1);
            }
        }
        d3.select('#x-axis-menu')
        .selectAll('li')
        .data(headers)
        .enter()
        .append('li')
        .text(function(d) {return d;})
        .on('click', function(d) {
            factor1 = "Happiness Score"
            factor2 = d;
            new_data = getScatterData(data, factor1, factor2);
            updateScatter(new_data, factor2, svg)
        });
    }

    function updateScatter(dat, title, svg){
        let scales = makeScales(dat);
        let xScale = scales[0];
        let yScale = scales[1];
        let popScales = scales[2]
        let margin = getMargins();

        d3.selectAll(".yLabel")
            .transition()
            .duration(1500)
            .text(title)

        d3.selectAll(".yAxis")
            .transition()
            .duration(1500)
            .call(d3.axisLeft(yScale));

        let coords = regressionCoords(dat, svg, xScale, yScale)

        svg.selectAll("#regressionline")
            .transition()
            .duration(1500)
            .attr('x1', function(d) { return xScale(coords[0][0]); })
            .attr('y1', function(d) {
                if(yScale(coords[1][0]) > yScale(0)){
                    return yScale(0)
                }
                return yScale(coords[1][0]); })
            .attr('x2', function(d) { return xScale(coords[0][1]); })
            .attr('y2', function(d) { return yScale(coords[1][1]); });

        // new dots
        d3.selectAll('circle')
          .data(dat)
          .transition()
          .duration(1500)
          .attr("cx", function(d, i) {return xScale(dat[i][0]);})
          .attr("cy", function(d, i) {return yScale(dat[i][1]);});

    }


}
