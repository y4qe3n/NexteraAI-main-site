import { readFileSync } from "fs";
import path from "path";

const INDEX_PATH = path.resolve(__dirname, "../../knowledge_base/index.json");
export type KnowledgeChunk = {
  source: string;
  text: string;
  embedding: number[];
};

let cachedIndex: KnowledgeChunk[] | null = null;

function cosine(a: number[], b: number[]) {
  const dot = a.reduce((sum, value, idx) => sum + value * (b[idx] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return dot / (magA * magB + 1e-9);
}

function loadIndexFromFile(): KnowledgeChunk[] {
  try {
    const raw = readFileSync(INDEX_PATH, "utf8");
    const payload = JSON.parse(raw);
    return (payload.documents ?? []) as KnowledgeChunk[];
  } catch (err) {
    console.error("Unable to read knowledge base index", err);
    return [];
  }
}

export function getKnowledgeIndex() {
  if (!cachedIndex) {
    cachedIndex = loadIndexFromFile();
  }
  return cachedIndex;
}

export function findTopChunks(queryEmbedding: number[], top = 3) {
  const index = getKnowledgeIndex();
  const scored = index
    .map((chunk) => ({ chunk, score: cosine(queryEmbedding, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, top)
    .map((p) => ({ ...p.chunk, score: p.score }));
  return scored;
}
