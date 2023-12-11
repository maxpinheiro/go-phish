import { AvatarConfig, Color, ColorType } from '@/types/main';
import NodeColor from 'color';

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

export const foregroundColor = (bgColor: Color): Color => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bgColor);
  if (!result) return '#000000';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 172 ? '#000000' : '#FFFFFF';
};

export const colorType = (color: Color): ColorType => {
  if (color.includes('rgb')) return 'rgb';
  if (color.includes('#')) return 'hex';
  return 'css';
};

export const desaturateColor = (color: Color, amt: number): Color => {
  const type = colorType(color);
  const newColor = NodeColor(color).desaturate(amt);
  return type === 'hex' ? newColor.hex() : type === 'rgb' ? newColor.rgb().string() : newColor.string();
};
