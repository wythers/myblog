import defineConfig from "./src/main"

export default defineConfig({
  defaultlanguage: 'zh', // chinese and english supported
  defaultThemeModel: 'light',

  github: 'https://github.com/wythers',  // your github home link
  zhihu: 'https://zhihu.com/people/stayfoolish-91', // your zhihu home link
  twitter: '', // your twitter  home link,
  discord: '', // your discord home link

  email: 'wytherblog@gmail.com',
  codeRepository: 'https://github.com/wythers/myblog-code-examples',
  
  ICP: '豫ICP备2024068279号',  // ICP 
  ICPN: '2024068279',
  NISM: '豫公网安备41152602000261号', // National Internet Security Management
  NISMN: '41152602000261',

  language: [
    {
      lang: 'en',
      to: 'zh',
      host: `Wyther`,
      intro: `here is my site for exploring new ideas, experimenting with different techniques, and musing on best practices, 
      I hope my articles bring you new thinking.`,
      about: `My name is wyther yang. I'm an engineer working on Linux and the Web Platform. I program professionally since 2019,
      and unprofessionally since 2014 when I made my first shell code. My interests range from the system layer to middleware and finally to the application layer,
      from low latency apps to distributed apps and finally to graphics apps, from asm/c/c++ to golang and finally to javascript/typescript, that's all my way.`,
    },
    {
      lang: 'zh',
      to: 'en',
      host: '杨',
      intro: `这里是杨的私人网站，用于探索和记录新想法，尝试不同技术并思考最佳实践，希望我的文章能给你带来新思考。`,
      about: `嗨，你可以称呼我——杨，我是一名计算机工程师，工作在Linux和Web平台，2019年开始职业编程，我最早开始编程是在2012年，当时我使用Shell编写了我人生的第一个程序。
      我的兴趣范围从系统层到中间件最后到应用层，从低延迟应用到分布式应用最后到图形应用，从asm/c/c++到golang最后到javascript/typescript，都是我涉及的方向。` 
    }
  ]
});