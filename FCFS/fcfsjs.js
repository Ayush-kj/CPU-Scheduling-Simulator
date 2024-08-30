// Priority preference toggle logic
let priorityPreference = 1;  // Variable to store the current priority preference (1 for high, -1 for low)
document.getElementById("priority-toggle-btn").onclick = () => {
    let currentPriorityPreference = document.getElementById("priority-preference").innerText;
    
    // Toggle between "high" and "low" priority preference
    if (currentPriorityPreference == "high") {
        document.getElementById("priority-preference").innerText = "low";
    } else {
        document.getElementById("priority-preference").innerText = "high";
    }
    
    // Reverse the priority preference value
    priorityPreference *= -1;
};

let selectedAlgorithm = document.getElementById('algo');  // Get the selected scheduling algorithm

// Function to check and toggle the visibility of the time quantum input field
function checkTimeQuantumInput() {
    let timequantum = document.querySelector("#time-quantum").classList;
    
    // Show time quantum input only if Round Robin (RR) is selected
    if (selectedAlgorithm.value == 'rr') {
        timequantum.remove("hide");
    } else {
        timequantum.add("hide");
    }
}

// Function to check and toggle the visibility of the priority input cells
function checkPriorityCell() {
    let prioritycell = document.querySelectorAll(".priority");
    
    // Show priority input cells only if Priority Non-Preemptive (PNP) or Priority Preemptive (PP) is selected
    if (selectedAlgorithm.value == "pnp" || selectedAlgorithm.value == "pp") {
        prioritycell.forEach((element) => {
            element.classList.remove("hide");
        });
    } else {
        prioritycell.forEach((element) => {
            element.classList.add("hide");
        });
    }
}

// Event listener for algorithm selection change
selectedAlgorithm.onchange = () => {
    checkTimeQuantumInput();  // Update time quantum input visibility
    checkPriorityCell();      // Update priority cell visibility
};

// Function to validate and adjust input values dynamically when they change
function inputOnChange() {
    let inputs = document.querySelectorAll('input');  // Get all input elements
    inputs.forEach((input) => {
        if (input.type == 'number') {
            input.onchange = () => {
                let inputVal = Number(input.value);
                let isInt = Number.isInteger(inputVal);

                // Validate and adjust the input value for arrival time and context switch (minimum 0)
                if (input.parentNode.classList.contains('arrival-time') || input.id == 'context-switch') {
                    if (!isInt || (isInt && inputVal < 0)) {
                        input.value = 0;
                    } else {
                        input.value = inputVal;
                    }
                } else {
                    // Validate and adjust the input value for other fields like time quantum, priority, etc. (minimum 1)
                    if (!isInt || (isInt && inputVal < 1)) {
                        input.value = 1;
                    } else {
                        input.value = inputVal;
                    }
                }
            }
        }
    });
}
inputOnChange();  // Call the inputOnChange function to set up the event listeners

let process = 1;  // Variable to track the number of processes

// Resize burst time rows when +/- buttons are clicked

