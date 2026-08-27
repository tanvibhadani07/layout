import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    role: {
      type: String,
      enum: [
        "Developer",
        "Designer",
        "Manager",
        "HR",
        "Admin",
      ],
      default: "Developer",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  models.User ||
  model("User", UserSchema);

export default User;