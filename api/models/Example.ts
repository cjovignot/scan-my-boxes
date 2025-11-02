import mongoose from "mongoose";

const ExampleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Example =
  mongoose.models.Example || mongoose.model("Example", ExampleSchema);
