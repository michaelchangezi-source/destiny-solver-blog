interface Props {
  html: string
}

export default function ArticleBody({ html }: Props) {
  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:text-[#2B241C] prose-headings:font-bold
        prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-[#2B241C]/10 prose-h2:pb-2
        prose-h3:text-xl prose-h3:text-[#B23E26]
        prose-p:text-[#3A332A] prose-p:leading-relaxed
        prose-a:text-[#B23E26] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[#2B241C]
        prose-blockquote:border-l-[#B23E26] prose-blockquote:text-[#5A5247] prose-blockquote:bg-[#2B241C]/[0.05] prose-blockquote:rounded-r-lg prose-blockquote:py-1
        prose-li:text-[#3A332A]
        prose-ul:list-disc prose-ol:list-decimal
        prose-hr:border-[#2B241C]/10
        prose-table:text-[#3A332A]
        prose-th:text-[#2B241C] prose-th:bg-[#2B241C]/[0.07]
        prose-code:text-[#2B241C] prose-code:bg-[#2B241C]/[0.07] prose-pre:bg-[#2B241C]/[0.07]
        prose-td:border-[#2B241C]/10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
