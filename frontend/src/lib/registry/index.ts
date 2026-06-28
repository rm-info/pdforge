import type { ToolDescriptor } from './types';
import { merge } from './tools/merge';
import { ocr } from './tools/ocr';

export const tools: ToolDescriptor[] = [merge, ocr];

export const toolsById: Record<string, ToolDescriptor> = Object.fromEntries(
  tools.map((t) => [t.id, t])
);

export function getTool(id: string): ToolDescriptor | undefined {
  return toolsById[id];
}

export const categories: string[] = [...new Set(tools.map((t) => t.category))];
