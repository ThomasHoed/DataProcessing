/*
name: Thomas Hoedeman
student number: 10318070
barscript
*/
window.onload = function()
{
    // Title head
    d3.select("head").append("title").text("Bar chart view");

    // load .JSON
    d3.json("https://raw.githubusercontent.com/ThomasHoed/DataProcessing/master/Homework/Week4/Data/gezondheid_nederland_2017.json").then(function(data) {

        // parse age information and xlabels from data
        var leeftijd_info = get_leeftijd_info(data)
        var xlabels = get_xlabels(data)

        // selection keys and colors
        var selection_keys = ["Dagelijkse rokers", "Zware drinkers", "Cannabisgebruik afgelopen jaar", "Drugsgebruik afgelopen jaar"]
        var beschrijvingen = ["Dagelijkse rokers: Het percentage van de bevolking van 12 jaar of ouder met antwoordcategorie ja op de vraag: Rookt u elke dag?",
                              "Zware drinkers: het percentage van de bevolking van 12 jaar of ouder dat minstens 1 keer per week 6 of meer glazen alcohol op één dag drinkt (mannen) of minstens 1 keer per week 4 of meer glazen alcohol op één dag drinkt (vrouwen).",
                              "Cannabisgebruik: Op basis van de vraag naar het gebruik van cannabis (hasj, wiet, marihuana)",
                              "Drugsgebruik anders dan cannabis: Op basis van de vragen naar het gebruik van: amfetamine, XTC, cocaine, LSD,  paddo's,  heroine, GHB, methadon of andere drugs, Het gaat om het gebruik van 1 of meer van deze drugssoorten. Bij gebruik van meerdere van deze drugssoorten wordt de meest recent gebruikte drugssoort als bepalend gezien voor de verdeling over de categorieën afgelopen maand, afgelopen jaar, en ooit."]
        var colors = ["#095e5c", "#cea40e", "#2a6818", "#890404"]

        // plot all bar graphs
        for(i = 0; i < selection_keys.length; i++){
            make_bar_graph(leeftijd_info[selection_keys[i]], colors[i], selection_keys[i], xlabels, beschrijvingen[i]);
        };

    });


    function make_bar_graph(data, color, title, xlabels, beschrijving){

        // spacing
        d3.select("body").append('p').html("<br>")
        d3.select("body").append('p').text(beschrijving)
        d3.select("body").append('p').html("<br>")

        // set margins, for margin idea source: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
        var margin = {top: 50, right: 20, bottom: 50, left: 40},
            w = 1100 - margin.left - margin.right,
            h = 500 - margin.top - margin.bottom;
        var barPadding = 2;

        // Make svg
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // scales
        var yscale = d3.scaleLinear()
            .range([h, 5])
            .domain([0, 25])

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
            .attr("x", w/2)
            .attr("y", -margin.top/2)
            .attr("font-family", "sans-serif").attr("font-weight","bold").attr("font-size", "22px").attr("fill", "black").attr("text-anchor", "middle")

        // axis labels
        svg.append("text")
            .text("percentage")
            .attr("y", -margin.left)
            .style("text-anchor", "end")
            .attr("dy", ".71em")
            .attr("transform", "rotate(-90)");
        svg.append("text")
            .text("leeftijdsgroep")
            .attr("y", h + margin.bottom -  margin.bottom / 4)
            .attr("x", w / 2 )
            .style("text-anchor", "middle")


        // axis
        var yaxis = d3.axisLeft(yscale)
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
    d3.select("body").append('h4').text("Beschrijving:")
    d3.select("body").append('p').html("Middelengebruik kan schadelijk zijn voor de gezondheid en kan veel kosten veroorzaken voor de maatschappij, hieronder zijn staafgrafieken weergegeven met de verdeling van het gebruik van verschillende middelen onder de bevolking")

    // footer
    d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070")
    d3.select("footer").append("source").attr("id", "source").text("Source: \n")
    d3.select("#source").append("a").attr("href", "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83021NED/table?ts=1542643355996").html("CBS")
    d3.select("footer").append("p").text("")

}
