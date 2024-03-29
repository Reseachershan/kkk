export type workOutType = 'single' | 'double' | 'triple' | 'sprint';
import {Position} from '@turf/turf';
export type trayectoriaType = {
  type: 'start' | 'end' | string;
  id: string;
  automaticCheckIn: boolean;
  area: Position[];
  pointToDistance: Position;
  completed: boolean;
  distanceToNext: number | ((position?: Position) => number);
  completedAt: number;
};
