//
// Author : Manu Mathew Thomas
// E-mail : mthoma52@uic.edu
// Website: mthoma52.com
//


// Global Variables
var barMargin = {top:20,right:20,bottom:30,left:5};
var barChartWidth = 800 - barMargin.left-barMargin.right;
var barChartHeight = 400 - barMargin.top-barMargin.bottom;
var barChart1Width = barChartWidth/3;
var barChart2Width = barChart1Width + barChartWidth/3;
var barChart3Width = barChart2Width + barChartWidth/3;
var xScale1,yScale1,heightScale1,xAxis1,yAxis1;
var xScaleOverview1,yScaleOverview1,heightScaleOverview1;
var xScale2,yScale2,heightScale2,xAxis2,yAxis2;
var xScaleOverview2,yScaleOverview2,heightScaleOverview2;
var xScale3,yScale3,heightScale3,xAxis3,yAxis3;
var xScaleOverview3,yScaleOverview3,heightScaleOverview3;
var chart1AgeDiv=[0,0,0,0,0,0,0,0,0];
var chart2AgeDiv=[0,0,0,0,0,0,0,0,0];
var chart3AgeDiv=[0,0,0,0,0,0,0,0,0];
var noOfPeopleWhoRemembersChart1=0,noOfPeopleWhoRemembersChart2=0,noOfPeopleWhoRemembersChart3=0;
var totalPopulationChart1=0,totalPopulationChart2=0,totalPopulationChart3=0;
var selectedCountryList=["California","Illinois","Utah"];
var currentEvent;
var pieOverviewLegend=[],pieOverviewLegendHeight=0;
var regionalDataset;
var stateList=[];
var countryList=["China","India","Norway","Canada"];

var eventList=["Haiti Earthquake [2010]","Obama's second term [2013]","Olympics [2012]","NASA Orion Spacecraft [2014]",
               "20 years after China's one child policy [2010]","Facebook buys Whatsapp [2014]","Polar Vortex [2013]","Fifa [2014]","iPad launched [2010]", "King's Speech won Best Picture [2011]"];
var eventYearList=[2010,2013,2012,2014,2010,2014,2013,2014,2010,2011];

var lookup={};
var currentCountry;
var chartDataset1=[],chartDataset2=[],chartDataset3=[];
var filePath="../assets/dataset/";

var barOrPie = true;
var overviewOrDetail = true;
var allOrRemember = true;

// Header Elements
var header = d3.select("body")
               .append("header");

  header.append("h1")
        .attr("id","mainHeading")
        .text("Still Crazy After All These Years !");

  header.append("h2")
        .attr("id","secondaryHeading")
        .text("Age-Population-Events Visualized.");

// Navigation Elements

var nav = header.append("nav");

    nav.selectAll("a")
       .data(["Home","How it works","Source","About the data","Thoughts","Credits"])
       .enter()
       .append("a")
       .attr("href",function(d,i){
            switch(i){
              case 0:
                return "#";
              break;
              case 1:
                return "work.html";
               break;
               case 2:
                 return "https://github.com/manumathewthomas/d3-age-population-events";
               break;
               case 3:
                 return "data.html";
                 break;
                case 4:
                  return "thoughts.html";
                return;
                case 5:
                 return "credits.html";
            }
       })
       .append("li")
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

var barCharts = barSection.append("div")
                          .attr("id","bar_chart1")
                          .attr("class","bar_chart");


var svgBarTitleContainer = barCharts.append("svg")
                                    .attr("class","svgBarTitle")
                                    .attr("width","100%")
                                    .attr("height","100%")
                                    .attr("viewBox","0 0 2000 60 ")
                                    .attr("preserveAspectRatio","xMinYMid");
                                 
var barChartTitle1 = svgBarTitleContainer.append("text")
                                   .attr("x","13%")
                                   .attr("y","50px")
                                   .attr("fill","white")
                                   .text(selectedCountryList[0]);

var barChartTitle2 = svgBarTitleContainer.append("text")
                                         .attr("x","46%")
                                         .attr("y","50px")
                                         .attr("fill","white")
                                         .text(selectedCountryList[1]);

var barChartTitle3 = svgBarTitleContainer.append("text")
                                         .attr("x","79%")
                                         .attr("y","50px")
                                         .attr("fill","white")
                                         .text(selectedCountryList[2]);


                                   
var svgBarContainer = barCharts.append("svg")
                                .attr("id","bar_charts_svg")
                                .attr("width","100%")
                                .attr("height","100%")
                                .attr("viewBox","0 0 "+(barChartWidth+barMargin.left+barMargin.right+200)
                                                      +" "+(barChartHeight+barMargin.top+barMargin.bottom)/3)
                                .attr("preserveAspectRatio","xMinYMid");
                                  

var barChartGroup1 = svgBarContainer.append("g")
                                    .attr("id","barChartGroup1")
                                    .attr("transform","translate("+barMargin.left+",0)");

var barChartGroup2 = svgBarContainer.append("g")
                                    .attr("id","barChartGroup2")
                                   .attr("transform","translate("+barMargin.left*2+",0)");
var barChartGroup3 = svgBarContainer.append("g")
                                    .attr("id","barChartGroup3")
                                    .attr("transform","translate("+barMargin.left*3+",0)");

                                    
var overviewBarChartGroup1 = svgBarContainer.append("g")
                                            .attr("id","overviewBarChartGroup1")
                                            .attr("transform","translate("+barMargin.left+",0)");

var overviewBarChartGroup2 = svgBarContainer.append("g")
                                            .attr("id","overviewBarChartGroup2")
                                            .attr("transform","translate("+barMargin.left*2+",0)");


var overviewBarChartGroup3 = svgBarContainer.append("g")
                                            .attr("id","overviewBarChartGroup3")
                                            .attr("transform","translate("+barMargin.left*3+",0)");

// Implementation of Pie-Charts
                                            
var pieChartGroup1 = svgBarContainer.append("g")
                                    .attr("id","pieChartGroup1")
                                    .attr("transform","translate("+(barChart1Width/2+40)+","+barChartHeight/5+")");

var pieChartGroup2 = svgBarContainer.append("g")
                                    .attr("id","pieChartGroup2")
                                    .attr("transform","translate("+(barChart1Width/2+barChart1Width+100)+","+barChartHeight/5+")");

var pieChartGroup3 = svgBarContainer.append("g")
                                    .attr("id","pieChartGroup3")
                                    .attr("transform","translate("+(barChart1Width/2+barChart1Width*2+170)+","+barChartHeight/5+")");

