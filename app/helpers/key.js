import { helper } from '@ember/component/helper';

export default helper(function key([object], { key }) {
  console.log('key');
  console.log(object);
  console.log(key);
  return object[key];
});
