import Record from "../models/record.model.js";

const create = async (req, res) => {
  const { userId, operationId, amount, operationResponse, userBalance } =
    req.body;
  const record = new Record({
    userId,
    operationId,
    amount,
    operationResponse,
    userBalance,
  });
  try {
    const data = await record.save();
    res.status(200).json({
      message: "Record created successfully",
      record: data,
      ok: true,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Record.",
    });
  }
};

const getRecords = async (req, res) => {
  try {
    const records = await Record.find({ softDeleted: false })
      .populate("userId")
      .populate("operationId");
    res.statusMessage = "RECORD_FOUND";
    res.status(200).json({ msg: "Records found", ok: true, records });
  } catch (error) {
    res.statusMessage = "ERROR_GETTING_RECORDS";
    res.status(400).send({ msg: "Error getting records", ok: false, error });
    return;
  }
};
const getRecordsByUser = async (req, res) => {
  const pageSize = 20;
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  try {
    const total = await Record.countDocuments({ userId });
    const records = await Record.find({ userId: userId, softDeleted: false })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate("userId")
      .populate("operationId");
    res.statusMessage = "RECORDS_FOUND";
    res.status(200).json({
      msg: "Records found",
      ok: true,
      records,
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    res.statusMessage = "ERROR_GETTING_RECORDS";
    res.status(400).send({ msg: "Error getting records", ok: false, error });
    return;
  }
};

const removeRecord = async (req, res) => {
  const { recordId } = req.params;
  try {
    const record = await Record.findOne({ _id: recordId });
    if (!record) {
      ("RECORD_NOT_FOUND");
      res.status(400).send({ msg: "No record with this email ", ok: false });
      return;
    }
    await Record.findOneAndUpdate(
      { _id: recordId },
      { softDeleted: true },
      { new: true }
    );
    res.statusMessage = "RECORD_UPDATED";
    res
      .status(200)
      .json({ msg: "Record update successfully", ok: true, deleted: true });
  } catch (error) {
    res.statusMessage = "ERROR_UPDATING_RECORD";
    res.status(400).send({ msg: "Error updating record", ok: false, error });
    return;
  }
};
export default {
  create,
  getRecords,
  getRecordsByUser,
  removeRecord,
};
