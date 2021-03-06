/*
script that plots a graph
*/

var fileName = "Data/gezondheid_nederland_2017.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
      data = JSON.parse(txtFile.responseText);
      main(data);
    }
}
txtFile.open("GET", fileName);
txtFile.send();


function main(data){

  // Get all keys representing categories
  keys = Object.keys(data);

  // middelengebruik over leeftijd, dus Dagelijks roken, zware drinkers Cannabisgebruik en Drugsgebruik
  // 1: "Dagelijkse rokers"
  info_rokers = GetInfo(data, "Dagelijkse rokers");
  // 5: "Zware drinkers"
  info_drinkers = GetInfo(data, "Zware drinkers");
  // 7: "Cannabisgebruik afgelopen jaar"
  info_blowers = GetInfo(data, "Cannabisgebruik afgelopen jaar");
  // 8: "Drugsgebruik afgelopen jaar"
  info_druggies = GetInfo(data, "Drugsgebruik afgelopen jaar");

  // Rokers
  display(info_rokers, 'green')

  // display(info_drinkers, 'red')
  // display(info_blowers 'blue'
  // display(info_druggies,'yellow' )


}

function display(info, color_hex){
  // Change to edit size of graph
  y_min = 500
  y_max = 100
  x_min = 200
  x_max = 1000
  array = info[0]
  key_names = info[1]

  // get transform function for y axis
  y_domain = [-0.1, Math.max(...array) * 1.2];
  y_range = [y_min, y_max];
  transform_y = createTransform(y_domain, y_range);

  // get transform function for x axis
  x_domain = [-1, array.length];
  x_range = [x_min, x_max]
  transform_x = createTransform(x_domain, x_range);

  // make canvas
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // Start drawing line
  ctx.beginPath();
  ctx.lineWidth = 2;
  // loop over array to get x/y coordinates using the transform functions
  for(i = 0; i <  array.length; i++){
    console.log(array[i]);
    current_point_y = transform_y(array[i]);
    ctx.lineTo(transform_x(i), current_point_y);
    ctx.strokeStyle = color_hex
    ctx.stroke();
  }

  // print x labels
  for(i = 0; i < key_names.length; i++){
    ctx.font = "12px Arial"
    ctx.fillText(key_names[i], transform_x(i) -25, transform_y(-4))
    ctx.beginPath()
    ctx.moveTo(transform_x(i), y_min )
    ctx.lineTo(transform_x(i), y_min + 10 )
    ctx.strokeStyle = 'black'
    ctx.stroke()
  }

  // print y labels
  for(i = 0; i < y_domain[1]; i++){
    console.log(i);
    ctx.font = "12px Arial"
    ctx.fillText(i, x_min -25, transform_y(i))
    ctx.moveTo(x_min, transform_y(i))
    ctx.lineTo(x_min + 10, transform_y(i))
    ctx.stroke()
  }



  // draw x axis
  ctx.beginPath();
  ctx.moveTo(x_min, y_min);
  ctx.lineTo(x_max, y_min);
  ctx.lineWidth = 3;
  ctx.stroke();
  // draw y axis
  ctx.beginPath();
  ctx.moveTo(x_min, y_min);
  ctx.lineTo(x_min, y_max);
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = "30px Arial";
  ctx.fillText("Percent of smokers across age groups in 2017 in the Netherlands",200,50);
}

// GetInfo function takes a dictionary of a certain category and selects the total percentage
// and the age information, returns an array
GetInfo = function(data, key){
  dictionary = data[key]
  keys = Object.keys(dictionary);
  output_dict = []
  output_dict["Totaal"] = dictionary["Totaal"];
  output_dict["Categorie naam"] = key
  values = []
  key_names = []


  for(i = 0; i < keys.length; i++){
    if(keys[i].includes("jaar") ){
      if(dictionary[keys[i]] != 'NULL'){
        output_dict[keys[i]] = dictionary[keys[i]]
        values.push(dictionary[keys[i]])
        key_names.push(keys[i])

      }
      else {
        output_dict[keys[i]] = 0
        values.push(0)
        key_names.push(keys[i])
      }
    }
  }
  return [values, key_names];
}

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}
