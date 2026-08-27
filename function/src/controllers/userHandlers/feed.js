import { User } from "../../models/user.js";
import mongoose from "mongoose";
import { ConnectionRequest } from "../../models/connectionRequest.js";

export const feed = async (req, res) => {
    const USER_INFO = ["firstName", "lastName", "email", "gender", "age", "phone", "skills"]
    try {
        const loggedInUser = req.user._id;
        // let limit = parseInt(req.query.limit) || 2;
        // const page = parseInt(req.query.page) || 1;

        // limit > 10 ? limit = 10 : limit;

        // const skip = (page - 1)*limit;

        const query = { $and: [{ $or: [{ fromRequest: loggedInUser }, { toRequest: loggedInUser }] }, { $or: [{ sentStatus: "connect" }, { sentStatus: "ignore" }] }, { $or: [{ receivedStatus: "accept" }, { receivedStatus: "rejected" }, { receivedStatus: "pending" }] }] }

        const reqExist = await ConnectionRequest.find(query) //.populate("fromRequest", ["firstName"]).populate("toRequest", ["firstName"]);

        if (!reqExist) {
            throw new Error(error)
        }

        const data = reqExist.map((row) => {
            const fromIdString = row.fromRequest._id.toString();
            const loggedInString = loggedInUser.toString();

            if (fromIdString === loggedInString) {
                return row.toRequest._id;
            } else {
                return row.fromRequest._id;
            }
        });
        data[data.length] = loggedInUser;

        const allUser = await User.find({ _id: { $nin: data } })//.skip(skip).limit(limit);

        res.send(allUser)
    } catch (error) {
        res.status(400).send("Something is wrong")
    }
}