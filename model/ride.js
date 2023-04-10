const mongoose= require('mongoose');
const {Schema, model} = mongoose;

const rideSchema= new Schema({
	admin: { type: String, required: true},
	slots: { type: Number, required: true},
	passengers: [
	{
		user: {type :[mongoose.ObjectId], ref: 'login'},
		phone: [Number]
		}],
	date: { type: Date, required: true},
	destination:  { type: String, required: true},
});

const ride= model('ride', rideSchema, 'ride');
module.exports = ride;