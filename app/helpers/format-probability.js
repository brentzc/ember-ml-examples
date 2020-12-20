import { helper } from '@ember/component/helper';

export default helper(function formatProbability(probability/*, hash*/) {
  return `${(probability * 100).toFixed(2)}%`;
});
