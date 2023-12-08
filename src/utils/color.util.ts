import { AvatarConfig, Color } from '@/types/main';

export const randomHex = (): Color => {
  const r = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0');
  const g = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0');
  const b = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0');
  return `#${r}${g}${b}`;
};

const randomAvatar = (): Omit<AvatarConfig, 'id' | 'userId'> => {
  return {
    head: randomHex(),
    background: randomHex(),
    torso: randomHex(),
  };
};

export const shiftColorValue = (hexColor: Color, amt: number): Color => {
  const num = parseInt(hexColor.substring(1), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const b = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const g = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  const newColor = g | (b << 8) | (r << 16);
  return '#' + newColor.toString(16).padStart(6, '0');
};
