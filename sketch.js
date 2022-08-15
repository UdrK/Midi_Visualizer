const universe_max_age = 1
universe_age = 0
const WIDTH = 2200;
const HEIGHT = 5250;
const HOR_STEP = 80;
const VER_STEP = 128;
const VER_MARGIN = 500;
const VARIANCE_FACTOR = 250;
const PILLARS_MATCHING_PALETTE = [[55, 19, 19], [87, 66, 64], [191, 165, 164], [0, 57, 76], [52, 104, 125], [153, 174, 187]];
const TITANS_REALM_PALETTE = [[38, 22, 33], [54, 56, 89], [105, 110, 140], [87, 72, 89], [89, 8, 23], [181, 92, 112]];
const PALETTE = TITANS_REALM_PALETTE;
const MONOCHROME = [[0, 32, 63]];
const SATURATION = 100;
const LIGHTNESS = 50;
const tecnique_to_color_index = {
    "not": 3, // k
    "pm": 4,  // k
    "po": 5,  //
    "slide": 1, // k
    "harmonic": 2
}
let max_duration = 0;
let max_value = 0;
let min_value = 256;


function note_center(note_value) {
    let val = ((note_value-min_value) * (WIDTH - HOR_STEP)) / (max_value-min_value);
    return val;
}

// given notes, returns avg value. E.g. (D2, A2: 42, 38: rets 40)
function chord_to_value(values) {
    let sum = 0;
    for(let i = 0; i < values.length; i += 1) {
        sum += values[i];
    }
    return sum/values.length;
}

// returns array of objects {"value": chord_value, "duration": duration}
// with chord_value avg midi notes value
// also does side effects on max_value min_value max_duration
function json_to_array() {
    notes_array = source_json["notes"];
    return_notes = [];
    for(let i=0; i < notes_array.length; i+=1) {
        let is_chord = false;
        tecnique = [notes_array[i]["tecnique"]];
        chord_notes = [notes_array[i]["midi"]];
        time = notes_array[i]["time"].toPrecision(3);
        duration = notes_array[i]["duration"].toPrecision(3);
        j = 1;
        while(i+j < notes_array.length && notes_array[i+j]["time"].toPrecision(3) == time) {
            chord_notes.push(notes_array[i+j]["midi"]);
            is_chord = true;
            j += 1;
        }
        i += j - 1;
        chord_value = chord_to_value(chord_notes).toPrecision(3);
        if(chord_value > max_value) {
            max_value = chord_value;
        }
        if(chord_value < min_value) {
            min_value = chord_value;
        }
        if(duration > max_duration) {
            max_duration = duration;
        }
        return_notes.push({"value": chord_value, "duration": duration, "is_chord": is_chord, "tecnique": tecnique});
    }
    return return_notes;
}

function draw() {
    if (universe_age < universe_max_age) {
        actualDraw();
        universe_age += 1
    }
}

function actualDraw() {

    notes = json_to_array();
    notes_lines = [];
    let duration_based_ver_step = VER_STEP;
    let previous_line_y = VER_MARGIN;
    console.log("notes "+notes.length);
    console.log("max_dur "+max_duration);

    for(let i = 0; i < notes.length; i += 1) {
        let line = [];
        // how many points per line? we want more points if image is wider so lines are more articulate
        let hor_multi = 0;
        if(i < 21) {
            hor_multi = 600;
        }
        for(let j = HOR_STEP; j < WIDTH - (HOR_STEP) - hor_multi; j += HOR_STEP) {
            // first and last 3 points of the line are "grounded" to standard line height so curveVertex fills the area under (not above) the line
            if (j <= HOR_STEP * 3 || j >= WIDTH - (3 * HOR_STEP) - hor_multi) {
                let point = {x: j, y: previous_line_y + duration_based_ver_step};
                line.push(point);
            } else {
                let min = 0.4;
                let variance_multiplier = 1;
                let variance_divider = 4;
                // if note: more compact wave, higher wave
                if(!notes[i]["is_chord"]) {
                    console.log("not a chord");
                    variance_multiplier = 4;
                    variance_divider = 0.5;
                }
                let note_center_val = note_center(notes[i]["value"]);
                let distance_to_center = Math.abs(j - note_center_val);
                let actual_var_factor = (WIDTH / 2 - VARIANCE_FACTOR * variance_multiplier  - distance_to_center);
                let variance = Math.max(actual_var_factor, 15);
                let random = (Math.random() + min) * variance / variance_divider * -1;  // Math.random() instead of 0.sm
                let point = {x: j, y: previous_line_y + duration_based_ver_step + random};
                line.push(point);
                //circle(point.x, point.y, 8);    // debug points
            }
        }
        duration_based_ver_step = notes[i]["duration"] * VER_STEP;
        previous_line_y = line[0].y;
        notes_lines.push(line);
        console.log("duration " + notes[i]["duration"]);
        console.log("dur_b_ver_step: "+duration_based_ver_step);
    }

    for(let i = 0; i < notes_lines.length; i += 1) {
        beginShape();
        for(let j = 0; j < notes_lines[i].length; j += 2) {
            curveVertex(notes_lines[i][j].x, notes_lines[i][j].y);
            const [r, g, b] = [22, 34, 27];//PALETTE[tecnique_to_color_index[notes[i]["tecnique"]]];
            fill(r,g,b);
            curveVertex(notes_lines[i][j+1].x, notes_lines[i][j+1].y);
        }
        endShape();
    }
}

function setup() {
    canvas = createCanvas(WIDTH, HEIGHT, SVG);
    background(PALETTE[0]);
    stroke([242, 241, 228]);
    strokeWeight(1);
    noLoop();
}
