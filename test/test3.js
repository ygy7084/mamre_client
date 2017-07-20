const mongoose = require('mongoose');


const db = mongoose.connection;
mongoose.connect('mongodb://octonutTicket:ST98HtJFvlBOVJgP@betterwaysystems-shard-00-00-iseba.mongodb.net:27017,betterwaysystems-shard-00-01-iseba.mongodb.net:27017,betterwaysystems-shard-00-02-iseba.mongodb.net:27017/octonutTicket?ssl=true&replicaSet=BetterwaySystems-shard-0&authSource=admin/octonutTicket');
mongoose.Promise = global.Promise;

db.on('error', console.error);
db.once('open', () => {console.log('Hi mongodb')});

