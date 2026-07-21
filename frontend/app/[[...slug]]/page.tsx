import App from '../../src/App'

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  return <App initialPath={`/${slug.join('/')}`} />
}
