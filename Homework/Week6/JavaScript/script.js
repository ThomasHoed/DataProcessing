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

            delete array;

            scatterData.push(array)
        });
        return scatterData
    }

    function makeScatterPlot(input_data){

        factor1 = "Happy Planet Index"
        factor2 = "Happiness Score"
        var data = getScatterData(input_data, factor1, factor2)

        var margin = getMargins()

        var svg = d3.select("body")
            .append("svg")
            .attr("width", margin.w + margin.left + margin.right)
            .attr("height", margin.h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        scales = makeScales(data);
        xScale = scales[0];
        yScale = scales[1];
        popScale = scales[2];

        plotRegressionLine(data, svg, xScale, yScale);

        drawDots(data, svg, xScale, yScale, popScale);

        makeAxis(xScale, yScale, margin, svg);

        legendOrdinal = makeLegend(data, svg, margin);
        svg.select(".legendOrdinal")
        .call(legendOrdinal);

        title = "Are happy people making the planet happy?"
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
        var yScale = d3.scaleLinear()
            .range([margin.h, 5])
            .domain([Math.round(Math.min.apply(Math, yData)* 0.95), Math.round(Math.max.apply(Math, yData) * 1.05)]);

        var xScale = d3.scaleLinear()
            .range([0, margin.w])
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
        var margins = {top: 50, right: 500, bottom: 50, left: 100};
        margins.w = 1100 - margins.left - margins.right;
        margins.h = 650 - margins.top - margins.bottom;
        return margins
    }

    function drawDots(data, svg, xScale, yScale, popScale){
        //  source colors: http://colorbrewer2.org/#type=diverging&scheme=BrBG&n=10
        var colorMapping = makeColorMapping(data);

        tip = makeTip();
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
             .on('mouseout', tip.hide);
    }

    function makeTip(){
        // source: http://bl.ocks.org/Caged/6476579
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {return "<span style='color:white'>" + "Country: " + d[2] + "<br>Population: " + Math.round(d[3]/100000)/10 + " Million"+ "<br>HPI: "+ d[0]+ " ||  Hapiness: " + Math.round(d[1]*100)/100 + " </span>";});

        return tip
    }

    function makeAxis(xScale, yScale, margin, svg){
        // y
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(-5, 0)")
            .attr("stroke-width", 2)
            .attr("y", 0)
            .call(d3.axisLeft(yScale))
            .attr("font-family", "sans-serif").attr("font-size", "12px");

        // ylabel
        svg.append("text")
            .text("Happiness score")
            .attr("y", -margin.left/2)
            .style("text-anchor", "end")
            .attr("transform", "rotate(-90)");

        // x
        svg.append("g")
            .attr("class", "yAxis")
            .attr("stroke-width", 2)
            .attr("transform", "translate(0," +  (margin.h +5)+ ")")
            .call(d3.axisBottom(xScale))
            .attr("font-family", "sans-serif").attr("font-size", "12px").attr("text-anchor", "middle");

        // xlabel
        svg.append("text")
            .text("Happy Planet Index")
            .attr("y", margin.h + margin.bottom -  margin.bottom / 4)
            .attr("x", margin.w / 2 )
            .style("text-anchor", "middle");

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
        .attr("transform", "translate("+ margin.w +",20)");


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

    function plotRegressionLine(data, svg, xScale, yScale){
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

        // plot line
        svg.append('line')
             .attr('id', 'trendline')
             .attr('x1', function(d) { return xScale(Math.min.apply(Math, result_values_x)); })
             .attr('y1', function(d) { return yScale(Math.min.apply(Math, result_values_y)); })
             .attr('x2', function(d) { return xScale(Math.max.apply(Math, result_values_x)); })
             .attr('y2', function(d) { return yScale(Math.max.apply(Math, result_values_y)); })
             .attr('stroke', 'red')
             .style('opacity', .55)
             .attr('stroke-width', 4.5);

    }

    function makeMenu(data, svg){
        headers =  Object.keys(data["Netherlands"]);
        for(i = headers.length - 1; i >= 0; i--){
            if (headers[i] == "Happy Planet Index" || headers[i] == "HPI Index" || headers[i] == "HPI Rank" || headers[i] == "Region"){
                headers.splice(i, 1);
            }
        }

        console.log(headers);
        d3.select('#x-axis-menu')
        .selectAll('li')
        .data(headers)
        .enter()
        .append('li')
        .text(function(d) {return d;})
        .on('click', function(d) {
            factor1 = "Happy Planet Index"
            factor2 = d;
            new_data = getScatterData(data, factor1, factor2);
            updateScatter(new_data, factor2, svg)
        });
    }

    function updateScatter(dat, title, svg){
        scales = makeScales(dat);
        xScale = scales[0];
        yScale = scales[1];
        popScales = scales[2]
        margin = getMargins();
        console.log(dat[0]);



        d3.selectAll("yAxis")
            .transition()
            .duration(1500)
            .attr("transform", "translate(0," + margin.h + ")")
            .call(d3.axisLeft(yScale))
            .attr("font-family", "sans-serif").attr("font-size", "10px").attr("text-anchor", "middle");

        // new dots
        d3.selectAll('circle')
          .transition()
          .duration(1500)
          .attr("cx", function(d, i) {return xScale(dat[i][0]);})
          .attr("cy", function(d, i) {return yScale(dat[i][1]);})
          .attr("r", function(d, i)  {
              let size = popScale(dat[i][3])
              if(size > 18){
                  size = 18
              }
              return size
          })

    }


}
