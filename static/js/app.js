d3.json("../../data/mouse_data.json").then((mouse_data) => {
    console.log(mouse_data);
    
    console.log(mouse_data[0].mouse_id);

    // Select dropdown
    var dropdown = d3.select("#dropdown-menu>#selID");

    // Create array for ids
    var ids = mouse_data.map(d => d.mouse_id);
    console.log("---IDs---");
    console.log(ids);

    // GET RID OF DUPLICATES
    // Convert the array to a set
    var setIDs = new Set(ids);
    // Convert the set back into an array
    var uniqueIDs = Array.from(setIDs);
    // For each id, append the name to a dropdown attribute
    uniqueIDs.forEach(id => {
        
        var item = dropdown.append("option");
        item.attr("class", "dropdown-item");
        item.text(id);
    });

    // console.log(uniqueIDs);

    var timepoints = mouse_data.map(d => d.timepoint);
    var weight = mouse_data.map(d => d.weight_g);
    var volume = mouse_data.map(d => d.tumor_vol_mm3);
    var regimens = mouse_data.map(d => d.drug_regimen);

    // Define arrays
    var minTime = [];
    var maxTime = [];
    var volDifference = [];
    var endVol = [];
    var startVol = [];
    var drugRegimen = [];
    var endWeight = [];

    // Loop through each timepoint
    for (var i = 0; i < timepoints.length; i++) {

        // If the current mouse is not the same as next
        // Finding the maxiumum times for each mouse
        if (ids[i] != ids[i+1]) {
            // var min_time = timepoints[i+1];
            var max_time = timepoints[i];
            maxTime.push(max_time);
            endVol.push(volume[i]);
            drugRegimen.push(regimens[i]);
            endWeight.push(weight[i]);
            // console.log(ids[i], max_time);
        }
        // If the current mouse is not the same as previous
        // Finding the minimum times for each mouse
        if (ids[i] != ids[i-1]) {
            var min_time = timepoints[i];
            minTime.push(min_time);
            startVol.push(volume[i])
            // console.log(ids[i], min_time);
        }
        
    };

    console.log(startVol);
    console.log(endVol);
    
    // Loop through and push to array
    for (var i = 0; i < startVol.length; i++) {
        volDifference.push(endVol[i] - startVol[i])
    }

    // Difference in volumes
    console.log(volDifference);

    // DEMOGRAPHIC CARD
    // Select the card location
    card_list = d3.select("#list-group");
    
    

    // Initialize the graph when loaded with default data
    function init() {

        // Bubble Plot trace
        var trace2 = [{
            x: uniqueIDs,
            y: endWeight,
            hovertext: drugRegimen,
            mode: 'markers',
            marker: {
                // color: drugRegimen,
                size: volDifference
            }
        }];
        
        // Bubble plot layout
        var layout2 = {
            title: "Number of OTUs per Sample",
            showlegend: false,
            // height: 600,
            // width: 1200,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values",
                //type: "category"
            },
            font: { family: 'Times'}
        };

        // Line Plot
        var mouseID = "k403";
        var filteredData = mouse_data.filter(mouse => mouse.mouse_id == mouseID);

        // Create arrays for single mouse results
        var timepoints = filteredData.map(d => d.timepoint);
        var weight = filteredData.map(d => d.weight_g);
        var volume = filteredData.map(d => d.tumor_vol_mm3);
        var regimens = filteredData.map(d => d.drug_regimen);
        var sex = filteredData.map(d => d.sex);
        var metastatic_sites = filteredData.map(d => d.metastatic_sites);

        var trace1 = {
            x: timepoints,
            y: volume,
            type: 'scatter',
            name: 'Volume'
        };

        var layout = {
            title:'Volume Progress Over Time',
            xaxis: {
                title: 'Timepoint',
                showgrid: false,
                zeroline: false
            },
            yaxis: {
            title: 'Volume',
            showline: false
            }
        };
        
        var data = [trace1];
        
        // var regimens = filteredData.map(d => d.drug_regimen);

        // mouse_id
        // sex
        // metastatic_sites

        // Append a list option with each demographic value
        card_list.append("li").text(`Regimen: ${regimens[0]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Weight: ${weight[0]} g`).attr("class", "list-group-item");
        card_list.append("li").text(`Sex: ${sex[0]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Metastatic Sites: ${metastatic_sites[0]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Mouse ID: ${mouseID}`).attr("class", "list-group-item");
        // card_list.append("li").text(`Bellybutton Type: ${bb_type}`).attr("class", "list-group-item");
        // card_list.append("li").text(`Wash Frequency: ${wfreq[0]}`).attr("class", "list-group-item");
       
        
    //     // Indicator Plot trace
    //     var trace3 = [
    //         {
    //             domain: { x: [0, 1], y: [0, 1] },
    //             value: wfreq[0],
    //             title: "Wash Frequency<br><span style='font-size:0.8em;color:gray'>Number of Bellybutton Scrubs<br>per Week</span>", // { text: "Washing Frequency" },
    //             type: "indicator",
    //             mode: "gauge+number",
    //             // delta: { reference: 3 },
    //             gauge: {
    //                 bar: { color: '#518290' },  // 'rgb(239, 203, 104)', '#518290'
    //                 axis: { range: [0, 9] },
    //                 steps: [
    //                     { range: [0, 1], color: '#F2F7F8'},
    //                     { range: [1, 2], color: '#E5EEF0'},
    //                     { range: [2, 3], color: '#D8E6E9'},
    //                     { range: [3, 4], color: '#CBDDE2'},
    //                     { range: [4, 5], color: '#BED5DA'},
    //                     { range: [5, 6], color: '#B1CCD3'},
    //                     { range: [6, 7], color: '#9BBEC7'},
    //                     { range: [7, 8], color: '#89B3BD'},
    //                     { range: [8, 9], color: '#7CAAB6'}
                    
    //                 ],
    //                 threshold: {
    //                     line: { color: "#33535B" , width: 4 }, //'rgb(239, 203, 104)', "#33535B"
    //                     thickness: 0.75,
    //                     value: wfreq[0]
    //                 }
    //             }
    //         }
    //     ];
        
    //     // Indicator Layout
    //     var layout3 = { margin: { t: 100, b: 100 }, font: { family: 'Times' } };
    //     // var layout3 = { width: 500, height: 300, margin: { t: 0, b: 0 } };

        var config = { responsive: true };
        
    //     // Define where the plots will live
    //     var bar_plot = d3.selectAll("#bar-plot").node();
        var bubble_plot = d3.selectAll("#bubble-plot").node();
    //     var indicator_plot = d3.selectAll("#indicator-plot").node();
        var line_plot = d3.selectAll("#line-plot").node();

    //     // Plot the plots
    //     Plotly.newPlot(bar_plot, trace1, layout1, config);
        Plotly.newPlot(bubble_plot, trace2, layout2, config);
    //     Plotly.newPlot(indicator_plot, trace3, layout3, config);
        Plotly.newPlot(line_plot, data, layout, config);
    
    };

    init();

    // When the page is changed, update the plot
    d3.selectAll("#selID").on("change", updatePlotly);

    function updatePlotly() {
        // Define where the plots will live
        var bubble_plot = d3.selectAll("#bubble-plot").node();
    //     var indicator_plot = d3.selectAll("#indicator-plot").node();
        var line_plot = d3.selectAll("#line-plot").node();

        var mouseID = dropdown.node().value;
        // console.log(mouseID);

        var filteredData = mouse_data.filter(mouse => mouse.mouse_id == mouseID);

        var timepoints = filteredData.map(d => d.timepoint);
        var weight = filteredData.map(d => d.weight_g);
        var volume = filteredData.map(d => d.tumor_vol_mm3);
        var regimens = filteredData.map(d => d.drug_regimen);

        // Restyle the bar plot with new data
        Plotly.restyle(line_plot, "x", [timepoints]);
        Plotly.restyle(line_plot, "y", [volume]);
        

    }

});