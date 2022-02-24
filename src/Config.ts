import { readFileSync } from "fs";
import path from "path";
import process from "process";
type BasicAuth = {
    user: string;
    password: string;
}

type Config = {
    token: string;
    sources: {
        type: "jnet";
        url: string;
        auth?: BasicAuth;
    }[];
}

let config: Config;
if (process.env.CONFIG) {
    config = JSON.parse(process.env.CONFIG) as Config;
} else {
    config = JSON.parse(readFileSync(path.join(__dirname, "config.json"), { encoding: "utf-8"}));
}

export default config;