// Function to calculate the Greatest Common Divisor (GCD) of two numbers
function gcd(x, y) {
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

// Function to calculate the Least Common Multiple (LCM) of two numbers
function lcm(x, y) {
    return (x * y) / gcd(x, y);
}

// Function to calculate the LCM of all burst times for processes
function lcmAll() {
    let result = 1;
    for (let i = 0; i < process; i++) {
        result = lcm(result, document.querySelector(".main-table").rows[2 * i + 2].cells.length);
    }
    return result;
}

// Function to update the colspan attribute of burst time cells based on LCM calculation
function updateColspan() {
    let totalColumns = lcmAll();  // Calculate the total columns based on LCM
    let processHeading = document.querySelector("thead .process-time");
    processHeading.setAttribute("colspan", totalColumns);
    
    let processTimes = [];
    let table = document.querySelector(".main-table");
    
    // Store the number of burst time cells for each process
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    
    // Update colspan for each burst time cell
    for (let i = 0; i < process; i++) {
        let row1 = table.rows[2 * i + 1].cells;
        let row2 = table.rows[2 * i + 2].cells;
        for (let j = 0; j < processTimes[i]; j++) {
            row1[j + 3].setAttribute("colspan", totalColumns / processTimes[i]);
            row2[j].setAttribute("colspan", totalColumns / processTimes[i]);
        }
    }
}

// Function to add or remove burst time (BT) and I/O time pairs
function addremove() {
    let processTimes = [];
    let table = document.querySelector(".main-table");
    
    // Store the number of burst time cells for each process
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    
    let addbtns = document.querySelectorAll(".add-process-btn");
    
    // Add event listeners to the +/- buttons for each process
    for (let i = 0; i < process; i++) {
        addbtns[i].onclick = () => {
            let table = document.querySelector(".main-table");
            let row1 = table.rows[2 * i + 1];  // Select the first row of the current process
            let row2 = table.rows[2 * i + 2];  // Select the second row of the current process
            
            // Insert new cells for I/O time in the table
            let newcell1 = row1.insertCell(processTimes[i] + 3);
            newcell1.innerHTML = "IO";
            newcell1.classList.add("process-time", "io", "process-heading");
            
            let newcell2 = row2.insertCell(processTimes[i]);
            newcell2.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell2.classList.add("process-time", "io", "process-input");
            
            // Insert new cells for CPU time in the table
            let newcell3 = row1.insertCell(processTimes[i] + 4);
            newcell3.innerHTML = "CPU";
            newcell3.classList.add("process-time", "cpu", "process-heading");
            
            let newcell4 = row2.insertCell(processTimes[i] + 1);
            newcell4.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell4.classList.add("process-time", "cpu", "process-input");
            
            processTimes[i] += 2;  // Increase the process time count by 2 (for IO and CPU)
            updateColspan();  // Update the colspan to adjust for the new cells
            inputOnChange();  // Reapply the input validation to the new input fields
        };
    }
    
    // Event listener for removing burst time (BT) and I/O time pairs
    let removebtns = document.querySelectorAll(".remove-process-btn");
    for (let i = 0; i < process; i++) {
        removebtns[i].onclick = () => {
            if (processTimes[i] > 1) {
                let table = document.querySelector(".main-table");
                processTimes[i]--;  // Decrease the process time count
                let row1 = table.rows[2 * i + 1];  // Select the first row of the current process
                row1.deleteCell(processTimes[i] + 3);  // Remove the IO/CPU cell from the first row
                let row2 = table.rows[2 * i + 2];  // Select the second row of the current process
                row2.deleteCell(processTimes[i]);  // Remove the corresponding input cell from the second row
                
                processTimes[i]--;  // Further decrease the process time count
                table = document.querySelector(".main-table");
                row1 = table.rows[2 * i + 1];  // Re-select the first row after deletion
                row1.deleteCell(processTimes[i] + 3);  // Continue removing cells as needed
                row2 = table.rows[2 * i + 2];  // Re-select the second row after deletion
                row2.deleteCell(processTimes[i]);  // Remove the corresponding input cell
                updateColspan();  // Update colspan to adjust the table structure
            }
        };
    }
}
addremove();  // Initialize the add/remove functionality

// Function to add a new process to the table
function addProcess() {
    process++;  // Increment the process count
    
    // HTML template for the new process's first row (header row)
    let rowHTML1 = `
                          <td class="process-id" rowspan="2">P${process}</td>
                          <td class="priority hide" rowspan="2"><input type="number" min="1" step="1" value="1"></td>
                          <td class="arrival-time" rowspan="2"><input type="number" min="0" step="1" value="0"> </td>
                          <td class="process-time cpu process-heading" colspan="">CPU</td>
                          <td class="process-btn"><button type="button" class="add-process-btn">+</button></td>
                          <td class="process-btn"><button type="button" class="remove-process-btn">-</button></td>
                      `;
    
    // HTML template for the new process's second row (input row)
    let rowHTML2 = `
                           <td class="process-time cpu process-input"><input type="number" min="1" step="1" value="1"> </td>
                      `;
    
    let table = document.querySelector(".main-table tbody");
    table.insertRow(table.rows.length).innerHTML = rowHTML1;  // Insert the first row
    table.insertRow(table.rows.length).innerHTML = rowHTML2;  // Insert the second row
    
    checkPriorityCell();  // Update the visibility of priority cells based on selected algorithm
    addremove();  // Re-initialize the add/remove functionality for the new process
    updateColspan();  // Adjust colspan for all processes
    inputOnChange();  // Apply input validation to the new inputs
}

// Function to delete the last process from the table
function deleteProcess() {
    let table = document.querySelector(".main-table");
    if (process > 1) {
        table.deleteRow(table.rows.length - 1);  // Delete the last row (input row)
        table.deleteRow(table.rows.length - 1);  // Delete the second-to-last row (header row)
        process--;  // Decrement the process count
    }
    updateColspan();  // Adjust colspan for the remaining processes
    inputOnChange();  // Reapply input validation
}

// Event listener for adding a new process row when "+" button is clicked
document.querySelector(".add-btn").onclick = () => {
    addProcess();  // Call the addProcess function
};

// Event listener for removing the last process row when "-" button is clicked
document.querySelector(".remove-btn").onclick = () => {
    deleteProcess();  // Call the deleteProcess function
};

//------------------------
// Input class to store process-related data
class Input {
    constructor() {
        this.processId = [];  // Array to store process IDs
        this.priority = [];  // Array to store process priorities
        this.arrivalTime = [];  // Array to store process arrival times
        this.processTime = [];  // Array to store process burst times
        this.processTimeLength = [];  // Array to store the length of process times (e.g., burst times)
        this.totalBurstTime = [];  // Array to store the total burst time for each process
        this.algorithm = "";  // String to store the name of the selected algorithm
        this.algorithmType = "";  // String to store the type of the selected algorithm (e.g., preemptive, non-preemptive)
        this.timeQuantum = 0;  // Time quantum value for Round Robin algorithm
        this.contextSwitch = 0;  // Context switch time
    }
}

// Utility class to store intermediate values used in scheduling calculations
class Utility {
    constructor() {
        this.remainingProcessTime = [];  // Array to store the remaining time for each process
        this.remainingBurstTime = [];  // Array to store the remaining burst time for each process
        this.remainingTimeRunning = [];  // Array to store the remaining running time for each process
        this.currentProcessIndex = [];  // Array to store the current index of processes
        this.start = [];  // Array to store the start time of processes
        this.done = [];  // Array to store the completion status of processes
        this.returnTime = [];  // Array to store the return time of processes
        this.currentTime = 0;  // Variable to store the current time in the scheduling simulation
    }
}

// Output class to store the results of the scheduling simulation
class Output {
    constructor() {
        this.completionTime = [];  // Array to store the completion time of each process
        this.turnAroundTime = [];  // Array to store the turnaround time of each process
        this.waitingTime = [];  // Array to store the waiting time of each process
        this.responseTime = [];  // Array to store the response time of each process
        this.schedule = [];  // Array to store the scheduling order of processes
        this.timeLog = [];  // Array to store the time log of process states
        this.contextSwitches = 0;  // Variable to store the number of context switches
        this.averageTimes = [];  // Array to store average times for metrics like completion time, turnaround time, etc.
    }
}

// TimeLog class to keep track of process states at each time unit
class TimeLog {
    constructor() {
        this.time = -1;  // Variable to store the current time unit
        this.remain = [];  // Array to store the remaining processes
        this.ready = [];  // Array to store the ready processes
        this.running = [];  // Array to store the running processes
        this.block = [];  // Array to store the blocked processes
        this.terminate = [];  // Array to store the terminated processes
        this.move = [];  // Array to store state transitions (e.g., ready to running, running to terminate, etc.)
        // Move transitions are encoded as follows:
        // 0 - remain -> ready
        // 1 - ready -> running
        // 2 - running -> terminate
        // 3 - running -> ready
        // 4 - running -> block
        // 5 - block -> ready
    }
}

// Function to set the algorithm name and type in the Input object
function setAlgorithmNameType(input, algorithm) {
    input.algorithm = algorithm;  // Set the algorithm name
    switch (algorithm) {
        case 'fcfs':  // First-Come, First-Serve
        case 'sjf':   // Shortest Job First
        case 'ljf':   // Longest Job First
        case 'pnp':   // Priority Non-Preemptive
        case 'hrrn':  // Highest Response Ratio Next
            input.algorithmType = "nonpreemptive";  // Set as non-preemptive
            break;
        case 'srtf':  // Shortest Remaining Time First
        case 'lrtf':  // Longest Remaining Time First
        case 'pp':    // Priority Preemptive
            input.algorithmType = "preemptive";  // Set as preemptive
            break;
        case 'rr':    // Round Robin
            input.algorithmType = "roundrobin";  // Set as round-robin
            break;
    }
}

// Function to populate the Input object with data from the user interface
function setInput(input) {
    for (let i = 1; i <= process; i++) {
        input.processId.push(i - 1);  // Add process ID
        let rowCells1 = document.querySelector(".main-table").rows[2 * i - 1].cells;  // Get the first row of the process
        let rowCells2 = document.querySelector(".main-table").rows[2 * i].cells;  // Get the second row of the process
        input.priority.push(Number(rowCells1[1].firstElementChild.value));  // Add the process priority
        input.arrivalTime.push(Number(rowCells1[2].firstElementChild.value));  // Add the process arrival time
        let ptn = Number(rowCells2.length);  // Get the length of the process time (number of bursts/IOs)
        let pta = [];  // Array to store the burst times and IO times
        for (let j = 0; j < ptn; j++) {
            pta.push(Number(rowCells2[j].firstElementChild.value));  // Add each burst time and IO time to the array
        }
        input.processTime.push(pta);  // Add the array of times to the processTime array
        input.processTimeLength.push(ptn);  // Store the length of process times
    }

    // Calculate the total burst time for each process
    input.totalBurstTime = new Array(process).fill(0);  // Initialize totalBurstTime array with zeros
    input.processTime.forEach((e1, i) => {
        e1.forEach((e2, j) => {
            if (j % 2 == 0) {  // Only add burst times (skip IO times)
                input.totalBurstTime[i] += e2;
            }
        });
    });

    // Set the algorithm name and type in the Input object
    setAlgorithmNameType(input, selectedAlgorithm.value);
    input.contextSwitch = Number(document.querySelector("#context-switch").value);  // Set the context switch time
    input.timeQuantum = Number(document.querySelector("#tq").value);  // Set the time quantum for Round Robin algorithm
}

// Function to initialize the Utility object based on the Input object
function setUtility(input, utility) {
    utility.remainingProcessTime = input.processTime.slice();  // Initialize remaining process times
    utility.remainingBurstTime = input.totalBurstTime.slice();  // Initialize remaining burst times
    utility.remainingTimeRunning = new Array(process).fill(0);  // Initialize remaining running time
    utility.currentProcessIndex = new Array(process).fill(0);  // Initialize current process index
    utility.start = new Array(process).fill(false);  // Initialize process start status
    utility.done = new Array(process).fill(false);  // Initialize process completion status
    utility.returnTime = input.arrivalTime.slice();  // Initialize return times with arrival times
}

// Function to reduce the schedule array by merging consecutive identical entries
function reduceSchedule(schedule) {
    let newSchedule = [];  // Array to store the reduced schedule
    let currentScheduleElement = schedule[0][0];  // Track the current process in the schedule
    let currentScheduleLength = schedule[0][1];  // Track the duration of the current process

    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i][0] == currentScheduleElement) {
            currentScheduleLength += schedule[i][1];  // Merge with the current process duration
        } else {
            newSchedule.push([currentScheduleElement, currentScheduleLength]);  // Push the merged entry
            currentScheduleElement = schedule[i][0];  // Move to the next process in the schedule
            currentScheduleLength = schedule[i][1];
        }
    }
    newSchedule.push([currentScheduleElement, currentScheduleLength]);  // Add the last process to the schedule
    return newSchedule;
}

