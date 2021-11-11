import * as blessed from 'blessed';

const screen = blessed.screen({
    autoPadding: true,
    title: 'Gopharl',
    warnings: true,
});

const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    content: 'Welcome to {bold}Gopharl{/bold}!',
});

const icon = blessed.image({
    parent: box,
    top: 0,
    left: 0,
    type: 'overlay',
    width: 'shrink',
    height: 'shrink',
    file: __dirname + '/icon.png',
    search: false,
});

screen.append(box);
box.focus();
screen.render();
