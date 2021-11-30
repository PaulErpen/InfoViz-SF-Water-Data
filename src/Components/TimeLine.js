import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TimeLine = (props) => {
    const [dragging, setDragging] = useState(false);
    const [sliderXPosition, setSliderXPosition] = useState(0);
    const {monthYearRange, yearRange} = useSelector(state => {
        if(!state.yearMonthRange) return {
            monthYearRange: null, 
            yearRange: null
        };
        let years = Array.from(
            new Set(
                state.yearMonthRange.map(
                    x => x.slice(0,4))));
        return {
            monthYearRange: state.yearMonthRange, 
            yearRange: years
        }
    });
    const sliderRef = useRef();
    const dispatch = useDispatch();
    // const yearElementWidthInPX = 32;

    // useEffect(() => {
    //     elementsToDisplay = sliderRef.current.innerWidth / 32;
    // }, [yearRange]);

    const moveMouseToCursorPosition = (e) => {
        const slider = sliderRef.current;
        let newPosition = e.pageX - slider.offsetLeft;
        if(newPosition > slider.offsetWidth) {
            newPosition = slider.offsetWidth;
        } else if(newPosition < 0) {
            newPosition = 0;
        }
        setSliderXPosition(newPosition - 10);
        let posRelative = Math.floor((newPosition / slider.offsetWidth) * monthYearRange.length);
        let dateParts = monthYearRange[posRelative].split("-");
        dispatch({
            type: "currentTime/set",
            payload: {
                year: parseInt(dateParts[0]),
                month: parseInt(dateParts[1]),
            }
        });
    }

    const handleMouseDown = (e) => {
        setDragging(true);
        moveMouseToCursorPosition(e);
    }

    const handleMouseMove = (e) => {
        if(dragging) {
            moveMouseToCursorPosition(e);
        }
    }

    const handleMouseUp = () => {
        setDragging(false);
    }

    const handleMouseLeave = () => {
        setDragging(false);
    }

    return <div className="time-line-wrapper">
        <div className="time-line" ref={sliderRef} 
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave} 
        onMouseUp={handleMouseUp} 
        onMouseMove={handleMouseMove}>
            <div className="time-line-slider" style={{left: `${ sliderXPosition }px`}}></div>
        </div>
        <div className="year-indicators">
            { 
                yearRange && yearRange.map(year => {
                    return <div className="year-indicator">
                        {year}
                    </div>
                })
            }
        </div>
    </div>
}

export default TimeLine;