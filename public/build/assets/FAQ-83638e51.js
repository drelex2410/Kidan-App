import{_ as c,o as a,g as r,i as e,F as d,k as u,t as p,B as h,h as g,w as m,l as y,ah as f,s as b,v as w}from"./app-86cd76e3.js";const v={name:"FAQPage",data(){return{activeFaq:null,faqs:[{question:"What is KIDANSTORE?",answer:"KIDANSTORE is a contemporary African lifestyle and fashion ecosystem offering curated fashion, beauty, home essentials, and luxury lifestyle products. We combine culture, craftsmanship, and modern living to deliver a refined shopping experience."},{question:"Where is KIDANSTORE based?",answer:"We are based across Africa with growing physical touchpoints, delivery partners, and pop-up experiences in key cities."},{question:"How do I place an order?",answer:"Simply browse our collections, add items to your cart, and checkout using your preferred payment option. You will receive an order confirmation immediately after purchase."},{question:"What payment methods do you accept?",answer:`We accept:
            <ul>
              <li>Debit and credit cards</li>
              <li>Bank transfers</li>
              <li>Mobile payments</li>
              <li>Paystack, Flutterwave, Stripe and Paypal</li>
              <li>Select wallet options</li>
              <li>KIDAN gift cards (coming soon)</li>
              <li>Instalment/BNPL options may be available depending on your location</li>
            </ul>`},{question:"How long does delivery take?",answer:`Delivery times vary by city and country, but most orders are fulfilled within:
            <ul>
              <li>1-3 days within major cities</li>
              <li>3-7 days nationwide</li>
              <li>7-14 days for regional/international delivery</li>
            </ul>
            You will receive tracking updates throughout the process.`},{question:"What are KIDAN Delivery Points?",answer:`KIDAN Delivery Points are approved partner locations where customers can:
            <ul>
              <li>Pick up orders</li>
              <li>Drop off returns</li>
              <li>And later, offer more connected local delivery</li>
            </ul>
            This helps reduce delays and creates a community-powered delivery network.`},{question:"Can I return or exchange items?",answer:"Yes. KIDANSTORE offers returns or exchanges within 7 days of receiving your order, as long as the item is unused, unwashed, and in original packaging.<br><br>(Certain products like beauty or intimate items may not be eligible.)"},{question:"Do you ship internationally?",answer:"Yes. We ship to selected countries. International customers will see shipping options at checkout."},{question:"How do I join the KIDAN Tribe?",answer:"All customers automatically join the KIDAN Tribe loyalty program.<br><br>Your membership tier grows as you shop, unlocking exclusive benefits, early access, rewards, and lifestyle perks."},{question:"What are the KIDAN Tribe tiers?",answer:`<ul>
              <li>KIDAN Tribe Member - Silver card</li>
              <li>KIDAN Tribe Insider - Gold Card</li>
              <li>KIDAN Tribe Maven - Black Card</li>
              <li>KIDAN Tribe Royal - Maroon VIP Card</li>
            </ul>
            Each tier offers increasing rewards, benefits, and exclusive access.`},{question:"How do I become a KIDAN Designer Partner?",answer:"Designers, brands, and creators can join KIDAN to distribute their fashion, beauty, home, or lifestyle products.<br><br>We seek emerging designers with mentorship and visibility.<br><br>Contact: <strong>Business@kidanstore.com</strong>"},{question:"How do I partner as an influencer or marketer?",answer:"Influencers, creators, and marketers can join the KIDAN Affiliates Program to earn commissions, access campaigns, and collaborate on brand storytelling.<br><br>Contact: <strong>Business@kidanstore.com</strong>"},{question:"What is the KIDAN Youth Program?",answer:"A development program for young Africans offering hands-on craftsmanship training, internships, business support, creative labs, and startup assistance."},{question:"How can I contact KIDANSTORE?",answer:`For general inquiries: <strong>hello@kidanglobal.com</strong><br>
            For support: <strong>support@kidanstore.com</strong><br>
            For press, partnerships, or wholesale, visit our Contact Page.`},{question:"Where can I follow KIDAN?",answer:`Instagram: <strong>@kidanstore</strong><br>
            TikTok: <strong>@kidanstore</strong><br>
            Website: <strong>www.kidanstore.com</strong>`}]}},methods:{toggleFaq(s){this.activeFaq=this.activeFaq===s?null:s}}},o=s=>(b("data-v-d2f50e0b"),s=s(),w(),s),_={class:"faq-page"},k=o(()=>e("div",{class:"page-header text-center mb-10"},[e("h1",{class:"text-h3 font-weight-bold mb-2"},"Frequently Asked Questions"),e("p",{class:"text-subtitle-1",style:{color:"#666"}},"You have questions? we have answers.")],-1)),I={class:"faq-content"},q=["onClick","aria-expanded"],A=o(()=>e("span",{class:"question-icon"},"Q",-1)),D={class:"question-text"},N=o(()=>e("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none"},[e("path",{d:"M5 7.5L10 12.5L15 7.5",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})],-1)),K=[N],F={key:0,class:"faq-answer"},T=["innerHTML"];function x(s,C,S,W,i,l){return a(),r("div",_,[k,e("div",I,[(a(!0),r(d,null,u(i.faqs,(n,t)=>(a(),r("div",{key:t,class:"faq-item mb-4"},[e("button",{class:"faq-question",onClick:P=>l.toggleFaq(t),"aria-expanded":i.activeFaq===t},[A,e("span",D,p(n.question),1),e("span",{class:h(["toggle-icon",{active:i.activeFaq===t}])},K,2)],8,q),g(f,{name:"fade-slide"},{default:m(()=>[i.activeFaq===t?(a(),r("div",F,[e("div",{innerHTML:n.answer},null,8,T)])):y("",!0)]),_:2},1024)]))),128))])])}const H=c(v,[["render",x],["__scopeId","data-v-d2f50e0b"]]);export{H as default};
