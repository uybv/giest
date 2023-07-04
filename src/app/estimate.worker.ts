/// <reference lib="webworker" />
import { Estimate } from '@gi/estimate';

const est = new Estimate();

addEventListener('message', ({ data }) => {
  var result = est.calculate(data);
  postMessage(result);
});
