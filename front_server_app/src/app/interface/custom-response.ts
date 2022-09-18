import { Server } from "./server";

export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    //?: to say it's possible to not have server and we have one server or several 
    data: { servers?: Server[], server?: Server }
}