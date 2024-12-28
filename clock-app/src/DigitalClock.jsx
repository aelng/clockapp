import React, {useState, useEffect} from 'react';
import { FaAlignJustify } from "react-icons/fa";

function DigitalClock (){

    const [time, setTime] = useState(new Date());
    const [zone, setZone] = useState("UTC");
    const [color, setColor] = useState("#FFFFFF");

    // time-zone adjustment
    function setTimeZone(date, timeZone) {
        // Format the date for the target time zone
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true, // Ensure we capture AM/PM information
        });

        // Extract parts from the formatted string
        const parts = formatter.formatToParts(date);

        // Safely retrieve each part
        const year = parseInt(parts.find((p) => p.type === "year").value, 10);
        const month = parseInt(parts.find((p) => p.type === "month").value, 10) - 1; // JS months are 0-indexed
        const day = parseInt(parts.find((p) => p.type === "day").value, 10);
        const hour = parseInt(parts.find((p) => p.type === "hour").value, 10);
        const minute = parseInt(parts.find((p) => p.type === "minute").value, 10);
        const second = parseInt(parts.find((p) => p.type === "second").value, 10);
        const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value;

        // Convert to 24-hour format if needed
        const adjustedHour =
            dayPeriod === "PM" && hour !== 12 ? hour + 12 : dayPeriod === "AM" && hour === 12 ? 0 : hour;

        // Construct a new Date object in UTC
        return new Date(year, month, day, adjustedHour, minute, second);
      }
      
    

    useEffect(() => {
        const intervalId = setInterval(() => {
            let originalDate = new Date();
            originalDate = setTimeZone(originalDate, zone);
            //console.log(new Date());
            //console.log(originalDate);
            setTime(originalDate);
            //console.log(zone)
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, [zone]);

    function formatTime(){
        let hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const meridiem = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridiem}`;
    }

    function padZero(number) {
        return (number < 10 ? "0" : "") + number;
    }


    function handleZoneChange(event) {
        setZone(event.target.value);
    }

    function handleColorChange(event) {
        setColor(event.target.value);
    }


    return (
        <>
            
            <div className="option">
            <FaAlignJustify className="option-icon"/>
                <div className="option-color">
                    <label>Select a Color:</label>
                    <input type="color" value = {color} onChange={handleColorChange}/>
                </div>
                <div className="option-zone">
                    <label>Time zone:</label>
                    <select value = {zone} onChange={handleZoneChange}>
                        <option value="UTC">UTC</option>
                        <option value="America/Toronto">EST</option>
                        <option value="America/Los_Angeles">PST</option>
                    </select>
                </div>
            </div>
            <div className="wrapping">
                <div className="clock-container">
                    <div className="clock">
                        <span style={{color: color}}>{formatTime()}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DigitalClock;