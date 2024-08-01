"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5407],{6423:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>a,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var s=o(5893),t=o(1151);const r={},i="Contributing",c={id:"overview/contributors",title:"Contributing",description:"Thank you for the interest! We would love to see a PR!",source:"@site/docs/overview/contributors.md",sourceDirName:"overview",slug:"/overview/contributors",permalink:"/docs/overview/contributors",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/overview/contributors.md",tags:[],version:"current",frontMatter:{},sidebar:"apiSidebar",previous:{title:"DriveChatbot",permalink:"/docs/api/llmtools/chatbot"}},l={},d=[{value:"Docs",id:"docs",level:3}];function u(e){const n={code:"code",h1:"h1",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"contributing",children:"Contributing"}),"\n",(0,s.jsx)(n.p,{children:"Thank you for the interest! We would love to see a PR!"}),"\n",(0,s.jsxs)(n.p,{children:["At the moment the CLI only supports the ",(0,s.jsx)(n.code,{children:"deploy"})," command:"]}),"\n",(0,s.jsx)(n.p,{children:"main.js"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"#!/usr/bin/env node\nif (process.argv.length >= 3 && process.argv[2] === 'deploy') {\n  console.log('test');\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"To help with your development, these command may help:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"npm link --loglevel verbose"})," - Uses loads the current repo and a npm module."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"npm unlink langdrive"})," - Unlink for good measure"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"npm unlink langdrive, npm link --loglevel verbose"})," - Do both"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"docs",children:"Docs"}),"\n",(0,s.jsx)(n.p,{children:"Two bash scripts exist to help with the development of our docs."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"pip install mkdocs"})," - Installs mkdocs"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"npm run serveDocs"})," - Serves .md files from ./docs using mkdocs' dev server"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"npm run buildDocs"})," - Builds the site using ./docs' for use in github pages"]}),"\n"]})]})}function a(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},1151:(e,n,o)=>{o.d(n,{Z:()=>c,a:()=>i});var s=o(7294);const t={},r=s.createContext(t);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);