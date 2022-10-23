import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';

await Actor.init();

const startUrls = ['https://www.mujkaktus.cz/chces-pridat'];

const crawler = new CheerioCrawler({
    requestHandler: router,
});

await crawler.run(startUrls);

await Actor.exit();
