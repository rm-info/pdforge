import type { ToolDescriptor } from '../types';

export const merge: ToolDescriptor = {
  id: 'merge',
  name: 'Fusionner des PDF',
  category: 'organize',
  icon: 'merge',
  runtime: 'client',
  inputs: { files: { accept: ['application/pdf'], min: 2, max: 0 } },
  params: [],
  output: { type: 'file', mime: 'application/pdf' }
};
