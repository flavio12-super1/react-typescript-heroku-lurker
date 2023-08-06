const mongoose = require("mongoose");

const ContainerDataSchema = new mongoose.Schema({
  containerArray: {
    type: String,
    required: true,
  },
  containerState: {
    type: String,
    required: true,
  },
});

const ContainerData = mongoose.model("ContainerData", ContainerDataSchema);
module.exports = ContainerData;
