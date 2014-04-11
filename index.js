exports.init = function (data) {
    var Venus = require('./js/venus'),
        container = document.getElementById('chart_container'),
        lineData = [],
        lineOptions = {
            width: 900,
            height: 400,
            axis:{
                x:{ 
                    opposite:false,
                    tickWidth:50,
                    ticks:['Jan', 'Feb', "Mar", 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                y: {
                    min:0
                }
            },
            icons: {
                0: "circle"
            },
            line:{
                smooth:false,
                dotRadius: 6
            },
            grid:{

            }

        };
        var arr = [];
        lineData.push({name:0, data:arr});
        for (var j = 0; j < 12; j++) {
            arr.push(parseInt(Math.random() * 100));
        };
    var line = new Venus.SvgChart(container, lineData, lineOptions);

}

