const generatedAvatars = {
  1: '/img/avatar-mehdi-generated.png',
  2: '/img/avatar-alex-generated.png',
  3: '/img/avatar-sarah-generated.png',
  4: '/img/avatar-thomas-generated.png',
};

const generatedAvatarsByName = {
  alex: '/img/avatar-alex-generated.png',
  sarah: '/img/avatar-sarah-generated.png',
  thomas: '/img/avatar-thomas-generated.png',
  mehdi: '/img/avatar-mehdi-generated.png',
};

export function getGeneratedAvatar(userId) {
  return generatedAvatars[String(userId)] || '';
}

export function getAvatarSource(user = {}) {
  const explicit = user.avatar_url || user.avatarUrl || user.avatar || '';
  const firstName = String(
    user.first_name || user.firstName || user.name?.trim().split(/\s+/)[0] || '',
  ).trim().toLowerCase();
  const generated = generatedAvatarsByName[firstName] || getGeneratedAvatar(user.id);
  const isLegacyDemoAvatar = /avatar-(alex|mehdi|sarah|thomas)\.jpg$/i.test(explicit);
  const isExternalDemoAvatar = /unsplash\.com|images\.unsplash|teamup\.local/i.test(explicit);
  return (isLegacyDemoAvatar || isExternalDemoAvatar) && generated ? generated : explicit || generated;
}
