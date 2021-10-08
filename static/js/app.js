d3.json("../../data/mouse_data.json").then((mouse_data) => {
    // console.log(mouse_data);

    // Find min & max of age
    var age_months = mouse_data.map(d => d.age_months);
    console.log(`Max Age: ${Math.max(...age_months)}`);
    console.log(`Min Age: ${Math.min(...age_months)}`);

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

    // DETAILS CARD
    // Select the card location
    card_list = d3.select("#list-group");


    function calculateBubbles(mouse_data) {
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
        var mouse_ids = [];

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
                mouse_ids.push(uniqueIDs[i]);
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

        return ([volDifference, endWeight, drugRegimen, mouse_ids]);

};
    
    

    // Initialize the graph when loaded with default data
    function init() {

        // Line Plot: initialize with first mouse
        var mouseID = "k403";
        var filteredData = mouse_data.filter(mouse => mouse.mouse_id == mouseID);

        // Create arrays for single mouse results
        var timepoints = filteredData.map(d => d.timepoint);
        var weight = filteredData.map(d => d.weight_g);
        var volume = filteredData.map(d => d.tumor_vol_mm3);
        var regimens = filteredData.map(d => d.drug_regimen);
        var sex = filteredData.map(d => d.sex);
        var metastatic_sites = filteredData.map(d => d.metastatic_sites);
        var age = filteredData.map(d => d.age_months);

        // Line Plot trace
        var trace1 = [{
            x: timepoints,
            y: volume,
            type: 'scatter',
            name: 'Volume'
        }];

        // Line Plot layout
        var layout1 = {
            title:'Volume Progress Over Time',
            height: 400,
            xaxis: {
                title: 'Timepoint',
                showgrid: false,
                zeroline: false
            },
            yaxis: {
                title: 'Volume',
                showline: false
            },
            font: { family: 'Times' }
        };

        var bubbleData = mouse_data.filter(mouse => mouse.drug_regimen == regimens[0]);
        // Structure: [0: volDifference, 1: endWeight, 2: drugRegimen, 3: mouse_ids]
        var bubbleValues = calculateBubbles(bubbleData);

        // Bubble Plot trace
        var trace2 = [{
            x: bubbleValues[3],
            y: bubbleValues[0],
            hovertext: bubbleValues[3],
            mode: 'markers',
            marker: {
                color: bubbleValues[0],
                colorscale: 'Greens',
                size: bubbleValues[1]
            }
        }];
        
        // Bubble plot layout
        var layout2 = {
            title: `Tumor Progress by Weight: ${regimens[0]}`,
            showlegend: false,
            height: 500,
            xaxis: {
                title: "Mouse ID"
            },
            yaxis: {
                title: "Difference in Volume",
                //type: "category"
            },
            font: { family: 'Times'}
        };

        // Append a list option with each details value
        card_list.append("li").text(`Mouse ID: ${mouseID}`).attr("class", "list-group-item");
        card_list.append("li").text(`Age: ${age[0]} months`).attr("class", "list-group-item");
        card_list.append("li").text(`Regimen: ${regimens[0]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Weight: ${weight[0]} g`).attr("class", "list-group-item");
        card_list.append("li").text(`Sex: ${sex[0]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Metastatic Sites: ${metastatic_sites[0]}`).attr("class", "list-group-item");
        
        // Indicator Plot trace
        var trace3 = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: age[0],
                title: "Mouse Age<br><span style='font-size:0.8em;color:gray'>Months</span>",
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: { color: '#518290' },
                    axis: { range: [1, 24] },
                    steps: [
                        { range: [1, 3], color: '#F2F7F8'},
                        { range: [3, 6], color: '#E5EEF0'},
                        { range: [6, 9], color: '#D8E6E9'},
                        { range: [9, 12], color: '#CBDDE2'},
                        { range: [12,15], color: '#BED5DA'},
                        { range: [15, 18], color: '#B1CCD3'},
                        { range: [18, 21], color: '#9BBEC7'},
                        { range: [21, 24], color: '#89B3BD'}
                    
                    ],
                    threshold: {
                        line: { color: "#33535B" , width: 4 }, 
                        thickness: 0.75,
                        value: age[0]
                    }
                }
            }
        ];
        
        // Indicator Layout
        var layout3 = { margin: { t: 100, b: 100 }, font: { family: 'Times' }, height: 400 };

        var config = { responsive: true };
        
        // Define where the plots will live
        var line_plot = d3.selectAll("#line-plot").node();
        var bubble_plot = d3.selectAll("#bubble-plot").node();
        var indicator_plot = d3.selectAll("#indicator-plot").node();
        
        // Plot the plots
        Plotly.newPlot(line_plot, trace1, layout1, config);
        Plotly.newPlot(bubble_plot, trace2, layout2, config);
        Plotly.newPlot(indicator_plot, trace3, layout3, config);
    
    };

    // Initialize dashboard
    init();

    // When the page is changed, update the plot
    d3.selectAll("#selID").on("change", updatePlotly);

    function updatePlotly() {
        // Define where the plots will live
        var bubble_plot = d3.selectAll("#bubble-plot").node();
        var indicator_plot = d3.selectAll("#indicator-plot").node();
        var line_plot = d3.selectAll("#line-plot").node();

        // Grab Mouse ID from dropdown
        var mouseID = dropdown.node().value;
        // console.log(mouseID);

        // Filter the new results from chosen Mouse ID
        var filteredData = mouse_data.filter(mouse => mouse.mouse_id == mouseID);

        // Create arrays for each detail
        var timepoints = filteredData.map(d => d.timepoint);
        var weight = filteredData.map(d => d.weight_g);
        var volume = filteredData.map(d => d.tumor_vol_mm3);
        var regimens = filteredData.map(d => d.drug_regimen);
        var sex = filteredData.map(d => d.sex);
        var metastatic_sites = filteredData.map(d => d.metastatic_sites);
        var age = filteredData.map(d => d.age_months);

        // Find new values for specific regimen
        var bubbleData = mouse_data.filter(mouse => mouse.drug_regimen == regimens[0]);
        // Structure: [0: volDifference, 1: endWeight, 2: drugRegimen, 3: mouse_ids]
        var bubbleValues = calculateBubbles(bubbleData);

        // Restyle the line plot with new data
        Plotly.restyle(line_plot, "x", [timepoints]);
        Plotly.restyle(line_plot, "y", [volume]);

        // Restyle the bubble plot with new data
        Plotly.restyle(bubble_plot, "x", [bubbleValues[3]]);
        Plotly.restyle(bubble_plot, "y", [bubbleValues[0]]);
        Plotly.restyle(bubble_plot, "hovertext", [bubbleValues[3]]);
        Plotly.restyle(bubble_plot, "marker.size", [bubbleValues[1]]);
        Plotly.restyle(bubble_plot, "marker.color", [bubbleValues[0]]);
        Plotly.relayout(bubble_plot, "title", `Tumor Progress by Weight: ${regimens[0]}`)

        // Restyle the indicator plot with new data
        Plotly.restyle(indicator_plot, "value", [age[0]]);
        Plotly.restyle(indicator_plot, "gauge.threshold.value", [age[0]]);

        // DETAILS CARD
        // Select the card location
        card_list = d3.select("#list-group");

        // Clear the details card
        card_list.html("");
        
        // Append a list option with each details value
        card_list.append("li").text(`Mouse ID: ${mouseID}`).attr("class", "list-group-item");
        card_list.append("li").text(`Age: ${age[0]} months`).attr("class", "list-group-item");
        card_list.append("li").text(`Regimen: ${regimens[0]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Weight: ${weight[0]} g`).attr("class", "list-group-item");
        card_list.append("li").text(`Sex: ${sex[0]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Metastatic Sites: ${metastatic_sites[0]}`).attr("class", "list-group-item");
        
        
    };
        

    

});