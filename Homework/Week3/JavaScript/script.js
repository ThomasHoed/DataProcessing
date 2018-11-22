/*
name: Thomas Hoedeman
studentnumebr 10318070
script that plots a graph in a html canvas based on .txt inputfile
*/

// load data
var fileName = "Data/KNMI_20171231.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
      data = JSON.parse(txtFile.responseText);
      main(data);
    }
}
txtFile.open("GET", fileName);
txtFile.send();

// main function that manipulates the data
function main(data){

  // Get all keys representing categories
  var keys = Object.keys(data);

  // Get all information in parsed array to make them easier to handle for plotting
  var info = GetInfo(data);

  // canvas size
  var y_min = 580;
  var y_max = 80;
  var x_min = 50;
  var x_max = 1150;

  // set colors corresponding to labels
  var colors = ['Blue', 'Red', 'Green'];

  // set labels
  var labels = ["Min", "Max", "Average"];

  // call function that creates a line char of the data on a canvas of given size
  display(info, x_min, x_max, y_min, y_max, colors, labels);
}

// This function draws a single line of an array of data in a given color in a given canvas
function draw(array, color_hex, ctx){

  // Start drawing line
  ctx.beginPath();
  ctx.lineWidth = 1.5;

  // loop over array to get x/y coordinates using the transform functions and draw line
  for(i = 0; i <  array.length; i++){
    ctx.lineTo(transform_x(i), transform_y(array[i]));
    ctx.strokeStyle = color_hex;
    ctx.stroke();
  }
}

// display creates a canvas and plots information from the first 3 input arrays
// with the last array as x labels
function display(info, x_min, x_max, y_min, y_max, colors, labels){
  key_names = info[3];

  // get transform function for y axis
  var y_domain = [Math.min(...info[0]) * 1.1, Math.max(...info[1]) * 1.1];
  var y_range = [y_min, y_max];
  transform_y = createTransform(y_domain, y_range);

  // get transform function for x axis
  var x_domain = [0, info[3].length];
  var x_range = [x_min, x_max];
  transform_x = createTransform(x_domain, x_range);

  // make canvas
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // draw lines of input arrays in canvas
  draw(info[0], colors[0], ctx)
  draw(info[1], colors[1], ctx)
  draw(info[2], colors[2], ctx)

  // print x labels and markings
  for(i = 0; i < key_names.length; i++){

    // only print labels for every year
    if(i % 12 == 0){
      ctx.fillText(key_names[i][0], transform_x(i), transform_y(-2))
    }

    // markings per month
    ctx.beginPath()
    ctx.lineWidth = 0.5;
    ctx.moveTo(transform_x(i), transform_y(0) -5 )
    ctx.lineTo(transform_x(i), transform_y(0) + 5 )
    ctx.strokeStyle = 'black'
    ctx.stroke()
  }

  // 2018 label (not in array)
  ctx.fillText(String(parseInt(key_names[i-1][0])+1), transform_x(i-1), transform_y(-2))

  // print y labels and markings
  for(i = Math.round(y_domain[0]); i < y_domain[1]; i++){

    // markings only every 5 °C
    if (i % 5 == 0){
      ctx.font = "12px Arial"
      ctx.strokeStyle = 'black'
      ctx.fillText(i + ' °C', transform_x(-4), transform_y(i))
      ctx.beginPath()
      ctx.lineWidth = 0.5;
      ctx.moveTo(x_min, transform_y(i))
      ctx.lineTo(x_max, transform_y(i))
      ctx.stroke()
    }
  }

  // draw x axis
  ctx.beginPath();
  ctx.moveTo(x_min, transform_y(0));
  ctx.lineTo(x_max, transform_y(0));
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3;
  ctx.stroke();

  // draw y axis
  ctx.beginPath();
  ctx.moveTo(x_min, y_min);
  ctx.lineTo(x_min, y_max);
  ctx.lineWidth = 3;
  ctx.stroke();

  // graph title
  ctx.font = "30px Arial";
  ctx.fillText("Average, minimum and maximum temperature at De Bilt, Netherlands (2008 - 2018)",x_min * 1.4, y_max * 0.7);

  // graph legend info
  var legend_x = transform_x(94);
  var legend_y = transform_y(35.5);
  var legend_width = 200;
  var legend_height = 100;

  // draw legend based on legend info
  drawlegend(legend_x, legend_y, legend_width, legend_height, ctx, colors, labels);

  // axis labels
  ctx.font = "10px Arial";
  ctx.fillText('temperature', x_min * 0.01, y_max * 0.9);
  ctx.font = "15px Arial";
  ctx.fillText('year', transform_x(x_domain[1]/2.2), transform_y(-3));

  // name and credits
  ctx.font = "10px Arial";
  ctx.fillText('Thomas Hoedeman, 10318070', x_range[0] * 1.1 , y_range[0] + 15)
  ctx.fillText('source data: http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi', x_range[1] / 1.35, y_range[0] + 15)
}



function drawlegend(legend_x, legend_y, legend_width, legend_height, ctx, colors, labels){

  // main box of legen
  ctx.clearRect(legend_x, legend_y, legend_width, legend_height);
  ctx.strokeRect(legend_x, legend_y, legend_width, legend_height);

  // boxes and text for each line
  for(i = 0; i < colors.length; i++){
    ctx.fillStyle = colors[i];
    ctx.fillRect(legend_x + legend_width / 7, legend_y + (legend_height / 6.5) + i * (legend_height / 3.5), legend_width / 6 , legend_height / 6);
    ctx.strokeRect(legend_x + legend_width / 7, legend_y + (legend_height / 6.5) + i * (legend_height / 3.5), legend_width / 6 , legend_height / 6);
    ctx.fillStyle = 'Black';
    ctx.font = "25px Arial";
    ctx.fillText(labels[i], legend_x + legend_width / 2.8, legend_y + (legend_height / 3) + i * (legend_height / 3.7));
  }
}

// GetInfo function takes a dictionary of a certain category and selects the total percentage
// and the age information, returns an array
GetInfo = function(data){

  // get keys for every year
  keys = Object.keys(data);

  // initiate output vars
  var min_values = [];
  var max_values = [];
  var av_values = [];
  var keys_output = [];

  // loop over years, within each year over months,
  for(i = 0; i < keys.length; i++){
    var year_data = data[keys[i]];
    var year_keys = Object.keys(year_data);

    // within each year over months
    for(j = 0; j < year_keys.length; j++){

      // get min, max and average and key_name and save these to respective vars
      min_values.push(year_data[year_keys[j]]['Min']);
      max_values.push(year_data[year_keys[j]]['Max']);
      av_values.push(year_data[year_keys[j]]['Average']);
      keys_output.push([keys[i], year_keys[j]]);
    }
  }
  return [min_values, max_values, av_values, keys_output];
}

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta

    var domain_min = domain[0];
    var domain_max = domain[1];
    var range_min = range[0];
    var range_max = range[1];

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min);
    var beta = range_max - alpha * domain_max;

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}
