const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conservation: {
      type: Schema.Types.ObjectId,
      ref: "Conservation",
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "video"],
      default: "text",
    },

    attachments: [],
  },
  { timestamps: true }
);

const MessageModel = model("Message", MessageSchema);

module.exports = MessageModel;
