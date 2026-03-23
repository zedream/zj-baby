import { createHash } from 'crypto'

export interface GitHubFile {
  path: string
  content: string // base64 encoded
  message: string
}

export async function commitToGitHub(
  owner: string,
  repo: string,
  branch: string,
  files: GitHubFile[],
  token: string
): Promise<{ success: boolean; commitSha?: string; error?: string }> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }

  try {
    // Get current commit SHA for the branch
    const refResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      { headers }
    )

    if (!refResponse.ok) {
      return { success: false, error: `Failed to get ref: ${refResponse.statusText}` }
    }

    const refData = await refResponse.json()
    const latestCommitSha = refData.object.sha

    // Get the current tree
    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
      { headers }
    )

    if (!commitResponse.ok) {
      return { success: false, error: `Failed to get commit: ${commitResponse.statusText}` }
    }

    const commitData = await commitResponse.json()
    const treeSha = commitData.tree.sha

    // Create new tree with the files
    const treeItems = await Promise.all(
      files.map(async (file) => {
        const contentHash = createHash('sha1').update(Buffer.from(file.content, 'base64')).digest('hex')
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: contentHash, // GitHub will create the blob
        }
      })
    )

    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base_tree: treeSha,
          tree: treeItems,
        }),
      }
    )

    if (!treeResponse.ok) {
      return { success: false, error: `Failed to create tree: ${treeResponse.statusText}` }
    }

    const treeData = await treeResponse.json()
    const newTreeSha = treeData.sha

    // Create commit
    const newCommitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: files[0]?.message || 'Update photos',
          tree: newTreeSha,
          parents: [latestCommitSha],
        }),
      }
    )

    if (!newCommitResponse.ok) {
      return { success: false, error: `Failed to create commit: ${newCommitResponse.statusText}` }
    }

    const newCommitData = await newCommitResponse.json()

    // Update branch ref
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          sha: newCommitData.sha,
          force: false,
        }),
      }
    )

    if (!updateRefResponse.ok) {
      return { success: false, error: `Failed to update ref: ${updateRefResponse.statusText}` }
    }

    return { success: true, commitSha: newCommitData.sha }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function createBlob(
  owner: string,
  repo: string,
  content: string,
  token: string
): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        encoding: 'base64',
      }),
    }
  )

  if (!response.ok) return null

  const data = await response.json()
  return data.sha
}
