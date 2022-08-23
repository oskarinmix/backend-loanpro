import { Operation, validOperations } from "../models/operation.model.js";

const generateOperations = async (req, res) => {
  const { type, cost } = req.body;
  const promises = [];
  validOperations.map((operation) => {
    const newOperation = new Operation({
      type: operation,
      cost: Math.floor(Math.random() * 10) + 1,
    });
    promises.push(newOperation.save());
  });
  await Promise.all(promises);
  res.status(200).json({
    message: "Operations generated successfully",
    ok: true,
  });
};
const updateOperation = async (req, res) => {
  const { cost } = req.body;
  const { id } = req.params;

  try {
    const operation = await Operation.findOne({ id: id });
    if (!operation) {
      res.statusMessage = "OPERATION_NOT_FOUND";
      res.status(400).send({ msg: "No operation with this id ", ok: false });
      return;
    }
    const newOperation = await Operation.findOneAndUpdate(
      { id: id },
      { cost: cost },
      { new: true }
    );
    res.statusMessage = "OPERATION_UPDATED";
    res.status(200).json({
      msg: "Operation update successfully",
      ok: true,
      operation: newOperation,
    });
  } catch (error) {
    res.statusMessage = "ERROR_UPDATING_OPERATION";
    res.status(400).send({ msg: "Error updating operation", ok: false, error });
    return;
  }
};
const getOperations = async (req, res) => {
  try {
    const operations = await Operation.find();
    res.statusMessage = "OPERATIONS_FOUND";
    res.status(200).json({ msg: "Operations found", ok: true, operations });
  } catch (error) {
    res.statusMessage = "ERROR_GETTING_OPERATIONS";
    res.status(400).send({ msg: "Error getting operations", ok: false, error });
    return;
  }
};
export default {
  generateOperations,
  updateOperation,
  getOperations,
};
