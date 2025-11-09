const mongoose = require("mongoose");
// const { StrictMode } = require("react");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user collection
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect string type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ firstName: 1, lastName: 1 });

// 1 → Ascending order  ,-1 → Descending order

// before save pre is called and the function will be normal function,not arrow function
// pre is a kind of middleware
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
