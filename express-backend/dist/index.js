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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
const notificationEventKey = 'notifications';
const PORT = 3000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Connected to the client');
        app.listen(PORT, () => {
            console.log(`APP IS RUNNING ON PORT ${PORT} :-)`);
        });
    }
    catch (e) {
        console.log(e || "Error in creating server");
    }
});
//process the payload and publish the notification to the redis queue
let NotificationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userName, email, emailBody, subject } = req.body;
        console.log(req.body);
        if (!userId || !userName || !email || !emailBody || !subject) {
            return res.status(400).send('One or more payload expected');
        }
        yield client.lPush(notificationEventKey, JSON.stringify({ userId, userName, email, emailBody, subject }));
        res.status(200).send('Successfully added operations to the queue');
    }
    catch (e) {
        console.log(e || "Error in processing");
    }
});
//api endpoint for processing notifications
app.post('/processNotification', NotificationHandler);
startServer();
