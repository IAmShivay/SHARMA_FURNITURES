import { Cashfree, CFEnvironment } from 'cashfree-pg';

const isProduction = process.env.CASHFREE_ENV === 'PRODUCTION';

const cashfree = new Cashfree(
  isProduction ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);

export default cashfree;
