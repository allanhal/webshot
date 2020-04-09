require('dotenv').config()

const URLS_TO_PRINT = [
  {
    name: 'oowlish',
    file: 'oowlish.png',
    url: 'http://oowlish.com',
    width: 640,
    height: 300,
    fullPage: false,
  },
  {
    name: 'prime evo',
    file: 'prime-evo.png',
    url:
      'https://www.dt3sports.com.br/loja/elite-series/cadeira-gamer-dt3sports-prime-evo/',
    width: 640,
    height: 1280,
    fullPage: false,
  },
  {
    name: 'helora',
    file: 'helora.png',
    url:
      'https://www.dt3office.com.br/loja/cavalleria/cadeira-de-escritorio-helora/',
    width: 640,
    height: 1280,
    fullPage: false,
  },
]

const cloudinary = require('cloudinary')

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
})

async function main() {
  const puppeteer = require('puppeteer')
  async function downloadFiles() {
    await URLS_TO_PRINT.map(
      async ({ url, file, width, height, fullPage, name }) => {
        try {
          const browser = await puppeteer.launch()
          const page = await browser.newPage()
          await page.goto(url, { waitUntil: 'networkidle0' })
          await page.setViewport({ width, height })
          await page.screenshot({ path: file, fullPage })
          await browser.close()

          await cloudinary.v2.uploader.upload(file, {
            tags: name,
            public_id: name,
            folder: new Date().toDateString(),
          })
          const fs = require('fs')
          fs.unlinkSync(file)
        } catch (error) {
          console.error(error)
        }
      }
    )
  }

  await downloadFiles()
}
main()
