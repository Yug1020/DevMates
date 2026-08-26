import { ConnectionRequest } from "../../models/connectionRequest.js";

export const reqList = async(req, res) => {
    const USER_INFO = ["firstName", "lastName", "streetName", "email", "gender", "age", "phone", "photoURL", "skills", "bio"]

    try {
        const loggedinId = req.user._id;

        const query = {toRequest: loggedinId, sentStatus: "connect", receivedStatus: "pending"}

        const cursor = await ConnectionRequest.find(query).populate("fromRequest", USER_INFO)

        if(!cursor){
            res.send("No pending request")
        }

        const sender = cursor.map(item => ({
          ...item.fromRequest._doc,
          createdAt: item.createdAt
        }));

        res.send(sender)

    } catch (error) {
        res.status(400).send("Something is wrong")
    }
}