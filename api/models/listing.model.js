import mongoose from "mongoose";
import slugify from "slugify";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["sale", "rent"],
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.every((url) => typeof url === "string");
        },
        message: "Image URLs must be an array of strings.",
      },
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

listingSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
