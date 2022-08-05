import plug from './Plug';
import internetIdentity from './InternetIdentity';

import { WALLETS } from 'Constants/common';

export default {
  [WALLETS.plug]: plug,
  [WALLETS.identity]: internetIdentity,
};
