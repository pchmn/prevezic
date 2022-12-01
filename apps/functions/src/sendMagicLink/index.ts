import sgMail from '@sendgrid/mail';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { CallableContext } from 'firebase-functions/v1/https';
import parser from 'ua-parser-js';
import { getEmailHtml } from './template';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
initializeApp();

type DataType = {
  email: string;
  from: string;
};

export default async (data: DataType, context: CallableContext) => {
  if (!data.email) {
    throw new Error('Email is required');
  }

  const userAgent = parser(context.rawRequest.headers['user-agent']);

  const actionSettings = {
    url: data.from || 'http://localhost:5173/',
  };
  const emailLink = await getAuth().generateSignInWithEmailLink(data.email, actionSettings);

  const html = getEmailHtml({
    email: data.email,
    link: emailLink,
    userAgent: {
      browser: userAgent.browser.name,
      os: userAgent.os.name,
      device: `${userAgent.device.vendor || ''} ${userAgent.device.model || ''}`.trim(),
    },
  });

  const msg = {
    to: data.email,
    from: 'no-reply@prevezic.com',
    subject: 'Sign in to Prevezic',
    html: html,
  };
  await sgMail.send(msg);

  return { success: true };
};
