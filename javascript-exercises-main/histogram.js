const bars = document.getElementById('svg2');
bar_chart(bars);

function bar_chart(svg){
    for (let i = 0; i <= 12; i += 1) {
        // axis ticks
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384});

        // axis labels
        drawText(svg, {x: 35 + 30 * i, y: 400, text: i+34});
    }

    for (let i = 2; i <= 13; i += 1) {
        // axis ticks
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i - 1), x2: 40, y2: 20 + 30 * (i - 1)});

        // axis labels
        drawText(svg, {x: 20, y: 25 + 30 * (i - 1), text: (12 - i + 1)*5});
    }

    drawRectangle(svg, {
        x: 40,
        y: 360,
        width: 29.5,
        height: 20,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 70,
        y: 320,
        width: 29.5,
        height: 60,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 100,
        y: 280,
        width: 29.5,
        height: 100,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 130,
        y: 270,
        width: 29.5,
        height: 110,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 160,
        y: 200,
        width: 29.5,
        height: 180,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 190,
        y: 50,
        width: 29.5,
        height: 330,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 220,
        y: 60,
        width: 29.5,
        height: 320,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 250,
        y: 105,
        width: 29.5,
        height: 275,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 280,
        y: 230,
        width: 29.5,
        height: 150,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 310,
        y: 305,
        width: 29.5,
        height: 75,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 340,
        y: 310,
        width: 29.5,
        height: 70,
        fill: 'blue',
    });

    drawRectangle(svg, {
        x: 370,
        y: 350,
        width: 29.5,
        height: 30,
        fill: 'blue',
    });
}

hists = document.getElementById('svg3');
histogram(hists);

function reset(svg){
    for (let i = 1; i <= 60; i += 1) {
        // console.log(Math.max(...window.histogram_data));
        drawCircle(hists, {cx: 35 + 30 * i, cy: 20 + 30 * (46 - window.histogram_data[i - 1]), r: 3, fill: 'green'});
    }
}

function histogram(svg){
    reset(svg);

    for (let i = 1; i <= 60; i += 1) {
        // axis ticks
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384});

        // axis labels
        drawText(svg, {x: 35 + 30 * i, y: 400, text: i});
    }

    for (let i = 1; i <= 13; i += 1) {
        // axis ticks
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i - 1), x2: 40, y2: 20 + 30 * (i - 1)});

        // axis labels
        drawText(svg, {x: 20, y: 25 + 30 * (i - 1), text: (46 - i + 1)});
    }

    // x-axis
    drawLine(svg, {x1: 40, y1: 380, x2: 1850, y2: 380});
    // y-axis
    drawLine(svg, {x1: 40, y1: 20, x2: 40, y2: 380});


    drawLine(svg, {
        x1: 40,
        y1: 200,
        x2: 1850,
        y2: 200,
        stroke: 'green',
        strokeWidth: 1,
        strokeType: 'dashed'
    });

    drawLine(svg, {
        x1: 40,
        y1: 170,
        x2: 1850,
        y2: 170,
        stroke: 'yellow',
        strokeWidth: 1,
        strokeType: 'dashed'
    });

    drawLine(svg, {
        x1: 40,
        y1: 230,
        x2: 1850,
        y2: 230,
        stroke: 'yellow',
        strokeWidth: 1,
        strokeType: 'dashed'
    });

    drawLine(svg, {
        x1: 40,
        y1: 140,
        x2: 1850,
        y2: 140,
        stroke: 'orange',
        strokeWidth: 1,
        strokeType: 'dashed'
    });

    drawLine(svg, {
        x1: 40,
        y1: 260,
        x2: 1850,
        y2: 260,
        stroke: 'orange',
        strokeWidth: 1,
        strokeType: 'dashed'
    });

    drawLine(svg, {
        x1: 40,
        y1: 110,
        x2: 1850,
        y2: 110,
        stroke: 'red',
        strokeWidth: 1,
        strokeType: 'dashed'
    });

    drawLine(svg, {
        x1: 40,
        y1: 290,
        x2: 1850,
        y2: 290,
        stroke: 'red',
        strokeWidth: 1,
        strokeType: 'dashed'
    });
}

// If a point is above or below LCL or UCL.
function verify_rule1(svg){
    reset(svg);

    for(let i=1; i<=60; i++){
        if(window.histogram_data[i-1]>43 || window.histogram_data[i-1]<37){
            drawCircle(hists, {cx: 35 + 30 * i, cy: 20 + 30 * (46 - window.histogram_data[i-1]), r: 3, fill: 'red'});
        }
    }
}