// Function to reduce the time log by removing redundant entries
function reduceTimeLog(timeLog) {
    let timeLogLength = timeLog.length;
    let newTimeLog = [],
        j = 0;
    for (let i = 0; i < timeLogLength - 1; i++) {
        if (timeLog[i] != timeLog[i + 1]) {
            newTimeLog.push(timeLog[j]);  // Add the unique time log entry to the newTimeLog array
        }
        j = i + 1;
    }
    if (j == timeLogLength - 1) {
        newTimeLog.push(timeLog[j]);  // Ensure the last entry is added if it's unique
    }
    return newTimeLog;
}

// Function to calculate and return the average times for completion, turnaround, waiting, and response times
function outputAverageTimes(output) {
    let avgct = 0;
    output.completionTime.forEach((element) => {
        avgct += element;  // Sum up all completion times
    });
    avgct /= process;  // Calculate the average completion time

    let avgtat = 0;
    output.turnAroundTime.forEach((element) => {
        avgtat += element;  // Sum up all turnaround times
    });
    avgtat /= process;  // Calculate the average turnaround time

    let avgwt = 0;
    output.waitingTime.forEach((element) => {
        avgwt += element;  // Sum up all waiting times
    });
    avgwt /= process;  // Calculate the average waiting time

    let avgrt = 0;
    output.responseTime.forEach((element) => {
        avgrt += element;  // Sum up all response times
    });
    avgrt /= process;  // Calculate the average response time

    return [avgct, avgtat, avgwt, avgrt];  // Return the average times as an array
}

// Function to set various output values after the scheduling simulation
function setOutput(input, output) {
    // Calculate turnaround time and waiting time for each process
    for (let i = 0; i < process; i++) {
        output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
        output.waitingTime[i] = output.turnAroundTime[i] - input.totalBurstTime[i];
    }

    // Simplify the schedule and time log to remove redundancies
    output.schedule = reduceSchedule(output.schedule);
    output.timeLog = reduceTimeLog(output.timeLog);

    // Calculate average times for the output
    output.averageTimes = outputAverageTimes(output);
}

