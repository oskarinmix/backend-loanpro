import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    operationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operation",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    userBalance: { type: Number, required: true },
    operationResponse: { type: String, default: "" },
    softDeleted: { type: Boolean, default: false },
  },
  { collection: "records", timestamps: true }
);

export default mongoose.model("Record", recordSchema);
