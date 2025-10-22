interface PinyinTextProps {
  chinese: string;
  pinyin: string;
  className?: string;
}

export function PinyinText({ chinese, pinyin, className = '' }: PinyinTextProps) {
  return (
    <div className={`inline-block ${className}`}>
      <ruby>
        <span className="text-2xl font-serif">{chinese}</span>
        <rp>(</rp>
        <rt className="text-xs text-muted-foreground">{pinyin}</rt>
        <rp>)</rp>
      </ruby>
    </div>
  );
}

interface ArticleParagraphProps {
  content: {
    type: 'paragraph' | 'dialogue';
    cn: string;
    pinyin: string;
    en: string;
  };
  showPinyin?: boolean;
  showTranslation?: boolean;
}

export function ArticleParagraph({
  content,
  showPinyin = true,
  showTranslation = true,
}: ArticleParagraphProps) {
  const isParagraph = content.type === 'paragraph';

  return (
    <div className={`mb-6 ${isParagraph ? '' : 'pl-4 border-l-4 border-blue-200'}`}>
      {/* Chinese Text with optional Pinyin */}
      <div className="mb-2">
        {showPinyin ? (
          <PinyinText chinese={content.cn} pinyin={content.pinyin} />
        ) : (
          <span className="text-2xl font-serif">{content.cn}</span>
        )}
      </div>

      {/* English Translation */}
      {showTranslation && (
        <p className="text-muted-foreground italic">{content.en}</p>
      )}
    </div>
  );
}



