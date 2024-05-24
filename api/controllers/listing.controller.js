import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug });

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listings!"));
    }

    await Listing.findByIdAndDelete(listing._id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug });

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listing._id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug });

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer = req.query.offer === "true" ? true : { $in: [true, false] };
    const furnished =
      req.query.furnished === "true" ? true : { $in: [true, false] };
    const parking =
      req.query.parking === "true" ? true : { $in: [true, false] };
    const type =
      req.query.type && req.query.type !== "all"
        ? req.query.type
        : { $in: ["sale", "rent"] };
    const searchTerm = req.query.searchTerm || "";
    const sortBy = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
