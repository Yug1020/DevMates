import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js"

export const ses_sendEmail = (toAddress, fromAddress, firstName, lastName) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `New user, ${firstName} ${lastName} signUp successfully`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `New user, ${firstName} ${lastName} signUp successfully`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New User SignUp Successfully",
      },
    },
    Source: fromAddress,
  });
};

export const run = async (firstName, lastName) => {
  const sendEmailCommand = ses_sendEmail(
    "yugandhardhore@gmail.com",
    "support@devmates.co.in",
    firstName,
    lastName
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};