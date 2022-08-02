import * as plug from './plug';
import * as identity from './internetIdentity';

import { WALLETS } from 'Constants/common';

export default {
  [WALLETS.plug]: plug,
  [WALLETS.identity]: identity,
};
