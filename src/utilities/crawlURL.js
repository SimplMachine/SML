const cheerio = require("cheerio");
const fs = require("fs");

async function parseHtmlForHREFTags(htmlFile, url) {
  let seenLinks = [];
  let linksQueue = [];
  let mainDomain = url.replace(/(^\w+:|^)\/\//, '');
 // parses all elements in html for urls with partial match to mainDomain then puts links into linksQueue array and seenLinks array to prevent duplicates then console logs and returns the linksQueue array
    htmlFile("a").each(function () {
        const href = htmlFile(this).attr("href");
        if (href) {
            if (href.includes(mainDomain) || !/^https?:\/\//i.test(href) && !seenLinks.includes(href)) {
                linksQueue.push(href);
                seenLinks.push(href);
            }
        }
    });
    return linksQueue;
};

module.exports = parseHtmlForHREFTags;
