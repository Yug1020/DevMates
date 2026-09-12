import { ArrowRight, Bolt, Check, CircleAlert, Megaphone, Receipt, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_BASE_URL } from "../util/constant";
import { useState } from "react";
import { useEffect } from "react";

const DevMatesPro = () => {

  const [ isPro, setIsPro ] = useState(false)
  const [ orderId, setOrderId ] = useState("")
  const [ method, setMethod ] = useState("")

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async() => {
    try{
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }    

    const res = await axios.post(
        `${API_BASE_URL}/razorpay/createOrder`,
        {},
        { withCredentials: true }
      );

    const orderData = res.data;

    var options = {
      "key": orderData.key,
      "currency": "INR",
      "name": "DevMates", 
      // "image": "https://example.com/your_logo",
      "order_id": orderData.orderReq.id, 
      // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
      "prefill": {
          "name": orderData.orderReq.notes.firstName + " " + orderData.orderReq.notes.lastName,
          "email": orderData.orderReq.notes.email,
          "contact": orderData.orderReq.notes.phone 
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#10b981"
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert(`Payment failed: ${response.error.description}`);

      //NOT USING TOAST BCOZ IT SHOW IN BACKGROUND OF RAZORPAY POPUP ALERT WORK PERFETLY HERE
      // setTimeout(() => {
      //   toast.error(`Payment failed:${response.error.description}`, {
      //     style: {
      //       background: 'rgba(255, 218, 214, 0.1)',
      //       border: '1px solid rgba(255, 180, 171, 0.3)',
      //       color: '#ffb4ab',
      //       padding: '12px',
      //       borderRadius: '4px',
      //       fontSize: '12px',
      //       fontFamily: 'monospace',
      //     },
      //     iconTheme: {
      //       primary: '#ffb4ab',
      //       secondary: '#1c1211',
      //     },
      //   });        
      // },600)
    });

    rzp.open();  
    }catch (err) {
      console.error("Error initiating payment:", err);
    }  
  }

  useEffect(() => {
    axios
    .get(API_BASE_URL + "/razorpay/verifyPayment", {withCredentials:true})
    .then((res) => {
      console.log(res)
      if(res.data.isPremium){
        setIsPro(true)
        setOrderId(res.data.payload.orderId)
        setMethod(res.data.payload.method)
      }})
    .catch((err) => {console.log(err)})
  },[])

  return (
    isPro ? (
      <section className="min-h-[calc(100vh-4rem)] bg-[#0a0e13] px-4 py-7 text-[#dde4dd] sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-mono-code text-[11px] font-semibold tracking-wide text-[#a6b5aa] mb-5">
            ~/workspace/devmates
          </p>

          {/* Top Hero Status Banner */}
          <div className="rounded-xl border border-[#1b2b22] bg-[#0c140f] p-5 sm:p-7 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono-code text-[11px] pb-3">
              <div className="flex items-center gap-0.5 sm:gap-1.5 ">
                <span className="text-[#6f7c73]">~/</span>
                <span className="text-[#86948a]">billing</span>
                <span className="text-[#6f7c73]">/</span>
                <span className="text-[#4edea3] font-bold">checkout_success</span>
                <span className="text-[#6f7c73]">::</span>
                <span className="text-[#86948a]">SESSION_200_OK</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#234333] bg-[#10241b] px-3 py-1 font-mono-code text-[10px] font-bold tracking-wider text-[#4edea3]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
                </span>
                <span>PRO_NODE_ACTIVE // ACCESS_LEVEL: FULL_TIER</span>
              </div>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#e1e7e1] flex items-center flex-wrap gap-2">
              <span>You're now a</span>
              <span className="text-[#4edea3] underline decoration-[#258461] underline-offset-4">DevMates Pro</span>
              <span>Member</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4edea3] text-[#082317] ml-1">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm font-mono-code leading-relaxed text-[#b5c4b9] max-w-3xl">
              Order <strong className="font-bold text-[#dde4dd]">{orderId}</strong> confirmed. <span className="text-[#4edea3]">₹10</span> billed via <span className="capitalize">{method}</span>. Your pro credentials, accelerated matching queue, and developer status have been provisioned across the cluster.
            </p>

            {/* 3 Metric Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-code">
              <div className="rounded border border-[#1b2720] bg-[#08100b] p-3.5">
                <span className="block text-[10px] font-semibold text-[#6f7c73] tracking-wider uppercase mb-1">STATUS</span>
                <div className="flex items-center gap-2 text-xs font-bold text-[#4edea3]">
                  <span className="h-2 w-2 rounded-full bg-[#4edea3]"></span>
                  <span>ACTIVE_PREMIUM</span>
                </div>
              </div>

              <div className="rounded border border-[#1b2720] bg-[#08100b] p-3.5">
                <span className="block text-[10px] font-semibold text-[#6f7c73] tracking-wider uppercase mb-1">VALIDITY</span>
                <span className="text-xs font-bold text-[#dde4dd]">Lifetime Validity</span>
              </div>

              <div className="rounded border border-[#1b2720] bg-[#08100b] p-3.5">
                <span className="block text-[10px] font-semibold text-[#6f7c73] tracking-wider uppercase mb-1">RATE_LIMIT</span>
                <span className="text-xs font-bold text-[#dde4dd]">UNLIMITED_IO</span>
              </div>
            </div>
          </div>

          {/* Lower Grid Cards */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Receipt Summary Card */}
            <div className="lg:col-span-7 rounded-xl border border-[#1b2b22] bg-[#0c140f] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#1b2620]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-[#152e22] text-[#4edea3]">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#e1e7e1]">Receipt Summary</h3>
                      <p className="font-mono-code text-[10px] text-[#6f7c73]">TXN_STAMP: 2025-05-18T14:32:09Z</p>
                    </div>
                  </div>

                  <span className="font-mono-code text-[10px] font-bold px-2.5 py-1 rounded bg-[#133022] border border-[#234d38] text-[#4edea3] tracking-wider">
                    PAID
                  </span>
                </div>

                {/* Table details */}
                <div className="mt-4 space-y-3 font-mono-code text-xs">
                  <div className="flex items-center justify-between text-[#b5c4b9]">
                    <span className="text-[#86948a]">Tier Subscription</span>
                    <span className="font-semibold text-[#dde4dd]">Early Builder Pass (Monthly)</span>
                  </div>

                  <div className="flex items-center justify-between text-[#b5c4b9]">
                    <span className="text-[#86948a]">Invoice Number</span>
                    <span className="font-semibold text-[#dde4dd]">{orderId}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#b5c4b9]">
                    <span className="text-[#86948a]">Payment Method</span>
                    <span className="font-semibold text-[#dde4dd] flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-[#234d38] bg-[#10241b] text-[#4edea3] text-[9px] ">💳</span>
                      <span className="capitalize">{method}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#b5c4b9]">
                    <span className="text-[#86948a]">Billing Cycle</span>
                    <span className="font-semibold text-[#dde4dd]">Lifetime Validity</span>
                  </div>
                </div>
              </div>

              {/* Total Settled */}
              <div className="mt-6 pt-4 border-t border-[#1b2620] flex items-center justify-between">
                <span className="font-bold text-sm text-[#e1e7e1]">Total Settled</span>
                <span className="text-xl sm:text-2xl font-bold font-mono-code text-[#4edea3]">₹10.00</span>
              </div>
            </div>

            {/* Notice Card */}
            <div className="lg:col-span-5 rounded-xl border border-[#1b2b22] bg-[#0c140f] p-5 sm:p-6 shadow-xl flex flex-col justify-start">
              <div className="flex items-center gap-2.5 font-mono-code text-xs font-bold text-[#38bdf8] mb-3">
                <div className="p-1.5 rounded bg-[#0f2838] text-[#38bdf8]">
                  <Megaphone className="w-4 h-4" />
                </div>
                <span>[NOTICE] FULL_PERKS_SCHEDULED_ROLLOUT</span>
              </div>

              <p className="text-xs sm:text-sm font-mono-code leading-relaxed text-[#b5c4b9]">
                Full perks related to DevMates Pro will be announced soon. You are holding an early genesis node with guaranteed grandfathered pricing of ₹10/cycle for continuous membership.
              </p>
            </div>
          </div>
        </div>
      </section>
    ) : (
    <section className="min-h-[calc(100vh-4rem)] bg-[#0a0e13] px-4 py-7 text-[#dde4dd] sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto w-full">
        <p className="font-mono-code text-[11px] font-semibold tracking-wide text-[#a6b5aa]">
          ~/subscription/DevMates_Pro
        </p>
        <div className="flex flex-col items-center justify-center">
          <header className="mx-auto mt-10 max-w-3xl text-center sm:mt-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1a3328] px-3 py-1 font-mono-code text-[10px] font-bold tracking-wide text-[#4edea3]">
              <Bolt className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>DEVMATES_PRO&nbsp; // &nbsp;ACCESS_GRANT</span>
            </div>

            <h1 className="mt-5 text-[27px] font-semibold leading-tight tracking-[-0.045em] text-[#e0e7e0] sm:text-[33px]">
              Supercharge your build journey with{" "}
              <span className="relative whitespace-nowrap text-[#37d998]">
                DevMates Pro
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#258461]" />
              </span>
            </h1>

            <p className="font-mono-code mx-auto mt-4 max-w-2xl text-[11px] leading-5 text-[#b5c4b9] sm:text-xs">
              Accelerate your growth, match faster with top engineers, and unlock dedicated
              <br className="hidden sm:block" /> high-velocity dev environments.
            </p>

            {/* <p className="font-mono-code mx-auto mt-4 inline-flex max-w-full items-center gap-1.5 rounded-sm bg-[#26312a] px-2 py-1 text-[10px] leading-4 text-[#c0cbc2] sm:text-[11px]">
              <Sparkles className="h-3 w-3 shrink-0 text-[#4edea3]" aria-hidden="true" />
              <span><strong className="font-bold text-[#51dba1]">[NOTICE]</strong> Full perks related to DevMates Pro will be announced soon</span>
            </p> */}
          </header>

          <article className="mt-7 rounded-lg border border-[#202c25] bg-[#1b231e] p-4 shadow-[0_14px_28px_rgba(0,0,0,0.16)] sm:mt-8 sm:p-5">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_355px] lg:gap-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#173c2d] px-1.5 py-1 font-mono-code text-[10px] font-bold tracking-wide text-[#4edea3]">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  <span className="text-[#ffbc48]">ϟ</span>
                  <span>PRE-BOOK OFFER</span>
                </div>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[#e1e7e1] sm:text-[21px]">
                  Community Tier Access Pass
                </h2>
                <p className="mt-1.5 max-w-[570px] text-[13px] leading-5 text-[#c3cdc5] sm:text-sm">
                  Gain immediate full-tier credentials across the ecosystem. Dedicated servers,
                  instant pair queues, and auto-credential sync for the price of a cutting chai.
                </p>

                <div className="font-mono-code mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold tracking-wide text-[#b9c7bc] sm:text-[11px]">
                  <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4edea3]" /> Instant Activation</span>
                  <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4edea3]" /> No Lock-in Contracts</span>
                  <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4edea3]" /> Full Future Nodes</span>
                </div>
              </div>

              <div className="rounded border border-[#1a2720] bg-[#09100c] p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono-code text-[10px] font-medium tracking-[0.12em] text-[#9aa99e]">EARLY BUILDER TIER</p>
                    <div className="mt-0.5 flex items-end gap-2">
                      <span className="text-[34px] font-bold leading-none tracking-[-0.05em] text-[#4edea3]">₹ 10</span>
                      <span className="font-mono-code mb-0.5 text-[10px] font-semibold text-[#bdc7bf]">/- only</span>
                      <span className="font-mono-code mb-0.5 text-[10px] text-[#6f7c73] line-through">₹499</span>
                    </div>
                  </div>
                  <span className="font-mono-code rounded-sm bg-[#153b2b] px-2 py-1 text-[10px] font-bold text-[#4edea3]">SAVE 98%</span>
                </div>

                <Button onClick={createOrder} className="mt-4 h-8 w-full rounded-sm bg-[#4edea3] text-xs font-bold text-[#082317] shadow-none hover:bg-[#6ffbbe]">
                  Upgrade to Pro for ₹10 <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
                <p className="font-mono-code mt-3 text-center text-[10px] leading-4 tracking-wide text-[#91a096]">
                  Instant Activation · Secure UPI / Card ·<br className="sm:hidden" /> Cancel Anytime
                </p>
              </div>
            </div>

            <div className="font-mono-code mt-4 flex items-center gap-1.5 border-t border-[#26332b] pt-3 text-[10px] font-semibold tracking-wide text-[#b6c1b8] sm:text-[11px]">
              <CircleAlert className="h-3.5 w-3.5 shrink-0 text-[#4edea3]" aria-hidden="true" />
              <span>Perks related to DevMates Pro will be announced soon</span>
            </div>
          </article>
        </div>  
      </div>
    </section>
    )
  );
};

export default DevMatesPro;