// Function to convert a time in seconds to a Date object (used for display in charts)
function getDate(sec) {
    return (new Date(0, 0, 0, 0, sec / 60, sec % 60));
}

// Function to display the Gantt chart based on the scheduling output
function showGanttChart(output, outputDiv) {
    let ganttChartHeading = document.createElement("h3");
    ganttChartHeading.innerHTML = "Gantt Chart";
    outputDiv.appendChild(ganttChartHeading);

    let ganttChartData = [];
    let startGantt = 0;

    output.schedule.forEach((element) => {
        if (element[0] == -2) {  // Context switch
            ganttChartData.push([
                "Time",
                "CS",  // Context switch label
                "grey",  // Context switch color
                getDate(startGantt),
                getDate(startGantt + element[1])
            ]);
        } else if (element[0] >= 0) {  // Process execution
            ganttChartData.push([
                "Time",
                `P${element[0]}`,  // Use the process ID directly without adding 1
                null,
                getDate(startGantt),
                getDate(startGantt + element[1])
            ]);
        } else if (element[0] == -1) {  // Idle time
            ganttChartData.push([
                "Time",
                "Empty",  // Idle time label
                "black",  // Idle time color
                getDate(startGantt),
                getDate(startGantt + element[1])
            ]);
        }
        startGantt += element[1];  // Increment start time for the next segment
    });

    let ganttChart = document.createElement("div");
    ganttChart.id = "gantt-chart";

    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawGanttChart);

    function drawGanttChart() {
        var container = document.getElementById("gantt-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: "string", id: "Gantt Chart" });
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(ganttChartData);

        let ganttWidth = '100%';
        if (startGantt >= 20) {
            ganttWidth = 0.05 * startGantt * screen.availWidth;
        }

        var options = {
            width: ganttWidth,
            timeline: {
                showRowLabels: false,
                avoidOverlappingGridLines: false
            }
        };
        chart.draw(dataTable, options);
    }

    outputDiv.appendChild(ganttChart);
}

// Function to display the Timeline chart based on the scheduling output
function showTimelineChart(output, outputDiv) {
    let timelineChartHeading = document.createElement("h3");
    timelineChartHeading.innerHTML = "Timeline Chart";
    outputDiv.appendChild(timelineChartHeading);

    let timelineChartData = [];
    let startTimeline = 0;
    output.schedule.forEach((element) => {
        if (element[0] >= 0) {  // Process execution
            timelineChartData.push([
                "P" + element[0],  // Label for the process (e.g., P1, P2)
                getDate(startTimeline),
                getDate(startTimeline + element[1])
            ]);
        }
        startTimeline += element[1];  // Increment the start time for the next timeline segment
    });

    // Sort the timeline data by process number
    timelineChartData.sort((a, b) => parseInt(a[0].substring(1, a[0].length)) - parseInt(b[0].substring(1, b[0].length)));

    let timelineChart = document.createElement("div");
    timelineChart.id = "timeline-chart";

    // Load Google Charts for drawing the Timeline chart
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawTimelineChart);

    // Function to draw the Timeline chart using Google Charts
    function drawTimelineChart() {
        var container = document.getElementById("timeline-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(timelineChartData);

        let timelineWidth = '100%';  // Default width for the Timeline chart
        if (startTimeline >= 20) {  // Adjust width if the total duration is long
            timelineWidth = 0.05 * startTimeline * screen.availWidth;
        }

        var options = {
            width: timelineWidth,
        };
        chart.draw(dataTable, options);
    }

    outputDiv.appendChild(timelineChart);  // Add the Timeline chart to the outputDiv
}

// Function to display the final summary table based on the scheduling output
function showFinalTable(input, output, outputDiv) {
    let finalTableHeading = document.createElement("h3");
    finalTableHeading.innerHTML = "Final Table";
    outputDiv.appendChild(finalTableHeading);

    let table = document.createElement("table");
    table.classList.add("final-table");
    let thead = table.createTHead();
    let row = thead.insertRow(0);

    // Define the table headings
    let headings = [
        "Process",
        "Arrival Time",
        "Total Burst Time",
        "Completion Time",
        "Turn Around Time",
        "Waiting Time",
        "Response Time"
    ];
    headings.forEach((element, index) => {
        let cell = row.insertCell(index);
        cell.innerHTML = element;  // Insert each heading into the table header
    });

    let tbody = table.createTBody();
    for (let i = 0; i < process; i++) {
        let row = tbody.insertRow(i);
        let cell = row.insertCell(0);
        cell.innerHTML = "P" + (i + 1);  // Insert the process ID (e.g., P1, P2)
        
        cell = row.insertCell(1);
        cell.innerHTML = input.arrivalTime[i];  // Insert the arrival time for the process
        
        cell = row.insertCell(2);
        cell.innerHTML = input.totalBurstTime[i];  // Insert the total burst time for the process
        
        cell = row.insertCell(3);
        cell.innerHTML = output.completionTime[i];  // Insert the completion time for the process
        
        cell = row.insertCell(4);
        cell.innerHTML = output.turnAroundTime[i];  // Insert the turnaround time for the process
        
        cell = row.insertCell(5);
        cell.innerHTML = output.waitingTime[i];  // Insert the waiting time for the process
        
        cell = row.insertCell(6);
        cell.innerHTML = output.responseTime[i];  // Insert the response time for the process
    }
    outputDiv.appendChild(table);  // Add the final table to the outputDiv

    let tbt = 0;
    input.totalBurstTime.forEach((element) => (tbt += element));  // Calculate the total burst time (TBT)
    
    let lastct = 0;
    output.completionTime.forEach((element) => (lastct = Math.max(lastct, element)));  // Find the latest completion time

    // Calculate and display CPU Utilization
    let cpu = document.createElement("p");
    cpu.innerHTML = "CPU Utilization : " + (tbt / lastct) * 100 + "%";
    outputDiv.appendChild(cpu);

    // Calculate and display Throughput
    let tp = document.createElement("p");
    tp.innerHTML = "Throughput : " + process / lastct;
    outputDiv.appendChild(tp);

    // Display the number of context switches if applicable
    if (input.contextSwitch > 0) {
        let cs = document.createElement("p");
        cs.innerHTML = "Number of Context Switches : " + (output.contextSwitches - 1);
        outputDiv.appendChild(cs);
    }
}

