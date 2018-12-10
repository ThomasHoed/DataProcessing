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
    d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070");
    d3.select("footer").append("source").attr("id", "source").text("Sources:");
    d3.select("#source").append("a").attr("href", "https://www.kaggle.com/unsdsn/world-happiness#2016.csv").html("<br>World Happiness Report<br>");
    d3.select("#source").append("a").attr("href", "http://happyplanetindex.org/countries").html("Happy Planet Index");


    dataLocation = "https://raw.githubusercontent.com/ThomasHoed/DataProcessing/master/Homework/Week6/Data/Combination_hpi-data-2016_%26_worldhappiness2016.json"
    d3.json(dataLocation).then(function(data) {
        var scatterData = getScatterData(data)
        makeScatterPlot(scatterData)
    })

    function getScatterData(data){
        var countries = Object.keys(data);

        var scatterData = [];
        countries.forEach(function(country){
            let array = [];
            array.push(data[country]["Happy Planet Index"]);
            array.push(data[country]["Happiness Score"]);
            array.push(country);
            array.push(data[country]["Population"]);
            array.push(data[country]["Region"]);

            delete array;

            scatterData.push(array)
        });
        return scatterData
    }

    function makeScatterPlot(data){
        var margins = getMargins()
        console.log(data);
    }


    function getMargins(){
            var margins = {top: 50, right: 20, bottom: 50, left: 40};
            margins.w = 800 - margins.left - margins.right;
            margins.h = 600 - margins.top - margins.bottom;
            return margins
        }
}
