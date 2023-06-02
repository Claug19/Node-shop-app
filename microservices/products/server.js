const app = require('koa')();
const router = require('koa-router')();
const db = require("../../databases/db.json");

// Log requests
app.use(function *(next){
    const start = new Date;
    yield next;
    const ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

router.get('/api/products', function *() {
    this.body = db.products;
});

router.get('/api/products/:productId', function *() {
    const id = parseInt(this.params.productId);
    this.body = db.products.find((product) => product.id === id);
});

router.get('/api/', function *() {
    this.body = "API ready to receive requests";
});

router.get('/', function *() {
    this.body = "Ready to receive requests";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);

console.log('Worker started');