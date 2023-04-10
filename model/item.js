const mongoose= require('mongoose');
const {Schema, model} = mongoose;

const itemSchema= new Schema({
	itemname: { type: String, required: true},
	location: { type: String, required: true},
	date: { type: Date, required: true},
	claims: { type: [mongoose.ObjectId], ref:'login'},
	received: { type: mongoose.ObjectId , ref: 'login' },
	image: { type: Buffer, required: true },
	poster: {type: mongoose.ObjectId , ref: 'login', required: true}
});
module.exports = model('item', itemSchema, 'item');