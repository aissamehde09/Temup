const generatedAvatarsByEmail = {
  'mehdi@teamup.local': '/img/avatar-mehdi-generated.png',
  'alex@teamup.local': '/img/avatar-alex-generated.png',
  'sarah@teamup.local': '/img/avatar-sarah-generated.png',
  'thomas@teamup.local': '/img/avatar-thomas-generated.png',
};

const generatedAvatarsByFullName = {
  'mehdi ait': '/img/avatar-mehdi-generated.png',
  'alex martin': '/img/avatar-alex-generated.png',
  'sarah benali': '/img/avatar-sarah-generated.png',
  'thomas dubois': '/img/avatar-thomas-generated.png',
};

const generatedAvatarsByFirstName = {
  mehdi: '/img/avatar-mehdi-generated.png',
  alex: '/img/avatar-alex-generated.png',
  sarah: '/img/avatar-sarah-generated.png',
  thomas: '/img/avatar-thomas-generated.png',
};

function isDemoUser(user = {}) {
  const email = String(user.email || '').trim().toLowerCase();
  return (
    email.endsWith('@teamup.local') ||
    user.isDemo === true ||
    user.demo === true ||
    user.source === 'demo'
  );
}

export function getGeneratedAvatar(user = {}) {
  const email = String(user.email || '').trim().toLowerCase();
  const firstName = String(user.first_name || user.firstName || user.name?.trim().split(/\s+/)[0] || '').trim();
  const lastName = String(user.last_name || user.lastName || user.name?.trim().split(/\s+/).slice(1).join(' ') || '').trim();
  const fullName = `${firstName} ${lastName}`.trim().toLowerCase();

  const avatarByEmail = generatedAvatarsByEmail[email];
  if (avatarByEmail) return avatarByEmail;

  if (!isDemoUser(user)) return '';

  return generatedAvatarsByFullName[fullName] || generatedAvatarsByFirstName[firstName.toLowerCase()] || '';
}

function isUsableImageSource(value) {
  const src = String(value || '').trim();
  return src.startsWith('/img/')
    || src.startsWith('data:image/')
    || /^https?:\/\//i.test(src);
}

export function getAvatarSource(user = {}) {
  const explicit = String(user.avatar_url || user.avatarUrl || user.avatar || '').trim();
  const generated = getGeneratedAvatar(user);
  const isLegacyDemoAvatar = /avatar-(alex|mehdi|sarah|thomas)(-generated)?\.(jpg|png)$/i.test(explicit);
  const isExternalDemoAvatar = /unsplash\.com|images\.unsplash|teamup\.local/i.test(explicit);

  if ((isLegacyDemoAvatar || isExternalDemoAvatar) && generated) return generated;
  if (isLegacyDemoAvatar || isExternalDemoAvatar) return '';
  if (isUsableImageSource(explicit)) return explicit;
  return generated;
}
