import { CronJob } from 'cron';
import { User } from "../models/user.js";
import { Bell } from "../models/Bell.js";

export const checkGoal = CronJob.from({
    // second minute hour day-of-month month day-of-week
    // Runs at 00:00:00 every day in India Standard Time.
    cronTime: "0 0 0 * * *",
    timeZone: "Asia/Kolkata",
    waitForCompletion: true,
    name: "check-expired-goals",
    onTick: async () => {
        try {
            const now = new Date();
            const query = {
                goal: { $nin: [null, ""] },
                goalDeadline: { $lte: now }
            };
            const expiredUsers = await User.find(query);
            
            for (const user of expiredUsers) {
                const bellPayload = {
                    user_id: user._id,
                    // Bell.messages is a String, not an array of strings.
                    messages: `${user.firstName}, you hit your ${user.goal} goal deadline. Please extend the deadline or add a new goal.`
                };
                const bell = new Bell(bellPayload);
                await bell.save();
                await User.findByIdAndUpdate(
                    user._id,
                    { $set: { goal: null, goalDeadline: null } }
                );
            }
            console.log(`Expired goals processed: ${expiredUsers.length}`);
        } catch (error) {
            console.error("Goal deadline check failed:", error);
        }
    }
});
