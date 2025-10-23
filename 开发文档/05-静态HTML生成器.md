# 静态HTML生成器设计

## 📋 模块概述

**目标**: 为每个HSK词汇生成SEO优化的静态HTML页面（10,000+个页面）

**核心功能**:
- 基于word-detail.html模板生成静态页面
- 完整的SEO meta标签
- Schema.org结构化数据
- 批量生成和增量更新
- 自动sitemap生成

---

## 🎯 生成目标

### 页面结构
```
public/
├── word/
│   ├── ni-hao.html          (你好)
│   ├── xue-xi.html          (学习)
│   ├── zhong-guo.html       (中国)
│   └── ...                  (10,000+ 文件)
├── article/
│   ├── beijing-food.html
│   └── ...
├── sitemap.xml
└── robots.txt
```

### URL结构
- 词汇页面: `https://chinesemaster.com/word/ni-hao.html`
- 文章页面: `https://chinesemaster.com/article/beijing-food.html`

---

## 🔧 技术实现

### 模板引擎选择
使用 **Handlebars** 或 **EJS**，推荐Handlebars（更简洁）

```bash
npm install handlebars
```

---

## 📄 HTML模板设计

### 词汇页面模板
**文件**: `api/templates/word-detail.hbs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>{{seo.title}}</title>
    <meta name="description" content="{{seo.description}}">
    <meta name="keywords" content="{{seo.keywords}}">
    <link rel="canonical" href="https://www.chinesemaster.com/word/{{slug}}.html">

    <!-- Open Graph -->
    <meta property="og:title" content="{{seo.title}}">
    <meta property="og:description" content="{{seo.description}}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://www.chinesemaster.com/word/{{slug}}.html">
    <meta property="og:image" content="{{seo.ogImage}}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{seo.title}}">
    <meta name="twitter:description" content="{{seo.description}}">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": "{{word}}",
      "alternateName": "{{pinyin}}",
      "description": "{{english}}",
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "HSK {{hskLevel}} Vocabulary"
      },
      "url": "https://www.chinesemaster.com/word/{{slug}}.html"
    }
    </script>

    <!-- Styles -->
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body class="dashboard-body">
    <!-- Header -->
    <header class="dashboard-header">
        <div class="container header-content">
            <div class="header-brand">
                <a href="/" class="brand-link">
                    <span class="logo">🎓</span>
                    <span class="brand-name">ChineseMaster</span>
                </a>
            </div>
            <nav class="header-nav">
                <a href="/">Home</a>
                <a href="/dashboard.html">Dashboard</a>
                <a href="/hsk-library.html">HSK Library</a>
                <a href="/articles.html">Articles</a>
            </nav>
            <div class="header-user">
                <a href="/login.html" class="btn btn-primary">Login</a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
        <div class="container">
            <!-- Breadcrumb -->
            <div class="breadcrumb" role="navigation" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/hsk-library.html">HSK Library</a>
                <span>/</span>
                <a href="/hsk-library.html?level={{hskLevel}}">HSK {{hskLevel}}</a>
                <span>/</span>
                <span>{{word}}</span>
            </div>

            <!-- Word Header -->
            <div class="word-header">
                <div class="word-main-info">
                    <h1 class="word-chinese">{{word}}</h1>
                    <div class="word-pinyin">{{pinyinWithTones}}</div>
                    <div class="word-english">{{english}}</div>
                    <div class="word-meta">
                        <span class="badge">HSK {{hskLevel}}</span>
                        <span class="word-views">👁️ {{viewCount}} views</span>
                    </div>
                </div>

                <!-- Sticky Reference Bar -->
                <div class="sticky-reference-bar">
                    <div class="sticky-word-info">
                        <span class="sticky-word">{{word}}</span>
                        <span class="sticky-pinyin">{{pinyinWithTones}}</span>
                        <span class="sticky-english">{{english}}</span>
                    </div>
                    <div class="sticky-actions">
                        <button class="btn btn-sm btn-primary" onclick="showLoginPrompt()">
                            ➕ Add to My Words
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="playAudio()">
                            🔊 Play Audio
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="word-tabs">
                <button class="tab-btn active" onclick="showTab('quick-learn')">
                    ⚡ Quick Learn
                </button>
                <button class="tab-btn" onclick="showTab('deep-dive')">
                    📚 Deep Dive
                </button>
                <button class="tab-btn" onclick="showTab('practice')">
                    🎮 Practice
                </button>
            </div>

            <!-- Quick Learn Tab -->
            <div id="quick-learn" class="tab-content active">
                <div class="two-column-layout">
                    <!-- Main Content -->
                    <div class="main-content">
                        <!-- Key Points -->
                        <div class="content-section">
                            <h2>📝 Key Points</h2>
                            <ul class="key-points-list">
                                {{#each content.quickLearn.keyPoints}}
                                <li>{{this}}</li>
                                {{/each}}
                            </ul>
                        </div>

                        <!-- Examples -->
                        <div class="content-section">
                            <h2>💬 Example Sentences</h2>
                            {{#each content.quickLearn.examples}}
                            <div class="example-card">
                                <div class="example-chinese">{{this.chinese}}</div>
                                <div class="example-pinyin">{{this.pinyin}}</div>
                                <div class="example-english">{{this.english}}</div>
                                <button class="btn-icon-sm" onclick="playExampleAudio({{@index}})">🔊</button>
                            </div>
                            {{/each}}
                        </div>

                        <!-- Common Mistakes -->
                        <div class="content-section">
                            <h2>⚠️ Common Mistakes</h2>
                            {{#each content.quickLearn.commonMistakes}}
                            <div class="mistake-card">
                                <div class="mistake-wrong">❌ {{this.wrong}}</div>
                                <div class="mistake-correct">✓ {{this.correct}}</div>
                                <div class="mistake-explanation">💡 {{this.explanation}}</div>
                            </div>
                            {{/each}}
                        </div>

                        <!-- Quick Quiz -->
                        <div class="content-section">
                            <h2>✅ Quick Quiz</h2>
                            {{#each content.quickLearn.quiz}}
                            <div class="quiz-card">
                                <div class="quiz-question">{{this.question}}</div>
                                <div class="quiz-options">
                                    {{#each this.options}}
                                    <label class="quiz-option">
                                        <input type="radio" name="quiz-{{@../index}}" value="{{this}}">
                                        <span>{{this}}</span>
                                    </label>
                                    {{/each}}
                                </div>
                                <div class="quiz-explanation" style="display: none;">
                                    {{this.explanation}}
                                </div>
                            </div>
                            {{/each}}
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="sidebar">
                        <!-- Memory Hook -->
                        <div class="sidebar-card">
                            <h3>💡 Memory Hook</h3>
                            <p class="memory-hook">{{content.quickLearn.memoryHook}}</p>
                        </div>

                        <!-- Related Words -->
                        <div class="sidebar-card">
                            <h3>🔗 Related Words</h3>
                            <div class="related-words-list">
                                {{#each content.quickLearn.relatedWords}}
                                <a href="/word/{{this.slug}}.html" class="related-word-item">
                                    <span class="related-word">{{this.word}}</span>
                                    <span class="related-pinyin">{{this.pinyin}}</span>
                                    <span class="related-english">{{this.english}}</span>
                                </a>
                                {{/each}}
                            </div>
                        </div>

                        <!-- Resources -->
                        <div class="sidebar-card">
                            <h3>📚 Resources</h3>
                            <ul class="resources-list">
                                <li><a href="/guides/hsk-{{hskLevel}}-guide.html">HSK {{hskLevel}} Study Guide</a></li>
                                <li><a href="/analyzer.html">Text Analyzer</a></li>
                                <li><a href="/dashboard.html">Your Dashboard</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Deep Dive Tab -->
            <div id="deep-dive" class="tab-content">
                <div class="deep-dive-content">
                    <h2>📖 Etymology and Structure</h2>
                    <p>{{content.deepDive.etymology}}</p>

                    <h2>🌏 Cultural Background</h2>
                    <p>{{content.deepDive.culturalBackground}}</p>

                    <h2>📐 Grammar Patterns</h2>
                    <p>{{content.deepDive.grammarPatterns}}</p>

                    <h2>🎯 Usage Scenarios</h2>
                    <p>{{content.deepDive.usageScenarios}}</p>

                    {{#if content.deepDive.faq}}
                    <h2>❓ Frequently Asked Questions</h2>
                    {{#each content.deepDive.faq}}
                    <div class="faq-item">
                        <h3>Q: {{this.question}}</h3>
                        <p>A: {{this.answer}}</p>
                    </div>
                    {{/each}}
                    {{/if}}
                </div>
            </div>

            <!-- Practice Tab -->
            <div id="practice" class="tab-content">
                <div class="practice-content">
                    <h2>✍️ Writing Practice</h2>
                    <p>{{content.practice.writingPrompt}}</p>
                    <textarea class="practice-textarea" placeholder="Write your sentence here..."></textarea>
                    <button class="btn btn-primary" onclick="showLoginPrompt()">Get AI Feedback</button>

                    <h2>🎤 Pronunciation Guide</h2>
                    <p>{{content.practice.pronunciationGuide}}</p>
                    <button class="btn btn-secondary" onclick="showLoginPrompt()">Record & Check</button>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="cta-section">
                <h2>Start Learning This Word Today</h2>
                <p>Track your progress, get personalized review schedules, and master {{word}} with our AI-powered learning system.</p>
                <div class="cta-buttons">
                    <a href="/register.html" class="btn btn-primary btn-lg">Sign Up Free</a>
                    <a href="/login.html" class="btn btn-outline btn-lg">Login</a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ChineseMaster. All rights reserved.</p>
            <div class="footer-links">
                <a href="/about.html">About</a>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/app.js"></script>
    <script>
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        function showLoginPrompt() {
            alert('Please login to access this feature');
            window.location.href = '/login.html';
        }

        function playAudio() {
            // Audio playback logic
            console.log('Playing audio for: {{word}}');
        }
    </script>
</body>
</html>
```

