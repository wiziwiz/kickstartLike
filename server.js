const {createServer} = require('http');
const next = require('next');
const routes = require('./routes');


const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const handler = routes.getRequestHandler(app);
app.prepare().then(() => {
    const port = 3000;
    createServer(handler).listen(port, (err) => {
        if (err) throw err;
        console.log('Ready on ', port);
    })
})