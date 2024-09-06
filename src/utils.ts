export type YoutubeVideoData = {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnails: string[]
}

function greatestCommonDivisor(a: number, b: number): number {
  if (b === 0) return a
  return greatestCommonDivisor(b, a % b)
}

export function fetchVideoData(id: string, apiKey: string): Promise<YoutubeVideoData | null> {
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${apiKey}`
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const snippet = data?.items?.[0]?.snippet
      if (!snippet) return null
      if (!snippet.title) return null
      if (!snippet.description) return null
      if (!snippet.publishedAt) return null

      let aspectRatio

      // Calculate CSS aspect ratio using video thumbnail dimensions
      if (snippet.thumbnails?.default?.width && snippet.thumbnails?.default?.height) {
        const gcd = greatestCommonDivisor(
          snippet.thumbnails.default.width,
          snippet.thumbnails.default.height,
        )

        aspectRatio = `${snippet.thumbnails.default.width / gcd}/${
          snippet.thumbnails.default.height / gcd
        }`
      }

      return {
        id,
        title: snippet.title as string,
        description: snippet.description as string,
        publishedAt: snippet.publishedAt as string,
        thumbnails: Object.keys(snippet.thumbnails),
        aspectRatio,
      }
    })
}

export function deriveVideoId(input: string): string | null {
  if (/^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}($|&|#)/.test(input)) {
    return new URL(input).searchParams.get('v')
  }

  if (/^https?:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}($|\/)/.test(input)) {
    return new URL(input).pathname.split('/')[1]
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input
  }

  return null
}
