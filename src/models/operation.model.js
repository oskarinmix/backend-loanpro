import mongoose from "mongoose";

const validOperations = [
  "ADDITION",
  "SUBTRACTION",
  "MULTIPLICATION",
  "DIVISION",
  "SQUARE_ROOT",
  "RANDOM_STRING",
];
const operationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: validOperations, required: true, unique: true },
    cost: { type: Number },
  },
  { collection: "operations", timestamps: true }
);

const Operation = mongoose.model("Operation", operationSchema);
export { Operation, validOperations };
