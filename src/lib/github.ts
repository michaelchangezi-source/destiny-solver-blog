const GITHUB_API = 'https://api.github.com'

function getConfig() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'michaelchangezi-source/destiny-solver-blog'
  if (!token) throw new Error('GITHUB_TOKEN env var required')
  return { token, repo }
}

function headers() {
  const { token } = getConfig()
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function ghFetch(path: string, options?: RequestInit) {
  const { repo } = getConfig()
  const res = await fetch(`${GITHUB_API}/repos/${repo}${path}`, {
    ...options,
    headers: { ...headers(), ...options?.headers },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub API error: ${res.status} ${err}`)
  }
  return res.json()
}

async function getRef(branch = 'main'): Promise<string> {
  const data = await ghFetch(`/git/ref/heads/${branch}`)
  return data.object.sha
}

async function getCommitTree(commitSha: string): Promise<string> {
  const data = await ghFetch(`/git/commits/${commitSha}`)
  return data.tree.sha
}

async function createBlob(content: string): Promise<string> {
  const data = await ghFetch('/git/blobs', {
    method: 'POST',
    body: JSON.stringify({ content, encoding: 'utf-8' }),
  })
  return data.sha
}

async function createTree(
  baseTreeSha: string,
  changes: Array<{ path: string; sha: string | null }>
): Promise<string> {
  const tree = changes.map((c) =>
    c.sha === null
      ? { path: c.path, mode: '100644' as const, type: 'blob' as const, sha: null }
      : { path: c.path, mode: '100644' as const, type: 'blob' as const, sha: c.sha }
  )
  const data = await ghFetch('/git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  })
  return data.sha
}

async function createCommit(treeSha: string, parentSha: string, message: string): Promise<string> {
  const data = await ghFetch('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: treeSha, parents: [parentSha] }),
  })
  return data.sha
}

async function updateRef(commitSha: string, branch = 'main'): Promise<void> {
  await ghFetch(`/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commitSha }),
  })
}

export async function createFile(filePath: string, content: string, message: string): Promise<void> {
  const headSha = await getRef()
  const treeSha = await getCommitTree(headSha)
  const blobSha = await createBlob(content)
  const newTreeSha = await createTree(treeSha, [{ path: filePath, sha: blobSha }])
  const newCommitSha = await createCommit(newTreeSha, headSha, message)
  await updateRef(newCommitSha)
}

export async function updateFile(
  filePath: string,
  content: string,
  message: string
): Promise<void> {
  const headSha = await getRef()
  const treeSha = await getCommitTree(headSha)
  const blobSha = await createBlob(content)
  const newTreeSha = await createTree(treeSha, [{ path: filePath, sha: blobSha }])
  const newCommitSha = await createCommit(newTreeSha, headSha, message)
  await updateRef(newCommitSha)
}

export async function deleteFile(filePath: string, message: string): Promise<void> {
  const headSha = await getRef()
  const treeSha = await getCommitTree(headSha)
  const newTreeSha = await createTree(treeSha, [{ path: filePath, sha: null }])
  const newCommitSha = await createCommit(newTreeSha, headSha, message)
  await updateRef(newCommitSha)
}
