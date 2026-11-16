const objectUrls = new Map<string, string>()

export function rememberAudio(analysisId: string, file: File): void {
  objectUrls.set(analysisId, URL.createObjectURL(file))
}

export function getAudioUrl(analysisId: string): string | undefined {
  return objectUrls.get(analysisId)
}

export function forgetAudio(analysisId: string): void {
  const url = objectUrls.get(analysisId)
  if (url) {
    URL.revokeObjectURL(url)
    objectUrls.delete(analysisId)
  }
}

export function forgetAllAudio(): void {
  objectUrls.forEach((url) => URL.revokeObjectURL(url))
  objectUrls.clear()
}
