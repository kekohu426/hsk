import { LandingPageContent } from '@/types/landingPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPagePreviewProps {
  content: LandingPageContent;
}

const SectionCard = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">{children}</CardContent>
  </Card>
);

const Paragraph = ({ text }: { text: string }) => (
  <p className="leading-relaxed whitespace-pre-line">{text}</p>
);

export function LandingPagePreview({ content }: LandingPagePreviewProps) {
  const { hero, vocabCard, longForm } = content;

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-900">{hero.h1}</CardTitle>
          <CardDescription className="text-base text-slate-600">
            {hero.tagline}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ul className="space-y-2 text-sm text-slate-700">
            {hero.supportingPoints.map((point, idx) => (
              <li key={idx}>
                <span className="font-semibold text-slate-900">{point.title}：</span>
                {point.description}
              </li>
            ))}
          </ul>
          <a
            href={hero.cta.href || '#'}
            className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {hero.cta.text}
          </a>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="长文解析">
            {longForm.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                <Paragraph text={section.body} />
                {section.bulletPoints?.length > 0 && (
                  <ul className="list-disc pl-6 space-y-1">
                    {section.bulletPoints.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </SectionCard>

          {content.usageScenarios?.length > 0 && (
            <SectionCard title="使用场景">
              {content.usageScenarios.map((scenario, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-base font-semibold text-slate-900">{scenario.title}</h4>
                  <Paragraph text={scenario.narrative} />
                  <p className="text-blue-600 font-medium">{scenario.callToAction}</p>
                </div>
              ))}
            </SectionCard>
          )}

          {content.cultureNotes?.length > 0 && (
            <SectionCard title="文化注释">
              {content.cultureNotes.map((note, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-base font-semibold text-slate-900">{note.title}</h4>
                  <Paragraph text={note.insight} />
                  {note.reference && <p className="text-xs text-slate-500">参考：{note.reference}</p>}
                </div>
              ))}
            </SectionCard>
          )}

          {content.grammarAndCollocations?.patterns?.length > 0 && (
            <SectionCard title="语法与搭配">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900">句型运用</h4>
                  <ul className="mt-2 space-y-2">
                    {content.grammarAndCollocations.patterns.map((pattern, idx) => (
                      <li key={idx}>
                        <p>
                          <span className="font-semibold text-slate-900">{pattern.pattern}：</span>
                          {pattern.explanation}
                        </p>
                        <Paragraph text={`示例：${pattern.example}`} />
                      </li>
                    ))}
                  </ul>
                </div>
                {content.grammarAndCollocations.commonMistakes?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900">常见错误</h4>
                    <ul className="mt-2 space-y-2">
                      {content.grammarAndCollocations.commonMistakes.map((mistake, idx) => (
                        <li key={idx}>
                          <p>
                            <span className="font-semibold text-red-500">误：{mistake.mistake}</span> → 正：{mistake.correction}
                          </p>
                          <p className="text-xs text-slate-500">{mistake.tip}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {content.featureHighlights?.length > 0 && (
            <SectionCard title="核心价值点">
              <div className="grid gap-4 md:grid-cols-3">
                {content.featureHighlights.map((feature, idx) => (
                  <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
                    <h4 className="text-base font-semibold text-slate-900">{feature.title}</h4>
                    <p className="text-sm text-slate-500">{feature.subtitle}</p>
                    <p className="mt-3 text-sm">{feature.valueProof}</p>
                    <p className="mt-2 text-xs text-blue-600">{feature.emotionHook}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">
                {vocabCard.word}
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                {vocabCard.pinyin}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Paragraph text={`核心释义：${vocabCard.coreMeaning}`} />
              <Paragraph text={`记忆法：${vocabCard.memoryHook}`} />
              <Paragraph text={`用法提示：${vocabCard.usageTip}`} />
              <p className="text-xs text-blue-500">{vocabCard.audioHint}</p>
            </CardContent>
          </Card>

          <SectionCard title="例句与配图">
            <div className="space-y-4">
              {content.exampleSentences.map((example, idx) => (
                <div key={idx} className="space-y-2 rounded-lg border p-4">
                  <p className="text-lg font-semibold text-slate-900">{example.cn}</p>
                  <p className="text-sm text-blue-600">{example.pinyin}</p>
                  <p className="text-sm text-slate-700">{example.en}</p>
                  <p className="text-xs text-slate-500">{example.usageNote}</p>
                  <div className="space-y-1 rounded bg-slate-50 p-3 text-xs">
                    <p><span className="font-semibold">图 ALT：</span>{example.image.alt}</p>
                    <p><span className="font-semibold">Caption：</span>{example.image.caption}</p>
                    <p><span className="font-semibold">Prompt：</span>{example.image.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {content.relatedWords?.synonyms?.length > 0 && (
            <SectionCard title="相关词汇">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-900">同义词</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {content.relatedWords.synonyms.map((item, idx) => (
                      <Badge key={idx} variant="secondary">
                        {item.word} ({item.pinyin})
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">反义词</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {content.relatedWords.antonyms.map((item, idx) => (
                      <Badge key={idx} variant="outline">
                        {item.word} ({item.pinyin})
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">常用搭配</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {content.relatedWords.collocations.map((item, idx) => (
                      <li key={idx}>
                        <span className="font-semibold text-slate-900">{item.phrase}</span>（{item.pinyin}） - {item.meaning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>
          )}

          <SectionCard title="常见问题">
            {content.faq.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-semibold text-slate-900">Q{idx + 1}. {item.question}</p>
                <Paragraph text={item.answer} />
              </div>
            ))}
          </SectionCard>

          <SectionCard title="CTA">
            <h3 className="text-lg font-semibold text-slate-900">{content.ctaBlock.headline}</h3>
            <Paragraph text={content.ctaBlock.subhead} />
            <div className="flex gap-2">
              <Badge className="bg-blue-600 hover:bg-blue-700">{content.ctaBlock.primary.text}</Badge>
              <Badge variant="outline">{content.ctaBlock.secondary.text}</Badge>
            </div>
          </SectionCard>

          {content.internalLinks?.length > 0 && (
            <SectionCard title="站内推荐">
              <ul className="space-y-2 text-sm">
                {content.internalLinks.map((link, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-blue-600">{link.anchorText}</span> → {link.slug}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
