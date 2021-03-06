import color from './color';
import statesData from '../data/states.json';

// make a quick lookup for objects in the statesData (from the JSON file in this
// app) with keys based on the results spreadsheet
const statesLookup = {};
for (const obj of statesData) {
  switch (obj.code) {
    case 'MECD1':
      statesLookup.me1 = obj;
      break;
    case 'MECD':
      statesLookup.me2 = obj;
      break;
    case 'NECD1':
      statesLookup.ne1 = obj;
      break;
    case 'NECD2':
      statesLookup.ne2 = obj;
      break;
    case 'NECD3':
      statesLookup.ne3 = obj;
      break;
    default:
      statesLookup[obj.code.toLowerCase()] = obj;
  }
}

// override certain shortnames to fit our table better
const customShortNames = {
  IL: 'Illinois',
  NH: 'NH',
  NC: 'NC',
  SC: 'SC',
  WV: 'WV',
  RI: 'RI',
};

const getShortName = (code) => {
  const data = statesLookup[code.toLowerCase()];
  return customShortNames[code] || data.shortName || data.name;
};

// returns an appropriate [bgColor, textColor] for a given winner
const getColors = (winner) => {
  if (!winner) return [color.pinkTint2, '#000'];

  switch (winner.toLowerCase()) {
    case 'd':
      return [color.Clinton, '#fff'];
    case 'r':
      return [color.Trump, '#fff'];
    default:
      return [color.McMullin, '#fff'];
  }
};

const bucketIds = ['D', 'LD', 'T', 'LR', 'R'];

export default (electoralCollege) => {
  const stateResults = {
    buckets: {},
    legend: {
      Clinton: {
        color: color.Clinton,
        total: 0,
      },
      Trump: {
        color: color.Trump,
        total: 0,
      },
    },
  };

  for (const bucketId of bucketIds) {
    stateResults.buckets[bucketId] = electoralCollege
      .filter((state) => {
        return (state.pollingprojection && state.pollingprojection.toUpperCase() === bucketId);
      })
      .map(state => {
        const { ecvotes: ecVotes } = state;
        const [bgColor, textColor] = getColors(state.winner);
        const [, code, districtNumber] = /([A-Za-z]+)([0-9]*)/.exec(state.code.toUpperCase());
        const winner = state.winner ? state.winner.toLowerCase() : null;

        // add mcmullin to legend if necessary
        if (winner && winner !== 'd' && winner !== 'r') {
          stateResults.legend.Other = color.McMullin;
        }

        const shortName = getShortName(code);

        const ecVotesWidth = (ecVotes / 55) * 100; // top number of EC votes is 55 (Calif.)

        // increment the win in the key
        switch (winner && winner.toLowerCase()) {
          case 'd':
            stateResults.legend.Clinton.total += ecVotes;
            break;
          case 'r':
            stateResults.legend.Trump.total += ecVotes;
            break;
          default:
        }

        return {
          ecVotes,
          ecVotesWidth,
          code, // e.g. "ME" or "NY"
          districtNumber, // e.g. "2" (for maine/nebraska) or "" (most cases)
          shortName,
          winner,
          bgColor,
          textColor,
        };
      })
      .sort((a, b) => b.ecVotes - a.ecVotes)
    ;
  }

  return stateResults;
};
