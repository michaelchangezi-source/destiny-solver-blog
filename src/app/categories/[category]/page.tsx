import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getArticlesByCategory, getAllCategories } from '@/lib/articles'
import { CATEGORY_SLUGS, SLUG_TO_CATEGORY } from '@/types'
import ArticleCard from '@/components/blog/ArticleCard'
import { SITE_URL } from '@/lib/site'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category: CATEGORY_SLUGS[category] ?? category,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const name = SLUG_TO_CATEGORY[category] ?? category
  return {
    title: name,
    description: `所有關於「${name}」的八字命理深度文章。`,
    alternates: { canonical: `/categories/${category}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const name = SLUG_TO_CATEGORY[category] ?? category
  const articles = getArticlesByCategory(name)

  if (articles.length === 0) notFound()

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${SITE_URL}/categories/${category}`,
    description: `所有關於「${name}」的八字命理深度文章。`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/articles/${a.slug}`,
        name: a.title,
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '學習路徑', item: `${SITE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name, item: `${SITE_URL}/categories/${category}` },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-[#6B6155] hover:text-[#B23E26] text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> 返回分類列表
      </Link>

      <div className="mb-10">
        <p className="text-[#B23E26] text-sm font-semibold tracking-widest mb-3">分類</p>
        <h1 className="text-[#2B241C] text-4xl font-bold mb-3">{name}</h1>
        <p className="text-[#6B6155]">共 {articles.length} 篇文章</p>
      </div>

      <h2 className="sr-only">「{name}」文章列表</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <ArticleCard key={article.slug} article={article} featured index={i} />
        ))}
      </div>
    </div>
  )
}
