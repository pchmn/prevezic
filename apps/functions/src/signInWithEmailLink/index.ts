import sgMail from '@sendgrid/mail';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Response } from 'firebase-functions/v1';
import parser from 'ua-parser-js';
import { TypedRequest } from '../core/TypedRequest';
import { getEmailHtml } from './template';

sgMail.setApiKey(process.env.SENDGRID_API_KEY_DEV || '');
initializeApp();

type RequestBody = {
  email: string;
  from: string;
};

export default async (req: TypedRequest<RequestBody>, res: Response) => {
  if (!req.body.email) {
    return res.status(400).send('Missing email');
  }

  const userAgent = parser(req.headers['user-agent']);

  const actionSettings = {
    url: req.body.from || 'http://localhost:5173/',
  };
  const emailLink = await getAuth().generateSignInWithEmailLink(req.body.email, actionSettings);

  const html = getEmailHtml({
    email: req.body.email,
    link: emailLink,
    userAgent: {
      browser: userAgent.browser.name,
      os: userAgent.os.name,
      device: `${userAgent.device.vendor || ''} ${userAgent.device.model || ''}`.trim(),
    },
  });

  const msg = {
    to: req.body.email,
    from: 'no-reply@prevezic.com',
    subject: 'Sign in to Prevezic',
    html: html,
  };
  await sgMail.send(msg);

  res.send('Email sent');
};
