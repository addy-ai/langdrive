"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9907],{9542:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>l,metadata:()=>t,toc:()=>d});var i=n(5893),r=n(1151);const l={},o="LLM Tools",t={id:"overview/llmtools",title:"LLM Tools",description:"Welcome to the LLM Overview! Here, we delve into the intricacies and unique features of several Node.js classes. Our goal is to offer you an engaging and informative guide through their functionalities and capabilities, making your development journey both efficient and enjoyable.",source:"@site/docs/overview/llmtools.md",sourceDirName:"overview",slug:"/overview/llmtools",permalink:"/docs/overview/llmtools",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/overview/llmtools.md",tags:[],version:"current",frontMatter:{},sidebar:"apiSidebar",previous:{title:"Data Connectors",permalink:"/docs/overview/dataconnectors"},next:{title:"FAQ",permalink:"/docs/overview/faq"}},c={},d=[{value:"HuggingFace Class Overview",id:"huggingface-class-overview",level:2},{value:"Class: <code>HuggingFace</code>",id:"class-huggingface",level:3},{value:"Constructor",id:"constructor",level:4},{value:"Key Methods",id:"key-methods",level:4},{value:"HerokuHandler Class Overview",id:"herokuhandler-class-overview",level:2},{value:"Class: <code>HerokuHandler</code>",id:"class-herokuhandler",level:3},{value:"Constructor",id:"constructor-1",level:4},{value:"Key Methods",id:"key-methods-1",level:4},{value:"NPM: Langdrive: DriveChatbot Class Overview",id:"npm-langdrive-drivechatbot-class-overview",level:2},{value:"Chatbot",id:"chatbot",level:3},{value:"Train Class Overview",id:"train-class-overview",level:2},{value:"Class: <code>Train</code>",id:"class-train",level:3},{value:"Constructor",id:"constructor-2",level:4},{value:"Key Methods",id:"key-methods-2",level:4},{value:"Utils Script Overview",id:"utils-script-overview",level:2},{value:"Script: <code>utils</code>",id:"script-utils",level:3},{value:"Main Functions",id:"main-functions",level:4},{value:"Modules",id:"modules",level:4}];function a(e){const s={blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.h1,{id:"llm-tools",children:"LLM Tools"}),"\n",(0,i.jsx)(s.p,{children:"Welcome to the LLM Overview! Here, we delve into the intricacies and unique features of several Node.js classes. Our goal is to offer you an engaging and informative guide through their functionalities and capabilities, making your development journey both efficient and enjoyable."}),"\n",(0,i.jsx)(s.h2,{id:"huggingface-class-overview",children:"HuggingFace Class Overview"}),"\n",(0,i.jsxs)(s.h3,{id:"class-huggingface",children:["Class: ",(0,i.jsx)(s.code,{children:"HuggingFace"})]}),"\n",(0,i.jsxs)(s.p,{children:["The ",(0,i.jsx)(s.code,{children:"HuggingFace"})," class is your gateway to interacting with the innovative Hugging Face API. From validating tokens and managing repositories to uploading files and performing model inference, this class is equipped to handle it all with ease."]}),"\n",(0,i.jsx)(s.h4,{id:"constructor",children:"Constructor"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters"}),":","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"accessToken"})," (String): Your key to access the diverse features of the Hugging Face API."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"defaultOptions"})," (Object): Customize the class behavior to suit your needs."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"key-methods",children:"Key Methods"}),"\n",(0,i.jsxs)(s.blockquote,{children:["\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"tokenIsValid()"}),":"]})," Wondering about your token's validity? This method swiftly confirms it for you."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"hubExists()"}),":"]})," Check if your desired hub is up and running with a simple call."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"questionAnswering(model, inputs)"}),":"]})," Dive into AI-driven question answering with your chosen model."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"createRepo(repoPath, type)"}),":"]})," Setting up a new repository is just a few parameters away."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"uploadFile(repoPath, filePath, blob)"}),":"]})," Easily upload files to your repository in the Hugging Face hub."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"deleteFiles(type, name, paths)"}),":"]})," Need to clear some space? Delete files seamlessly with this method."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"herokuhandler-class-overview",children:"HerokuHandler Class Overview"}),"\n",(0,i.jsxs)(s.h3,{id:"class-herokuhandler",children:["Class: ",(0,i.jsx)(s.code,{children:"HerokuHandler"})]}),"\n",(0,i.jsxs)(s.p,{children:["Embark on a smooth journey with Heroku using the ",(0,i.jsx)(s.code,{children:"HerokuHandler"})," class. It simplifies interactions with the Heroku API, ensuring you can check installation and login statuses effortlessly."]}),"\n",(0,i.jsx)(s.h4,{id:"constructor-1",children:"Constructor"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters"}),":","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"props"})," (Object): All you need to connect - Heroku API key, username, and password."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"key-methods-1",children:"Key Methods"}),"\n",(0,i.jsxs)(s.blockquote,{children:["\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"checkInstall()"}),":"]})," Quickly verify if Heroku CLI is part of your toolkit."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"checkLogin()"}),":"]})," Log in hassles? This method ensures you're connected to Heroku."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"handleHeroku(args)"}),":"]})," Manage your Heroku setup and status with this comprehensive function."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"npm-langdrive-drivechatbot-class-overview",children:"NPM: Langdrive: DriveChatbot Class Overview"}),"\n",(0,i.jsx)(s.h3,{id:"chatbot",children:"Chatbot"}),"\n",(0,i.jsxs)(s.p,{children:["Primarily for demonstration and testing purposes. Engage with the ",(0,i.jsx)(s.code,{children:"DriveChatbot"}),", where Async Promises bring your chatbot interactions to life."]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"train-class-overview",children:"Train Class Overview"}),"\n",(0,i.jsxs)(s.h3,{id:"class-train",children:["Class: ",(0,i.jsx)(s.code,{children:"Train"})]}),"\n",(0,i.jsxs)(s.p,{children:["The ",(0,i.jsx)(s.code,{children:"Train"})," class is your companion in the realm of machine learning. It's designed to streamline the training process of your models and manage data sources efficiently."]}),"\n",(0,i.jsx)(s.h4,{id:"constructor-2",children:"Constructor"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters"}),": ",(0,i.jsx)(s.code,{children:"props"})," (Object): Fine-tune your training experience with verbose and train options."]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"key-methods-2",children:"Key Methods"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"init(config)"}),":"]})," Initializes the class and prepares data."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"trainModel(huggingfaceInfo)"}),":"]})," Manages the model training process."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"prepareData()"}),":"]})," Prepares training data."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"getDataFromUrl(url)"}),":"]})," Fetches data from a URL."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"getDataFromService(classInstance, query)"}),":"]})," Retrieves data using a service class."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"getValuesFromData(data, value)"}),":"]})," Extracts specific values from data."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"getData(lbl)"}),":"]})," General method for data retrieval."]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"utils-script-overview",children:"Utils Script Overview"}),"\n",(0,i.jsxs)(s.h3,{id:"script-utils",children:["Script: ",(0,i.jsx)(s.code,{children:"utils"})]}),"\n",(0,i.jsxs)(s.p,{children:["This Node.js script is essential for deploying machine learning models. It utilizes key libraries like ",(0,i.jsx)(s.code,{children:"fs"}),", ",(0,i.jsx)(s.code,{children:"path"}),", ",(0,i.jsx)(s.code,{children:"js-yaml"}),", and ",(0,i.jsx)(s.code,{children:"dotenv"})," for various file operations, path resolution, YAML processing, and environment variable management."]}),"\n",(0,i.jsx)(s.h4,{id:"main-functions",children:"Main Functions"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"cli_deploy(args)"})}),": Entry point for deploying the model. Manages deployment initiation and configuration retrieval."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"deploy(config)"})}),": Handles the core deployment process of the machine learning model."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"getConfig(args)"})}),": Retrieves deployment configurations from a YAML file."]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"modules",children:"Modules"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"fs"})}),": Handles file system operations."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"path"})}),": Manages file paths."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"js-yaml"})}),": Processes YAML files."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"dotenv"})}),": Loads environment variables."]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},1151:(e,s,n)=>{n.d(s,{Z:()=>t,a:()=>o});var i=n(7294);const r={},l=i.createContext(r);function o(e){const s=i.useContext(l);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(l.Provider,{value:s},e.children)}}}]);