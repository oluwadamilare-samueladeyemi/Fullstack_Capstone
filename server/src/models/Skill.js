import mongoose from "mongoose";

const CATEGORIES = ["frontend", "backend", "database", "tools", "design"];

const LEVELS = ["beginner", "intermediate", "advanced"];

const skillSchema = new mongoose.Schema({
  _id: { type: String, trim: true },
  name: {
    type: String,
    required: [true, "This skill needs to have a name"],
    unique: true,
    trim: true,
  },
  category: { type: String, enum: CATEGORIES, trim: true },
  level: { type: String, enum: LEVELS, trim: true },
  yearsExperience: { type: Number, min: 0 },
  endorsements: { type: Number, min: 0, default: 0 },
  endorsedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

skillSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    
ret.id
 = ret._id;
    delete ret._id;
    delete ret.endorsedBy; // never sent to the client
    return ret;
  },
});

export default mongoose.model('Skill', skillSchema); 