// Function to toggle the color of arrows in the time log visualization
function toggleTimeLogArrowColor(timeLog, color) {
    let timeLogMove = ['remain-ready', 'ready-running', 'running-terminate', 'running-ready', 'running-block', 'block-ready'];
    timeLog.move.forEach(element => {
        document.getElementById(timeLogMove[element]).style.color = color;  // Change the arrow color based on the move type
    });
}

// Function to move to the next state in the time log
function nextTimeLog(timeLog) {
    let timeLogTableDiv = document.getElementById("time-log-table-div");

    let arrowHTML = `
    <p id = "remain-ready" class = "arrow">&rarr;</p>
    <p id = "ready-running" class = "arrow">&#10554;</p>
    <p id = "running-ready" class = "arrow">&#10554;</p>
    <p id = "running-terminate" class = "arrow">&rarr;</p>
    <p id = "running-block" class = "arrow">&rarr;</p>
    <p id = "block-ready" class = "arrow">&rarr;</p>
    `;
    timeLogTableDiv.innerHTML = arrowHTML;  // Insert the arrow HTML into the time log table div

    // Create and populate the Remain table in the time log
    let remainTable = document.createElement("table");
    remainTable.id = "remain-table";
    remainTable.className = 'time-log-table';
    let remainTableHead = remainTable.createTHead();
    let remainTableHeadRow = remainTableHead.insertRow(0);
    let remainTableHeading = remainTableHeadRow.insertCell(0);
    remainTableHeading.innerHTML = "Remain";
    let remainTableBody = remainTable.createTBody();
    for (let i = 0; i < timeLog.remain.length; i++) {
        let remainTableBodyRow = remainTableBody.insertRow(i);
        let remainTableValue = remainTableBodyRow.insertCell(0);
        remainTableValue.innerHTML = 'P' + (timeLog.remain[i] + 1);  // Populate with process IDs
    }
    timeLogTableDiv.appendChild(remainTable);  // Add the Remain table to the time log div

    // Create and populate the Ready table in the time log
    let readyTable = document.createElement("table");
    readyTable.id = "ready-table";
    readyTable.className = 'time-log-table';
    let readyTableHead = readyTable.createTHead();
    let readyTableHeadRow = readyTableHead.insertRow(0);
    let readyTableHeading = readyTableHeadRow.insertCell(0);
    readyTableHeading.innerHTML = "Ready";
    let readyTableBody = readyTable.createTBody();
    for (let i = 0; i < timeLog.ready.length; i++) {
        let readyTableBodyRow = readyTableBody.insertRow(i);
        let readyTableValue = readyTableBodyRow.insertCell(0);
        readyTableValue.innerHTML = 'P' + (timeLog.ready[i] + 1);  // Populate with process IDs
    }
    timeLogTableDiv.appendChild(readyTable);  // Add the Ready table to the time log div

    // Create and populate the Running table in the time log
    let runningTable = document.createElement("table");
    runningTable.id = "running-table";
    runningTable.className = 'time-log-table';
    let runningTableHead = runningTable.createTHead();
    let runningTableHeadRow = runningTableHead.insertRow(0);
    let runningTableHeading = runningTableHeadRow.insertCell(0);
    runningTableHeading.innerHTML = "Running";  // Set the heading for the Running table

    let runningTableBody = runningTable.createTBody();
    for (let i = 0; i < timeLog.running.length; i++) {
        let runningTableBodyRow = runningTableBody.insertRow(i);
        let runningTableValue = runningTableBodyRow.insertCell(0);
        runningTableValue.innerHTML = 'P' + (timeLog.running[i] + 1);  // Populate with process IDs in the Running state
    }
    timeLogTableDiv.appendChild(runningTable);  // Add the Running table to the time log div

    // Create and populate the Block table in the time log
    let blockTable = document.createElement("table");
    blockTable.id = "block-table";
    blockTable.className = 'time-log-table';
    let blockTableHead = blockTable.createTHead();
    let blockTableHeadRow = blockTableHead.insertRow(0);
    let blockTableHeading = blockTableHeadRow.insertCell(0);
    blockTableHeading.innerHTML = "Block";  // Set the heading for the Block table

    let blockTableBody = blockTable.createTBody();
    for (let i = 0; i < timeLog.block.length; i++) {
        let blockTableBodyRow = blockTableBody.insertRow(i);
        let blockTableValue = blockTableBodyRow.insertCell(0);
        blockTableValue.innerHTML = 'P' + (timeLog.block[i] + 1);  // Populate with process IDs in the Block state
    }
    timeLogTableDiv.appendChild(blockTable);  // Add the Block table to the time log div

    // Create and populate the Terminate table in the time log
    let terminateTable = document.createElement("table");
    terminateTable.id = "terminate-table";
    terminateTable.className = 'time-log-table';
    let terminateTableHead = terminateTable.createTHead();
    let terminateTableHeadRow = terminateTableHead.insertRow(0);
    let terminateTableHeading = terminateTableHeadRow.insertCell(0);
    terminateTableHeading.innerHTML = "Terminate";  // Set the heading for the Terminate table

    let terminateTableBody = terminateTable.createTBody();
    for (let i = 0; i < timeLog.terminate.length; i++) {
        let terminateTableBodyRow = terminateTableBody.insertRow(i);
        let terminateTableValue = terminateTableBodyRow.insertCell(0);
        terminateTableValue.innerHTML = 'P' + (timeLog.terminate[i] + 1);  // Populate with process IDs in the Terminate state
    }
    timeLogTableDiv.appendChild(terminateTable);  // Add the Terminate table to the time log div

    document.getElementById("time-log-time").innerHTML = "Time : " + timeLog.time;  // Display the current time in the time log
}

