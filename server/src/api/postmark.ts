import { ServerClient } from "postmark";

const settings = {
  From: "support@schedoule.com",
};

const client = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

export const sendVerificationCode = async (
  recipientEmail: string,
  code: string
) => {
  await client.sendEmailWithTemplate({
    From: settings.From,
    To: recipientEmail,
    TemplateAlias: "passcode",
    TemplateModel: {
      product_name: "Classroom App",
      code: code,
    },
  });
  return;
};

export const sendSetupLink = async (recipientEmail: string, link: string) => {
  await client.sendEmailWithTemplate({
    From: settings.From,
    To: recipientEmail,
    TemplateAlias: "email-verify",
    TemplateModel: {
      product_name: "Classroom App",
      link: link,
    },
  });
  return;
};
