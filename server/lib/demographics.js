import _ from 'underscore';
import { render } from '../nunjucks';
import referenceData from '../../layouts/stateDemographics';

const d3 = require('d3');

const labels = referenceData.label;

const attributesToDisplay = [
  'wageGrowth2015',
  'unemployment',
  'poverty',
  'graduates',
  'hispanic',
  'africanAmerican',
];

export function formatToPercent(n) {
  return Math.round(n * 1000) / 10;
}

// return svg object given indicator
function layoutDemographicBarcode(code, indicator, stateName) {
  // deal with Maine, Nebraska
  if (code.toUpperCase().indexOf('CD') > -1) {
    code = code.split('CD')[0];
  }

  const stateData = referenceData[code.toUpperCase()][indicator];
  if (!stateData) return null;

  const indicatorData = _.pluck(_.omit(referenceData, ['label', 'US']), indicator); // list of indicator data from all states (minus label and national)

  const nationalData = referenceData.US[indicator];

  const chartConfig = {
    width: 325,
    height: 136,
    margin: {
      left: 15,
      right: 15,
      top: 30,
      bottom: 60,
    },
  };

  const xDomain = d3.extent(indicatorData);

  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, chartConfig.width - (chartConfig.margin.left + chartConfig.margin.right)]);

  const stateTicks = indicatorData.map(val => xScale(val));

  let stateLabelTextDirection = 'start';
  if (xScale(stateData) / xScale(xDomain[1]) > 0.5) {
    stateLabelTextDirection = 'end';
  }

  return {
    stateName,
    ...chartConfig,
    stateTicks,
    highlight: {
      value: `${formatToPercent(stateData)}%`,
      position: xScale(stateData),
      textDirection: stateLabelTextDirection,
    },
    xTicks: [{
      label: 'min',
      value: `${formatToPercent(d3.min(indicatorData))}%`,
      position: xScale(d3.min(indicatorData)),
      fontWeight: 400,
    },
    {
      label: 'US',
      value: `${formatToPercent(nationalData)}%`,
      position: xScale(nationalData),
      fontWeight: 500,
    },
    {
      label: 'max',
      value: `${formatToPercent(d3.max(indicatorData))}%`,
      position: xScale(d3.max(indicatorData)),
      fontWeight: 400,
    }],
  };
}

export function getDemographics(code, stateName) {
  return attributesToDisplay.map(indicator => {
    return {
      label: labels[indicator],
      svg: render('demographics-barcode.svg', layoutDemographicBarcode(code, indicator, stateName)),
    };
  });
}
