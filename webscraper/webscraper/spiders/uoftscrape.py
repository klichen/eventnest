import scrapy
import requests

current_page = 1
max_page = 1

class UoftscrapeSpider(scrapy.Spider):
    name = "uoftscrape"
    allowed_domains = ["sop.utoronto.ca"]
    start_urls = ["https://sop.utoronto.ca/groups/?campus=st-george&pg=1"]

    def parse(self, response):
        global current_page
        global max_page

        # Extract all href links
        links = response.css('a::attr(href)').extract()
        for link in links:
            if "pg=" in link:
                page_num = link.split('pg=')
                if int(page_num[1]) > max_page:
                    max_page = int(page_num[1])
        for link in links:
            if "/group/" in link:
                clean_link = response.urljoin(link)
                yield scrapy.Request(clean_link, callback=self.parse_club_page)

        current_page += 1
        next_page = "https://sop.utoronto.ca/groups/?campus=st-george&pg=" + str(current_page)
        if next_page is not None and current_page <= max_page:
            yield scrapy.Request(next_page, callback=self.parse)

    def parse_club_page(self, response):
        # Extract the club title
        club_title = response.css('main#main h1 span::text').get()
        # Extract the club description
        club_description = response.xpath('//div[@class="pr-8"]//text()').getall()
        # Join the text content list into a single string
        club_description = ' '.join(club_description).strip()
        #replace html stuff like \n or \t
        club_description = club_description.replace('\t', '')
        

        instagram_links = response.css('a[href*="www.instagram.com"]::attr(href)').extract()

        if not instagram_links:
            instagram_links = None
            instagram_usernames = None
        else:
            instagram_usernames = [self.extract_username(link) for link in instagram_links]

        yield {
            'club_page': response.url,
            'club_title': club_title,
            'club_description': club_description,
            'instagram_links': instagram_links,
            'instagram_usernames': instagram_usernames
        }

    def extract_username(self, link):
        # Extract the username from the Instagram link
        import re
        pattern = re.compile(r"www.instagram\.com/([^/?]+)")
        match = pattern.search(link)
        if match:
            return match.group(1)
        return None
