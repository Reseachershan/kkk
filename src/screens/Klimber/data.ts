import { trayectoriaType } from '../../types/workout';
const turf = require('@turf/turf');
export const defaultRegionKoko =
// {"latitude": 21.283329079273884, "latitudeDelta": 0.012712480238743495, "longitude": -157.68860445314195, "longitudeDelta": 0.014668983784929424}
{
  latitude: 21.283329079273884,
  longitude: -157.68860445314195,
  latitudeDelta: 0.004757,
  longitudeDelta: 0.006866,
}
export const defaultRegionLocal =
{
  latitude: 31.4667159,
  longitude: 74.2740506,
  latitudeDelta: 0.004757,
  longitudeDelta: 0.006866,
}
export const endRouteCoordsKoko = [-157.68656143957125, 21.284805247729608];
export const endRouteCoordsKokoShort = [-157.69006133079532, 21.28221655518522];
export const endRouteCoordsLocal = [74.27394032478334, 31.466693631108285];
export const startRouteCoordsKoko = [-157.69191769559893, 21.28086162237429];
export const startRouteCoordsLocal = [74.27387058734895, 31.466936134776716];
// export const startKlimbCoordsKoko = [
//   [
//     -157.691976,
//     21.280937
//   ],
//   [
//     -157.692015,
//     21.280889
//   ],
//   [
//     -157.691924,
//     21.280777
//   ],
//   [
//     -157.691868,
//     21.280815
//   ],
//   [
//     -157.691976,
//     21.280937
//   ]
// ];
export const startKlimbCoordsKoko = [  
  [ -157.6917636, 21.2807276 ],
  [ -157.6920345, 21.2810200 ],
  [ -157.6918763, 21.2811125 ],
  [ -157.6916000, 21.2808151 ],
  [ -157.6917636, 21.2807276 ],
];
export const startKlimbCoordsLocal = [
  [
    74.27385985851289,
    31.46683089741285
  ],
  [
    74.27390813827516,
    31.46685835064961
  ],
  [
    74.27392423152925,
    31.46680801970939
  ],
  [
    74.27386522293092,
    31.46679429308465
  ],
  [
    74.27385985851289,
    31.46683089741285
  ]
  // [74.27417099475862, 31.466579242367388],
  //       [74.27384912967683, 31.46651060905578],
  //       [74.27361309528352, 31.4673708095915],
  //       [74.27385449409486, 31.467398262669917],
  //       [74.27417099475862, 31.466579242367388],
];
// export const endKlimbCoorsKoko = [
//   [
//     -157.6865459,
//     21.285024
//   ],
//   [
//     -157.6866849,
//     21.2849094
//   ],
//   [
//     -157.6864765,
//     21.2846769
//   ],
//   [
//     -157.6863342,
//     21.2847899
//   ],
//   [
//     -157.6864353,
//     21.2849023
//   ],
//   [
//     -157.6865459,
//     21.285024
//   ]
// ];
export const endKlimbCoorsKoko = [
  [
    -157.686584,
    21.285069
  ],
  [
    -157.686802,
    21.284916
  ],
  [
    -157.686489,
    21.284543
  ],
  [
    -157.686274,
    21.284699
  ],
  [
    -157.686584,
    21.285069
  ]
];
export const endKlimbCoorsKokoShort = [
  [
    -157.69019544124606,
    21.282346518358445
  ],
  [
    -157.69034028053287,
    21.28229153395302
  ],
  [
    -157.68995404243472,
    21.281926636923433
  ],
  [
    -157.68980383872986,
    21.28203660598655
  ],
  [
    -157.69019544124606,
    21.282346518358445
  ]
];
export const endKlimbCoorsLocal = [
  [74.27373111248018, 31.467219817516185],
  [74.27370563149452, 31.467290738066747],
  [74.27381560206413, 31.467318191168644],
  [74.27384309470654, 31.467236975718848],
  [74.27373111248018, 31.467219817516185],
];
export const externalAreaCoordsKoko = {
  geometry: {
    coordinates: [
      [
        [-157.6869084846359, 21.286056059538623],
        [-157.68536915744576, 21.284224337990793],
        [-157.69170164950683, 21.279606450854857],
        [-157.69325723364517, 21.281427754426886],
        [-157.6869084846359, 21.286056059538623],
      ],
    ],
    type: 'Polygon',
  },
  id: 'externalArea',
  type: 'Feature',
  properties: {},
};
export const externalAreaCoordsLocal = {
  geometry: {
    coordinates: [
      [
        [74.27402615547182, 31.46680801970939],
        [74.27376866340639, 31.46676683982909],
        [74.27361309528352, 31.4673708095915],
        [74.27385449409486, 31.467398262669917],
        [74.27402615547182, 31.46680801970939],
      ],
    ],
    type: 'Polygon',
  },
  id: 'externalArea',
  type: 'Feature',
  properties: {},
};

