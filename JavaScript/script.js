/*
name: Thomas Hoedeman
student number: 10318070
barscript
*/

// Title head and body
d3.select("head").append("title").text("Assigment overview");
d3.select("body").append("title").text("Assigments");


// paragraph
d3.select("body").append('h4').text("Links to website assigments:")
d3.select("body").append('p').attr("href", "https://thomashoed.github.io/DataProcessing/Homework/Week3/index.html").text("Week 4")

// footer
d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070")
d3.select("footer").append("p").attr("id", "source").text("Source: ")