var overviewPieChartGroup1 = svgBarContainer.append("g")
                                    .attr("id","overviewPieChartGroup1")
                                    .attr("transform","translate("+(barChart1Width/2+40)+","+barChartHeight/5+")");

var overviewPieChartGroup2 = svgBarContainer.append("g")
                                    .attr("id","overviewPieChartGroup2")
                                    .attr("transform","translate("+(barChart1Width/2+barChart1Width+100)+","+barChartHeight/5+")");

var overviewPieChartGroup3 = svgBarContainer.append("g")
                                    .attr("id","overviewPieChartGroup3")
                                    .attr("transform","translate("+(barChart1Width/2+barChart1Width*2+170)+","+barChartHeight/5+")");

// Implementation of Control Buttons

 var barPieToggle = function(barVisibility,pieVisibility){ 
   
   if(!overviewOrDetail)
   {
      d3.select("#barChartGroup1").attr("visibility",barVisibility);
      d3.select("#barChartGroup2").attr("visibility",barVisibility);
      d3.select("#barChartGroup3").attr("visibility",barVisibility);
 
      d3.select("#xAxis1").attr("visibility",barVisibility);
      d3.select("#yAxis1").attr("visibility",barVisibility);
      
      d3.select("#xAxis2").attr("visibility",barVisibility);
      d3.select("#yAxis2").attr("visibility",barVisibility);

      d3.select("#xAxis3").attr("visibility",barVisibility);
      d3.select("#yAxis3").attr("visibility",barVisibility);


 }
   else
   {
      d3.select("#overviewBarChartGroup1").attr("visibility",barVisibility);
      d3.select("#overviewBarChartGroup2").attr("visibility",barVisibility);
      d3.select("#overviewBarChartGroup3").attr("visibility",barVisibility);
  
      d3.select("#xAxisOverview1").attr("visibility",barVisibility);
      d3.select("#yAxisOverview1").attr("visibility",barVisibility);
      
      d3.select("#xAxisOverview2").attr("visibility",barVisibility);
      d3.select("#yAxisOverview2").attr("visibility",barVisibility);

      d3.select("#xAxisOverview3").attr("visibility",barVisibility);
      d3.select("#yAxisOverview3").attr("visibility",barVisibility);
     
      d3.select("#overviewPieChartGroup1").attr("visibility",pieVisibility);
      d3.select("#overviewPieChartGroup2").attr("visibility",pieVisibility);
      d3.select("#overviewPieChartGroup3").attr("visibility",pieVisibility);
 
   }

      
      d3.select("#pieChartGroup1").attr("visibility",pieVisibility);
      d3.select("#pieChartGroup2").attr("visibility",pieVisibility);
      d3.select("#pieChartGroup3").attr("visibility",pieVisibility);

}

var overviewDetailToggle = function(detailVisibility,overviewVisibility){

  if(barOrPie)
  {
      d3.select("#barChartGroup1").attr("visibility",detailVisibility);
      d3.select("#barChartGroup2").attr("visibility",detailVisibility);
      d3.select("#barChartGroup3").attr("visibility",detailVisibility);
        
      d3.select("#overviewBarChartGroup1").attr("visibility",overviewVisibility);
      d3.select("#overviewBarChartGroup2").attr("visibility",overviewVisibility);
      d3.select("#overviewBarChartGroup3").attr("visibility",overviewVisibility);
 
      d3.select("#xAxis1").attr("visibility",detailVisibility);
      d3.select("#yAxis1").attr("visibility",detailVisibility);
      
      d3.select("#xAxis2").attr("visibility",detailVisibility);
      d3.select("#yAxis2").attr("visibility",detailVisibility);

      d3.select("#xAxis3").attr("visibility",detailVisibility);
      d3.select("#yAxis3").attr("visibility",detailVisibility);

      d3.select("#xAxisOverview1").attr("visibility",overviewVisibility);
      d3.select("#yAxisOverview1").attr("visibility",overviewVisibility);
      
      d3.select("#xAxisOverview2").attr("visibility",overviewVisibility);
      d3.select("#yAxisOverview2").attr("visibility",overviewVisibility);

      d3.select("#xAxisOverview3").attr("visibility",overviewVisibility);
      d3.select("#yAxisOverview3").attr("visibility",overviewVisibility);
  } 

  else
  {
      d3.select("#pieChartGroup1").attr("visibility",detailVisibility);
      d3.select("#pieChartGroup2").attr("visibility",detailVisibility);
      d3.select("#pieChartGroup3").attr("visibility",detailVisibility);
        
      d3.select("#overviewPieChartGroup1").attr("visibility",overviewVisibility);
      d3.select("#overviewPieChartGroup2").attr("visibility",overviewVisibility);
      d3.select("#overviewPieChartGroup3").attr("visibility",overviewVisibility);
 

  }
}



                                    
// Resizing Bar Charts
var barChartToBeResized = $(".bar_chart_svg");
var barChartAspect = barChartToBeResized.width()/barChartToBeResized.height();
var barChartContainer = barChartToBeResized.parent();

var barChartTitleToBeResized = $(".svgBarTitle");
var barChartTitleAspect = barChartTitleToBeResized.width()/barChartTitleToBeResized.height();
var barChartTitleContainer = barChartTitleToBeResized.parent();


$(window).on("resize", function(){
  var targetBarChartWidth = barChartContainer.width();
    barChartToBeResized.attr("width",targetBarChartWidth);
    barChartToBeResized.attr("height", Math.round(targetBarChartWidth / barChartAspect));

    var targetBarChartTitleWidth = barChartTitleContainer.width();
    barChartTitleToBeResized.attr("width",targetBarChartTitleWidth);
    barChartTitleToBeResized.attr("height", Math.round(targetBarChartTitleWidth / barChartTitleAspect));

}).trigger("resize");


                               
//Dropdown Container
var stateDropdown = d3.select("body")
                      .append("div")
                      .attr("class","ui fluid multiple selection dropdown stateDropdown");

    stateDropdown.append("input")
                 .attr("type","hidden")
                 .attr("id","country")
                 .attr("name","country");

    stateDropdown.append("i")
                 .attr("class","dropdown icon");

    stateDropdown.append("div")
                 .attr("class","default text")
                 .text("Select State or Country");

    var dropdown_menu = stateDropdown.append("div")
                                     .attr("class","menu");


