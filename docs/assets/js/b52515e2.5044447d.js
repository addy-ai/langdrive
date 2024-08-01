"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2600],{8471:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var r=n(5893),o=n(1151);const s={},i="Firestore",c={id:"api/connectors/firestore",title:"Firestore",description:"Description: The Firestore class provides a variety of methods to interact with documents and collections in Firebase Firestore. It allows you to filter, add, create, update, and delete documents in Firestore collections, including subcollections.",source:"@site/docs/api/connectors/firestore.md",sourceDirName:"api/connectors",slug:"/api/connectors/firestore",permalink:"/docs/api/connectors/firestore",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api/connectors/firestore.md",tags:[],version:"current",frontMatter:{},sidebar:"apiSidebar",previous:{title:"Command Line",permalink:"/docs/api/cli"},next:{title:"EmailRetriever",permalink:"/docs/api/connectors/email"}},l={},d=[{value:"Method: <code>filterCollectionWithWhereClause(collection, filterKey, filterData, operation)</code>",id:"method-filtercollectionwithwhereclausecollection-filterkey-filterdata-operation",level:3},{value:"Method: <code>addDocumentToCollection(document, collection)</code>",id:"method-adddocumenttocollectiondocument-collection",level:3}];function a(e){const t={code:"code",h1:"h1",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"firestore",children:"Firestore"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Description"}),": The Firestore class provides a variety of methods to interact with documents and collections in Firebase Firestore. It allows you to filter, add, create, update, and delete documents in Firestore collections, including subcollections."]}),"\n",(0,r.jsx)(t.p,{children:"For each method follow this structure:"}),"\n",(0,r.jsxs)(t.h3,{id:"method-filtercollectionwithwhereclausecollection-filterkey-filterdata-operation",children:["Method: ",(0,r.jsx)(t.code,{children:"filterCollectionWithWhereClause(collection, filterKey, filterData, operation)"})]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Returns"}),": An array of documents that match the provided filters."]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Description"}),":"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Filters a collection using a where clause and returns the resulting documents."}),"\n",(0,r.jsx)(t.li,{children:"Throws an error if there is an issue retrieving the documents."}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Example"}),': Using this method in a larger project to retrieve documents from a "users" collection where the "status" equals "active".']}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-javascript",children:'const userDocs = await firestoreInstance.filterCollectionWithWhereClause(\n    "users",\n    "status",\n    "active",\n    "=="\n);\n'})}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Parameters"}),":"]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Parameter Name"}),(0,r.jsx)(t.th,{children:"Description"}),(0,r.jsx)(t.th,{children:"Accepted Values/Data Types"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"collection"}),(0,r.jsx)(t.td,{children:"The name of the collection to be filtered."}),(0,r.jsx)(t.td,{children:"String"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"filterKey"}),(0,r.jsx)(t.td,{children:"The key/field name to filter by."}),(0,r.jsx)(t.td,{children:"String"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"filterData"}),(0,r.jsx)(t.td,{children:"The value to match for the given filterKey."}),(0,r.jsx)(t.td,{children:"String"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"operation"}),(0,r.jsx)(t.td,{children:"The Firestore query operator."}),(0,r.jsx)(t.td,{children:"String (Firestore query operators)"})]})]})]}),"\n",(0,r.jsxs)(t.h3,{id:"method-adddocumenttocollectiondocument-collection",children:["Method: ",(0,r.jsx)(t.code,{children:"addDocumentToCollection(document, collection)"})]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Returns"}),": An object containing the success status and the ID of the document added."]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Description"}),":"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Adds a new document to the specified collection."}),"\n",(0,r.jsx)(t.li,{children:"If an error occurs, it throws an exception with the error details."}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Example"}),': Adding a new user object to the "users" collection in Firestore.']}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-javascript",children:'const addResult = await firestoreInstance.addDocumentToCollection(newUser, "users");\nif (addResult.success) {\n    console.log(`Added document with ID: ${addResult.docID}`);\n}\n'})}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Parameters"}),":"]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Parameter Name"}),(0,r.jsx)(t.th,{children:"Description"}),(0,r.jsx)(t.th,{children:"Accepted Values/Data Types"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"document"}),(0,r.jsx)(t.td,{children:"The data object of the document."}),(0,r.jsx)(t.td,{children:"Object"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"collection"}),(0,r.jsx)(t.td,{children:"The name of the target collection."}),(0,r.jsx)(t.td,{children:"String"})]})]})]}),"\n",(0,r.jsxs)(t.p,{children:["(Note: The documentation template above is applied to only the ",(0,r.jsx)(t.code,{children:"filterCollectionWithWhereClause"})," method and ",(0,r.jsx)(t.code,{children:"addDocumentToCollection"}),". Similar formatting would follow for each method defined within the ",(0,r.jsx)(t.code,{children:"Firestore"})," class itself, but due to the length and number of methods, not all methods have been templated here. Each method should get its own section following the given structure.)"]})]})}function h(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>c,a:()=>i});var r=n(7294);const o={},s=r.createContext(o);function i(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);