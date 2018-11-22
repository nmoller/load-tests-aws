/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.71794871794872, "KoPercent": 1.2820512820512822};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9354700854700855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9333333333333333, 500, 1500, "Fill a form to reply a forum discussion"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion-0"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "View a forum discussion"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "View course participants"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "View a forum activity-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum activity-1"], "isController": false}, {"data": [0.95, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "View course once more"], "isController": false}, {"data": [1.0, 500, 1500, "View course once more-1"], "isController": false}, {"data": [0.3388888888888889, 500, 1500, "Logout"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "View course once more-0"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity-0"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course again-1"], "isController": false}, {"data": [0.9416666666666667, 500, 1500, "View a forum activity"], "isController": false}, {"data": [1.0, 500, 1500, "View course-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "View course again"], "isController": false}, {"data": [1.0, 500, 1500, "View course again-0"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "Frontpage logged"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [0.9083333333333333, 500, 1500, "View a page activity"], "isController": false}, {"data": [0.9944444444444445, 500, 1500, "Frontpage not logged"], "isController": false}, {"data": [1.0, 500, 1500, "Send the forum discussion reply"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "View course"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2340, 30, 1.2820512820512822, 307.52649572649506, 0, 1340, 503.9000000000001, 654.7999999999993, 1024.130000000001, 5.036547253144613, 146.94379262366445, 1.7876657123593427], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Fill a form to reply a forum discussion", 60, 0, 0.0, 381.86666666666656, 325, 531, 505.6, 510.79999999999995, 531.0, 0.25842130425232257, 7.6241014475900055, 0.13678158877417854], "isController": false}, {"data": ["Fill a form to reply a forum discussion-0", 60, 0, 0.0, 145.1, 110, 298, 271.0, 286.54999999999995, 298.0, 0.25867309325596133, 0.26978795273180345, 0.06037389578923316], "isController": false}, {"data": ["Fill a form to reply a forum discussion-1", 60, 0, 0.0, 236.26666666666665, 207, 386, 243.7, 372.79999999999995, 386.0, 0.2587232868206357, 7.363170416716974, 0.07655581631509047], "isController": false}, {"data": ["View a forum discussion", 60, 0, 0.0, 391.8999999999999, 339, 651, 514.1, 538.3499999999999, 651.0, 0.2587645716799427, 7.61419384997477, 0.13671057937387598], "isController": false}, {"data": ["View course participants-0", 60, 0, 0.0, 137.13333333333327, 112, 304, 146.0, 275.95, 304.0, 0.2601659858990036, 0.27134499310560134, 0.058435719489034], "isController": false}, {"data": ["View course participants", 60, 0, 0.0, 383.03333333333336, 326, 538, 499.8, 520.15, 538.0, 0.2599146613528558, 7.659313642541532, 0.13528761181745327], "isController": false}, {"data": ["View a forum activity-0", 60, 0, 0.0, 152.41666666666669, 117, 569, 260.59999999999985, 287.54999999999995, 569.0, 0.25902485775218226, 0.2701548321087214, 0.05969713518507326], "isController": false}, {"data": ["View course participants-1", 60, 0, 0.0, 245.56666666666666, 205, 402, 363.7, 374.84999999999997, 402.0, 0.26005096999011806, 7.392105428184758, 0.07694867569043533], "isController": false}, {"data": ["Login-0", 90, 0, 0.0, 329.97777777777765, 292, 387, 341.0, 358.35, 387.0, 0.2960146560145244, 0.3676735858722072, 0.10580211338019137], "isController": false}, {"data": ["Login-1", 90, 0, 0.0, 222.17777777777778, 172, 409, 340.70000000000005, 357.0, 409.0, 0.2961597946625424, 0.2799635558919346, 0.09195543103590115], "isController": false}, {"data": ["View a forum activity-1", 60, 0, 0.0, 236.88333333333333, 205, 394, 355.6999999999998, 382.9, 394.0, 0.25895666360234615, 7.348944812288788, 0.07662487214014735], "isController": false}, {"data": ["Logout-1", 60, 0, 0.0, 411.2333333333333, 374, 560, 521.9999999999999, 546.65, 560.0, 0.2658478552724276, 10.3502696071101, 0.06957736837208066], "isController": false}, {"data": ["Login-2", 90, 0, 0.0, 458.9000000000001, 393, 623, 586.2, 599.35, 623.0, 0.2960760060004737, 42.64069225962741, 0.07835605236926599], "isController": false}, {"data": ["Logout-0", 60, 0, 0.0, 161.3666666666667, 123, 432, 286.9, 298.0, 432.0, 0.26594919483881263, 0.28932363579144266, 0.06674701472028793], "isController": false}, {"data": ["View course once more", 60, 0, 0.0, 405.5333333333332, 330, 920, 516.7, 604.5, 920.0, 0.25877238381119966, 7.612001944027533, 0.13494575483904359], "isController": false}, {"data": ["View course once more-1", 60, 0, 0.0, 249.3166666666667, 206, 435, 377.7, 388.65, 435.0, 0.2589030278709109, 7.3458171788631565, 0.07660900141102149], "isController": false}, {"data": ["Logout", 90, 30, 33.333333333333336, 382.0444444444444, 0, 823, 685.7, 696.45, 823.0, 0.21075012996258013, 5.705339431378587, 0.07203373582705376], "isController": false}, {"data": ["View course once more-0", 60, 0, 0.0, 155.76666666666665, 116, 679, 266.0999999999999, 287.9, 679.0, 0.2590192667164559, 0.27014900083317867, 0.05843110411279426], "isController": false}, {"data": ["View a page activity-1", 60, 0, 0.0, 244.09999999999994, 207, 391, 374.3, 380.95, 391.0, 0.25904834273822736, 7.351323116394738, 0.07665199985320595], "isController": false}, {"data": ["View a page activity-0", 60, 0, 0.0, 158.63333333333333, 118, 307, 276.0, 288.79999999999995, 307.0, 0.2589633696313656, 0.2700907019202134, 0.05943007017907317], "isController": false}, {"data": ["View a forum discussion-1", 60, 0, 0.0, 240.95, 195, 407, 367.9, 386.49999999999994, 407.0, 0.2589197866500958, 7.348715832027946, 0.0766139603075967], "isController": false}, {"data": ["View a forum discussion-0", 60, 0, 0.0, 150.48333333333335, 118, 293, 263.39999999999986, 288.54999999999995, 293.0, 0.259000259000259, 0.2701291763791764, 0.06019732582232582], "isController": false}, {"data": ["View course again-1", 60, 0, 0.0, 241.00000000000003, 208, 391, 362.9, 369.84999999999997, 391.0, 0.2587601078167116, 7.342040094339622, 0.0765667115902965], "isController": false}, {"data": ["View a forum activity", 60, 0, 0.0, 389.66666666666663, 330, 801, 509.6, 521.0, 801.0, 0.2587891256809389, 7.614099215707206, 0.13621810424025982], "isController": false}, {"data": ["View course-0", 90, 0, 0.0, 157.3111111111111, 114, 497, 278.8, 301.15000000000003, 497.0, 0.2811331540328551, 0.29321309424520436, 0.06341968611483352], "isController": false}, {"data": ["View course-1", 90, 0, 0.0, 236.07777777777775, 201, 388, 257.6, 379.05, 388.0, 0.2810558957719825, 7.974219977179823, 0.08316400040909247], "isController": false}, {"data": ["View course again", 60, 0, 0.0, 397.25000000000006, 332, 689, 510.8, 523.85, 689.0, 0.2586095426921253, 7.607489642149045, 0.1348608357398388], "isController": false}, {"data": ["View course again-0", 60, 0, 0.0, 155.66666666666669, 118, 309, 280.3, 303.29999999999995, 309.0, 0.2588505310750063, 0.2699730148321354, 0.05839303972492817], "isController": false}, {"data": ["Frontpage logged", 90, 0, 0.0, 348.1222222222223, 319, 553, 456.0000000000005, 488.9, 553.0, 0.28478128797083835, 11.108444788621089, 0.05868051929867862], "isController": false}, {"data": ["Login", 90, 0, 0.0, 1013.8333333333336, 918, 1340, 1125.9, 1197.5000000000002, 1340.0, 0.2954035212099728, 43.19000454490626, 0.27548237446170915], "isController": false}, {"data": ["View a page activity", 60, 0, 0.0, 403.14999999999986, 330, 676, 536.9, 650.6999999999999, 676.0, 0.25870543798830653, 7.611413787490729, 0.1359214117555751], "isController": false}, {"data": ["Frontpage not logged", 90, 0, 0.0, 345.25555555555576, 313, 655, 375.4000000000001, 486.25, 655.0, 0.3106297500465945, 12.146031063190721, 0.0348851770071859], "isController": false}, {"data": ["Send the forum discussion reply", 60, 0, 0.0, 87.58333333333331, 73, 108, 96.9, 104.79999999999998, 108.0, 0.25908861262366084, 0.27022132644733377, 0.1637014964526451], "isController": false}, {"data": ["View course", 90, 0, 0.0, 394.0777777777777, 332, 714, 526.2, 609.8500000000003, 714.0, 0.28093921099783364, 8.263920172098679, 0.14650540886019842], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 48: http:\/\/moodle.uqam.io\/login\/logout.php?sesskey=${SESSION_SESSKEY}", 30, 100.0, 1.2820512820512822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2340, 30, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 48: http:\/\/moodle.uqam.io\/login\/logout.php?sesskey=${SESSION_SESSKEY}", 30, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout", 90, 30, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 48: http:\/\/moodle.uqam.io\/login\/logout.php?sesskey=${SESSION_SESSKEY}", 30, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
