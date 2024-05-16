# myblog front-end

## config
```mdx
import defineConfig from "./src/main"

export default defineConfig({
  defaultlanguage: 'en', // en | zh
  defaultThemeModel: 'light', // light | dark

  github: 'https://github.com/wythers',  // your github home link
  zhihu: 'https://zhihu.com/people/stayfoolish-91', // your zhihu home link
  twitter: '', // your twitter  home link,
  discord: '', // your discord home link

  email: 'wytherblog@gmail.com',
  
  language: [
    {
      lang: 'en',
      to: 'zh',
      host: `Wyther`,
      intro: `here is my site for exploring new ideas...`,
    },
    {
      lang: 'zh',
      to: 'en',
      host: '杨',
      intro: `杨的私人网站，用于探索和记录新想法，尝试不同技术并思考最佳实践，希望我的文章能给你带来新思考。`,
      about: `嗨，你可以....` 
    }
  ]
});

```

## build
```shell
npm run build
```