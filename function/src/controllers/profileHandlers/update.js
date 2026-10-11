import { User } from "../../models/user.js";
import { uploadImage } from "../../utils/uploadImage.js";

const normalizeSkills = (skills) => {
    if (Array.isArray(skills)) return skills.map((skill) => String(skill).trim()).filter(Boolean);
    if (typeof skills !== "string") return [];

    try {
        const parsedSkills = JSON.parse(skills);
        if (Array.isArray(parsedSkills)) {
            return parsedSkills.map((skill) => String(skill).trim()).filter(Boolean);
        }
    } catch {
        // JSON is optional for backward compatibility with comma-separated skills.
    }

    return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
};

export const update = async(req, res) => {
    const editable = ["streetName", "phone", "skills", "bio", "profession", "goal", "goalDeadline"]
    try {
        const query = req.user
        const changes = { ...(req.body || {}) }
        
        const isValid = Object.keys(changes).every(item => editable.includes(item))

        if(!(isValid)){
            return res.status(400).send("selected field is not allowed to update")
        }

        if(!query){
            return res.status(404).send("User doesn't exist")
        }

        if (Object.prototype.hasOwnProperty.call(changes, "skills")) {
            changes.skills = normalizeSkills(changes.skills);
        }

        if (Object.prototype.hasOwnProperty.call(changes, "phone")) {
            changes.phone = Number(changes.phone);
        }

        if (changes.goalDeadline === "" || changes.goalDeadline === "null") {
            changes.goalDeadline = null;
        }

        if (req.file) {
            const uploadedImage = await uploadImage(req.file.buffer);
            changes.photoURL = uploadedImage.photoURL;
        }

        const updatedDoc = await User.findByIdAndUpdate(query._id, changes, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            message: "Successfully updated user profile",
            photoURL: updatedDoc.photoURL,
        });

    } catch(error){
        return res.status(500).send("Something went wrong " + error.message)
    }
}
