interface Props {
  html: string
}

export default function ArticleBody({ html }: Props) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:text-white prose-headings:font-bold
        prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
        prose-h3:text-xl prose-h3:text-[#C9A84C]
        prose-p:text-white/75 prose-p:leading-relaxed
        prose-a:text-[#C9A84C] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-blockquote:border-l-[#C9A84C] prose-blockquote:text-white/60 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
        prose-li:text-white/75
        prose-ul:list-disc prose-ol:list-decimal
        prose-hr:border-white/10
        prose-table:text-white/80
        prose-th:text-white prose-th:bg-white/10
        prose-td:border-white/10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
