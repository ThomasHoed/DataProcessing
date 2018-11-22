/*
name: Thomas Hoedeman
student number: 10318070
barscript
*/

// Title head and body
d3.select("head").append("title").text("Assigment overview");
d3.select("body").append("title").text("Assigments");


// paragraph
d3.select("body").append('h4').text("Links to assigments:")
d3.select("body").append('a').attr("href", "https://thomashoed.github.io/DataProcessing/Homework/Week3/index.html").text("Week 3")
d3.select("body").append('a').attr("href", "https://thomashoed.github.io/DataProcessing/Homework/Week4/index.html").text("Week 4")

// footer
d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070")