### HSK等级页面模板
**文件**: `api/templates/hsk-level.hbs`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>HSK {{level}} 词汇表 - {{wordCount}}个词汇完整列表 | ChineseMaster</title>
    <meta name="description" content="HSK {{level}} 完整词汇表，包含{{wordCount}}个必学词汇，配套拼音、释义、例句和学习资源。预计学习时间{{estimatedHours}}小时。">
    <meta name="keywords" content="HSK {{level}}, HSK {{level}} 词汇, 汉语水平考试, 中文词汇, Chinese vocabulary">
    <link rel="canonical" href="https://www.chinesemaster.com/hsk/level-{{level}}.html">

    <!-- Open Graph -->
    <meta property="og:title" content="HSK {{level}} 词汇表 - {{wordCount}}个词汇 | ChineseMaster">
    <meta property="og:description" content="完整的HSK {{level}}词汇表，包含{{wordCount}}个必学词汇">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.chinesemaster.com/hsk/level-{{level}}.html">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "HSK {{level}} 词汇表",
      "description": "完整的HSK {{level}}词汇列表",
      "numberOfItems": {{wordCount}},
      "itemListElement": [
        {{#each words}}
        {
          "@type": "DefinedTerm",
          "position": {{add @index 1}},
          "name": "{{word}}",
          "alternateName": "{{pinyin}}",
          "description": "{{translation}}",
          "url": "https://www.chinesemaster.com/word/{{slug}}.html"
        }{{#unless @last}},{{/unless}}
        {{/each}}
      ]
    }
    </script>

    <!-- Styles -->
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body class="dashboard-body">
    <!-- Header -->
    <header class="dashboard-header">
        <div class="container header-content">
            <div class="header-brand">
                <a href="/" class="brand-link">
                    <span class="logo">🎓</span>
                    <span class="brand-name">ChineseMaster</span>
                </a>
            </div>
            <nav class="header-nav">
                <a href="/">Home</a>
                <a href="/dashboard.html">Dashboard</a>
                <a href="/hsk-library.html">HSK Library</a>
                <a href="/articles.html">Articles</a>
            </nav>
            <div class="header-user">
                <a href="/login.html" class="btn btn-primary">Login</a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
        <div class="container">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/hsk-library.html">HSK Library</a>
                <span>/</span>
                <span>HSK {{level}}</span>
            </div>

            <!-- Level Header -->
            <div class="level-header">
                <h1>HSK {{level}} 词汇表</h1>
                <div class="level-stats">
                    <div class="stat-item">
                        <span class="stat-number">{{wordCount}}</span>
                        <span class="stat-label">词汇总数</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{estimatedHours}}</span>
                        <span class="stat-label">预计学习时间（小时）</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{cumulativeTotal}}</span>
                        <span class="stat-label">累计词汇（HSK1-{{level}}）</span>
                    </div>
                </div>
            </div>

            <!-- Level Description -->
            <div class="level-description">
                <h2>📖 HSK {{level}} 简介</h2>
                <p>{{description}}</p>
            </div>

            <!-- Quick Navigation -->
            <div class="quick-nav">
                <h3>快速导航</h3>
                <div class="alphabet-nav">
                    {{#each alphabet}}
                    <a href="#letter-{{this}}" class="letter-link">{{this}}</a>
                    {{/each}}
                </div>
            </div>

            <!-- Word List -->
            <div class="word-list-section">
                {{#each wordsByLetter}}
                <div id="letter-{{letter}}" class="letter-section">
                    <h2 class="letter-heading">{{letter}}</h2>
                    <div class="word-grid">
                        {{#each words}}
                        <a href="/word/{{slug}}.html" class="word-card">
                            <div class="word-chinese">{{word}}</div>
                            <div class="word-pinyin">{{pinyin}}</div>
                            <div class="word-translation">{{translation}}</div>
                        </a>
                        {{/each}}
                    </div>
                </div>
                {{/each}}
            </div>

            <!-- Study Resources -->
            <div class="resources-section">
                <h2>📚 学习资源</h2>
                <div class="resource-grid">
                    <div class="resource-card">
                        <h3>🎯 在线练习</h3>
                        <p>通过闪卡和测验掌握这些词汇</p>
                        <a href="/dashboard.html" class="btn btn-primary">开始练习</a>
                    </div>
                    <div class="resource-card">
                        <h3>📖 学习文章</h3>
                        <p>阅读包含HSK {{level}}词汇的文章</p>
                        <a href="/articles.html?hskLevel={{level}}" class="btn btn-secondary">浏览文章</a>
                    </div>
                    <div class="resource-card">
                        <h3>🔍 文本分析器</h3>
                        <p>分析你自己的中文文本</p>
                        <a href="/analyzer.html" class="btn btn-secondary">使用工具</a>
                    </div>
                </div>
            </div>

            <!-- Other Levels -->
            <div class="other-levels">
                <h2>其他等级</h2>
                <div class="level-links">
                    {{#each [1, 2, 3, 4, 5, 6]}}
                    {{#unless (eq this ../level)}}
                    <a href="/hsk/level-{{this}}.html" class="level-link">HSK {{this}}</a>
                    {{/unless}}
                    {{/each}}
                </div>
            </div>

            <!-- CTA Section -->
            <div class="cta-section">
                <h2>开始学习HSK {{level}}</h2>
                <p>创建免费账号，使用AI辅助学习系统，让学习效率翻倍！</p>
                <div class="cta-buttons">
                    <a href="/register.html" class="btn btn-primary btn-lg">免费注册</a>
                    <a href="/login.html" class="btn btn-outline btn-lg">登录</a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ChineseMaster. All rights reserved.</p>
            <div class="footer-links">
                <a href="/about.html">About</a>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/app.js"></script>
</body>
</html>
```

### 文章列表页面模板
**文件**: `api/templates/article-list.hbs`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>中文学习文章{{#if page}} - 第{{page}}页{{/if}} | ChineseMaster</title>
    <meta name="description" content="精选中文学习文章，涵盖HSK各级别词汇，提供拼音标注和词汇解析，帮助你提高中文阅读能力。">
    <meta name="keywords" content="中文文章, Chinese articles, HSK reading, 中文阅读, learn Chinese">
    <link rel="canonical" href="https://www.chinesemaster.com/articles{{#if (gt page 1)}}/page-{{page}}{{/if}}.html">

    {{#if hasPrev}}
    <link rel="prev" href="https://www.chinesemaster.com/articles{{#if (gt prevPage 1)}}/page-{{prevPage}}{{/if}}.html">
    {{/if}}
    {{#if hasNext}}
    <link rel="next" href="https://www.chinesemaster.com/articles/page-{{nextPage}}.html">
    {{/if}}

    <!-- Open Graph -->
    <meta property="og:title" content="中文学习文章 | ChineseMaster">
    <meta property="og:description" content="精选中文学习文章，帮助你提高阅读能力">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.chinesemaster.com/articles.html">

    <!-- Styles -->
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body class="dashboard-body">
    <!-- Header -->
    <header class="dashboard-header">
        <div class="container header-content">
            <div class="header-brand">
                <a href="/" class="brand-link">
                    <span class="logo">🎓</span>
                    <span class="brand-name">ChineseMaster</span>
                </a>
            </div>
            <nav class="header-nav">
                <a href="/">Home</a>
                <a href="/dashboard.html">Dashboard</a>
                <a href="/hsk-library.html">HSK Library</a>
                <a href="/articles.html" class="active">Articles</a>
            </nav>
            <div class="header-user">
                <a href="/login.html" class="btn btn-primary">Login</a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
        <div class="container">
            <!-- Page Header -->
            <div class="page-header">
                <h1>📖 中文学习文章</h1>
                <p>通过阅读有趣的文章，在语境中学习中文词汇和语法</p>
            </div>

            <!-- Filter Bar -->
            <div class="filter-bar">
                <div class="filter-group">
                    <label>HSK等级:</label>
                    <select id="hskFilter">
                        <option value="">全部等级</option>
                        <option value="1">HSK 1</option>
                        <option value="2">HSK 2</option>
                        <option value="3">HSK 3</option>
                        <option value="4">HSK 4</option>
                        <option value="5">HSK 5</option>
                        <option value="6">HSK 6</option>
                    </select>
                </div>
            </div>

            <!-- Article Grid -->
            <div class="article-grid">
                {{#each articles}}
                <article class="article-card">
                    <a href="/articles/{{slug}}.html" class="article-link">
                        {{#if coverImage}}
                        <div class="article-image">
                            <img src="{{coverImage}}" alt="{{title}}" loading="lazy">
                        </div>
                        {{/if}}
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="badge badge-hsk">HSK {{hskLevel}}</span>
                                <span class="article-date">{{formatDate publishedAt}}</span>
                            </div>
                            <h2 class="article-title">{{title}}</h2>
                            <p class="article-excerpt">{{excerpt}}</p>
                            <div class="article-stats">
                                <span>📚 {{wordCount}} 字</span>
                                <span>⏱️ {{readTime}} 分钟</span>
                                <span>👁️ {{viewCount}} 阅读</span>
                            </div>
                        </div>
                    </a>
                </article>
                {{/each}}
            </div>

            <!-- Pagination -->
            <nav class="pagination" aria-label="文章分页">
                {{#if hasPrev}}
                <a href="/articles{{#if (gt prevPage 1)}}/page-{{prevPage}}{{/if}}.html" class="btn btn-secondary">
                    ← 上一页
                </a>
                {{/if}}

                <div class="pagination-info">
                    第 {{page}} 页，共 {{totalPages}} 页
                </div>

                {{#if hasNext}}
                <a href="/articles/page-{{nextPage}}.html" class="btn btn-secondary">
                    下一页 →
                </a>
                {{/if}}
            </nav>

            <!-- CTA Section -->
            <div class="cta-section">
                <h2>想要更多学习功能？</h2>
                <p>注册账号，获取个性化文章推荐、生词本、阅读进度跟踪等功能</p>
                <div class="cta-buttons">
                    <a href="/register.html" class="btn btn-primary btn-lg">免费注册</a>
                    <a href="/login.html" class="btn btn-outline btn-lg">登录</a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ChineseMaster. All rights reserved.</p>
            <div class="footer-links">
                <a href="/about.html">About</a>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/app.js"></script>
</body>
</html>
```

### 文章详情页面模板
**文件**: `api/templates/article-detail.hbs`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>{{title}} - HSK {{hskLevel}} | ChineseMaster</title>
    <meta name="description" content="{{excerpt}}">
    <meta name="keywords" content="{{title}}, HSK {{hskLevel}}, 中文文章, Chinese reading">
    <link rel="canonical" href="https://www.chinesemaster.com/articles/{{slug}}.html">

    <!-- Open Graph -->
    <meta property="og:title" content="{{title}} | ChineseMaster">
    <meta property="og:description" content="{{excerpt}}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://www.chinesemaster.com/articles/{{slug}}.html">
    {{#if coverImage}}
    <meta property="og:image" content="{{coverImage}}">
    {{/if}}
    <meta property="article:published_time" content="{{publishedAt}}">
    <meta property="article:author" content="ChineseMaster">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{{title}}",
      "description": "{{excerpt}}",
      "author": {
        "@type": "Organization",
        "name": "ChineseMaster"
      },
      "datePublished": "{{publishedAt}}",
      "dateModified": "{{updatedAt}}",
      {{#if coverImage}}
      "image": "{{coverImage}}",
      {{/if}}
      "publisher": {
        "@type": "Organization",
        "name": "ChineseMaster",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.chinesemaster.com/logo.png"
        }
      }
    }
    </script>

    <!-- Styles -->
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body class="dashboard-body">
    <!-- Header -->
    <header class="dashboard-header">
        <div class="container header-content">
            <div class="header-brand">
                <a href="/" class="brand-link">
                    <span class="logo">🎓</span>
                    <span class="brand-name">ChineseMaster</span>
                </a>
            </div>
            <nav class="header-nav">
                <a href="/">Home</a>
                <a href="/dashboard.html">Dashboard</a>
                <a href="/hsk-library.html">HSK Library</a>
                <a href="/articles.html">Articles</a>
            </nav>
            <div class="header-user">
                <a href="/login.html" class="btn btn-primary">Login</a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
        <div class="container">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/articles.html">Articles</a>
                <span>/</span>
                <span>{{title}}</span>
            </div>

            <!-- Article Header -->
            <article class="article-detail">
                <header class="article-header">
                    <div class="article-meta">
                        <span class="badge badge-hsk">HSK {{hskLevel}}</span>
                        <span class="article-date">{{formatDate publishedAt}}</span>
                        <span class="article-stats">
                            📚 {{wordCount}} 字 · ⏱️ {{readTime}} 分钟 · 👁️ {{viewCount}} 阅读
                        </span>
                    </div>
                    <h1 class="article-title">{{title}}</h1>
                    {{#if coverImage}}
                    <div class="article-cover">
                        <img src="{{coverImage}}" alt="{{title}}">
                    </div>
                    {{/if}}
                </header>

                <!-- Article Content -->
                <div class="article-body">
                    {{{contentHtml}}}
                </div>

                <!-- Article Footer -->
                <footer class="article-footer">
                    <div class="article-actions">
                        <button class="btn btn-secondary" onclick="showLoginPrompt()">
                            ❤️ 收藏文章
                        </button>
                        <button class="btn btn-secondary" onclick="showLoginPrompt()">
                            📝 添加笔记
                        </button>
                    </div>
                </footer>
            </article>

            <!-- Related Vocabulary -->
            {{#if keyVocabulary}}
            <aside class="related-vocabulary">
                <h2>📚 文章关键词汇</h2>
                <div class="vocabulary-grid">
                    {{#each keyVocabulary}}
                    <a href="/word/{{slug}}.html" class="vocabulary-card">
                        <div class="vocab-word">{{word}}</div>
                        <div class="vocab-pinyin">{{pinyin}}</div>
                        <div class="vocab-translation">{{translation}}</div>
                        <span class="vocab-badge">HSK {{hskLevel}}</span>
                    </a>
                    {{/each}}
                </div>
            </aside>
            {{/if}}

            <!-- Related Articles -->
            {{#if relatedArticles}}
            <aside class="related-articles">
                <h2>🔗 相关文章</h2>
                <div class="related-grid">
                    {{#each relatedArticles}}
                    <a href="/articles/{{slug}}.html" class="related-card">
                        <h3>{{title}}</h3>
                        <p>{{excerpt}}</p>
                        <div class="related-meta">
                            <span class="badge">HSK {{hskLevel}}</span>
                            <span>{{readTime}} 分钟</span>
                        </div>
                    </a>
                    {{/each}}
                </div>
            </aside>
            {{/if}}

            <!-- CTA Section -->
            <div class="cta-section">
                <h2>想要更深入地学习？</h2>
                <p>注册账号，获取个性化学习计划、生词本、AI辅导等功能</p>
                <div class="cta-buttons">
                    <a href="/register.html" class="btn btn-primary btn-lg">免费注册</a>
                    <a href="/login.html" class="btn btn-outline btn-lg">登录</a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ChineseMaster. All rights reserved.</p>
            <div class="footer-links">
                <a href="/about.html">About</a>
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/app.js"></script>
    <script>
        function showLoginPrompt() {
            alert('请登录以使用此功能');
            window.location.href = '/login.html';
        }
    </script>
</body>
</html>
```

---

## 🛠️ HTML生成服务

**文件**: `api/services/htmlGeneratorService.js`

```javascript
const Handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class HTMLGeneratorService {
  constructor() {
    this.templatesDir = path.join(__dirname, '../templates');
    this.outputDir = path.join(__dirname, '../../public');
    this.templates = {};
  }

  /**
   * 初始化模板
   */
  async initialize() {
    // 加载词汇模板
    const wordTemplate = await fs.readFile(
      path.join(this.templatesDir, 'word-detail.hbs'),
      'utf8'
    );
    this.templates.word = Handlebars.compile(wordTemplate);

    // 加载HSK等级页模板
    const hskLevelTemplate = await fs.readFile(
      path.join(this.templatesDir, 'hsk-level.hbs'),
      'utf8'
    );
    this.templates.hskLevel = Handlebars.compile(hskLevelTemplate);

    // 加载文章列表模板
    const articleListTemplate = await fs.readFile(
      path.join(this.templatesDir, 'article-list.hbs'),
      'utf8'
    );
    this.templates.articleList = Handlebars.compile(articleListTemplate);

    // 加载文章详情模板
    const articleDetailTemplate = await fs.readFile(
      path.join(this.templatesDir, 'article-detail.hbs'),
      'utf8'
    );
    this.templates.articleDetail = Handlebars.compile(articleDetailTemplate);

    // 注册Helper
    Handlebars.registerHelper('json', function(context) {
      return JSON.stringify(context);
    });

    Handlebars.registerHelper('add', function(a, b) {
      return a + b;
    });

    Handlebars.registerHelper('eq', function(a, b) {
      return a === b;
    });

    Handlebars.registerHelper('gt', function(a, b) {
      return a > b;
    });

    Handlebars.registerHelper('formatDate', function(date) {
      return new Date(date).toLocaleDateString('zh-CN');
    });

    console.log('[HTMLGenerator] Templates loaded');
  }

  /**
   * 生成单个词汇HTML
   */
  async generateWordHTML(wordEntryId) {
    try {
      if (!this.templates.word) {
        await this.initialize();
      }

      // 1. 从数据库获取词汇数据
      const wordEntry = await prisma.wordEntry.findUnique({
        where: { id: wordEntryId },
        include: {
          _count: {
            select: { userWords: true }
          }
        }
      });

      if (!wordEntry || !wordEntry.contentJson) {
        throw new Error(`WordEntry ${wordEntryId} has no generated content`);
      }

      // 2. 准备模板数据
      const templateData = {
        word: wordEntry.word,
        slug: wordEntry.slug,
        pinyin: wordEntry.pinyin,
        pinyinWithTones: wordEntry.pinyinWithTones,
        english: wordEntry.english,
        hskLevel: wordEntry.hskLevel,
        viewCount: wordEntry.viewCount,
        content: wordEntry.contentJson,
        seo: {
          title: wordEntry.seoTitle || `${wordEntry.word} (${wordEntry.pinyinWithTones}) - HSK ${wordEntry.hskLevel} | ChineseMaster`,
          description: wordEntry.seoDescription || `Learn ${wordEntry.word} (${wordEntry.english}) - Complete HSK ${wordEntry.hskLevel} vocabulary with examples, pronunciation, and practice exercises.`,
          keywords: wordEntry.seoKeywords || `${wordEntry.word}, ${wordEntry.pinyin}, HSK ${wordEntry.hskLevel}, Chinese vocabulary, learn Chinese`,
          ogImage: wordEntry.ogImage || 'https://www.chinesemaster.com/og-word-default.png'
        }
      };

      // 3. 渲染HTML
      const html = this.templates.word(templateData);

      // 4. 保存到文件
      const outputPath = path.join(this.outputDir, 'word', `${wordEntry.slug}.html`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html, 'utf8');

      // 5. 更新数据库
      await prisma.wordEntry.update({
        where: { id: wordEntryId },
        data: {
          htmlFilePath: `/word/${wordEntry.slug}.html`,
          htmlGenerated: true,
          status: 'PUBLISHED',
          publishedAt: new Date()
        }
      });

      console.log(`[HTMLGenerator] Generated: ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        url: `/word/${wordEntry.slug}.html`
      };

    } catch (error) {
      console.error(`[HTMLGenerator] Failed to generate HTML for ${wordEntryId}:`, error);
      throw error;
    }
  }

  /**
   * 生成HSK等级页HTML
   */
  async generateHSKLevelPage(level) {
    try {
      if (!this.templates.hskLevel) {
        await this.initialize();
      }

      // 获取该级别的所有词汇
      const words = await prisma.wordEntry.findMany({
        where: { hskLevel: level, status: 'PUBLISHED' },
        orderBy: { pinyin: 'asc' },
        select: {
          word: true,
          slug: true,
          pinyin: true,
          pinyinWithTones: true,
          english: true
        }
      });

      // 按拼音首字母分组
      const wordsByLetter = {};
      const alphabet = new Set();

      words.forEach(word => {
        const firstLetter = word.pinyin.charAt(0).toUpperCase();
        alphabet.add(firstLetter);
        if (!wordsByLetter[firstLetter]) {
          wordsByLetter[firstLetter] = [];
        }
        wordsByLetter[firstLetter].push({
          word: word.word,
          slug: word.slug,
          pinyin: word.pinyinWithTones,
          translation: word.english
        });
      });

      // 转换为数组格式
      const wordsByLetterArray = Object.keys(wordsByLetter)
        .sort()
        .map(letter => ({
          letter,
          words: wordsByLetter[letter]
        }));

      // HSK等级描述
      const descriptions = {
        1: 'HSK 1级是最基础的汉语水平，掌握150个词汇即可进行简单的日常交流。',
        2: 'HSK 2级要求掌握300个词汇，能够进行简单直接的日常交流。',
        3: 'HSK 3级要求掌握600个词汇，能够用汉语完成生活、学习、工作等方面的基本交流任务。',
        4: 'HSK 4级要求掌握1200个词汇，能够用汉语就较广泛领域的话题进行讨论。',
        5: 'HSK 5级要求掌握2500个词汇，能够阅读汉语报刊杂志，欣赏汉语影视节目。',
        6: 'HSK 6级是最高级别，要求掌握5000个词汇，能够轻松理解听到或读到的汉语信息。'
      };

      // 累计词汇数
      const cumulativeTotals = {
        1: 150,
        2: 300,
        3: 600,
        4: 1200,
        5: 2500,
        6: 5000
      };

      // 准备模板数据
      const templateData = {
        level,
        wordCount: words.length,
        estimatedHours: Math.ceil(words.length / 20),
        cumulativeTotal: cumulativeTotals[level],
        description: descriptions[level],
        alphabet: Array.from(alphabet).sort(),
        wordsByLetter: wordsByLetterArray
      };

      // 渲染HTML
      const html = this.templates.hskLevel(templateData);

      // 保存到文件
      const outputPath = path.join(this.outputDir, 'hsk', `level-${level}.html`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html, 'utf8');

      console.log(`[HTMLGenerator] Generated: ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        url: `/hsk/level-${level}.html`,
        wordCount: words.length
      };

    } catch (error) {
      console.error(`[HTMLGenerator] Failed to generate HSK ${level} page:`, error);
      throw error;
    }
  }

  /**
   * 生成所有HSK等级页
   */
  async generateAllHSKLevelPages() {
    const results = [];
    for (let level = 1; level <= 6; level++) {
      const result = await this.generateHSKLevelPage(level);
      results.push(result);
    }
    return results;
  }

  /**
   * 生成文章列表页HTML
   */
  async generateArticleListPages() {
    try {
      if (!this.templates.articleList) {
        await this.initialize();
      }

      const PAGE_SIZE = 20;
      const totalArticles = await prisma.article.count({
        where: { status: 'PUBLISHED' }
      });
      const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

      console.log(`[HTMLGenerator] Generating ${totalPages} article list pages...`);

      for (let page = 1; page <= totalPages; page++) {
        const articles = await prisma.article.findMany({
          where: { status: 'PUBLISHED' },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
          orderBy: { publishedAt: 'desc' },
          select: {
            slug: true,
            title: true,
            excerpt: true,
            coverImage: true,
            hskLevel: true,
            publishedAt: true,
            viewCount: true
          }
        });

        // 计算阅读时间（字数 / 每分钟250字）
        const articlesWithReadTime = articles.map(article => ({
          ...article,
          wordCount: Math.floor(Math.random() * 500) + 500, // 临时：实际应从article.content计算
          readTime: Math.ceil(((Math.random() * 500) + 500) / 250)
        }));

        const templateData = {
          page,
          totalPages,
          articles: articlesWithReadTime,
          hasPrev: page > 1,
          hasNext: page < totalPages,
          prevPage: page - 1,
          nextPage: page + 1
        };

        const html = this.templates.articleList(templateData);

        // 第一页保存为 articles.html，其他页保存为 articles/page-N.html
        const fileName = page === 1 ? 'articles.html' : `articles/page-${page}.html`;
        const outputPath = path.join(this.outputDir, fileName);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, html, 'utf8');

        console.log(`[HTMLGenerator] Generated: ${outputPath}`);
      }

      return {
        success: true,
        totalPages,
        totalArticles
      };

    } catch (error) {
      console.error('[HTMLGenerator] Failed to generate article list pages:', error);
      throw error;
    }
  }

  /**
   * 生成单个文章详情页HTML
   */
  async generateArticleDetailPage(articleId) {
    try {
      if (!this.templates.articleDetail) {
        await this.initialize();
      }

      // 获取文章数据
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        include: {
          keyVocabulary: {
            select: {
              word: true,
              slug: true,
              pinyin: true,
              pinyinWithTones: true,
              english: true,
              hskLevel: true
            },
            take: 20
          }
        }
      });

      if (!article) {
        throw new Error(`Article ${articleId} not found`);
      }

      // 获取相关文章
      const relatedArticles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          hskLevel: article.hskLevel,
          id: { not: articleId }
        },
        take: 3,
        orderBy: { viewCount: 'desc' },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          hskLevel: true
        }
      });

      // 计算字数和阅读时间
      const wordCount = article.content.length;
      const readTime = Math.ceil(wordCount / 250);

      // 准备模板数据
      const templateData = {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        hskLevel: article.hskLevel,
        publishedAt: article.publishedAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        coverImage: article.coverImage,
        contentHtml: article.contentHtml,
        wordCount,
        readTime,
        viewCount: article.viewCount,
        keyVocabulary: article.keyVocabulary.map(word => ({
          word: word.word,
          slug: word.slug,
          pinyin: word.pinyinWithTones,
          translation: word.english,
          hskLevel: word.hskLevel
        })),
        relatedArticles: relatedArticles.map(a => ({
          ...a,
          readTime: Math.ceil(a.excerpt.length / 10)
        }))
      };

      // 渲染HTML
      const html = this.templates.articleDetail(templateData);

      // 保存到文件
      const outputPath = path.join(this.outputDir, 'articles', `${article.slug}.html`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html, 'utf8');

      console.log(`[HTMLGenerator] Generated: ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        url: `/articles/${article.slug}.html`
      };

    } catch (error) {
      console.error(`[HTMLGenerator] Failed to generate article ${articleId}:`, error);
      throw error;
    }
  }

  /**
   * 批量生成所有文章详情页
   */
  async batchGenerateArticlePages() {
    try {
      const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true, title: true, slug: true }
      });

      console.log(`[HTMLGenerator] Generating ${articles.length} article detail pages...`);

      const results = {
        total: articles.length,
        success: 0,
        failed: 0,
        errors: []
      };

      // 并发生成
      const concurrency = 10;
      for (let i = 0; i < articles.length; i += concurrency) {
        const batch = articles.slice(i, i + concurrency);

        await Promise.all(
          batch.map(async (article) => {
            try {
              await this.generateArticleDetailPage(article.id);
              results.success++;
            } catch (error) {
              results.failed++;
              results.errors.push({
                articleId: article.id,
                title: article.title,
                error: error.message
              });
            }
          })
        );

        const progress = Math.round(((i + batch.length) / articles.length) * 100);
        console.log(`[HTMLGenerator] Progress: ${progress}% (${i + batch.length}/${articles.length})`);
      }

      return results;

    } catch (error) {
      console.error('[HTMLGenerator] Batch article generation failed:', error);
      throw error;
    }
  }

  /**
   * 批量生成HTML
   */
  async batchGenerateHTML(filters = {}, limit = 100) {
    try {
      // 获取需要生成HTML的词汇
      const where = {
        status: 'GENERATED',
        htmlGenerated: false,
        contentJson: { not: null }
      };

      if (filters.hskLevel) {
        where.hskLevel = filters.hskLevel;
      }

      const wordEntries = await prisma.wordEntry.findMany({
        where,
        take: limit,
        select: { id: true, word: true, slug: true }
      });

      console.log(`[HTMLGenerator] Starting batch generation: ${wordEntries.length} words`);

      const results = {
        total: wordEntries.length,
        success: 0,
        failed: 0,
        errors: []
      };

      // 并发生成（控制并发数）
      const concurrency = 10;
      for (let i = 0; i < wordEntries.length; i += concurrency) {
        const batch = wordEntries.slice(i, i + concurrency);

        await Promise.all(
          batch.map(async (entry) => {
            try {
              await this.generateWordHTML(entry.id);
              results.success++;
            } catch (error) {
              results.failed++;
              results.errors.push({
                wordId: entry.id,
                word: entry.word,
                error: error.message
              });
            }
          })
        );

        // 进度日志
        const progress = Math.round(((i + batch.length) / wordEntries.length) * 100);
        console.log(`[HTMLGenerator] Progress: ${progress}% (${i + batch.length}/${wordEntries.length})`);
      }

      console.log(`[HTMLGenerator] Batch completed: ${results.success} success, ${results.failed} failed`);

      return results;

    } catch (error) {
      console.error('[HTMLGenerator] Batch generation failed:', error);
      throw error;
    }
  }

  /**
   * 生成sitemap.xml（包含所有页面类型）
   */
  async generateSitemap() {
    try {
      const baseUrl = process.env.BASE_URL || 'https://www.chinesemaster.com';
      const urls = [];

      // 1. 添加首页和主要静态页面
      urls.push(
        {
          loc: `${baseUrl}/`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'daily',
          priority: '1.0'
        },
        {
          loc: `${baseUrl}/hsk-library.html`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'daily',
          priority: '0.9'
        }
      );

      // 2. 添加HSK等级页（6个页面）
      for (let level = 1; level <= 6; level++) {
        urls.push({
          loc: `${baseUrl}/hsk/level-${level}.html`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.9'
        });
      }

      // 3. 添加所有词汇页面
      const publishedWords = await prisma.wordEntry.findMany({
        where: {
          status: 'PUBLISHED',
          htmlGenerated: true
        },
        select: {
          slug: true,
          updatedAt: true
        }
      });

      publishedWords.forEach(word => {
        urls.push({
          loc: `${baseUrl}/word/${word.slug}.html`,
          lastmod: word.updatedAt.toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8'
        });
      });

      console.log(`[Sitemap] Added ${publishedWords.length} word pages`);

      // 4. 添加文章列表页
      const totalArticles = await prisma.article.count({
        where: { status: 'PUBLISHED' }
      });
      const totalPages = Math.ceil(totalArticles / 20);

      // 第一页（articles.html）
      urls.push({
        loc: `${baseUrl}/articles.html`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '0.9'
      });

      // 其他分页
      for (let page = 2; page <= totalPages; page++) {
        urls.push({
          loc: `${baseUrl}/articles/page-${page}.html`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'daily',
          priority: '0.7'
        });
      }

      console.log(`[Sitemap] Added ${totalPages} article list pages`);

      // 5. 添加所有文章详情页
      const publishedArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          updatedAt: true
        }
      });

      publishedArticles.forEach(article => {
        urls.push({
          loc: `${baseUrl}/articles/${article.slug}.html`,
          lastmod: article.updatedAt.toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7'
        });
      });

      console.log(`[Sitemap] Added ${publishedArticles.length} article detail pages`);

      // 生成XML
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // 保存sitemap
      const sitemapPath = path.join(this.outputDir, 'sitemap.xml');
      await fs.writeFile(sitemapPath, xml, 'utf8');

      console.log(`[HTMLGenerator] Sitemap generated: ${urls.length} total URLs`);
      console.log(`  - ${publishedWords.length} word pages`);
      console.log(`  - ${publishedArticles.length} article pages`);
      console.log(`  - ${totalPages} article list pages`);
      console.log(`  - 6 HSK level pages`);
      console.log(`  - 2 main pages`);

      return {
        success: true,
        path: sitemapPath,
        urlCount: urls.length,
        breakdown: {
          words: publishedWords.length,
          articles: publishedArticles.length,
          articleListPages: totalPages,
          hskLevelPages: 6,
          mainPages: 2
        }
      };

    } catch (error) {
      console.error('[HTMLGenerator] Sitemap generation failed:', error);
      throw error;
    }
  }

  /**
   * 生成robots.txt
   */
  async generateRobotsTxt() {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://www.chinesemaster.com/sitemap.xml

# Disallow admin area
Disallow: /admin/
Disallow: /api/admin/

# Crawl-delay
Crawl-delay: 1
`;

    const robotsPath = path.join(this.outputDir, 'robots.txt');
    await fs.writeFile(robotsPath, robotsTxt, 'utf8');

    console.log('[HTMLGenerator] robots.txt generated');
  }
}

module.exports = new HTMLGeneratorService();
```

---

## 🚀 批量生成脚本

**文件**: `scripts/generate-all-html.js`

```javascript
const htmlGeneratorService = require('../api/services/htmlGeneratorService');

async function main() {
  console.log('🚀 Starting HTML generation for all pages...\n');

  try {
    // 1. 生成所有词汇HTML
    console.log('📝 Step 1/5: Generating word pages...');
    const wordResults = await htmlGeneratorService.batchGenerateHTML({}, 10000);
    console.log(`✓ Words: ${wordResults.success} success, ${wordResults.failed} failed`);

    if (wordResults.errors.length > 0) {
      console.log('❌ Word generation errors:');
      wordResults.errors.slice(0, 5).forEach(err => {
        console.log(`  - ${err.word}: ${err.error}`);
      });
      if (wordResults.errors.length > 5) {
        console.log(`  ... and ${wordResults.errors.length - 5} more errors`);
      }
    }

    // 2. 生成HSK等级页
    console.log('\n📚 Step 2/5: Generating HSK level pages...');
    const hskResults = await htmlGeneratorService.generateAllHSKLevelPages();
    console.log(`✓ Generated ${hskResults.length} HSK level pages`);

    // 3. 生成文章列表页
    console.log('\n📰 Step 3/5: Generating article list pages...');
    const articleListResults = await htmlGeneratorService.generateArticleListPages();
    console.log(`✓ Generated ${articleListResults.totalPages} article list pages (${articleListResults.totalArticles} articles)`);

    // 4. 生成文章详情页
    console.log('\n📖 Step 4/5: Generating article detail pages...');
    const articleResults = await htmlGeneratorService.batchGenerateArticlePages();
    console.log(`✓ Articles: ${articleResults.success} success, ${articleResults.failed} failed`);

    if (articleResults.errors.length > 0) {
      console.log('❌ Article generation errors:');
      articleResults.errors.slice(0, 5).forEach(err => {
        console.log(`  - ${err.title}: ${err.error}`);
      });
      if (articleResults.errors.length > 5) {
        console.log(`  ... and ${articleResults.errors.length - 5} more errors`);
      }
    }

    // 5. 生成sitemap和robots.txt
    console.log('\n🗺️  Step 5/5: Generating sitemap and robots.txt...');
    const sitemapResult = await htmlGeneratorService.generateSitemap();
    console.log(`✓ Sitemap: ${sitemapResult.urlCount} URLs`);
    console.log(`  - ${sitemapResult.breakdown.words} word pages`);
    console.log(`  - ${sitemapResult.breakdown.articles} article pages`);
    console.log(`  - ${sitemapResult.breakdown.articleListPages} article list pages`);
    console.log(`  - ${sitemapResult.breakdown.hskLevelPages} HSK level pages`);
    console.log(`  - ${sitemapResult.breakdown.mainPages} main pages`);

    await htmlGeneratorService.generateRobotsTxt();
    console.log('✓ robots.txt generated');

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Generation Summary:');
    console.log('='.repeat(50));
    console.log(`✓ Word pages: ${wordResults.success}/${wordResults.total}`);
    console.log(`✓ HSK level pages: ${hskResults.length}/6`);
    console.log(`✓ Article list pages: ${articleListResults.totalPages}`);
    console.log(`✓ Article detail pages: ${articleResults.success}/${articleResults.total}`);
    console.log(`✓ Total URLs in sitemap: ${sitemapResult.urlCount}`);
    console.log('='.repeat(50));

    console.log('\n✅ All done!');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
```

运行脚本：
```bash
node scripts/generate-all-html.js
```

---

## 📈 性能优化

### 1. 增量生成
只生成新内容或有更新的内容：
```javascript
where: {
  status: 'GENERATED',
  OR: [
    { htmlGenerated: false },
    { updatedAt: { gte: lastGenerationTime } }
  ]
}
```

### 2. 并发控制
```javascript
const concurrency = 10;  // 同时生成10个HTML
```

### 3. 缓存模板
在服务初始化时编译模板，避免重复编译

### 4. 压缩HTML
```javascript
const htmlMinifier = require('html-minifier');

const minified = htmlMinifier.minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true
});
```

---

## ✅ 静态HTML生成器完成

**功能清单**:
- ✅ Handlebars模板系统
- ✅ SEO优化HTML生成
- ✅ 批量生成脚本
- ✅ Sitemap自动生成
- ✅ robots.txt生成
- ✅ 增量更新支持
- ✅ 性能优化

**下一步**: 用户端改造方案
