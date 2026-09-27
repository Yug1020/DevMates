import { User } from "../../models/user.js";
import isStrongPassword from "validator/lib/isStrongPassword.js";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";
import { run } from "../../utils/ses_sendEmail.js";
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

export const signUp = async(req, res) => {
    const required = [ 'firstName', 'lastName', 'email', 'password', 'gender', 'age', 'phone', 'skills', 'profession' ]
    try{
        const body = req.body || {};
        const missing = required.filter(field => !Object.prototype.hasOwnProperty.call(body, field));
        if(missing.length !== 0){
            return res.status(400).send(missing.join(", ") + " is required to sign up")
        }

        const {firstName, lastName, streetName, email, password, gender, age, phone, skills, bio, profession} = body
        if(!(isEmail(email))){
            return res.status(400).send("Enter Valid Email")
        }
        else if(!(isStrongPassword(password))){
            return res.status(400).send("Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special symbol.")
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUserData = {
            firstName,
            lastName,
            streetName: streetName || undefined,
            email,
            password: hashedpassword,
            gender,
            age,
            phone,
            skills: normalizeSkills(skills)
        }
        if (bio) newUserData.bio = bio;
        if (profession) newUserData.profession  =  profession;

        if (req.file) {
            const uploadedImage = await uploadImage(req.file.buffer);
            newUserData.photoURL = uploadedImage.photoURL;
        }

        const new_user = new User(newUserData)
        await new_user.save()

        try {
            const sentEmail = await run(firstName, lastName);
        } catch (emailError) {
            console.error("SES email failed (non-blocking):", emailError.message);
        }


        return res.status(201).send("successfully added new user on database")
    } catch (error) {
        return res.status(400).send("Something is wrong: "+ error.message)
    }
}
