import type { ToolDescriptor } from '../types';

export const rotate: ToolDescriptor = {
  id: 'rotate',
  name: 'Pivoter les pages',
  category: 'organize',
  icon: 'rotate',
  runtime: 'client',
  inputs: { files: { accept: ['application/pdf'], min: 1, max: 1 } },
  params: [
    {
      key: 'angle',
      type: 'select',
      label: 'Rotation',
      default: '90',
      options: [
        { value: '90', label: '90° (horaire)' },
        { value: '180', label: '180°' },
        { value: '270', label: '270° (anti-horaire)' }
      ]
    }
  ],
  output: { type: 'file', mime: 'application/pdf' }
};
