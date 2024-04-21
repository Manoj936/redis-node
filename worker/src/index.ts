import { createClient } from "redis";

const client = createClient();
const notificationEventKey: string = "notifications";

const Subscribe = async () => {
  try {
    await client.connect();
    while (true) {
      const rawNotificationData = await client.brPop(notificationEventKey, 0);

      //artificial delay to console the reponse (You will need to perform your email operations here..)
      const processedData = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(rawNotificationData);
        }, 1000)
      );
      console.log(processedData);
    }
  } catch (e) {
    console.log(e || "Subscribing to the notification events failed");
  }
};

Subscribe();
