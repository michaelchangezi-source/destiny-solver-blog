import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GLOSSARY_TERMS } from '@/lib/glossary'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '命理詞彙表',
  description: '八字命理核心詞彙的定義速查：十神、大運、流年、用神、藏干、格局、日主、做功、去向、比劫、食傷、官殺，每個詞彙皆附延伸閱讀。',
  alternates: { canonical: '/glossary' },
}

const DEFINED_TERM_SET_ID = `${SITE_URL}/glossary#definedTermSet`

export default function GlossaryIndexPage() {
  const definedTermSetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': DEFINED_TERM_SET_ID,
    name: '命理詞彙表',
    description: '八字命理核心詞彙定義集，涵蓋十神、大運流年、格局用神等基礎與框架概念。',
    url: `${SITE_URL}/glossary`,
    inLanguage: 'zh-TW',
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      url: `${SITE_URL}/glossary/${t.slug}`,
    })),
  }

  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '命理詞彙表',
    url: `${SITE_URL}/glossary`,
    description: '八字命理核心詞彙的定義速查，每個詞彙皆有獨立定義頁與延伸閱讀。',
    inLanguage: 'zh-TW',
    mainEntity: { '@id': DEFINED_TERM_SET_ID },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      <div className="mb-10">
        <p className="text-[#B23E26] text-sm font-semibold tracking-widest mb-3">詞彙表</p>
        <h1 className="text-[#2B241C] text-4xl font-black mb-3">命理詞彙表</h1>
        <p className="text-[#6B6155] leading-relaxed">
          八字命理常用詞彙的直接定義，每個詞彙一頁，附常見誤解與延伸閱讀，方便快速查找核心概念。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GLOSSARY_TERMS.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}`}
            className="group flex items-center justify-between gap-3 rounded border border-[#2B241C]/10 bg-[#FBF7EE] p-5 hover:border-[#B23E26]/40 transition-colors"
          >
            <span className="text-[#2B241C] font-bold text-lg group-hover:text-[#B23E26] transition-colors">
              {t.term}
            </span>
            <ArrowRight size={16} className="text-[#6B6155] group-hover:text-[#B23E26] transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
