import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Legend from "../Legend/Legend";
import { labelToUnitMapping, valueColors, valueOptions } from "../MetaData";
import "./ActiveStationDialog.scss";

const ActiveStationDialog = () => {
    const dispatch = useDispatch();
    const selectedOptionLabel = useSelector(state => valueOptions.find(opt => opt.value.join(":") === state.selectedValues.join(":")).label);
    const {activeStationId, activeStationData} = useSelector(state => {
        return {
          activeStationId: state.activeStationId, 
          activeStationData: state.organizedStationData ? state.organizedStationData[state.activeStationId+".0"] : undefined
        };
    });
    const selectedValues = useSelector(state => state.selectedValues);

    useEffect(() => {
        if(activeStationId && activeStationData) {
          const margin = {top: 10, right: 30, bottom: 30, left: 60},
              width = window.innerWidth - 240 - margin.left - margin.right,
              height = 400 - 40 - margin.top - margin.bottom;

          // append the svg object to the body of the page
          const dataViz = d3.select("#my_dataviz");
          dataViz.html("");
          const svg = dataViz.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

          let data = activeStationData.map(point => {
            point.date = d3.timeParse("%Y-%m-%d")(point["MonthYear"]+"-01");
            return point;
          });

          // Add X axis --> it is a date format
          const x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);

          svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

          let max_value = data.map(
            point => selectedValues.map(
              key => parseFloat(point[key]))
              .reduce((a, b) => {return Math.max(a,b)}, 0))
              .reduce((a, b) => {return Math.max(a,b)}, 0)
          selectedValues.forEach(valueKey => {
            // Add Y axis
            const y = d3.scaleLinear()
              .domain([0, max_value])
              .range([ height, 0 ]);
            svg.append("g")
              .call(d3.axisLeft(y));

            // Add the line
            svg.append("path")
              .datum(data)
              .attr("fill", "none")
              .attr("stroke", valueColors[valueKey])
              .attr("stroke-width", 1.5)
              .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(parseFloat(d[valueKey])) }))
          });
        }
    }, [activeStationData]);

    const close = () => {
        dispatch({
            type: "activeStationId/set",
            payload: undefined,
        });
    }

    return <div className={`active-station-dialog-wrapper ${activeStationId ? "visible" : ""}`}>
        <div className="active-station-dialog">
            <div className="active-station-dialog-inner">
                <h3>Station {activeStationId} - {selectedOptionLabel}</h3>
                <div className="unit-indicator">in {labelToUnitMapping[selectedOptionLabel]}</div>
                <div id="my_dataviz"></div>
                <div className="legend-wrapper">
                  <Legend/>
                </div>
            </div>
            <button className="close-button" type="button" onClick={() => close()}>x</button>
        </div>
    </div>
}

export default ActiveStationDialog;