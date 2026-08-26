import { ConnectionRequest } from "../../models/connectionRequest.js";

export const sentList = async(req, res) => {
    const USER_INFO = ["firstName", "lastName", "streetName", "email", "gender", "age", "phone", "photoURL", "skills", "bio"]
    try {
        const loggedIn = req.user._id;

        const query = {fromRequest: loggedIn, sentStatus:"connect"}

        const cursor = await ConnectionRequest.find(query).populate("toRequest", USER_INFO)

        if(!cursor){
            return res.send("No data found")
        }
        console.log("cursor", cursor)
        const receiver = cursor.map(
            (item) => ({
                ...item.toRequest._doc,
                createdAt: item.createdAt,
                status: item.receivedStatus
            })
        )

        res.send(receiver)

    } catch (error) {
        res.status(400).send("Something is wrong")
    }
}