var eventDropdown = d3.select("body")
                      .append("div")
                      .attr("class","ui fluid selection dropdown eventDropdown");

    eventDropdown.append("input")
                 .attr("type","hidden")
                 .attr("id","events")
                 .attr("name","events");

    eventDropdown.append("i")
                 .attr("class","dropdown icon");

    eventDropdown.append("div")
                 .attr("class","default text")
                 .text(eventList[1]);

    var eventDropdown_menu = eventDropdown.append("div")
                                          .attr("class","menu");
            
        eventDropdown_menu.selectAll("div")
                     .data(eventList)
                     .enter()
                     .append("div")
                     .attr("class","item")
                     .attr("data-value",function(d,i){
                        return eventYearList[i];
                       })
                     .append("i")
                     .select(function(){
                        return this.parentNode;
                       }).insert("span","div")
                     .text(function(d){
                        return d;
                      });

// Defining Control Buttons

var controlButtons= d3.select("body")
                      .append("div")
                      .attr("id","controlButtons");

var barPieButton = controlButtons.append("div")
                                 .attr("class","ui large  buttons");

barPieButton.append("button")
          .attr("class","ui button positive")
          .attr("id","barButton") 
          .text("Bar");

barPieButton.append("div")
          .attr("class","or");

barPieButton.append("button")
          .attr("class","ui button")
          .attr("id","pieButton")
          .text("Pie");

var overviewDetailButton= controlButtons.append("div")
                                 .attr("class","ui large buttons");

overviewDetailButton.append("button")
          .attr("class","ui button positive")
          .attr("id","overviewButton")
          .text("Overview");

overviewDetailButton.append("div")
          .attr("class","or");

overviewDetailButton.append("button")
          .attr("class","ui button")
          .attr("id","detailButton")
          .text("Detailed View");

var genderButton = controlButtons.append("div")
                                 .attr("class","ui large buttons");

genderButton.append("button")
          .attr("class","ui button positive")
          .attr("id","allButton")
          .text("All");

genderButton.append("div")
          .attr("class","or");

genderButton.append("button")
          .attr("class","ui button")
          .attr("id","rememberButton")
          .text("Who Remembers");



//Regional Data
var getRegionalData = function(){
   d3.csv(filePath+"US2010-2014.csv",function(error,data){
        regionalDataset = data;
        console.log(regionalDataset);
        showRegionalData();

   })

}   


showRegionalData = function(){
  for(var item,i=0;item = regionalDataset[i++];){
    var name = item.NAME;

    if(!(name in lookup)){
      lookup[name] = 1;
       stateList.push(item.NAME);
    }
  }

fullList = stateList.sort();
  dropdown_menu.selectAll("div")
               .data(fullList)
               .enter()
               .append("div")
               .attr("class","item")
               .attr("data-value",function(d){
                  return d;
               })
               .append("i")
               .attr("class",function(d){
                    switch(d)
                    {
                      case "United States":
                        return "us flag";
                      case "China":
                        return "cn flag";
                      case "India":
                        return "in flag";
                      case "Norway":
                        return "no flag";
                      case "Canada":
                        return "ca flag";
                      default:
                        return "noflag";
                    }
               })
               .select(function(){
                 return this.parentNode;
               }).insert("span","div")
                .text(function(d){
                  return d; 
                });

     currentEvent=2013;
    
// Implementation of DropDown menus
    insertDataToBarCharts(currentEvent);
  $('.stateDropdown').on("change",function(){     
      selectedCountryList=d3.select("#country").property("value").split(",");
      chartDataset1=[];
      chartDataset2=[];
      chartDataset3=[];
      insertDataToBarCharts(currentEvent);
      updateBarChart1();
      updateBarChart2();
      updateBarChart3();
    });

  $('.eventDropdown').on("change",function(d){     
      currentEvent = +d.target.defaultValue;
      chartDataset1=[];
      chartDataset2=[];
      chartDataset3=[];
      insertDataToBarCharts(currentEvent);
      updateBarChart1();
      updateBarChart2();
      updateBarChart3();
    });




  $('#barButton').on("click",function(){
           d3.select("#barButton").attr("class","ui button positive"); 
           d3.select("#pieButton").attr("class","ui button");
          
           barOrPie = true;
          
           barPieToggle("visible","hidden");
  });

  $('#pieButton').on("click",function(){
           d3.select("#pieButton").attr("class","ui button positive");
           d3.select("#barButton").attr("class","ui button");
          
           barOrPie = false;

           barPieToggle("hidden","visible");
  });


  $('#overviewButton').on("click",function(){
          d3.select("#overviewButton").attr("class","ui button positive");
          d3.select("#detailButton").attr("class","ui button");
          
          overviewOrDetail = true;
          overviewDetailToggle("hidden","visible");
  });

  $('#detailButton').on("click",function(){
          d3.select("#detailButton").attr("class","ui button positive");
          d3.select("#overviewButton").attr("class","ui button");

          overviewOrDetail = false;
          overviewDetailToggle("visible","hidden");
  });

  $('#allButton').on("click",function(){
          d3.select('#allButton').attr("class","ui button positive");
          d3.select('#rememberButton').attr("class","ui button");

          allOrRemember = true;

          chartDataset1=[];
          chartDataset2=[];
          chartDataset3=[];
          insertDataToBarCharts(currentEvent);
          updateBarChart1();
          updateBarChart2();
          updateBarChart3();

  });

  $('#rememberButton').on("click",function(){
          d3.select('#rememberButton').attr("class","ui button positive");
          d3.select('#allButton').attr("class","ui button");
          
          allOrRemember = false;

          chartDataset1=[];
          chartDataset2=[];
          chartDataset3=[];
          insertDataToBarCharts(currentEvent);
          updateBarChart1();
          updateBarChart2();
          updateBarChart3();
  });

drawBarCharts();
 
}


//call to event-data handling function
getRegionalData();

