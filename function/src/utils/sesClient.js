import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

export const sesClient = new SESClient( {
    region: process.env.Region,
    credentials:{
        accessKeyId: process.env.AWS_SES_Access_Key, 
        secretAccessKey: process.env.AWS_SES_Secrete_Access_Key
    }});