//  if 5 consecutive points are monotonously increasing/decreasing.
function verify_rule2(svg){
    reset(svg);

    for(let i=4; i<=60; i++){

        let inc = true;
        let dec = true;

        for(let j=i-3; j<=i; j++){
            if(window.histogram_data[j]<=window.histogram_data[j-1]){
                inc = false;
            }

            if(window.histogram_data[j]>=window.histogram_data[j-1]){
                dec = false;
            }
        }

        if(inc || dec){
            for (let j=i-4; j<=i; j++){
                drawCircle(hists, {cx: 35 + 30 * (j+1), cy: 20 + 30 * (46 - window.histogram_data[j]), r: 3, fill: 'red'});
            }
        }
    }
}

// if 6 consecutive points are on either side of target.
function verify_rule3(svg){
    reset(svg);

    for(let i=5; i<=60; i++){
        let upper = true;
        let lower = true;

        for(let j = i-4; j<=i; j++){
            if(window.histogram_data[j]<=40){
                upper = false;
            }

            if(window.histogram_data[j]>=40){
                lower = false;
            }
        }

        if(upper || lower){
            for (let j=i-4; j<=i; j++){
                drawCircle(hists, {cx: 35 + 30 * (j+1), cy: 20 + 30 * (46 - window.histogram_data[j]), r: 3, fill: 'red'});
            }
        }
    }
}

// Fourteen consecutive data points alternating up & down.
function verify_rule4(svg){
    reset(svg);

    // 7 consecutive for now
    for(let i=6; i<=60; i++){

        let alter = true;

        for(let j=i-4; j<=i; j++){
            const prev = window.histogram_data[j-1];
            const curr = window.histogram_data[j];

            const prev_dir = prev > window.histogram_data[j-2];

            const curr_dir = curr > prev;

            if (prev_dir == curr_dir){
                alter = false;
                break;
            }
        }

        if(alter){
            for (let j=i-6; j<=i; j++){
                drawCircle(hists, {cx: 35 + 30 * (j+1), cy: 20 + 30 * (46 - window.histogram_data[j]), r: 3, fill: 'red'});
            }
        }
    }
}

// Two data points, out of three consecutive data points, are on the same side of the average in zone A or beyond.
function verify_rule5(svg){
    reset(svg);

    for(let i=2; i<=60; i++){

        let upper = 0;
        let lower = 0;

        for(let j=i-2; j<=i; j++){
            if(window.histogram_data[j]<=38){
                lower += 1;
            }

            if(window.histogram_data[j]>=42){
                upper += 1;
            }
        }

        if(upper>=2 || lower>=2){
            for (let j=i-2; j<=i; j++){
                if(window.histogram_data[j]>=42 || window.histogram_data[j]<=38){
                    drawCircle(hists, {cx: 35 + 30 * (j+1), cy: 20 + 30 * (46 - window.histogram_data[j]), r: 3, fill: 'red'});
                }
            }
        }
    }
}

// Four data points, out of five consecutive data points, are on the same side of the average in zone B or beyond.
function verify_rule6(svg){
    reset(svg);

    for(let i=4; i<=60; i++){

        let upper = 0;
        let lower = 0;

        for(let j=i-4; j<=i; j++){
            if(window.histogram_data[j]<=39){
                lower += 1;
            }

            if(window.histogram_data[j]>=41){
                upper += 1;
            }
        }

        if(upper>=4 || lower>=4){
            for (let j=i-4; j<=i; j++){
                if(window.histogram_data[j]<=39 || window.histogram_data[j]>=41){
                    drawCircle(hists, {cx: 35 + 30 * (j+1), cy: 20 + 30 * (46 - window.histogram_data[j]), r: 3, fill: 'red'});
                }
            }
        }
    }
}

// Fifteen consecutive data points are within zone C (above and below the average).
function verify_rule7(svg){
    reset(svg);

    for(let i=14; i<=60; i++){

        let inside = true;

        for(let j=i-14; j<=i; j++){
            if(window.histogram_data[j]<39 || window.histogram_data[j]>41){
                inside = false;
                break;
            }
        }

        if(inside){
            for (let j=i-14; j<=i; j++){
                    drawCircle(hists, {cx: 35 + 30 * (j+1), cy: 20 + 30 * (46 - window.histogram_data[j]), r: 3, fill: 'red'});
            }
        }
    }
}