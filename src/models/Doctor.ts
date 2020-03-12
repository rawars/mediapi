import { Schema, model } from 'mongoose';

const DoctorSchema = new Schema({
	names: { type: String, required: true },
	surnames: { type: String, required: true },
	erm: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, default: '' },
	createdAt: { type: Date, default: Date.now }
});

export default model('Doctor', DoctorSchema);