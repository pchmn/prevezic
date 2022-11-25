import { Response } from 'firebase-functions/v1';
import { Request } from 'firebase-functions/v1/https';

export default async (req: Request, res: Response) => {
  res.send('Hello from Firebase!');
};
