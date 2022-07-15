import expressHandlebars from 'express-handlebars';
const handlebars = expressHandlebars.create({
	defaultLayout: 'main', 
	extname: 'hbs'
});

import multer from 'multer';
import EasyYandexS3 from 'easy-yandex-s3';




var s3 = new EasyYandexS3({
    auth: {
        accessKeyId: "YCAJEfV7m5XcXhk9NhlSp7D7E",
        secretAccessKey: "YCNngYN1FZeTFvBahAa2h3hsJb9Rdj2fw-32IPbP",
    },
    Bucket: "public-bucket-033903", // Название бакета
    debug: false// Дебаг в консоли
});


import express from 'express';
let app = express();

// import __dirname from './public';
app.use(express.static('public'));
// app.get('/', function(req, res) {
// 	res.send('hello world');
// });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// Подключаешь мидлвар multer для чтения загруженных файлов
app.use(multer().any());

import mongodb from 'mongodb';

let mongoClient = new mongodb.MongoClient('mongodb://localhost:27017/', {
	useUnifiedTopology: true
});

mongoClient.connect(async function(error, mongo) {
	if (!error) {
		let db = mongo.db('test');
		let coll = db.collection('users');
		let tex = db.collection('texts');
		let ads = db.collection('ads');
		// let res = await coll.find().toArray(); 
		// console.log(res);

		// Home_page
		app.get('/', async function(req, res) {

				// let result = await tex.find().sort({$natural: -1}).toArray();
				
				let latest = await ads.find().toArray(); 
				res.render('home', {latest_home: latest, special_home: latest, bestseller_home: latest});

		});
		app.get('/sdsd', async function(req, res) {

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
		app.get('/t', async function(req, res) {

			
				res.render('test_post');
		});
		// Download of images
		// Делаешь фетч post-запроса с отправленным файлом по ссылке /uploadFile
		app.post('/d', async(req,res)=>{
			let buffer = req.files[0].buffer; // Буфер загруженного файла
			var upload = await s3.Upload({buffer}, '/folder1/'); // Загрузка в бакет
			req.body.img = upload.Location;

			ads.insertOne(req.body); 
			res.send("success"); // Ответ сервера - ответ от Yandex Object Storage
		});
		
	} else {
		console.error(error);
	}
});






app.listen(3000, function() {
	console.log('running');
});