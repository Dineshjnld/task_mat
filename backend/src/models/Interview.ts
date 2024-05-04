import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  name: string;
  status: 'Pending' | 'Complete';
  feedback: string;
  rating: number;
}

const interviewSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Complete'], required: true },
  feedback: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
});

const Interview = mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;
