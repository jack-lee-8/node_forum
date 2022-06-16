import expressHandlebars from 'express-handlebars';
const handlebars = expressHandlebars.create({
	defaultLayout: 'main', 
	extname: 'hbs'
});


import express from 'express';
let app = express();

// app.get('/', function(req, res) {
// 	res.send('hello world');
// });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');



import mongodb from 'mongodb';

let mongoClient = new mongodb.MongoClient('mongodb://localhost:27017/', {
	useUnifiedTopology: true
});

mongoClient.connect(async function(error, mongo) {
	if (!error) {
		let db = mongo.db('test');
		let coll = db.collection('users');
		let tex = db.collection('texts');
		// let res = await coll.find().toArray();
		// console.log(res);
		 
		app.get('/', async function(req, res) {

			if(!req.query.submit){
				let num_text = await tex.find().toArray(); 
				res.render('page1', {resul: num_text});
			}else{
				let unit = {name: req.query.one, text: req.query.two};
				// let unit = {name: 'mike', text: 'dkfjfodfiwo'};
				tex.insertOne(unit);
				let result = await tex.find().sort({$natural: -1}).toArray();
				res.render('page1', {resul: result});
			}
		});
		
	} else {
		console.error(err);
	}
});






app.listen(3000, function() {
	console.log('running');
});