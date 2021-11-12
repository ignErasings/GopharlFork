var blessed = require('blessed')
    , contrib = require('blessed-contrib')
var os = require('os');
var osu = require('os-utils');
var moment = require('moment');

var screen = blessed.screen()
var grid = new contrib.grid({ rows: 13, cols: 12, screen: screen })
var header = grid.set(0, 0, 1, 12, blessed.text, {
    content: 'Gopharl',
    tags: true,
    align: 'center',
});
let focusWindow = 0;

// * VERTICAL COLUMN 1
var motd = grid.set(1, 0, 2, 4, blessed.text, {
    content: 'Hello',
    tags: true,
    label: ' MOTD ',
});
var appList = grid.set(3, 0, 4, 4, blessed.list, {
    parent: screen,
    label: ' What do you want to do? ',
    tags: true,
    draggable: false,
    keys: true,
    vi: true,
    mouse: false,
    border: 'line',
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'cyan'
        },
        style: {
            inverse: true
        }
    },
    style: {
        selected: {
            bg: 'white',
            fg: 'black',
            bold: true
        }
    },
    items: ['Clone repository from GitHub', 'List all running processes', 'Logout current user', 'Change "Message of the Day"', 'Check for updates']
});
var systemUsage = grid.set(7, 0, 6, 4, contrib.line, {
    showNthLabel: 5,
    maxY: 100,
    label: ' System usage ',
    showLegend: true,
    legend: { width: 10 }
});
// * VERTICAL COLUMN 2
var projectList = grid.set(1, 4, 6, 4, blessed.list, {
    parent: screen,
    label: ' Browse projects ',
    tags: true,
    draggable: false,
    keys: true,
    vi: true,
    mouse: false,
    border: 'line',
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'cyan'
        },
        style: {
            inverse: true
        }
    },
    style: {
        selected: {
            bg: 'white',
            fg: 'black',
            bold: true
        }
    },
    items: ['/home/projects/manager', '/home/projects/fluen/frontend', '/home/projects/fluen/backend', '/var/www/html']
});
var processList = grid.set(7, 4, 6, 4, blessed.list, {
    parent: screen,
    label: ' Your running processes ',
    tags: true,
    draggable: false,
    keys: true,
    vi: true,
    mouse: false,
    border: 'line',
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'cyan'
        },
        style: {
            inverse: true
        }
    },
    style: {
        selected: {
            bg: 'white',
            fg: 'black',
            bold: true
        }
    },
    items: ['{gray-fg}node.js (PID3958){/gray-fg}\nCPU usage: 37%\nRAM usage: 2095MB', '{gray-fg}/path/to/process.sh (PID0967){/gray-fg}\nCPU usage: 37%\nRAM usage: 2095MB', 'Start another process']
});
// * VERTICAL COLUMN 2
var terminal = grid.set(1, 8, 12, 4, blessed.textarea, {
    inputOnFocus: true,
    label: ' Terminal ',
    parent: screen,
});


var D_cpu = {
    title: 'CPU',
    style: { line: 'blue' },
    x: [],
    y: []
}
var D_net = {
    title: 'Network',
    style: { line: 'green' },
    x: [],
    y: []
}
var D_ram = {
    title: 'RAM',
    style: { line: 'red' },
    x: [],
    y: []
}

setLineData();

setInterval(function () {
    setLineData()
    screen.render()
}, 500)
setInterval(function () {
    if (focusWindow === 0) appList.focus();
    if (focusWindow === 1) projectList.focus();
    if (focusWindow === 2) processList.focus();
    // if (focusWindow === 3) terminal.focus();
    screen.render()
}, 5)

function setLineData() {
    osu.cpuUsage(function (v) {
        if (D_cpu.x.length > 10) {
            D_cpu.y.shift();
            D_cpu.x.shift();
            D_net.y.shift();
            D_net.x.shift();
            D_ram.y.shift();
            D_ram.x.shift();
        }
        D_cpu.y.push(Math.floor(v * 100));
        D_cpu.x.push(moment().format('HH:mm:ss'));
        D_ram.y.push((osu.totalmem() - osu.freemem()) / osu.totalmem() * 100);
        D_ram.x.push(moment().format('HH:mm:ss'));

        systemUsage.setData([D_cpu, D_net, D_ram]);
    });
}


screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});
screen.key(['tab'], function (ch, key) {
    if (focusWindow === 3) focusWindow = 0;
    else focusWindow++;
})

// fixes https://github.com/yaronn/blessed-contrib/issues/10
screen.on('resize', function () {
    systemUsage.emit('attach');
});

screen.render()