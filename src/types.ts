export type Shape = {
  type: 'circle' | 'rectangle' | 'square' | 'triangle';
  attributes: {
    size: number;
    color: string;
    x: number;
    y: number;
  };
};

export interface GameState {
  active: boolean;
  type: 'RPG' | 'Story' | 'Platformer' | null;
  data: any;
  config?: any;
  level?: number;
  stats?: any;
}

export type ExecutionResult = {
  input: string;
  backgroundLogic: string;
  output: {
    text?: string;
    math?: number | string;
    shapes?: Shape[];
    particles?: { count: number; color: string; x: number; y: number };
    sound?: { type: string; frequency?: number; note?: string };
    chart?: { type: 'bar' | 'line'; data: number[]; label?: string };
    system?: { type: 'clock' | 'diagnostics' | 'file_system' | 'timer' | 'beep'; payload: any };
    logic?: { a: any, b: any, comparison: string, result: boolean };
    crypto?: { original: string, encoded: string, method: string };
    turtle?: { command: string; args: any[] };
    game?: GameState;
    error?: string;
  };
};

export type CompilerState = {
  variables: Record<string, any>;
  logs: ExecutionResult[];
};
