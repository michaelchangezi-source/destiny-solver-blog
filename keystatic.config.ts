import { config, collection, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'michaelchangezi-source',
      name: 'destiny-solver-blog',
    },
  },
  ui: {
    brand: { name: '命運解決師 後台' },
  },
  collections: {
    articles: collection({
      label: '文章管理',
      slugField: 'slug',
      path: 'content/articles/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: '文章標題' }),
        slug: fields.text({ label: 'Slug（URL路徑）' }),
        excerpt: fields.text({ label: '摘要', multiline: true }),
        category: fields.select({
          label: '分類',
          options: [
            { label: '八字基礎', value: '八字基礎' },
            { label: '干支詳解', value: '干支詳解' },
            { label: '十神應用', value: '十神應用' },
            { label: '命盤格局', value: '命盤格局' },
            { label: '實戰斷命', value: '實戰斷命' },
            { label: '大運流年', value: '大運流年' },
            { label: '感情格局', value: '感情格局' },
            { label: '事業財運', value: '事業財運' },
            { label: '健康命理', value: '健康命理' },
            { label: '風水地理', value: '風水地理' },
          ],
          defaultValue: '八字基礎',
        }),
        tags: fields.array(
          fields.text({ label: '標籤' }),
          { label: '標籤', itemLabel: (props) => props.value }
        ),
        coverImage: fields.text({
          label: '封面圖片路徑',
          defaultValue: '/images/og-default.png',
        }),
        publishedAt: fields.date({ label: '發佈日期' }),
        order: fields.number({ label: '排序（數字越小越前）', defaultValue: 99 }),
        isPaid: fields.checkbox({ label: '付費文章', defaultValue: false }),
        content: fields.text({
          label: '文章內容（Markdown 格式）',
          multiline: true,
        }),
      },
    }),
  },
})
