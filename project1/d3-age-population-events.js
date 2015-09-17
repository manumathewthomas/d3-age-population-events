//
// Author : Manu Mathew Thomas
// E-mail : mthoma52@uic.edu
// Website: mthoma52.com
//


// Global Variables

var barMargin = {top:20,right:20,bottom:30,left:80};
var barChartWidth = 800 - barMargin.left-barMargin.right;
var barChartHeight = 600 - barMargin.top-barMargin.bottom;
var selectedCountryList;



//delete this!!!
var tempDataset;
var countryList=[];
var currentCountry;
var USDataset=[];
var lookup={};
var xScale,yScale,heightScale,xAxis,yAxis;
var country1Dataset=[],country2Dataset,country3Dataset;

// Header Elements
var header = d3.select("body")
               .append("header");

  header.append("h1")
        .text("Still Crazy After All These Years !");
  header.append("h2")
        .text("Age-Population-Events Visualized.");

// Navigation Elements

var nav = header.append("nav");

    nav.selectAll("a")
       .data(["Home","How it works","Source","About the data","Thoughts","Credits"])
       .enter()
       .append("a")
       .attr("href","#")
       .text(function(d){
          return d;
       });

// Listing the DataSource
 d3.select("body")
   .append("p")
   .attr("id","datasource")
   .text("Data Source: US Census Bureau.");


// Implementation of Bar Charts   
var barSection = d3.select("body")
                   .append("section")
                   .attr("class","bar_chart_collection");

var barChart1 = barSection.append("div")
                          .attr("id","bar_chart1")
                          .attr("class","bar_chart");

var barChart1Title = barChart1.append("h1")
                              .style("text-align","center")
                              .text("Bar Chart 1");

var barChart2 = barSection.append("div")
                          .attr("id","bar_chart2")
                          .attr("class","bar_chart");

var barChart2Title = barChart2.append("h1")
                              .style("text-align","center")
                              .text("Bar Chart 2");

var barChart3 = barSection.append("div")
                          .attr("id","bar_chart3")
                          .attr("class","bar_chart");

var barChart3Title = barChart3.append("h1")
                              .style("text-align","center")
                              .text("Bar Chart 3");

var svgBarContainer1 = barChart1.append("svg")
                                .attr("id","bar_chart_svg1")
                                .attr("class","bar_charts_svg")
                                .attr("width","100%")
                                .attr("height","100%")
                                .attr("viewBox","0 0 "+(barChartWidth+barMargin.left+barMargin.right)
                                                      +" "+(barChartHeight+barMargin.top+barMargin.bottom))
                                .attr("preserveAspectRatio","xMinYMid");


var svgBarContainer2 = barChart2.append("svg")
                                .attr("id","bar_chart_svg2")
                                .attr("class","bar_charts_svg")
                                .attr("width","100%")
                                .attr("height","100%")
                                .attr("viewBox","0 0 "+(barChartWidth+barMargin.left+barMargin.right)
                                                     +" "+(barChartHeight+barMargin.top+barMargin.bottom))
                                .attr("preserveAspectRatio","xMinYMid");

var svgBarContainer3 = barChart3.append("svg")
                                .attr("id","bar_chart_svg3")
                                .attr("class","bar_charts_svg")
                                .attr("width","100%")
                                .attr("height","100%")
                                .attr("viewBox","0 0 "+(barChartWidth+barMargin.left+barMargin.right)
                                                      +" "+(barChartHeight+barMargin.top+barMargin.bottom))
                                .attr("preserveAspectRatio","xMinYMid");

// Resizing Bar Charts
var barChartToBeResized = $(".bar_chart_svg");
var barChartAspect = barChartToBeResized.width()/barChartToBeResized.height();
var barChartContainer = barChartToBeResized.parent();

$(window).on("resize", function(){
  var targetWidth = barChartContainer.width();
    barChartToBeResized.attr("width",targetWidth);
    barChartToBeResized.attr("height", Math.round(targetWidth / barChartAspect));
}).trigger("resize");


                               
//Dropdown Container
var dropdown = d3.select("body")
                 .append("div")
                 .attr("class","ui fluid multiple search selection dropdown");

    dropdown.append("input")
            .attr("type","hidden")
            .attr("id","country")
            .attr("name","country");

    dropdown.append("i")
            .attr("class","dropdown icon");

    dropdown.append("div")
            .attr("class","default text")
            .text("Select Country");

    var dropdown_menu =dropdown.append("div")
            .attr("class","menu");

           
            
            
            

