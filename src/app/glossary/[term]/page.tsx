import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { GLOSSARY_TERMS, getGlossaryTerm } from '@/lib/glossary'
import { getArticleBySlug } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ term: string }>
}

const DEFINED_TERM_SET_ID = `${SITE_URL}/glossary#definedTermSet`

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ term: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: slug } = await params
  const entry = getGlossaryTerm(slug)
  if (!entry) return {}
  return buildMetadata({
    title: `${entry.term}是什麼意思？八字命理詞彙定義`,
    description: entry.definition,
    path: `/glossary/${entry.slug}`,
    type: 'article',
  })
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term: slug } = await params
  const entry = getGlossaryTerm(slug)
  if (!entry) notFound()

  const relatedArticles = entry.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => a !== null)

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/glossary/${entry.slug}#term`,
    name: entry.term,
    description: entry.definition,
    url: `${SITE_URL}/glossary/${entry.slug}`,
    inLanguage: 'zh-TW',
    inDefinedTermSet: DEFINED_TERM_SET_ID,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '命理詞彙表', item: `${SITE_URL}/glossary` },
      { '@type': 'ListItem', position: 3, name: entry.term, item: `${SITE_URL}/glossary/${entry.slug}` },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-[#6B6155] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#B23E26] transition-colors">首頁</Link>
        <ChevronRight size={12} />
        <Link href="/glossary" className="hover:text-[#B23E26] transition-colors">命理詞彙表</Link>
        <ChevronRight size={12} />
        <span className="text-[#6B6155]">{entry.term}</span>
      </nav>

      <h1 className="text-[#2B241C] text-4xl font-bold mb-6">{entry.term}</h1>

      <p id="glossary-definition" className="text-[#2B241C] text-lg leading-relaxed mb-10 pb-8 border-b border-[#2B241C]/10">
        {entry.definition}
      </p>

      <section className="mb-10">
        <h2 className="text-[#2B241C] text-xl font-bold mb-3">常見誤解</h2>
        <p className="text-[#5A5247] leading-relaxed">{entry.misconception}</p>
      </section>

      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">延伸閱讀</h2>
          <ul className="space-y-3">
            {relatedArticles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="group flex items-center justify-between gap-3 rounded border border-[#2B241C]/10 bg-[#FBF7EE] p-4 hover:border-[#B23E26]/40 transition-colors"
                >
                  <span className="text-[#2B241C] font-semibold text-sm leading-snug group-hover:text-[#B23E26] transition-colors">
                    {a.title}
                  </span>
                  <ChevronRight size={14} className="text-[#6B6155] group-hover:text-[#B23E26] transition-colors shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
