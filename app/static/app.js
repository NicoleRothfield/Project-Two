// d3.json("/getData").then(function(data){
//     console.log(data);
// })

// d3.json("/sunburst").then(function(data){
//     console.log(data);
// })

const dataPromise = d3.json("/averageDepartureDelay");
console.log("Data Promise: ", dataPromise);

//Use the D3 library to read in samples.json

function buildPlot(airport) {
    d3.json("/averageDepartureDelay").then((data) => {

        data = data.filter((x)=> x.ORIGIN == airport);

        // Sort airlines by avg departure delay
        data.sort((a, b) => d3.descending(a.AvgDeptDelay, b.AvgDeptDelay));


        var airlines = data.map(x => x.Description).slice(0, 10).reverse();
        var delays = data.map(x => x.AvgDeptDelay).slice(0, 10).reverse();


        //console.log(delays)

        var trace1 = {
            x: delays,
            y: airlines,
            text: airlines,
            type: "bar",
            orientation: "h" 
        };

        var barData = [trace1];

        var layout1 = {
            title: "Average Departure Delay in Minutes by Airline",
            margin: {
                l: 200,
                r: 100,
                t: 100,
                b: 100
            }
        };
        Plotly.newPlot("bar", barData, layout1);
    });
    
    d3.json("/delaySummary").then((data) => {

        data = data.filter((x)=> x.ORIGIN == airport)[0];
        // Sort airlines by avg departure delay
        //data.sort((a, b) => d3.descending(a.AvgDeptDelay, b.AvgDeptDelay));
        // var carrierDelay = data.map(x => x.SumCarrierDelay).reverse();
        var carrierDelay = [data.SumCarrierDelay, data.SumLateAircraftDelay, data.SumNASDelay, data.SumWeatherDelay];
        var delays2 = ['Carrier Delay', 'Late Aircraft Delay', 'NAS Delay', 'Weather Delay'];

        console.log(carrierDelay);

        var trace2 = {
            x: carrierDelay.reverse(),
            y: delays2.reverse(),
            text: delays2,
            type: "bar",
            orientation: "h" 
        };

        var barData2 = [trace2];

        var layout1 = {
            title: "Departure Delay Reason Summary in Minutes",
            margin: {
                l: 200,
                r: 100,
                t: 100,
                b: 100
            }
        };
        Plotly.newPlot("bar2", barData2, layout1);
    });
}


// This function for dropdown selection
function init() {
    
    var dropdownMenu = d3.select("#selDataset");

    d3.json("/getAirports").then((data) => {
        data = data.filter((x)=> x.Count > 500);
        data.sort((a, b) => d3.ascending(a.Airport, b.Airport));
        var originAirport = data.map(x => x.Airport);
        originAirport.forEach((Airport) => {
            console.log(Airport);
            dropdownMenu
                .append("option")
                .text(Airport)
                .property("value", Airport);
        });
        var firstAirport = originAirport[0];
        buildPlot(firstAirport);
    });
}

function optionChanged(newOrigin) {
    // Fetch new data each time a new sample is selected
    buildPlot(newOrigin);
  }

init();