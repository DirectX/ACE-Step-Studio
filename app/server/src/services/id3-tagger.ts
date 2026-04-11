import NodeID3 from 'node-id3';

interface TagOptions {
  title: string;
  artist: string;
  genre?: string;
  year?: number;
  coverBuffer?: Buffer;
  coverMimeType?: string;
  lyrics?: string;
  bpm?: number;
}

/**
 * Write ID3v2 tags to an MP3 buffer. Returns tagged buffer.
 * For non-MP3 files, returns the original buffer unchanged.
 */
export function tagMp3Buffer(buffer: Buffer, options: TagOptions): Buffer {
  const tags: NodeID3.Tags = {
    title: options.title,
    artist: options.artist,
    album: 'ACE-Step Studio',
    performerInfo: options.artist,
    year: String(options.year || new Date().getFullYear()),
    encodedBy: 'ACE-Step Studio',
  };

  if (options.genre) {
    tags.genre = options.genre;
  }

  if (options.bpm) {
    tags.bpm = String(options.bpm);
  }

  if (options.lyrics) {
    tags.unsynchronisedLyrics = {
      language: 'eng',
      text: options.lyrics,
    };
  }

  if (options.coverBuffer) {
    tags.image = {
      mime: options.coverMimeType || 'image/jpeg',
      type: { id: 3, name: 'front cover' },
      description: 'Cover',
      imageBuffer: options.coverBuffer,
    };
  }

  const tagged = NodeID3.write(tags, buffer);
  if (tagged === false) {
    console.warn('[ID3] Failed to write tags, returning original buffer');
    return buffer;
  }
  return tagged as Buffer;
}

/**
 * Fetch cover image from URL and return as buffer.
 * Returns undefined if fetch fails (non-critical).
 */
export async function fetchCoverImage(songId: string): Promise<{ buffer: Buffer; mimeType: string } | undefined> {
  try {
    const url = `https://picsum.photos/seed/${songId}/400/400`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    clearTimeout(timer);
    if (!res.ok) return undefined;
    const mimeType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer), mimeType };
  } catch {
    return undefined;
  }
}