// Drawing the inital Charts
var drawBarCharts = function(){

scaleBarChart1();

  barChartGroup1.selectAll("rect")
                .data(chartDataset1)
                .enter()
                .append("rect")
                .attr({
                    x:function(d,i){
                      return (i * (barChart1Width/chartDataset1.length))+barMargin.left+barMargin.right+21;
                      },

                    y:function(d){
                       return barChartHeight/3-heightScale1(d.Population);
                   },

                    width:barChart1Width/chartDataset1.length -1,
                  
                    height: function(d){
                      return heightScale1(d.Population);
                    },

                   fill:function(d){
                      return "#56baec";
                    }
                   });
  
  overviewBarChartGroup1.selectAll("rect")
                        .data(chart1AgeDiv)
                        .enter()
                        .append("rect")
                        .attr({
                          x:function(d,i){
                           return (i * (barChart1Width/chart1AgeDiv.length))+barMargin.left+barMargin.right+21;
                        },

                         y:function(d){
                          return barChartHeight/3-heightScaleOverview1(d);
                        },

                         width:barChart1Width/chart1AgeDiv.length -1,
                  
                         height: function(d){
                           return heightScaleOverview1(d);
                       },

                         fill:function(d){
                          return "#56baec";
                       }
                    });


svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("id","xAxis1")
               .attr("transform","translate("+(barMargin.left+barMargin.right+25)+","+(barChartHeight/3)+")")
              .call(xAxis1);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("id","yAxis1")
               .attr("transform","translate("+(barMargin.left+barMargin.right+25)+",0)")
               .call(yAxis1);

svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("id","xAxisOverview1")
               .attr("transform","translate("+(barMargin.left+barMargin.right+25)+","+(barChartHeight/3)+")")
              .call(xAxisOverview1);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("id","yAxisOverview1")
               .attr("transform","translate("+(barMargin.left+barMargin.right+25)+",0)")
               .call(yAxisOverview1);



scaleBarChart2();

barChartGroup2.selectAll("rect")
                .data(chartDataset2)
                .enter()
                .append("rect")
                .attr({
                  x:function(d,i){
                    return i * (barChart1Width/chartDataset2.length)+barChart1Width+barMargin.left+barMargin.right+91;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale2(d.Population);
                  },

                  width:barChart1Width/chartDataset2.length -1,
                  
                  height: function(d){
                    return heightScale2(d.Population);
                  },

                  fill:function(d){
                    return "#b0e57c";
                  }
                  });

overviewBarChartGroup2.selectAll("rect")
                      .data(chart2AgeDiv)
                      .enter()
                      .append("rect")
                      .attr({
                        x:function(d,i){
                          return i * (barChart1Width/chart2AgeDiv.length)+barChart1Width+barMargin.left+barMargin.right+91;
                      },

                        y:function(d){
                           return barChartHeight/3-heightScaleOverview2(d);
                      },

                        width:barChart1Width/chart2AgeDiv.length -1,
                  
                        height: function(d){
                          return heightScaleOverview2(d);
                      },

                        fill:function(d){
                          return "#b0e57c";
                      }
                    });


svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("id","xAxis2")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart1Width+100)+","+(barChartHeight/3)+")")
              .call(xAxis2);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("id","yAxis2")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart1Width+100)+",0)")
               .call(yAxis2);

svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("id","xAxisOverview2")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart1Width+100)+","+(barChartHeight/3)+")")
              .call(xAxisOverview2);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("id","yAxisOverview2")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart1Width+100)+",0)")
               .call(yAxisOverview2);


scaleBarChart3();

barChartGroup3.selectAll("rect")
                .data(chartDataset3)
                .enter()
                .append("rect")
                .attr({
                  x:function(d,i){
                    return i * (barChart1Width/chartDataset3.length) + barChart1Width*2 + 181;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale3(d.Population);
                  },

                  width:barChart1Width/chartDataset3.length -1,
                  
                  height: function(d){
                      return heightScale3(d.Population);
                  },

                  fill:function(d){
                    return "#fe8402";
                  }
                  });

overviewBarChartGroup3.selectAll("rect")
                      .data(chart3AgeDiv)
                      .enter()
                      .append("rect")
                      .attr({
                        x:function(d,i){
                          return i * (barChart1Width/chart3AgeDiv.length) + barChart1Width*2 +181;
                      },

                        y:function(d){
                              return barChartHeight/3-heightScaleOverview3(d);
                      },

                         width:barChart1Width/chart3AgeDiv.length -1,
                  
                         height: function(d){
                              return heightScaleOverview3(d);
                  
                      },

                        fill:function(d){
                              return "#fe8402";
                      }
                     });

svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("id","xAxis3")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart2Width+170)+","+(barChartHeight/3)+")")
              .call(xAxis3);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("id","yAxis3")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart2Width+170)+",0)")
               .call(yAxis3);

svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("id","xAxisOverview3")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart2Width+170)+","+(barChartHeight/3)+")")
              .call(xAxisOverview3);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("id","yAxisOverview3")
               .attr("transform","translate("+(barMargin.left+barMargin.right+barChart2Width+170)+",0)")
               .call(yAxisOverview3);



          pie = d3.layout.pie()
                         .value(function(d){return d.Population});
          
          pieOverview = d3.layout.pie()
                                 .value(function(d){return d});

          var outerRadius1 = barChart1Width/3 - barMargin.bottom;
          var innerRadius1 = 0;
          arc = d3.svg.arc()
                      .innerRadius(innerRadius1)
                      .outerRadius(outerRadius1);
          
          pieChartGroup1.append("g")
                         .attr("transform","translate("+barChartWidth/2+","+barChartWidth/2+")");

          pieColor = d3.scale.category20();

          pieArcs1 = pieChartGroup1.datum(chartDataset1)
                                  .selectAll("path")
                                  .data(pie)
                                  .enter();

         piePath1 = pieArcs1.append("path")
                    .attr("fill",function(d,i){
                      return pieColor(i);})
                    .attr("d",arc)
                    .each(function(d){return this._current=d.Population2012;});

       
        pieArcsOverview1 = overviewPieChartGroup1.datum(chart1AgeDiv)
                                  .selectAll("path")
                                  .data(pieOverview)
                                  .enter();

        pieOverviewLegend=[],pieOverviewLegendHeight=-75;
        
        piePathOverview1 = pieArcsOverview1.append("path")
                    .attr("fill",function(d,i){
                      pieOverviewLegend[i]=pieColor(i);
                      return pieColor(i);})
                    .attr("d",arc);


         pieOverviewLegend.forEach(function(d,i){
                overviewPieChartGroup2.append("text")
                                      .attr("x",-barChartWidth/3 +20)
                                      .attr("y",pieOverviewLegendHeight+=15)
                                      .attr("fill",d)
                                      .attr("id",function(d){return "overviewPieChart1Percentage"+i;})
                                      .text(function(d){
                                        switch(i){
                                            case 0:
                                              return "< 10  ( "+((chart1AgeDiv[0]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                             case 1:
                                              return "10-20  ( "+((chart1AgeDiv[1]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                             case 2:
                                              return "20-30  ( "+((chart1AgeDiv[2]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                             case 3:
                                              return "30-40 ( "+((chart1AgeDiv[3]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                             case 4:
                                              return "40-50  ( "+((chart1AgeDiv[4]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                             case 5:
                                              return "50-60  ( "+((chart1AgeDiv[5]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                             case 6:
                                              return "60-70  ( "+((chart1AgeDiv[6]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                            case 7:
                                              return "70-80  ( "+((chart1AgeDiv[7]/totalPopulationChart1*100).toFixed(2))+"%)";
                                              break;

                                            case 8:
                                              return ">80    ( "+((chart1AgeDiv[8]/totalPopulationChart1*100).toFixed(2))+"%)";

                                              break;
                                        } 
                                      });
                                });
         
     
       

         pieChartGroup2.append("g")
                         .attr("transform","translate("+(barChartWidth/2+barChart1Width)+","+barChartWidth/2+")");


         pieArcs2 = pieChartGroup2.datum(chartDataset2)
                                  .selectAll("path")
                                  .data(pie)
                                  .enter();

         piePath2 = pieArcs2.append("path")
                    .attr("fill",function(d,i){return pieColor(i);})
                    .attr("d",arc)
                    .each(function(d){return this._current=d.Population2012;});

 
          

       
        pieArcsOverview2 = overviewPieChartGroup2.datum(chart2AgeDiv)
                                  .selectAll("path")
                                  .data(pieOverview)
                                  .enter();

         pieOverviewLegend=[],pieOverviewLegendHeight=-75;
         piePathOverview2 = pieArcsOverview2.append("path")
                    .attr("fill",function(d,i){
                      pieOverviewLegend[i] = pieColor(i);
                      return pieColor(i);})
                    .attr("d",arc);

        pieOverviewLegend.forEach(function(d,i){
                overviewPieChartGroup2.append("text")
                                      .attr("x",barChart1Width/3)
                                      .attr("y",pieOverviewLegendHeight+=15)
                                      .attr("fill",d)
                                      .attr("id",function(d){return "overviewPieChart2Percentage"+i;})
                                      .text(function(d){
                                        switch(i){
                                            case 0:
                                              return "< 10  ( "+((chart2AgeDiv[0]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                             case 1:
                                              return "10-20  ( "+((chart2AgeDiv[1]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                             case 2:
                                              return "20-30  ( "+((chart2AgeDiv[2]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                             case 3:
                                              return "30-40 ( "+((chart2AgeDiv[3]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                             case 4:
                                              return "40-50  ( "+((chart2AgeDiv[4]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                             case 5:
                                              return "50-60  ( "+((chart2AgeDiv[5]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                             case 6:
                                              return "60-70  ( "+((chart2AgeDiv[6]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                            case 7:
                                              return "70-80  ( "+((chart2AgeDiv[7]/totalPopulationChart2*100).toFixed(2))+"%)";
                                              break;

                                            case 8:
                                              return ">80    ( "+((chart2AgeDiv[8]/totalPopulationChart2*100).toFixed(2))+"%)";

                                              break;
                                        } 
                                     });
                                      });
     
         

             
             
        pieChartGroup3.append("g")
                         .attr("transform","translate("+(barChartWidth/2+barChart1Width)+","+barChartWidth/2+")");


         pieArcs3 = pieChartGroup3.datum(chartDataset3)
                                  .selectAll("path")
                                  .data(pie)
                                  .enter();

         piePath3 = pieArcs3.append("path")
                    .attr("fill",function(d,i){return pieColor(i);})
                    .attr("d",arc)
                    .each(function(d){return this._current=d.Population2012;});

             
             barPieToggle("visible","hidden");
             overviewDetailToggle("hidden","visible");
 
        pieArcsOverview3 = overviewPieChartGroup3.datum(chart3AgeDiv)
                                  .selectAll("path")
                                  .data(pieOverview)
                                  .enter();

         pieOverviewLegend=[],pieOverviewLegendHeight=-75;
         
         piePathOverview3 = pieArcsOverview3.append("path")
                    .attr("fill",function(d,i){
                      pieOverviewLegend[i] = pieColor(i);
                      return pieColor(i);})
                    .attr("d",arc);

         pieOverviewLegend.forEach(function(d,i){
                overviewPieChartGroup3.append("text")
                                      .attr("x",barChart1Width/3)
                                      .attr("y",pieOverviewLegendHeight+=15)
                                      .attr("fill",d)
                                      .attr("id",function(d){return "overviewPieChart3Percentage"+i;})
                                      .text(function(d){
                                        switch(i){
                                            case 0:
                                              return "< 10  ( "+((chart3AgeDiv[0]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                             case 1:
                                              return "10-20  ( "+((chart3AgeDiv[1]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                             case 2:
                                              return "20-30  ( "+((chart3AgeDiv[2]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                             case 3:
                                              return "30-40 ( "+((chart3AgeDiv[3]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                             case 4:
                                              return "40-50  ( "+((chart3AgeDiv[4]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                             case 5:
                                              return "50-60  ( "+((chart3AgeDiv[5]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                             case 6:
                                              return "60-70  ( "+((chart3AgeDiv[6]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                            case 7:
                                              return "70-80  ( "+((chart3AgeDiv[7]/totalPopulationChart3*100).toFixed(2))+"%)";
                                              break;

                                            case 8:
                                              return ">80    ( "+((chart3AgeDiv[8]/totalPopulationChart3*100).toFixed(2))+"%)";

                                              break;
                                        } 
                                     });
                                      });
     
         

 

}

// Implementation of Scale
var scaleBarChart1 = function(){
  xScale1 = d3.scale.linear()
                   .domain([0,
                        d3.max(chartDataset1,function(d){
                           if(d.Age!=999)
                            return d.Age;
                     })])
                    .range([0,barChartWidth/3]);

  yScale1 = d3.scale.linear()
                   .domain([0,d3.max(chartDataset1,function(d){
                          return d.Population;
                   })])
                  .range([barChartHeight/3,0]);

  heightScale1 = d3.scale.linear()
                        .domain([0,d3.max(chartDataset1,function(d){
                          return d.Population;
                        })])
                        .range([0,barChartHeight/3]);


  xScaleOverview1 = d3.scale.ordinal()
                   .domain(["<10","10-20","20-30","30-40","40-50","50-60","60-70","70-80",">80"])
                    .range([0,40,70,100,130,160,190,220,250]);

  yScaleOverview1 = d3.scale.linear()
                   .domain([0,d3.max(chart1AgeDiv,function(d){
                          return d;
                   })])
                  .range([barChartHeight/3,0]);

  heightScaleOverview1 = d3.scale.linear()
                        .domain([0,d3.max(chart1AgeDiv,function(d){
                          return d;
                        })])
                        .range([0,barChartHeight/3]);
xAxis1 = d3.svg.axis()
              .scale(xScale1)
              .orient("bottom").ticks(10);

yAxis1 = d3.svg.axis()
              .scale(yScale1)
              .orient("left").ticks(10);

xAxisOverview1 = d3.svg.axis()
                       .scale(xScaleOverview1)
                       .orient("bottom").ticks(10);

yAxisOverview1 = d3.svg.axis()
              .scale(yScaleOverview1)
              .orient("left").ticks(10);

}


var scaleBarChart2 = function(){
xScale2 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset2,function(d){
                    if(d.Age!=999)
                      return d.Age;
                 })])
                  .range([0,barChartWidth/3]);
yScale2 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset2,function(d){
                      return d.Population;
                 })])
                .range([barChartHeight/3,0]);

heightScale2 = d3.scale.linear()
                      .domain([0,d3.max(chartDataset2,function(d){
                          return d.Population;
                      })])
                     .range([0,barChartHeight/3]);
 
xScaleOverview2 = d3.scale.ordinal()
                    .domain(["<10","10-20","20-30","30-40","40-50","50-60","60-70","70-80",">80"])
                    .range([0,40,70,100,130,160,190,220,250]);

yScaleOverview2 = d3.scale.linear()
                   .domain([0,d3.max(chart2AgeDiv,function(d){
                          return d;
                   })])
                  .range([barChartHeight/3,0]);

heightScaleOverview2 = d3.scale.linear()
                        .domain([0,d3.max(chart2AgeDiv,function(d){
                          return d;
                        })])
                        .range([0,barChartHeight/3]);


xAxis2 = d3.svg.axis()
              .scale(xScale2)
              .orient("bottom").ticks(10);

yAxis2 = d3.svg.axis()
              .scale(yScale2)
              .orient("left").ticks(10);

xAxisOverview2 = d3.svg.axis()
              .scale(xScaleOverview2)
              .orient("bottom").ticks(10);

yAxisOverview2 = d3.svg.axis()
              .scale(yScaleOverview2)
              .orient("left").ticks(10);

}


var scaleBarChart3 = function(){
xScale3 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset3,function(d){
                    if(d.Age!=999)
                      return d.Age;
                 })])
                  .range([0,barChartWidth/3]);
yScale3 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset3,function(d){
                      return d.Population;
                 })])
                .range([barChartHeight/3,0]);

heightScale3 = d3.scale.linear()
                      .domain([0,d3.max(chartDataset3,function(d){
                          return d.Population;
                      })])
                      .range([0,barChartHeight/3]);

 
xScaleOverview3 = d3.scale.ordinal()
                     .domain(["<10","10-20","20-30","30-40","40-50","50-60","60-70","70-80",">80"])
                    .range([0,40,70,100,130,160,190,220,250]);


yScaleOverview3 = d3.scale.linear()
                   .domain([0,d3.max(chart3AgeDiv,function(d){
                          return d;
                   })])
                  .range([barChartHeight/3,0]);

heightScaleOverview3 = d3.scale.linear()
                        .domain([0,d3.max(chart3AgeDiv,function(d){
                          return d;
                        })])
                        .range([0,barChartHeight/3]);



xAxis3 = d3.svg.axis()
              .scale(xScale3)
              .orient("bottom").ticks(10);

yAxis3 = d3.svg.axis()
              .scale(yScale3)
              .orient("left").ticks(10);
xAxisOverview3 = d3.svg.axis()
              .scale(xScaleOverview3)
              .orient("bottom").ticks(10);

yAxisOverview3 = d3.svg.axis()
              .scale(yScaleOverview3)
              .orient("left").ticks(10);

}




//Populating Data
var insertDataToBarCharts = function(year){

 if(selectedCountryList[0]) 
    chart1AgeDiv=[0,0,0,0,0,0,0,0,0];
 if(selectedCountryList[1]) 
    chart2AgeDiv=[0,0,0,0,0,0,0,0,0];
 if(selectedCountryList[2]) 
    chart3AgeDiv=[0,0,0,0,0,0,0,0,0];
 
 totalPopulationChart1=0,totalPopulationChart2=0,totalPopulationChart3=0;
 for(var item,i=0;item=regionalDataset[i++];){
    var name = item.NAME;
    var population;
    switch(year)
    {
      case 2010:
        population = +item.POPEST2010_CIV;
        break
      case 2011:
         population =+item.POPEST2011_CIV;
         break;
      case 2012:
         population =+item.POPEST2012_CIV;
         break;
      case 2013:
         population =+item.POPEST2013_CIV;
         break;
      case 2014:
         population =+item.POPEST2014_CIV;
         break;

    }

    if(item.NAME == selectedCountryList[0])
    {
     if(item.SEX==0 && item.AGE <10)  
       chart1AgeDiv[0]+=population;
     
     if(item.SEX==0 && item.AGE>=10 && item.AGE<20)
      chart1AgeDiv[1]+=population;

     if(item.SEX==0 && item.AGE>=20 && item.AGE<30)
      chart1AgeDiv[2]+=population;

    if(item.SEX==0 && item.AGE>=30 && item.AGE<40)
      chart1AgeDiv[3]+=population;

    if(item.SEX==0 && item.AGE>=40 && item.AGE<50)
      chart1AgeDiv[4]+=population;

    if(item.SEX==0 && item.AGE>=50 && item.AGE<60)
      chart1AgeDiv[5]+=population;

    if(item.SEX==0 && item.AGE>=60 && item.AGE<70)
      chart1AgeDiv[6]+=population;

    if(item.SEX==0 && item.AGE>=70 && item.AGE<80)
      chart1AgeDiv[7]+=population;

    if(item.SEX==0 && item.AGE>=80 && item.AGE<999)
      chart1AgeDiv[8]+=population;
    if(item.SEX==0 && item.AGE<999)
      totalPopulationChart1+=population;
    if(item.SEX==0 && item.AGE>=12 && item.AGE<999)
      noOfPeopleWhoRemembersChart1+=population;      

    if(item.SEX==0 && item.AGE<999)
        chartDataset1.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,"Population":population});

   }
    
   if(item.NAME == selectedCountryList[1])
    {
     if(item.SEX==0 && item.AGE <10)  
       chart2AgeDiv[0]+=population;
     if(item.SEX==0 && item.AGE>=10 && item.AGE<20)
       chart2AgeDiv[1]+=population;
     if(item.SEX==0 && item.AGE>=20 && item.AGE<30)
       chart2AgeDiv[2]+=population;
    if(item.SEX==0 && item.AGE>=30 && item.AGE<40)
       chart2AgeDiv[3]+=population;

    if(item.SEX==0 && item.AGE>=40 && item.AGE<50)
       chart2AgeDiv[4]+=population;

    if(item.SEX==0 && item.AGE>=50 && item.AGE<60)
       chart2AgeDiv[5]+=population;

    if(item.SEX==0 && item.AGE>=60 && item.AGE<70)
       chart2AgeDiv[6]+=population;

    if(item.SEX==0 && item.AGE>=70 && item.AGE<80)
       chart2AgeDiv[7]+=population;
    if(item.SEX==0 && item.AGE>=80 && item.AGE<999)
       chart2AgeDiv[8]+=population;
    if(item.SEX==0 && item.AGE<999)
      totalPopulationChart2+=population;
    if(item.SEX==0 && item.AGE>=12 && item.AGE<999)
       noOfPeopleWhoRemembersChart2+=population;

    if(item.SEX==0 && item.AGE<999)
        chartDataset2.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,"Population":population});

   }

  if(item.NAME == selectedCountryList[2])
    {
     if(item.SEX==0 && item.AGE <10)  
       chart3AgeDiv[0]+=population;
     if(item.SEX==0 && item.AGE>=10 && item.AGE<20)
       chart3AgeDiv[1]+=population;
     if(item.SEX==0 && item.AGE>=20 && item.AGE<30)
       chart3AgeDiv[2]+=population;
    if(item.SEX==0 && item.AGE>=30 && item.AGE<40)
       chart3AgeDiv[3]+=population;
    if(item.SEX==0 && item.AGE>=40 && item.AGE<50)
       chart3AgeDiv[4]+=population;
    if(item.SEX==0 && item.AGE>=50 && item.AGE<60)
       chart3AgeDiv[5]+=population;
    if(item.SEX==0 && item.AGE>=60 && item.AGE<70)
       chart3AgeDiv[6]+=population;
    if(item.SEX==0 && item.AGE>=70 && item.AGE<80)
       chart3AgeDiv[7]+=population;
    if(item.SEX==0 && item.AGE>=80 && item.AGE<999)
       chart3AgeDiv[8]+=population;
    if(item.SEX==0 && item.AGE<999)
      totalPopulationChart3+=population;
    if(item.SEX==0 && item.AGE>=12 && item.AGE<999)
         noOfPeopleWhoRemembersChart3+=population;
    if(item.SEX==0 && item.AGE<999)
        chartDataset3.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,"Population":population});

   }
 
   }
}


// Updating the charts
var updateBarChart1 = function(){

  
scaleBarChart1();


svgBarContainer.select("#xAxis1")
               .transition()
               .duration(1000)
               .call(xAxis1);
              
svgBarContainer.select("#yAxis1")
               .transition()
               .duration(1000)
               .call(yAxis1);

svgBarContainer.select("#xAxisOverview1")
               .transition()
               .duration(1000)
               .call(xAxisOverview1);
              
svgBarContainer.select("#yAxisOverview1")
               .transition()
               .duration(1000)
               .call(yAxisOverview1);



barChartGroup1.selectAll("rect")
              .data(chartDataset1)
              .transition()
              .delay(function(d,i){
                return i/chartDataset1.length *1000;
              })
              .duration(1000)
              .ease("cubic-in-out")
              .attr({
                  x:function(d,i){
                    return i * (barChart1Width/chartDataset1.length)+barMargin.left+barMargin.right+21;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale1(d.Population);
                  },

                  width:barChart1Width/chartDataset1.length -1,
                  
                  height: function(d){
                    return heightScale1(d.Population);
                  },

                  opacity:function(d){
                    if(d.Age<12 && !allOrRemember)
                      return 0.5;
                  },

                  fill:function(d){
                    return "#56baec";
                  }
                  });
 

overviewBarChartGroup1.selectAll("rect")
                      .data(chart1AgeDiv)
                      .transition()
                      .delay(function(d,i){
                       return i/chart1AgeDiv.length *1000;
                       })
                      .duration(1000)
                      .ease("cubic-in-out")
                      .attr({
                      x:function(d,i){
                         return i * (barChart1Width/chart1AgeDiv.length)+barMargin.left+barMargin.right+21;
                      },

                      y:function(d){
                        return barChartHeight/3-heightScaleOverview1(d);
                      },

                         width:barChart1Width/chart1AgeDiv.length -1,
                  
                         height: function(d){
                        return heightScaleOverview1(d);
                      },

                        fill:function(d){
                          return "#56baec";
                      }
                    });

                     
barChartTitle1.text(selectedCountryList[0]);
              
barChartGroup1.selectAll("rect")
              .data(chartDataset1)
              .exit()
              .transition();
overviewBarChartGroup1.selectAll("rect")
              .data(chart1AgeDiv)
              .exit()
              .transition();


  piePath1 = pieChartGroup1.datum(chartDataset1)
                           .selectAll("path")
                           .data(pie)
                           .attr("d",arc);

piePathOverview1 = overviewPieChartGroup1.datum(chart1AgeDiv)
                           .selectAll("path")
                           .data(pieOverview)
                           .attr("d",arc);
if(totalPopulationChart1!=0)
{
d3.select("#overviewPieChart1Percentage0").text("<10 ( " +((chart1AgeDiv[0]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage1").text("10-20 ( " +((chart1AgeDiv[1]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage2").text("20-30 ( " +((chart1AgeDiv[2]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage3").text("30-40 ( " +((chart1AgeDiv[3]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage4").text("40-50 ( " +((chart1AgeDiv[4]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage5").text("50-60 ( " +((chart1AgeDiv[5]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage6").text("60-70 ( " +((chart1AgeDiv[6]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage7").text("70-80 ( " +((chart1AgeDiv[7]/totalPopulationChart1*100).toFixed(2))+"%)");
d3.select("#overviewPieChart1Percentage8").text(">80 ( " +((chart1AgeDiv[8]/totalPopulationChart1*100).toFixed(2))+"%)");
}








}


var updateBarChart2 = function(){

scaleBarChart2();
barChartGroup2.selectAll("rect")
              .data(chartDataset2)
              .transition()
              .delay(function(d,i){
                return i/chartDataset2.length *1000;
              })
              .duration(1000)
              .ease("cubic-in-out")
              .attr({
                   x:function(d,i){
                    return i * (barChart1Width/chartDataset2.length)+barChart1Width+barMargin.left+barMargin.right+91;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale2(d.Population);
                  },

                  width:barChart1Width/chartDataset2.length -1,
                  
                  height: function(d){
                    return heightScale2(d.Population);
                  },
                  opacity:function(d){
                    if(d.Age<12 && !allOrRemember)
                      return 0.5;
                  },

                  fill:function(d){
                      return "#b0e57c";
                  }
                  });

 overviewBarChartGroup2.selectAll("rect")
                       .data(chart2AgeDiv)
                       .transition()
                       .delay(function(d,i){
                         return i/chart2AgeDiv.length *1000;
                       })
                       .duration(1000)
                       .ease("cubic-in-out")
                       .attr({
                           x:function(d,i){
                            return i * (barChart1Width/chart2AgeDiv.length)+barChart1Width+barMargin.left+barMargin.right+91;
                        },

                        y:function(d){
                            return barChartHeight/3-heightScaleOverview2(d);
                        },

                        width:barChart1Width/chart2AgeDiv.length -1,
                  
                        height: function(d){
                            return heightScaleOverview2(d);
                        },

                        fill:function(d){
                             return "#b0e57c";
                        }
                      });

 svgBarContainer.select("#xAxis2")
               .transition()
               .duration(1000)
               .call(xAxis2);
              
svgBarContainer.select("#yAxis2")
               .transition()
               .duration(1000)
               .call(yAxis2);

 svgBarContainer.select("#xAxisOverview2")
               .transition()
               .duration(1000)
               .call(xAxisOverview2);
              
svgBarContainer.select("#yAxisOverview2")
               .transition()
               .duration(1000)
               .call(yAxisOverview2);

     
barChartTitle2.text(selectedCountryList[1]);
              
barChartGroup2.selectAll("rect")
              .data(chartDataset2)
              .exit()
              .transition();

overviewBarChartGroup2.selectAll("rect")
              .data(chart2AgeDiv)
              .exit()
              .transition();


piePath2 = pieChartGroup2.datum(chartDataset2)
                           .selectAll("path")
                           .data(pie)
                           .attr("d",arc);
piePathOverview2 = overviewPieChartGroup2.datum(chart2AgeDiv)
                           .selectAll("path")
                           .data(pieOverview)
                           .attr("d",arc);

if(totalPopulationChart2!=0)
{
d3.select("#overviewPieChart2Percentage0").text("<10 ( " +((chart2AgeDiv[0]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage1").text("10-20 ( " +((chart2AgeDiv[1]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage2").text("20-30 ( " +((chart2AgeDiv[2]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage3").text("30-40 ( " +((chart2AgeDiv[3]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage4").text("40-50 ( " +((chart2AgeDiv[4]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage5").text("50-60 ( " +((chart2AgeDiv[5]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage6").text("60-70 ( " +((chart2AgeDiv[6]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage7").text("70-80 ( " +((chart2AgeDiv[7]/totalPopulationChart2*100).toFixed(2))+"%)");
d3.select("#overviewPieChart2Percentage8").text(">80 ( " +((chart2AgeDiv[8]/totalPopulationChart2*100).toFixed(2))+"%)");
}



}

var updateBarChart3 = function(){

scaleBarChart3();
barChartGroup3.selectAll("rect")
              .data(chartDataset3)
              .transition()
              .delay(function(d,i){
                return i/chartDataset3.length *1000;
              })
              .duration(1000)
              .ease("cubic-in-out")
              .attr({
                x:function(d,i){
                    return i * (barChart1Width/chartDataset3.length) + barChart1Width*2 + 181;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale3(d.Population);
                  },

                  width:barChart1Width/chartDataset3.length -1,
                  
                  height: function(d){
                    return heightScale3(d.Population);
                  },
                  opacity:function(d){
                    if(d.Age<12 && !allOrRemember)
                      return 0.5;
                  },


                  fill:function(d){
                      return "#fe8402";
                  }
                  });
 
overviewBarChartGroup3.selectAll("rect")
                      .data(chart3AgeDiv)
                      .transition()
                      .delay(function(d,i){
                        return i/chart3AgeDiv.length *1000;
                       })
                      .duration(1000)
                      .ease("cubic-in-out")
                      .attr({
                         x:function(d,i){
                            return i * (barChart1Width/chart3AgeDiv.length) + barChart1Width*2 +181;
                         },

                         y:function(d){
                            return barChartHeight/3-heightScaleOverview3(d);
                         },

                          width:barChart1Width/chart3AgeDiv.length -1,
                  
                          height: function(d){
                            return heightScaleOverview3(d);
                         },

                          fill:function(d){
                            return "#fe8402";
                         } 
                        });
     
svgBarContainer.select("#xAxis3")
               .transition()
               .duration(1000)
               .call(xAxis3);
              
svgBarContainer.select("#yAxis3")
               .transition()
               .duration(1000)
               .call(yAxis3);

svgBarContainer.select("#xAxisOverview3")
               .transition()
               .duration(1000)
               .call(xAxisOverview3);
              
svgBarContainer.select("#yAxisOverview3")
               .transition()
               .duration(1000)
               .call(yAxisOverview3);



       
barChartTitle3.text(selectedCountryList[2]);
              
barChartGroup3.selectAll("rect")
              .data(chartDataset3)
              .exit()
              .transition()
overviewBarChartGroup3.selectAll("rect")
              .data(chart3AgeDiv)
              .exit()
              .transition()


    piePath3 = pieChartGroup3.datum(chartDataset3)
                          .selectAll("path")
                           .data(pie)
                           .attr("d",arc);
    overviewPiePath3 = overviewPieChartGroup3.datum(chart3AgeDiv)
                          .selectAll("path")
                           .data(pieOverview)
                           .attr("d",arc);

if(totalPopulationChart3!=0)
{
d3.select("#overviewPieChart3Percentage0").text("<10 ( " +((chart3AgeDiv[0]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage1").text("10-20 ( " +((chart3AgeDiv[1]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage2").text("20-30 ( " +((chart3AgeDiv[2]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage3").text("30-40 ( " +((chart3AgeDiv[3]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage4").text("40-50 ( " +((chart3AgeDiv[4]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage5").text("50-60 ( " +((chart3AgeDiv[5]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage6").text("60-70 ( " +((chart3AgeDiv[6]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage7").text("70-80 ( " +((chart3AgeDiv[7]/totalPopulationChart3*100).toFixed(2))+"%)");
d3.select("#overviewPieChart3Percentage8").text(">80 ( " +((chart3AgeDiv[8]/totalPopulationChart3*100).toFixed(2))+"%)");
}



}


