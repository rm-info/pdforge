import type { ToolDescriptor } from '../types';

export const removePages: ToolDescriptor = {
  id: 'remove-pages',
  name: 'Supprimer des pages',
  category: 'organize',
  icon: 'remove',
  runtime: 'client',
  inputs: { files: { accept: ['application/pdf'], min: 1, max: 1 } },
  params: [
    { key: 'pages', type: 'pageRange', label: 'Pages à supprimer (ex : 2-3,7)', default: '' }
  ],
  output: { type: 'file', mime: 'application/pdf' }
};
