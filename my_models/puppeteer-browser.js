const puppeteer = require('puppeteer');


class PuppeteerBrowser {
    browser;
    page;
    currentProductsPage;

    constructor() {
        // this.init()
        this.currentProductsPage = 'https://www.showdowndisplays.com/ProductSearch?ReferenceKey=84138&CategoryName=EuroFit%20Straight%20Wall&SearchType=CategorySearch';
    }

    async init() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        //this.auth();
        await this.page.goto(this.currentProductsPage, { waitUntil: 'networkidle2' });
        return this.page;

    }
    async auth() {
        // his.page.goto() //   add link to login page
    }

    async closeBrowser() {
        return console.log(this.page);
        await this.browser.close();
    }
    async screenShoot() {
        await this.page.screenshot({ path: 'example.png', fullPage: true });
    }

    // current page with products
    async goToCurrentProductsPage() {
        await this.page.goto(this.currentProductsPage, { waitUntil: 'networkidle2' });

    }
    // save current page
    async saveCurrentProductsPage(url) {
        this.currentProductsPage = url;

    }
    // go to next page
    async goToNextProductsPage() {
        const message = await this.page.evaluate(() => {
            //var msg = 'not last page';
            var msg = '';

            // check location url
            // save url
            // 
            const pagination = document.querySelectorAll('nav.pull-right pager li.page-item');
            pagination.forEach((li, index) => {
                // const pageNumber = li.innerText;
                //  if (pageNumber == pageSite) li.click();
                const isActive = li.classList.contains('active');
                const nextLi = pagination[index + 1];

                if ( isActive || nextLi ) {
                    nextLi.click();
                    msg = 'not last page';
                } 
                else msg = 'last page'
            })
            return msg

        })
        return message;
    }

    async getProductList() {
        await this.page.goto(this.currentProductsPage, { waitUntil: 'networkidle2' });
        this.screenShoot()
        const product = await this.page.evaluate(() => {

            const productInfo = [];
            const listOfH1 = [];
            const skuList = [];
            const priceList = [];
            const productLink = [];

            const h1 = document.querySelectorAll('a[data-title]');
            const sku = document.querySelectorAll('.product-sku span');
            const price = document.querySelectorAll('.price-text > b');
            //const link = document.querySelectorAll('.photo > a');

            h1.forEach(element => {
                listOfH1.push(element.innerHTML.trim());
                productLink.push(element.href)
            });
            sku.forEach(element => {
                skuList.push(element.innerHTML);
            })
            price.forEach(element => {
                priceList.push(element.innerHTML);
            })
            // link.forEach(element => {
            //     productLink.push( element.innerHTML );
            // })

            h1.forEach((el, index) => {
                productInfo.push({
                    h1: listOfH1[index],
                    sku: skuList[index],
                    price: priceList[index],
                    link: productLink[index]
                })
            });

            return {
                productInfo
            }
        })
        return product

    }

    async parsePage(url) {
        await this.page.goto(url);
        const currentProduct = await this.page.evaluate(() => {
            const h1 = document.querySelector('h3').innerText;
            const price = document.querySelector("[data-col='1']").innerText;
            const overview = document.querySelector('.panel-body').innerText;
            console.log(overview)
            return { h1, price, overview }
        })
        console.log(currentProduct);
        return currentProduct
    }

    async getProductListOfPage(pageSite) {
        // check page; if this page != we need go to another page
        const paginationBtns = await this.page.evaluate((pageSite) => {
            const pagination = document.querySelectorAll('nav.pull-right pager li.page-item');
            pagination.forEach((li) => {
                const pageNumber = li.innerText;
                if (pageNumber == pageSite) li.click();
            })
        }, pageSite)

    }

    async authentication() {
        // await this.page.goto(url);

        const login = await this.page.evaluate(() => {
            const login = document.querySelector('.header-GlobalAccountFlyout-flyout-link');
            login.click();
            const username = document.getElementById('login-username');
            username.value = 'David@brussianstrokes.com';
            const password = document.getElementById('login-password');
            password.value = 'D07161955gomel';
            const signInBtn = document.getElementById('btn-login');
            signInBtn.click();

            //return login
        })
        await this.screenShoot()
        //return login
    }

}






module.exports = PuppeteerBrowser;