// Function to display the Time Log visualization
function showTimeLog(output, outputDiv) {
    reduceTimeLog(output.timeLog);  // Simplify the time log before displaying

    let timeLogDiv = document.createElement("div");
    timeLogDiv.id = "time-log-div";
    timeLogDiv.style.height = (15 * process) + 300 + "px";  // Set the height dynamically based on the number of processes

    let startTimeLogButton = document.createElement("button");
    startTimeLogButton.id = "start-time-log";
    startTimeLogButton.innerHTML = "Start Time Log";
    timeLogDiv.appendChild(startTimeLogButton);  // Add the Start Time Log button to the time log div
    outputDiv.appendChild(timeLogDiv);  // Add the time log div to the outputDiv

    document.querySelector("#start-time-log").onclick = () => {
        timeLogStart = 1;
        let timeLogDiv = document.getElementById("time-log-div");

        let timeLogOutputDiv = document.createElement("div");
        timeLogOutputDiv.id = "time-log-output-div";

        let timeLogTableDiv = document.createElement("div");
        timeLogTableDiv.id = "time-log-table-div";

        let timeLogTime = document.createElement("p");
        timeLogTime.id = "time-log-time";

        // Append the table div and time display to the output div
        timeLogOutputDiv.appendChild(timeLogTableDiv);
        timeLogOutputDiv.appendChild(timeLogTime);
        timeLogDiv.appendChild(timeLogOutputDiv);

        let index = 0;
        let timeLogInterval = setInterval(() => {
            nextTimeLog(output.timeLog[index]);  // Display the next time log entry

            if (index != output.timeLog.length - 1) {
                setTimeout(() => {
                    toggleTimeLogArrowColor(output.timeLog[index], 'red');  // Highlight state transitions in red
                    setTimeout(() => {
                        toggleTimeLogArrowColor(output.timeLog[index], 'black');  // Revert arrow color to black
                    }, 600);
                }, 200);
            }

            index++;
            if (index == output.timeLog.length) {
                clearInterval(timeLogInterval);  // Stop the interval when the time log is complete
            }

            document.getElementById("calculate").onclick = () => {
                clearInterval(timeLogInterval);  // Stop the interval if the user recalculates
                document.getElementById("time-log-output-div").innerHTML = "";  // Clear the time log output
                calculateOutput();
            }
        }, 1000);  // Display each time log entry at intervals of 1 second
    };
}

// Function to display a Round Robin performance chart
function showRoundRobinChart(outputDiv) {
    let roundRobinInput = new Input();
    setInput(roundRobinInput);

    let maxTimeQuantum = 0;
    roundRobinInput.processTime.forEach(processTimeArray => {
        processTimeArray.forEach((time, index) => {
            if (index % 2 == 0) {  // Only consider CPU burst times (ignore IO times)
                maxTimeQuantum = Math.max(maxTimeQuantum, time);  // Determine the maximum CPU burst time
            }
        });
    });

    let roundRobinChartData = [
        [], // Completion Time
        [], // Turn Around Time
        [], // Waiting Time
        [], // Response Time
        []  // Context Switches
    ];

    let timeQuantumArray = [];
    for (let timeQuantum = 1; timeQuantum <= maxTimeQuantum; timeQuantum++) {
        timeQuantumArray.push(timeQuantum);

        let roundRobinInput = new Input();
        setInput(roundRobinInput);
        setAlgorithmNameType(roundRobinInput, 'rr');  // Set the algorithm type to Round Robin
        roundRobinInput.timeQuantum = timeQuantum;

        let roundRobinUtility = new Utility();
        setUtility(roundRobinInput, roundRobinUtility);

        let roundRobinOutput = new Output();
        CPUScheduler(roundRobinInput, roundRobinUtility, roundRobinOutput);  // Run the CPU scheduler with the current time quantum

        setOutput(roundRobinInput, roundRobinOutput);

        for (let i = 0; i < 4; i++) {
            roundRobinChartData[i].push(roundRobinOutput.averageTimes[i]);  // Collect average times for each metric
        }
        roundRobinChartData[4].push(roundRobinOutput.contextSwitches);  // Collect the number of context switches
    }

    let roundRobinChartCanvas = document.createElement('canvas');
    roundRobinChartCanvas.id = "round-robin-chart";

    let roundRobinChartDiv = document.createElement('div');
    roundRobinChartDiv.id = "round-robin-chart-div";
    roundRobinChartDiv.appendChild(roundRobinChartCanvas);
    outputDiv.appendChild(roundRobinChartDiv);  // Add the chart div to the outputDiv

    new Chart(document.getElementById('round-robin-chart'), {
        type: 'line',
        data: {
            labels: timeQuantumArray,  // X-axis labels (time quantum values)
            datasets: [{
                    label: "Completion Time",
                    borderColor: '#3366CC',
                    data: roundRobinChartData[0]  // Y-axis data for Completion Time
                },
                {
                    label: "Turn Around Time",
                    borderColor: '#DC3912',
                    data: roundRobinChartData[1]  // Y-axis data for Turn Around Time
                },
                {
                    label: "Waiting Time",
                    borderColor: '#FF9900',
                    data: roundRobinChartData[2]  // Y-axis data for Waiting Time
                },
                {
                    label: "Response Time",
                    borderColor: '#109618',
                    data: roundRobinChartData[3]  // Y-axis data for Response Time
                },
                {
                    label: "Context Switches",
                    borderColor: '#990099',
                    data: roundRobinChartData[4]  // Y-axis data for Context Switches
                },
            ]
        },
        options: {
            title: {
                display: true,
                text: ['Round Robin', 'Comparison of Completion, Turn Around, Waiting, Response Time and Context Switches', 'The Lower The Better']
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true  // Ensure the y-axis starts at zero
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time Quantum'  // Label for the x-axis
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'black'
                }
            }
        }
    });
}

