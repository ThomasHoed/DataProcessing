/*
name: Thomas Hoedeman
student number: 10318070
barscript
*/

// Title head and body
d3.select("head").append("title").text("Bar chart view");
d3.select("body").append("title").text("My bar chart");


// paragraph
d3.select("body").append('h4').text("Description of my dataset and visualization:")
d3.select("body").append('p').text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")

// footer
d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070")
d3.select("footer").append("p").attr("id", "source").text("Source: ")
d3.select("#source").append("a").attr("href", "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83021NED/table?ts=1542643355996").text("CBS")
