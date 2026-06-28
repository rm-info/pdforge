import type { ToolDescriptor } from '../types';

export const ocr: ToolDescriptor = {
  id: 'ocr',
  name: 'OCR (rendre cherchable)',
  category: 'ocr',
  icon: 'scan',
  runtime: 'server',
  inputs: { files: { accept: ['application/pdf'], min: 1, max: 1 } },
  params: [
    {
      key: 'lang',
      type: 'select',
      label: 'Langue',
      default: 'fra',
      options: [
        { value: 'fra', label: 'Français' },
        { value: 'eng', label: 'Anglais' },
        { value: 'fra+eng', label: 'Français + Anglais' }
      ]
    }
  ],
  output: { type: 'file', mime: 'application/pdf' }
};