// Function to show a comparison chart for different algorithms
function showAlgorithmChart(outputDiv) {
    let algorithmArray = ["fcfs"];  // Array of algorithm codes
    let algorithmNameArray = ["FCFS"];  // Array of algorithm names
    let algorithmChartData = [
        [], // Completion Time
        [], // Turn Around Time
        [], // Waiting Time
        [], // Response Time
    ];

    algorithmArray.forEach(currentAlgorithm => {
        let chartInput = new Input();
        let chartUtility = new Utility();
        let chartOutput = new Output();
        setInput(chartInput);
        setAlgorithmNameType(chartInput, currentAlgorithm);  // Set the algorithm type (e.g., FCFS)
        setUtility(chartInput, chartUtility);  // Prepare the utility object
        CPUScheduler(chartInput, chartUtility, chartOutput);  // Run the CPU scheduler for the current algorithm
        setOutput(chartInput, chartOutput);  // Process the output of the scheduler

        for (let i = 0; i < 4; i++) {
            algorithmChartData[i].push(chartOutput.averageTimes[i]);  // Collect the average times for each metric
        }
    });

    let algorithmChartCanvas = document.createElement('canvas');
    algorithmChartCanvas.id = "algorithm-chart";

    let algorithmChartDiv = document.createElement('div');
    algorithmChartDiv.id = "algorithm-chart-div";
    algorithmChartDiv.style.height = "40vh";
    algorithmChartDiv.style.width = "80%";
    algorithmChartDiv.appendChild(algorithmChartCanvas);
    outputDiv.appendChild(algorithmChartDiv);  // Add the algorithm chart div to the outputDiv

    new Chart(document.getElementById('algorithm-chart'), {
        type: 'bar',  // Set chart type to bar
        data: {
            labels: algorithmNameArray,  // X-axis labels (algorithm names)
            datasets: [{
                    label: "Completion Time",
                    backgroundColor: '#3366CC',
                    data: algorithmChartData[0]  // Y-axis data for Completion Time
                },
                {
                    label: "Turn Around Time",
                    backgroundColor: '#DC3912',
                    data: algorithmChartData[1]  // Y-axis data for Turn Around Time
                },
                {
                    label: "Waiting Time",
                    backgroundColor: '#FF9900',
                    data: algorithmChartData[2]  // Y-axis data for Waiting Time
                },
                {
                    label: "Response Time",
                    backgroundColor: '#109618',
                    data: algorithmChartData[3]  // Y-axis data for Response Time
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: ['Algorithm', 'Comparison of Completion, Turn Around, Waiting and Response Time', 'The Lower The Better']
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true  // Ensure the y-axis starts at zero
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Algorithm'  // Label for the x-axis
                    }
                }]
            }
        }
    });
}

// Function to display various output visualizations
function showOutput(input, output, outputDiv) {
    showGanttChart(output, outputDiv);  // Display the Gantt chart
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    
    showTimelineChart(output, outputDiv);  // Display the Timeline chart
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    
    showFinalTable(input, output, outputDiv);  // Display the Final Table with detailed process metrics
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    
    showTimeLog(output, outputDiv);  // Display the Time Log
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    
    if (selectedAlgorithm.value == "rr") {
        showRoundRobinChart(outputDiv);  // Display the Round Robin performance chart if RR is selected
        outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    }
    
    showAlgorithmChart(outputDiv);  // Display the algorithm comparison chart
}

