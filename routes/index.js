var express = require('express');
var router = express.Router();
const PuppeteerBrowser = require('../my_models/puppeteer-browser.js');
const browser = new PuppeteerBrowser();
browser.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getList', async (req,res)=>{
  //await browser.screenShoot();
  const productInfo = await browser.getProductList();
  res.send({ ok: true, productInfo });
})

router.get('/getListOfPage', async (req,res)=>{
  //await browser.screenShoot();
  const page = req.query.page;
  const productInfo = await browser.getProductListOfPage(page);
  res.send({ ok: true, productInfo });
})

router.get('/parse-page', async(req,res)=>{
  
  const url = req.query.url;
  const result = await browser.parsePage(url);
  res.json({ ok: true, result });
})

router.post('/login', async(req,res)=>{
  const result = await browser.authentication();
  res.send({ ok: true, result });
})

router.get('/go-to-current-products-page', async(req,res)=>{
  const result = await browser.goToCurrentProductsPage();
  res.send({ ok: true, result });
})

router.get('/go-to-next-products-page', async(req,res)=>{
  const message = await browser.goToNextProductsPage();
  //await browser.saveCurrentProductsPage();
  console.log(message, '++++++++++++MESSAGE+++++++++');
  res.send({ ok: true, msg: message });
})



module.exports = router;



