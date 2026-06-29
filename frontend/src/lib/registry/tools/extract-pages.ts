import type { ToolDescriptor } from '../types';

export const extractPages: ToolDescriptor = {
  id: 'extract-pages',
  name: 'Extraire des pages',
  category: 'organize',
  icon: 'extract',
  runtime: 'client',
  inputs: { files: { accept: ['application/pdf'], min: 1, max: 1 } },
  params: [
    { key: 'pages', type: 'pageRange', label: 'Pages à extraire (ex : 1-3,5)', default: '' }
  ],
  output: { type: 'file', mime: 'application/pdf' }
};
