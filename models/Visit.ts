import { Schema, model, models, type Model } from 'mongoose';

export interface IVisit {
  name: string;
  lat: number;
  lng: number;
  accuracy?: number;
  at: Date;
}

const VisitSchema = new Schema<IVisit>({
  name: { type: String, default: 'Anonymous', maxlength: 50 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  accuracy: Number,
  at: { type: Date, default: Date.now },
});

export const Visit: Model<IVisit> =
  models.Visit || model<IVisit>('Visit', VisitSchema);