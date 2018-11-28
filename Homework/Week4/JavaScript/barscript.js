/*
name: Thomas Hoedeman
student number: 10318070
barscript
*/


// Title head and body
d3.select("head").append("title").text("Bar chart view");
d3.select("body").append("title").text("My bar chart");


// load .JSON
d3.json("/Data/gezondheid_nederland_2017.json").then(function(data) {

    // parse age information and xlabels from data
    var leeftijd_info = get_leeftijd_info(data)
    var xlabels = get_xlabels(data)

    // selection keys and colors
    var selection_keys = ["Dagelijkse rokers", "Zware drinkers", "Cannabisgebruik afgelopen jaar", "Drugsgebruik afgelopen jaar"]
    var colors = ["#095e5c", "#cea40e", "#2a6818", "#890404"]

    // plot all bar graphs
    for(i = 0; i < selection_keys.length; i++){
        make_bar_graph(leeftijd_info[selection_keys[i]], colors[i], selection_keys[i], xlabels);
    };

    });


function make_bar_graph(data, color, title, xlabels){

    // set margins, for margin idea source: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    var margin = {top: 100, right: 20, bottom: 30, left: 40},
        w = 960 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;
    var barPadding = 2;

    // Make svg
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom);

    // scales
    var yscale = d3.scaleLinear()
        .range([h, 5])
        .domain([0, 30])

    var xscale = d3.scaleBand()
        .domain(xlabels)
        .range([0, w])

    // tip
    tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {return "<span style='color:white' 'fontsize:150px'>" + d + "</span>";});
    svg.call(tip);


    // Make bars
    svg.selectAll("rect")
        .data(data).enter().append("rect")
        .attr('class', 'bar')
        .attr("x", function(d, i){return i * (w / data.length);})
        .attr("y", function(d) { return yscale(d) })
        .attr("width",  w / data.length - barPadding)
        .attr("height", function(d) {return h - yscale(d);})
        .attr("fill", color)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // Add title
    svg.append("text")
        .text(title + " (%)")
        .attr("x", 460)
        .attr("y", 20)
        .attr("font-family", "sans-serif").attr("font-size", "25px").attr("fill", "black").attr("text-anchor", "middle");


    // axis
    var yaxis = d3.axisRight(yscale)
        .ticks(5);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, 0)")
        .call(yaxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xscale))
        .attr("font-family", "sans-serif").attr("font-size", "10px").attr("text-anchor", "middle");
}


function get_leeftijd_info(data){

    // Get all keys
    var outer_keys = Object.keys(data);
    var inner_keys = Object.keys(data[outer_keys[0]]);

    // output dict
    leeftijd_data = {};

    // loop over outer objects
    for (var key of outer_keys) {

        // get inner object
        var inner_data = data[key];

        // initiate
        var array = [];

        // loop over inner object and get leeftijd values and add them to dict, tranform NULL to 0

        var counter = 0
        for (var s_key of inner_keys){
            if(s_key.includes("jaar")){
                var value = inner_data[s_key];

                // transform Null to 0
                if(value == 'NULL'){
                    value = 0;
                }
                array[counter] = value;
                counter += 1
            }
        }
        leeftijd_data[key] = array;
    }
    return leeftijd_data
}


function get_xlabels(data){
    var outer_keys = Object.keys(data);
    labels = Object.keys(data[outer_keys[0]]);
    var xlabels = [];
    for(i = 0, j = 0; i < labels.length; i++){
        if(labels[i].includes("jaar")){
            xlabels[j] = labels[i];
            j++;
        }
    }
    return xlabels
}


// paragraph
d3.select("body").append('h4').text("Description of my dataset and visualization:")
d3.select("body").append('p').text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")


// footer
d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070")
d3.select("footer").append("source").attr("id", "source").text("Source: \n")
d3.select("#source").append("a").attr("href", "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83021NED/table?ts=1542643355996").text("CBS")
d3.select("footer").append("p").text("")
