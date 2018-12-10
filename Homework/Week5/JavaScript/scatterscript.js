/*
name: Thomas Hoedeman
student number: 10318070
*/
window.onload = function(){

    // Title head
    d3.select("head").append("title").text("Scatter");

    // links to data
    var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015";
    var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015";
    var requests = [d3.json(womenInScience), d3.json(consConf)];

    Promise.all(requests).then(function(response) {

        // transform API response
        var t_data = [];
        for(i = 0; i < response.length; i++){
            t_data.push(transformResponse(response[i]));
        }

        // load data in correct format for plotting
        var data = loadData(t_data);

        // plot initial scatterplot
        makeScatterPlot(data, "2007");

    }).catch(function(e){
        throw(e);
    });

    // footer
    d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070");
    d3.select("footer").append("source").attr("id", "source").text("Source: \n");
    d3.select("#source").append("a").attr("href", "https://data.oecd.org/").html("OECD");
    d3.select("footer").append("p").text("");


function makeScatterPlot(data_in, year){

    // Get years and data for one year
    years = [];
    for(key in data_in){
        years.push(key);
    }
    var data = data_in[year];

    // Get data in arrays
    x_data = [];
    y_data = [];
    countries = [];
    data.forEach(function(dat){
        x_data.push(dat[0]);
        y_data.push(dat[1]);
        countries.push(dat[2]);
    })

    // set margins, source for margin idea: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    var margin = {top: 50, right: 20, bottom: 50, left: 40},
        w = 800 - margin.left - margin.right,
        h = 600 - margin.top - margin.bottom;

    // color from http://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=6
    var colors = ['#b2182b','#ef8a62','#fddbc7','#d1e5f0','#67a9cf','#2166ac'];

    // make svg
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add title
    title = "Women in science vs consumer confidence (" + year +")"
    svg.append("text")
        .attr("class", "title")
        .text(title)
        .attr("x", w/2)
        .attr("y", -margin.top/2)
        .attr("font-family", "sans-serif").attr("font-weight","bold").attr("font-size", "22px").attr("fill", "black").attr("text-anchor", "middle");

    // scales
    scales = get_scales(data);
    xscale = scales[0];
    yscale = scales[1];

    // tip
    tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {return "<span style='color:white' 'fontsize:150px'>" + "Consumer confidence index (CGI): "+ d[0] + ",<br> Women in science: " + Math.round(d[1]) + "%" + ",<br>Country: " + d[2]+ "</span>";});
    svg.call(tip);


    // draw circles
    i = 0
    svg.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr('class', 'dot')
         .attr("cx", function(d) {return xscale(d[0]);})
         .attr("cy", function(d) {return yscale(d[1]);})
         .attr("r", 10)
         .style("stroke", "black")
         .attr("fill", function(d) {
             out =  colors[i]
             i += 1
             return out
         })
         .on('mouseover', tip.show)
         .on('mouseout', tip.hide);

    // axis
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yscale));

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xscale))
        .attr("font-family", "sans-serif").attr("font-size", "10px").attr("text-anchor", "middle");

    // labels
    svg.append("text")
        .text("women in science (%)")
        .attr("y", -margin.left/1.5)
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90)");

    svg.append("text")
        .text("Consumer confidence index (CGI)")
        .attr("y", h + margin.bottom -  margin.bottom / 4)
        .attr("x", w / 2 )
        .style("text-anchor", "middle");

    // legend scale
    var ordinal = d3.scaleOrdinal()
    .domain(countries)
    .range(colors);

    // code found on https://d3-legend.susielu.com/#color-ordinal
    svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(20,20)");


    var legendOrdinal = d3.legendColor()

    //d3 symbol creates a path-string,
    .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
    .shapePadding(10)

    //use cellFilter to hide the "e" cell
    .cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);

    svg.select(".legendOrdinal")
    .call(legendOrdinal);

    // interactive menu
    d3.select('#x-axis-menu')
    .selectAll('li')
    .data(years)
    .enter()
    .append('li')
    .text(function(d) {return d;})
    .on('click', function(d) {
      year = d;
      updateScatter(data_in[year], year)
    });
}

function updateScatter(da, year){

    scales = get_scales(da);
    xscale = scales[0];
    yscale = scales[1];
    margins = margin();

    // new axis
    d3.selectAll("xAxis")
        .transition()
        .duration(1500)
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yscale));

    d3.selectAll("yAxis")
        .transition()
        .duration(1500)
        .attr("transform", "translate(0," + margins[2] + ")")
        .call(d3.axisBottom(xscale))
        .attr("font-family", "sans-serif").attr("font-size", "10px").attr("text-anchor", "middle");

    // new dots
    d3.selectAll('circle')
      .transition()
      .duration(1500)
      .attr("cx", function(d, i) {
          if(i < da.length){
              x = xscale(da[i][0]);
          }
          else{
              x = xscale(0);
          }
          return x;
          ;})
      .attr("cy", function(d, i) {
          if(i < da.length){
              y = yscale(da[i][1]);
          }
          else{
              y = yscale(0);
          }
          return y;
      })
      .attr('r', 10);

      // update title
      title = "Women in science vs consumer confidence (" + year +")";
      d3.select("text").text(title);
}

function margin(){
    var margin = {top: 50, right: 20, bottom: 50, left: 40},
        w = 800 - margin.left - margin.right,
        h = 600 - margin.top - margin.bottom;

    return [margin, w, h];
}

function get_scales(da){

    marg = margin();

    // // Get data in arrays
    x_data = [];
    y_data = [];
    da.forEach(function(dat){
        x_data.push(dat[0]);
        y_data.push(dat[1]);
    });
    // scales
    var yscale = d3.scaleLinear()
        .range([marg[2], 5])
        .domain([Math.min.apply(Math, y_data)* 0.90, Math.max.apply(Math, y_data) * 1.10]);

    var xscale = d3.scaleLinear()
        .range([0, marg[1]])
        .domain([Math.min.apply(Math, x_data) * 0.99, Math.max.apply(Math, x_data) * 1.01]);

    return [xscale, yscale];
}

function loadData(data){

    var patents = {};
    data[1].forEach(function(dat){
        patents[dat.Country] = [];
    });

    // dict with data for each year
    var data_select = {};
    data[1].forEach(function(dat){
        data_select[dat.time] = [];
    });

    var consumers = JSON.parse(JSON.stringify(data_select));

    // import datapoints
    data.forEach(function(dat, idx){
        dat.forEach(function(d, id){
            if(Object.keys(d)[0] == "MSTI Variables"){
                data_select[d.time].push([d.datapoint, d.Country]);
            }
            else if(Object.keys(d)[1] == "Indicator"){
                consumers[d.time].push(d.datapoint);
            }
            else if(idx == 2 && d["Partner Country"] == "Total co-operation with abroad" && Object.keys(patents).includes(d.Country))
            {
                patents[d.Country].push(d.datapoint);
            }
        });
    });

    for(key in consumers){
        consumers[key].forEach(function(dat, idx){
            if(data_select[key][idx]!= undefined){
                data_select[key][idx].unshift(dat);
            }
        });
    };
    return data_select;
}

function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;
    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){
                // set up temporary object
                let tempObj = {};
                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });
    // return the finished product!
    return dataArray;
}
}
