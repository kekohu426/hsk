import type { CSSProperties } from 'react';

export const summaryBadgeStyle = (color: string, background: string): CSSProperties => ({
  padding: '4px 10px',
  borderRadius: '999px',
  backgroundColor: background,
  color,
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1
});

export const tagStyle = (color: string, background: string): CSSProperties => ({
  padding: '4px 10px',
  borderRadius: '999px',
  backgroundColor: background,
  color,
  fontSize: '12px',
  fontWeight: 600
});

export const sectionTitleStyle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: '12px'
};

export const metaLabelStyle: CSSProperties = {
  fontSize: '12px',
  color: '#64748b',
  fontWeight: 600,
  marginTop: '6px'
};

export const metaValueStyle: CSSProperties = {
  fontSize: '13px',
  color: '#1f2937',
  lineHeight: 1.6
};
