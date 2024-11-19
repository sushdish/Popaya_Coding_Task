import { injectable } from "inversify";
import { User } from "../entities/User";
import { promises as fs } from "fs";
import { join } from "path";

const FILE_PATH = join(__dirname, "../data/sample_lead_data.json");


@injectable()
export class UserService {

    async getUsers() {
        try {
            const data = await fs.readFile(FILE_PATH, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading JSON file:", error);
            throw new Error("Failed to fetch users.");
        }
    }
}