export type TrayectoriasType = {
  single_1: Array<trayectoriaType>;
  single_2: Array<trayectoriaType>;
  double_1: Array<trayectoriaType>;
  double_2: Array<trayectoriaType>;
};
export const trayectoriasKokoShort: TrayectoriasType = {
  single_1: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKokoShort]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: endKlimbCoorsKokoShort,
      pointToDistance: endRouteCoordsKokoShort,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  single_2: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: endKlimbCoorsKokoShort,
      pointToDistance: endRouteCoordsKokoShort,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKokoShort]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  double_1: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKokoShort]);
        return turf.length(line, { units: 'feet' }) * 2;
      },
      completedAt: 0,
    },
    {
      type: 'chckpoint',
      id: 'chckpoint1',
      automaticCheckIn: false,
      area: endKlimbCoorsKokoShort,
      pointToDistance: endRouteCoordsKokoShort,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKokoShort]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  double_2: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: endKlimbCoorsKokoShort,
      pointToDistance: endRouteCoordsKokoShort,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKokoShort]);
        return turf.length(line, { units: 'feet' }) * 2;
      },
      completedAt: 0,
    },
    {
      type: 'chckpoint',
      id: 'chckpoint1',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKokoShort]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: endKlimbCoorsKokoShort,
      pointToDistance: endRouteCoordsKokoShort,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
};
export const trayectoriasKoko: TrayectoriasType = {
  single_1: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKoko]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: endKlimbCoorsKoko,
      pointToDistance: endRouteCoordsKoko,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  single_2: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: endKlimbCoorsKoko,
      pointToDistance: endRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKoko]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  double_1: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKoko]);
        return turf.length(line, { units: 'feet' }) * 2;
      },
      completedAt: 0,
    },
    {
      type: 'chckpoint',
      id: 'chckpoint1',
      automaticCheckIn: false,
      area: endKlimbCoorsKoko,
      pointToDistance: endRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKoko]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  double_2: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: endKlimbCoorsKoko,
      pointToDistance: endRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKoko]);
        return turf.length(line, { units: 'feet' }) * 2;
      },
      completedAt: 0,
    },
    {
      type: 'chckpoint',
      id: 'chckpoint1',
      automaticCheckIn: false,
      area: startKlimbCoordsKoko,
      pointToDistance: startRouteCoordsKoko,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsKoko, endRouteCoordsKoko]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: endKlimbCoorsKoko,
      pointToDistance: endRouteCoordsKoko,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
};
export const trayectoriasLocal: TrayectoriasType = {
  single_1: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: startKlimbCoordsLocal,
      pointToDistance: startRouteCoordsLocal,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsLocal, endRouteCoordsLocal]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: endKlimbCoorsLocal,
      pointToDistance: endRouteCoordsLocal,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  single_2: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: endKlimbCoorsLocal,
      pointToDistance: endRouteCoordsLocal,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsLocal, endRouteCoordsLocal]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: startKlimbCoordsLocal,
      pointToDistance: startRouteCoordsLocal,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  double_1: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: startKlimbCoordsLocal,
      pointToDistance: startRouteCoordsLocal,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsLocal, endRouteCoordsLocal]);
        return turf.length(line, { units: 'feet' }) * 2;
      },
      completedAt: 0,
    },
    {
      type: 'chckpoint',
      id: 'chckpoint1',
      automaticCheckIn: false,
      area: endKlimbCoorsLocal,
      pointToDistance: endRouteCoordsLocal,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsLocal, endRouteCoordsLocal]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: startKlimbCoordsLocal,
      pointToDistance: startRouteCoordsLocal,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
  double_2: [
    {
      type: 'start',
      id: 'start',
      automaticCheckIn: false,
      area: endKlimbCoorsLocal,
      pointToDistance: endRouteCoordsLocal,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsLocal, endRouteCoordsLocal]);
        return turf.length(line, { units: 'feet' }) * 2;
      },
      completedAt: 0,
    },
    {
      type: 'chckpoint',
      id: 'chckpoint1',
      automaticCheckIn: false,
      area: startKlimbCoordsLocal,
      pointToDistance: startRouteCoordsLocal,
      completed: false,
      distanceToNext: () => {
        const line = turf.lineString([startRouteCoordsLocal, endRouteCoordsLocal]);
        return turf.length(line, { units: 'feet' });
      },
      completedAt: 0,
    },
    {
      type: 'end',
      id: 'end',
      automaticCheckIn: false,
      area: endKlimbCoorsLocal,
      pointToDistance: endRouteCoordsLocal,
      completed: false,
      distanceToNext: 0,
      completedAt: 0,
    },
  ],
};