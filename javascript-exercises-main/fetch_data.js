import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    // apiKey: "YOUR_API_KEY",
    databaseURL: "https://node-red-afd5a-default-rtdb.firebaseio.com",
    projectId: "node-red-afd5a",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const voltageRef = ref(database, "voltage");
const temperatureRef = ref(database, "temperature");

let voltageData = [];
let temperatureData = [];

// ========================================================================


function convertToAvg(data){
    const temporary = {};

    for(const [key, value] of Object.entries(data)){

        const avg_time = Math.floor(key/(3*60*1000)) * (3*60*1000);

        if(!temporary[avg_time]){
            temporary[avg_time] = {sum: 0, count: 0};
        }

        temporary[avg_time].sum+=value;
        temporary[avg_time].count+=1;
    }

    const average = {};
    for(const avg_time in temporary){
        const avg_volt = temporary[avg_time].sum / temporary[avg_time].count;

        average[avg_time] = avg_volt.toFixed(2);
    }

    return average;
}

// Average data per 3 minutes of voltage.
const volt = document.getElementById('svg5');
controlplot_for_node(volt);
function voltage_chart(freshData){
    const voltage = Object.values(freshData);
    const time_stamp = Object.keys(freshData);

    const oldVoltDots = volt.querySelectorAll("circle[fill='blue']");
    oldVoltDots.forEach(dot => dot.remove());

    const oldTexts = volt.querySelectorAll('.svg-text[y="400"]');
    oldTexts.forEach(text => text.remove());

    // plots.innerHTML = '';
    // controlplot(plots);

    for (let i = 1, j=voltage.length-59; i <= 60 && j<=voltage.length; i += 1, j += 1) {
        if (voltage[j - 1] === undefined){
            continue;
        }

        drawCircle(volt, {cx: 40 + 30 * i, cy: 20 + 30 * (46 - voltage[j - 1]), r: 3, fill: 'blue'});
        drawText(volt , {x: 40 + 30 * i, y: 400, text: time_stamp[j-1]});
    }
}

// Average data per 3 minutes of Temperature.
const temp = document.getElementById('svg6');
controlplot_for_node(temp);
function temperature_chart(freshData){
    const temperature = Object.values(freshData);
    const time_stamp = Object.keys(freshData);

    const oldVoltDots = temp.querySelectorAll("circle[fill='orange']");
    oldVoltDots.forEach(dot => dot.remove());

    const oldTexts = temp.querySelectorAll('.svg-text[y="400"]');
    oldTexts.forEach(text => text.remove());

    // plots.innerHTML = '';
    // controlplot(plots);

    for (let i = 1, j=temperature.length-59; i <= 60 && j<=temperature.length; i += 1, j += 1) {
        if (temperature[j - 1] === undefined){
            continue;
        }

        drawCircle(temp, {cx: 40 + 30 * i, cy: 20 + 30 * (46 - temperature[j - 1]), r: 3, fill: 'orange'});
        drawText(temp , {x: 40 + 30 * i, y: 400, text: time_stamp[j-1]});
    }
}

// Realtime data of voltage and temperature in one graph.
const both = document.getElementById("svg4");
controlplot_for_node(both);
function realtime_chart(voltData, tempData){
    const temperature = Object.values(tempData);
    const voltage = Object.values(voltData);

    const time_stamp = Object.keys(voltData);

    const oldTempDots = both.querySelectorAll("circle[fill='orange']");
    oldTempDots.forEach(dot => dot.remove());

    const oldVoltDots = both.querySelectorAll("circle[fill='blue']");
    oldVoltDots.forEach(dot => dot.remove());

    const oldTexts = both.querySelectorAll('.svg-text[y="400"]');
    oldTexts.forEach(text => text.remove());

    // plots.innerHTML = '';
    // controlplot(plots);

    let k = temperature.length-59;
    for (let i = 1, j=voltage.length-59; i <= 60 && j<=voltage.length; i += 1, j += 1) {
        if (temperature[k - 1] !== undefined){
            drawCircle(both, {cx: 40 + 30 * i, cy: 20 + 30 * (46 - temperature[k - 1]), r: 3, fill: 'orange'});
        }

        if (voltage[j - 1] !== undefined){
            drawCircle(both, {cx: 40 + 30 * i, cy: 20 + 30 * (46 - voltage[j - 1]), r: 3, fill: 'blue'});
        }

        drawText(both , {x: 40 + 30 * i, y: 400, text: time_stamp[j-1]});
        k +=1 ;

    }
}


// ========================================================================

onValue(voltageRef, (snapshot)=>{
    voltageData = snapshot.val() || {};

    realtime_chart(voltageData, temperatureData);
    const avgData = convertToAvg(voltageData);
    voltage_chart(avgData);
})

onValue(temperatureRef, (snapshot)=>{
    temperatureData = snapshot.val() || {};

    realtime_chart(voltageData, temperatureData);
    const avgData = convertToAvg(temperatureData);
    temperature_chart(avgData);
})

// Promise.all([
//     get(ref(database, 'voltage')),
//     get(ref(database, 'temperature'))
// ]).then(([voltageSnapshot, temperatureSnapshot]) => {
//     const voltageData = voltageSnapshot.val() || {};
//     const temperatureData = temperatureSnapshot.val() || {};
//
//     realtime_chart(voltageData, temperatureData);
// }).catch((error) => {
//     console.error("Error fetching data:", error);
// });
