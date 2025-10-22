'use client';

interface LandingPageContentProps {
  content: any;
}

export function LandingPageContent({ content }: LandingPageContentProps) {
  if (!content) return null;

  return (
    <div className="space-y-8">
      {/* Hero 区 */}
      <section className="bg-white border-b rounded-lg shadow-sm">
        <div className="px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.hero?.h1 || content.vocabCard?.word}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {content.hero?.tagline}
          </p>
          
          {/* 支持点 */}
          {content.hero?.supportingPoints && content.hero.supportingPoints.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {content.hero.supportingPoints.map((point: any, i: number) => (
                <div key={i} className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 主内容区 - 左右布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧 - 主内容 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 长文内容 */}
          {content.longForm?.sections && content.longForm.sections.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 深度解析</h2>
              <div className="prose prose-lg max-w-none">
                {content.longForm.sections.map((section: any, i: number) => (
                  <div key={i} className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {section.title}
                    </h3>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {section.body}
                    </div>
                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {section.bulletPoints.map((point: string, idx: number) => (
                          <li key={idx} className="text-gray-700">{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 英文摘要 */}
              {content.longForm.summaryEn && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    English Summary
                  </h4>
                  <p className="text-gray-600 italic">{content.longForm.summaryEn}</p>
                </div>
              )}
            </section>
          )}

          {/* 使用场景 */}
          {content.usageScenarios && content.usageScenarios.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🎬 实用场景</h2>
              <div className="space-y-6">
                {content.usageScenarios.map((scenario: any, i: number) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{scenario.title}</h3>
                    <p className="text-gray-700 mb-2">{scenario.narrative}</p>
                    {scenario.callToAction && (
                      <p className="text-sm text-blue-600">{scenario.callToAction}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 文化注释 */}
          {content.cultureNotes && content.cultureNotes.length > 0 && (
            <section className="bg-amber-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🏮 文化背景</h2>
              <div className="space-y-4">
                {content.cultureNotes.map((note: any, i: number) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                    <p className="text-gray-700 mb-1">{note.insight}</p>
                    {note.reference && (
                      <p className="text-sm text-gray-500 italic">参考: {note.reference}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 语法搭配 */}
          {content.grammarAndCollocations && (
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 语法与搭配</h2>
              
              {content.grammarAndCollocations.patterns && content.grammarAndCollocations.patterns.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">常见句型</h3>
                  <div className="space-y-4">
                    {content.grammarAndCollocations.patterns.map((pattern: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded p-4">
                        <p className="font-mono text-blue-600 mb-2">{pattern.pattern}</p>
                        <p className="text-sm text-gray-700 mb-1">{pattern.explanation}</p>
                        <p className="text-sm text-gray-600 italic">{pattern.example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.grammarAndCollocations.commonMistakes && content.grammarAndCollocations.commonMistakes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">常见错误</h3>
                  <div className="space-y-4">
                    {content.grammarAndCollocations.commonMistakes.map((mistake: any, i: number) => (
                      <div key={i} className="bg-red-50 rounded p-4">
                        <p className="text-red-700 mb-2">❌ {mistake.mistake}</p>
                        <p className="text-green-700 mb-2">✓ {mistake.correction}</p>
                        <p className="text-sm text-gray-600">{mistake.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* FAQ */}
          {content.faq && content.faq.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ 常见问题</h2>
              <div className="space-y-6">
                {content.faq.map((item: any, i: number) => (
                  <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA Block */}
          {content.ctaBlock && (
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">{content.ctaBlock.headline}</h2>
              <p className="text-xl mb-6">{content.ctaBlock.subheadline}</p>
              <div className="flex gap-4">
                {content.ctaBlock.primaryCta && (
                  <a
                    href={content.ctaBlock.primaryCta.url}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    {content.ctaBlock.primaryCta.text}
                  </a>
                )}
                {content.ctaBlock.secondaryCta && (
                  <a
                    href={content.ctaBlock.secondaryCta.url}
                    className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                  >
                    {content.ctaBlock.secondaryCta.text}
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        {/* 右侧 - 词汇卡片 + 例句 + 相关词汇 */}
        <div className="space-y-6">
          
          {/* 词汇卡片 */}
          {content.vocabCard && (
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="text-4xl font-bold mb-2">{content.vocabCard.word}</div>
              <div className="text-xl mb-4">{content.vocabCard.pinyin}</div>
              <div className="text-lg mb-4">{content.vocabCard.coreMeaning}</div>
              
              {content.vocabCard.memoryHook && (
                <div className="bg-white/20 rounded p-3 mb-3">
                  <p className="text-sm">💡 {content.vocabCard.memoryHook}</p>
                </div>
              )}
              
              {content.vocabCard.usageTip && (
                <div className="bg-white/20 rounded p-3">
                  <p className="text-sm">📝 {content.vocabCard.usageTip}</p>
                </div>
              )}
            </div>
          )}

          {/* 例句 */}
          {content.exampleSentences && content.exampleSentences.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💬 例句</h3>
              <div className="space-y-4">
                {content.exampleSentences.map((sentence: any, i: number) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                    <p className="text-gray-900 font-medium mb-1">{sentence.cn}</p>
                    <p className="text-blue-600 text-sm mb-1">{sentence.pinyin}</p>
                    <p className="text-gray-600 text-sm mb-2">{sentence.en}</p>
                    {sentence.usageNote && (
                      <p className="text-xs text-gray-500">💡 {sentence.usageNote}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 相关词汇 */}
          {content.relatedWords && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 相关词汇</h3>
              
              {content.relatedWords.synonyms && content.relatedWords.synonyms.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">同义词</h4>
                  <div className="space-y-2">
                    {content.relatedWords.synonyms.map((word: any, i: number) => (
                      <div key={i} className="bg-green-50 rounded p-2">
                        <span className="font-medium text-gray-900">{word.chinese}</span>
                        <span className="text-sm text-gray-600 ml-2">{word.pinyin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.relatedWords.antonyms && content.relatedWords.antonyms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">反义词</h4>
                  <div className="space-y-2">
                    {content.relatedWords.antonyms.map((word: any, i: number) => (
                      <div key={i} className="bg-red-50 rounded p-2">
                        <span className="font-medium text-gray-900">{word.chinese}</span>
                        <span className="text-sm text-gray-600 ml-2">{word.pinyin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 特色亮点 */}
          {content.featureHighlights && content.featureHighlights.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">✨ 特色亮点</h3>
              <ul className="space-y-3">
                {content.featureHighlights.map((highlight: any, i: number) => {
                  if (typeof highlight === 'string') {
                    return (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-yellow-600 mr-2">★</span>
                        <span>{highlight}</span>
                      </li>
                    );
                  }

                  return (
                    <li key={i} className="bg-white rounded-md p-4 shadow-sm border border-yellow-100">
                      <div className="flex items-start gap-3">
                        <span className="text-yellow-500 mt-1">★</span>
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">
                            {highlight.title || '亮点'}
                          </h4>
                          {highlight.subtitle && (
                            <p className="text-sm text-gray-600 mt-1">{highlight.subtitle}</p>
                          )}
                          {highlight.valueProof && (
                            <p className="text-sm text-blue-600 mt-2">
                              📈 {highlight.valueProof}
                            </p>
                          )}
                          {highlight.emotionHook && (
                            <p className="text-sm text-amber-700 mt-2 italic">
                              💡 {highlight.emotionHook}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 内链推荐 */}
      {content.internalLinks && content.internalLinks.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 相关推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.internalLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={`/word/${link.slug || ''}`}
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{link.title || link.anchorText}</h3>
                <p className="text-sm text-gray-600">
                  {link.anchorText || link.contextualAnchor || link.description || '查看词条详情'}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}



