"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
const notificationEventKey = "notifications";
const Subscribe = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        while (true) {
            const rawNotificationData = yield client.brPop(notificationEventKey, 0);
            //artificial delay to console the reponse (You will need to perform your email operations here..)
            const processedData = yield new Promise((resolve) => setTimeout(() => {
                resolve(rawNotificationData);
            }, 1000));
            console.log(processedData);
        }
    }
    catch (e) {
        console.log(e || "Subscribing to the notification events failed");
    }
});
Subscribe();
