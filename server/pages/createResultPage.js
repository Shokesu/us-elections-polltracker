import Page from './page';
import { getResultData } from '../lib/results';
import dotMapLayout from '../../layouts/results-dot-map';
import stateResultsLayout from '../../layouts/state-results-layout';
import mapLayout from '../../layouts/results-map';
import onwardJourney from '../lib/onwardjourney';
import statesList from '../../data/states';

class ResultPage extends Page {

  description = 'Who is the new US President? Track election results with our live election map';
  socialHeadline = 'How Trump won: the full results';
  socialSummary = 'US election 2016: Presidential and congressional results';

  canonicalUrl = 'https://ig.ft.com/us-elections/results';
  mainImage = {
      url: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fig.ft.com%2Fstatic%2Fus-election-2016%2Fsocial2.jpg?url=http%253A%252F%252Fig.ft.com%252Fstatic%252Fus-election-2016%252Fsocial2.jpg&source=ig&width=600&height=338&fit=cover&format=auto&quality=high',
  };

  id = '5cc27b78-946b-11e6-a1dc-bdf38d484582';
  title = 'US election results map in full';
  url = 'https://ig.ft.com/us-elections/results';
  headline = 'US presidential election results';
  summary = 'Electoral college map';

  async ready() {
    const result = (await getResultData()).resultsPage;
    this.headline = result.copy.headline || this.headline;
    this.summary = result.copy.subtitle || this.summary;
    this.senatefootnote = result.copy.senatefootnote || '';
    this.housefootnote = result.copy.housefootnote || '';
    this.statebreakdowntitle = result.copy.statebreakdowntitle || 'Did the candidates win as expected?';
    this.statebreakdownsubtitle = result.copy.statebreakdownsubtitle || 'Presidential winner and electoral college votes by state. Expected winners based on latest polls';
    this.congresstext = result.copy.congresstext || false;
    this.statetabletext = result.copy.statetabletext || false;
    this.stateResults = stateResultsLayout(result.electoralCollege);
    this.overview = result.overview;
    this.mediaOrgs = result.mediaOrgs;
    this.mapfootnote = result.copy.mapfootnote;
    this.dotMapSelectors = dotMapLayout(result.electoralCollege, { width: 800, height: 500 });
    this.mapSelectors = mapLayout(result.electoralCollege, { width: 800, height: 500 });

    this.publishedDate = new Date(result.overview.timestamp);

    this.keyStates = {};
    for (let i = 0; i < this.stateResults.buckets.T.length; i += 1) {
      const d = this.stateResults.buckets.T[i];
      this.keyStates[d.code] = true;
    }

    this.onwardJourney = await onwardJourney({
      // Home page US Election headpiece
      suggestedReads: 'list/dbd61736-8af1-11e6-8aa5-f79f5696c731',
      relatedContent: [
        // "US Election 2016" stream
        'thing/N2UxNTM3MzItNWNlZC00MDc5LWI3ODUtYWNmZDA2YjE0MWE2-U2VjdGlvbnM=',
        // Home page Highlights section
        'list/highlights',
      ],
    });
  }
}

export default async () => {
  const page = new ResultPage();
  await page.ready();
  return page;
};
