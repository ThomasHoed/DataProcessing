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

    // parse age information from data
    var leeftijd_info = get_leeftijd_info(data)

    // get xlabels
    var outer_keys = Object.keys(data);
    xlabels = Object.keys(data[outer_keys[0]]);

    var body = d3.select('body');
    var ol = body.append('ol');
    ol.selectAll('li')
    .data(d3.entries(leeftijd_info['Rokers']))
    .enter()
    .append('li')
    .text(d => d.value);

    //


});

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
    var dict = {};

    // loop over inner object and get leeftijd values and add them to dict, tranform NULL to 0
    for (var s_key of inner_keys){
      if(s_key.includes("jaar")){
        var value = inner_data[s_key];

        // transform Null to 0
        if(value == 'NULL'){
          value = 0;
        }
        dict[s_key] = value;
      }
    }
    leeftijd_data[key] = dict;
  }
  return leeftijd_data
}


// paragraph
d3.select("body").append('h4').text("Description of my dataset and visualization:")
d3.select("body").append('p').text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")

// footer
d3.select("html").append("footer").append("p").attr("class","small text-center text-muted").text("Thomas Hoedeman, 10318070")
d3.select("footer").append("p").attr("id", "source").text("Source: ")
d3.select("#source").append("a").attr("href", "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83021NED/table?ts=1542643355996").text("CBS")
