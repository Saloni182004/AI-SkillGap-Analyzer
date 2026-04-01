import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true }, 
  profile: { type: Object, required: true }, 
  updated_at: { type: Date }
}, { 
  strict: false, 
  collection: 'resumes' 
});

export default mongoose.model("Resume", ResumeSchema);