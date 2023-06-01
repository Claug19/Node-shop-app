const app = require('koa')();
const router = require('koa-router')();
const users_db = require('./databases/users.json');
const db = require('./databases/db.json');

// Log requests
app.use(function *(next){
    const start = new Date;
    yield next;
    const ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

router.get('/api/users', function *(next) {
    this.body = users_db.users;
});

router.get('/api/users/:userId', function *(next) {
    const id = parseInt(this.params.userId);
    this.body = users_db.users.find((user) => user.id === id);
});

router.get('/api/products', function *() {
    this.body = db.products;
});

router.get('/api/products/:productId', function *() {
    const id = parseInt(this.params.productId);
    this.body = db.products.find((product) => product.id === id);
});

router.get('/api/inventory', function *() {
    this.body = db.inventory;
});

router.get('/api/inventory/:productId', function *() {
    const id = parseInt(this.params.productId);
    this.body = db.inventory.find((product) => product.id === id);
});

router.get('/api/reserved', function *() {
    this.body = db.inventory;
});

router.get('/api/reserved/:productId', function *() {
    const id = parseInt(this.params.productId);
    this.body = db.reserved.find((product) => product.id === id);
});

router.get('/api/reserved/by_user/:clientId', function *() {
    const id = parseInt(this.params.clientId);
    this.body = db.reserved.filter((product) => product.clientId === id);
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