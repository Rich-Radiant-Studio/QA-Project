const zh = require('./src/i18n/locales/zh.json');

const keysToCheck = [
  'screens.questionDetail.title',
  'screens.questionDetail.tabs.supplements',
  'screens.questionDetail.tabs.answers',
  'screens.questionDetail.tabs.comments',
  'screens.questionDetail.tabs.invite',
  'screens.questionDetail.reward.add',
  'screens.questionDetail.reward.contributors',
  'screens.questionDetail.stats.views',
  'screens.questionDetail.pk.solved',
  'screens.questionDetail.pk.unsolved',
  'screens.questionDetail.pk.pk',
  'screens.questionDetail.answer.superLike',
  'screens.questionDetail.loading',
  'screens.questionDetail.loadMoreSupplements',
  'screens.questionDetail.comment.replies',
  'screens.questionDetail.loadMoreComments',
  'screens.questionDetail.invite.local',
  'screens.questionDetail.invite.twitter',
  'screens.questionDetail.invite.searchUser',
  'screens.questionDetail.invite.searchTwitterUser',
  'screens.questionDetail.loadMoreInvites',
  'screens.questionDetail.answer.adopted',
  'screens.questionDetail.answer.adopt',
];

console.log('Checking translation keys:\n');

keysToCheck.forEach(key => {
  const parts = key.split('.');
  let value = zh;
  let found = true;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      found = false;
      break;
    }
  }
  
  if (found && typeof value === 'string') {
    console.log(`✅ ${key}: "${value}"`);
  } else {
    console.log(`❌ ${key}: NOT FOUND`);
  }
});
