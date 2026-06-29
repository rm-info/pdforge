import type { ToolDescriptor } from '../types';

export const removeMetadata: ToolDescriptor = {
  id: 'remove-metadata',
  name: 'Retirer les métadonnées',
  category: 'security',
  icon: 'shield',
  runtime: 'client',
  inputs: { files: { accept: ['application/pdf'], min: 1, max: 1 } },
  params: [],
  output: { type: 'file', mime: 'application/pdf' }
};
