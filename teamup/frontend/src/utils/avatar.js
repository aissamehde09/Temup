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

export function getGeneratedAvatar(user = {}) {
  const email = String(user.email || '').trim().toLowerCase();
  const firstName = String(user.first_name || user.firstName || user.name?.trim().split(/\s+/)[0] || '').trim();
  const lastName = String(user.last_name || user.lastName || user.name?.trim().split(/\s+/).slice(1).join(' ') || '').trim();
  const fullName = `${firstName} ${lastName}`.trim().toLowerCase();

  return generatedAvatarsByEmail[email] || generatedAvatarsByFullName[fullName] || '';
}

export function getAvatarSource(user = {}) {
  const explicit = user.avatar_url || user.avatarUrl || user.avatar || '';
  const generated = getGeneratedAvatar(user);
  const isLegacyDemoAvatar = /avatar-(alex|mehdi|sarah|thomas)\.jpg$/i.test(explicit);
  const isExternalDemoAvatar = /unsplash\.com|images\.unsplash|teamup\.local/i.test(explicit);

  if ((isLegacyDemoAvatar || isExternalDemoAvatar) && generated) return generated;
  if (explicit && !isExternalDemoAvatar) return explicit;
  return generated;
}
