import { helper } from '@ember/component/helper';

export default helper(function formatSentiment(score/*, hash*/) {
  if (score > 0.66) return 'positive'
  else if (score > 0.4) return 'neutral'
  else return 'negative';
});