// CPU Scheduler function that simulates the scheduling process based on the selected algorithm
function CPUScheduler(input, utility, output) {
    function updateReadyQueue(currentTimeLog) {
        let candidatesRemain = currentTimeLog.remain.filter((element) => input.arrivalTime[element] <= currentTimeLog.time);
        if (candidatesRemain.length > 0) {
            currentTimeLog.move.push(0);  // Mark processes moving from "Remain" to "Ready"
        }
        
        let candidatesBlock = currentTimeLog.block.filter((element) => utility.returnTime[element] <= currentTimeLog.time);
        if (candidatesBlock.length > 0) {
            currentTimeLog.move.push(5);  // Mark processes moving from "Block" to "Ready"
        }
        
        let candidates = candidatesRemain.concat(candidatesBlock);
        candidates.sort((a, b) => utility.returnTime[a] - utility.returnTime[b]);  // Sort candidates by return time
        
        candidates.forEach(element => {
            moveElement(element, currentTimeLog.remain, currentTimeLog.ready);  // Move elements from "Remain" to "Ready"
            moveElement(element, currentTimeLog.block, currentTimeLog.ready);   // Move elements from "Block" to "Ready"
        });
        
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the current time state
        currentTimeLog.move = [];  // Reset moves for the next time unit
    }

    // Function to move an element from one state to another
    function moveElement(value, from, to) {
        let index = from.indexOf(value);
        if (index != -1) {
            from.splice(index, 1);  // Remove from the original state
        }
        if (to.indexOf(value) == -1) {
            to.push(value);  // Add to the new state if not already present
        }
    }

    let currentTimeLog = new TimeLog();
    currentTimeLog.remain = input.processId;  // Initialize with all processes in "Remain"
    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the initial state
    
    currentTimeLog.move = [];  // Initialize the move array
    currentTimeLog.time++;  // Increment the simulation time
    
    let lastFound = -1;
    while (utility.done.some((element) => element == false)) {  // Continue while there are incomplete processes
        updateReadyQueue(currentTimeLog);  // Update the ready queue based on the current time
        
        let found = -1;
        if (currentTimeLog.running.length == 1) {
            found = currentTimeLog.running[0];  // If a process is already running, continue with it
        } else if (currentTimeLog.ready.length > 0) {
            if (input.algorithm == 'rr') {  // If Round Robin, select the first ready process
                found = currentTimeLog.ready[0];
                utility.remainingTimeRunning[found] = Math.min(utility.remainingProcessTime[found][utility.currentProcessIndex[found]], input.timeQuantum);
            } else {
                let candidates = currentTimeLog.ready;
                candidates.sort((a, b) => a - b);  // Sort the ready queue (FCFS logic here)
                candidates.sort((a, b) => {
                    switch (input.algorithm) {
                        case 'fcfs':
                            return utility.returnTime[a] - utility.returnTime[b];  // FCFS: Sort by arrival time (return time)
                        case 'sjf':
                        case 'srtf':
                            return utility.remainingBurstTime[a] - utility.remainingBurstTime[b];  // SJF/SRTF: Sort by remaining burst time
                        case 'ljf':
                        case 'lrtf':
                            return utility.remainingBurstTime[b] - utility.remainingBurstTime[a];  // LJF/LRTF: Sort by remaining burst time (reverse)
                        case 'pnp':
                        case 'pp':
                            return priorityPreference * (input.priority[a] - input.priority[b]);  // Priority: Sort by priority level
                        case 'hrrn':
                            function responseRatio(id) {
                                let s = utility.remainingBurstTime[id];
                                let w = currentTimeLog.time - input.arrivalTime[id] - s;
                                return 1 + w / s;  // HRRN: Calculate response ratio
                            }
                            return responseRatio(b) - responseRatio(a);  // Sort by highest response ratio
                    }
                });
                found = candidates[0];  // Select the best candidate based on the algorithm

                if (input.algorithmType == "preemptive" && found >= 0 && lastFound >= 0 && found != lastFound) {
                    // Preemptive: Context switch required
                    output.schedule.push([-2, input.contextSwitch]);  // Record context switch in the schedule
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                        updateReadyQueue(currentTimeLog);  // Update ready queue during context switch
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;  // Increment context switch count
                    }
                }

                moveElement(found, currentTimeLog.ready, currentTimeLog.running);  // Move the selected process to "Running"
                currentTimeLog.move.push(1);  // Log the move from "Ready" to "Running"
                output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the current time state
                currentTimeLog.move = [];  // Reset moves for the next time unit

                if (utility.start[found] == false) {
                    utility.start[found] = true;
                    output.responseTime[found] = currentTimeLog.time - input.arrivalTime[found];  // Calculate the response time for the process
                }
            }
        }
        currentTimeLog.time++;  // Increment the simulation time
        
        if (found != -1) {
            output.schedule.push([found + 1, 1]);  // Record the process execution in the schedule
            utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;  // Decrement the remaining process time
            utility.remainingBurstTime[found]--;  // Decrement the remaining burst time

            if (input.algorithm == 'rr') {  // Special handling for Round Robin
                utility.remainingTimeRunning[found]--;
                if (utility.remainingTimeRunning[found] == 0) {  // Time slice is complete
                    if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                        utility.currentProcessIndex[found]++;
                        if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                            utility.done[found] = true;  // Process is complete
                            output.completionTime[found] = currentTimeLog.time;  // Record the completion time
                            moveElement(found, currentTimeLog.running, currentTimeLog.terminate);  // Move process to "Terminate"
                            currentTimeLog.move.push(2);  // Log the move from "Running" to "Terminate"
                        } else {
                            utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                            utility.currentProcessIndex[found]++;
                            moveElement(found, currentTimeLog.running, currentTimeLog.block);  // Move process to "Block"
                            currentTimeLog.move.push(4);  // Log the move from "Running" to "Block"
                        }
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the current state
                        currentTimeLog.move = [];
                        updateReadyQueue(currentTimeLog);  // Update the ready queue
                    } else {
                        updateReadyQueue(currentTimeLog);  // Update the ready queue if the process is not finished
                        moveElement(found, currentTimeLog.running, currentTimeLog.ready);  // Move process back to "Ready"
                        currentTimeLog.move.push(3);  // Log the move from "Running" to "Ready"
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the current state
                        currentTimeLog.move = [];  // Reset moves for the next time unit
                    }
                    output.schedule.push([-2, input.contextSwitch]);  // Record a context switch in the schedule
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                        updateReadyQueue(currentTimeLog);  // Update the ready queue during the context switch
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;  // Increment the context switch count
                    }
                }
            } else {  // Handling for preemptive and non-preemptive scheduling algorithms
                if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                    utility.currentProcessIndex[found]++;
                    if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                        utility.done[found] = true;  // Mark the process as complete
                        output.completionTime[found] = currentTimeLog.time;  // Record the completion time
                        moveElement(found, currentTimeLog.running, currentTimeLog.terminate);  // Move process to "Terminate"
                        currentTimeLog.move.push(2);  // Log the move from "Running" to "Terminate"
                    } else {
                        utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                        utility.currentProcessIndex[found]++;
                        moveElement(found, currentTimeLog.running, currentTimeLog.block);  // Move process to "Block"
                        currentTimeLog.move.push(4);  // Log the move from "Running" to "Block"
                    }
                    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the current state
                    currentTimeLog.move = [];

                    if (currentTimeLog.running.length == 0) {  // If no process is running, perform a context switch
                        output.schedule.push([-2, input.contextSwitch]);  // Record a context switch in the schedule
                        for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                            updateReadyQueue(currentTimeLog);  // Update the ready queue during the context switch
                        }
                        if (input.contextSwitch > 0) {
                            output.contextSwitches++;  // Increment the context switch count
                        }
                        lastFound = -1;  // Reset the last found process
                    } else if (input.algorithmType == "preemptive") {
                        moveElement(found, currentTimeLog.running, currentTimeLog.ready);  // Preemptive: Move the process back to "Ready"
                        currentTimeLog.move.push(3);  // Log the move from "Running" to "Ready"
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the current state
                        currentTimeLog.move = [];
                        lastFound = found;  // Update the last found process
                    }
                }
            }
        } else {
            output.schedule.push([-1, 1]);  // No process is running (idle time)
            lastFound = -1;
        }
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));  // Log the current state
    }
    output.schedule.pop();  // Remove the last entry in the schedule if it's incomplete
}

// Function to calculate the scheduling output and display it
function calculateOutput() {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";  // Clear any previous output

    let mainInput = new Input();
    let mainUtility = new Utility();
    let mainOutput = new Output();

    setInput(mainInput);  // Gather input data
    setUtility(mainInput, mainUtility);  // Initialize utility data
    CPUScheduler(mainInput, mainUtility, mainOutput);  // Run the CPU scheduler
    setOutput(mainInput, mainOutput);  // Process the output

    showOutput(mainInput, mainOutput, outputDiv);  // Display the output
}

// Event listener to calculate and display the output when the "Calculate" button is clicked
document.getElementById("calculate").onclick = () => {
    calculateOutput();
};
