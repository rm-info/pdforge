export type ParamType = 'number' | 'bool' | 'select' | 'text' | 'pageRange';

export interface ParamOption {
  value: string;
  label: string;
}

export interface ParamSpec {
  key: string;
  type: ParamType;
  label: string;
  default?: string | number | boolean;
  options?: ParamOption[];
  min?: number;
  max?: number;
}

export interface FileInputSpec {
  accept: string[];
  min: number;
  max: number; // 0 = illimité
}

export interface ToolDescriptor {
  id: string;
  name: string;
  category: string;
  icon: string;
  runtime: 'client' | 'server';
  inputs: { files: FileInputSpec };
  params: ParamSpec[];
  output: { type: 'file'; mime: string };
}