//delete this!!!!!
tempFunction();




// resize chart

//delete this!!!
function tempFunction()
{
   d3.csv("../assets/dataset/US2010-2014.csv",function(error,data){
        tempDataset = data;
        console.log(tempDataset);
        showData();
   })

}   

//delete this!!!
function showData()
{
  for(var item,i=0;item = tempDataset[i++];){
    var name = item.NAME;

    if(!(name in lookup)){
      lookup[name] = 1;
      countryList.push({"distinctState":item.NAME});
    }
  }

  dropdown_menu.selectAll("div")
               .data(countryList)
               .enter()
               .append("div")
               .attr("class","item")
               .attr("data-value",function(d){
                    return d.distinctState;
               })
               .append("i")
               .attr("class","ca flag")
               .select(function(){
                 return this.parentNode;
               }).insert("span","div")
               .text(function(d){
                  return d.distinctState;
               });

insertDataToBarChart1();
  $('.dropdown').on("change",function(){     
      selectedCountryList=d3.select("#country").property("value").split(",");
      insertDataToBarChart1();
} );
//insertDataToBarChart1();
drawBarChart1();

   /*  dropdown_menu.append("div")
            .attr("class","item")
            .attr("data-value","ca")
            .append("i")
            .attr("class","ca flag")
            .select(function(){
              return this.parentNode;
            }).insert("span","div")
            .text("Canada");
            */
  
     
 
  
 
   
}

var drawBarChart1 = function(){
              
xScale = d3.scale.linear()
                 .domain([0,d3.max(country1Dataset,function(d){
                    if(d.Age!=999)
                      return d.Age;
                 })])
                  .range([0,barChartWidth]);
yScale = d3.scale.linear()
                 .domain([0,d3.max(country1Dataset,function(d){
                      return d.Population2012;
                 })])
                .range([barChartHeight,0]);

heightScale = d3.scale.linear()
                      .domain([0,d3.max(country1Dataset,function(d){
                          return d.Population2012;
                      })])
                      .range([0,barChartHeight]);

xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom").ticks(30);

yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left").ticks(10);

svgBarContainer1.append("g")
                .attr("class","axis x_axis")
                .attr("transform","translate(0,"+barChartWidth+")")
                .call(xAxis);

svgBarContainer1.append("g")
                .attr("class","axis y_axis")
                .attr("transform","translate(20,0)")
                .call(yAxis);


svgBarContainer1.selectAll("rect")
                .data(country1Dataset)
                .enter()
                .append("rect")
                .attr({
                  x:function(d,i){
                    return i * (barChartWidth/country1Dataset.length);
                    },

                  y:function(d){
                     return barChartHeight-heightScale(d.Population2012);
                  },

                  width:barChartWidth/country1Dataset.length -1,
                  
                  height: function(d){
                    return heightScale(d.Population2012);
                  },

                  fill:function(d){
                    return "teal";
                  }
                  });


svgBarContainer2.append("g")
                .attr("class","axis y_axis")
                .attr("transform","translate(20,0)")
                .call(yAxis);


svgBarContainer2.selectAll("rect")
                .data(country1Dataset)
                .enter()
                .append("rect")
                .attr({
                  x:function(d,i){
                    return i * (barChartWidth/country1Dataset.length);
                    },

                  y:function(d){
                     return barChartHeight-heightScale(d.Population2012);
                  },

                  width:barChartWidth/country1Dataset.length -1,
                  
                  height: function(d){
                    return heightScale(d.Population2012);
                  },

                  fill:function(d){
                    return "teal";
                  }
                  });



svgBarContainer3.append("g")
                .attr("class","axis y_axis")
                .attr("transform","translate(20,0)")
                .call(yAxis);


svgBarContainer3.selectAll("rect")
                .data(country1Dataset)
                .enter()
                .append("rect")
                .attr({
                  x:function(d,i){
                    return i * (barChartWidth/country1Dataset.length);
                    },

                  y:function(d){
                     return barChartHeight-heightScale(d.Population2012);
                  },

                  width:barChartWidth/country1Dataset.length -1,
                  
                  height: function(d){
                    return heightScale(d.Population2012);
                  },

                  fill:function(d){
                    return "#4776f6";
                  }
                  });





}
          
var insertDataToBarChart1 = function(){
  
for(var item,i=0;item=tempDataset[i++];){
    var name = item.NAME;

    if(item.NAME == "United States" && item.SEX=="0" && item.AGE!=999)
      country1Dataset.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,"Population2012":+item.POPEST2012_CIV});

  }
}

