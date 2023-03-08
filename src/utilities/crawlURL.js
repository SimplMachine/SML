function parseHtmlForHREFTags(htmlFile, url) {
  let seenLinks = [];
  let linksQueue = [];
  let mainDomain = url.replace(/(^\w+:|^)\/\//, "");
  // parses all elements in html for urls with partial match to mainDomain then puts links into linksQueue array and seenLinks array to prevent duplicates then console logs and returns the linksQueue array
  htmlFile("a").each(function () {
    const href = htmlFile(this).attr("href");
    if (href) {
      if (
        href.includes(mainDomain) ||
        (!/^https?:\/\//i.test(href) && !seenLinks.includes(href))
      ) {
        // for now I am combining so we have the full url instead of just like /contacts
        linksQueue.push(url + href);
        seenLinks.push(href);
      }
    }
  });
  return linksQueue;
}

module.exports = parseHtmlForHREFTags;
