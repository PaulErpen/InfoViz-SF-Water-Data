import React from "react";
import { useSelector } from "react-redux";

const TimeLine = (props) => {
    const yearRange = useSelector(state => state.yearRange);

    return <div class="time-line-wrapper">
        <div class="time-line">
            <div class="time-line-slider"></div>
        </div>
        <div>
            {yearRange}
        </div>
    </div>
}

export default TimeLine;