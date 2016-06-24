const request = require('request');

// request.post('http://localhost:3000/slack/ping', {form: { foo: 'bar'}}, (err, res, body) => {
//     console.log('err', err);
//     console.log('res', res.statusCode);
//     console.log('body', body);
// });


const database = require('./app/libs/database.js')();
console.log(database);
database.save({}, 'team:me')
.then(data => {
    console.log('data', data);
})
