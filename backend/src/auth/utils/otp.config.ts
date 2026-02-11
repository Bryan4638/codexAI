import { TOTP } from 'otplib';
import { NobleCryptoPlugin } from 'otplib';
import { ScureBase32Plugin } from 'otplib';

const authenticator = new TOTP({
  crypto: new NobleCryptoPlugin(),
  base32: new ScureBase32Plugin(),
  digits: 6,
});

export { authenticator };
export const otpConfig = authenticator;
