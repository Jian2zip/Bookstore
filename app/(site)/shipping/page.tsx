import type { Metadata } from "next";
import { TextPage, TextSection } from "@/components/TextPage";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "運送與付款",
  description: "減屋的寄送方式、訂購流程、付款方式與二手商品退換貨說明。",
  alternates: { canonical: "/shipping" },
};

// Draft copy — review before launch. Stage 6 lets the CMS fields
// (siteSettings.shippingNotes / returnsPolicy) replace these sections.
export default async function ShippingPage() {
  const s = await getSiteSettings();
  return (
    <TextPage title="運送與付款">
      <TextSection id="shipping" title="寄送">
        <p>寄送方式：{s.shipping.method}。</p>
        {s.shipping.dispatchTime && <p>出貨時間：{s.shipping.dispatchTime}。</p>}
      </TextSection>

      <TextSection id="ordering" title="訂購流程">
        <ol className="grid list-decimal gap-2 pl-5">
          <li>在商品頁按「Email 訂購」，或把訂購清單一次寄出。</li>
          <li>我們回信確認商品是否還在。</li>
          <li>回信告知付款方式。</li>
          <li>確認收款後，以{s.shipping.method}寄出。</li>
        </ol>
      </TextSection>

      <TextSection id="hold" title="不保留">
        <p>商品不保留，先確認付款者先得。</p>
        <p>多人同時詢問同一件商品時，我們會逐一回信告知結果；沒有買到的人會收到「已售出」通知。</p>
      </TextSection>

      <TextSection id="payment" title="付款">
        <p>付款方式一律在 Email 回覆中告知。網站上不會出現任何帳號或付款資訊；若有人以其他管道向你索取付款，請先來信確認。</p>
      </TextSection>

      <TextSection id="returns" title="退換貨">
        <p>二手商品的品相以商品頁的照片與說明為準，下單前請仔細確認；照片與說明已載明的瑕疵不在退換範圍內。</p>
        <p>
          若收到的商品與說明明顯不符，請在收到後 7 天內寄信到{" "}
          <a href={`mailto:${s.email}`} className="underline underline-offset-4">
            {s.email}
          </a>
          ，附上照片，我們會協助退貨或退款。
        </p>
      </TextSection>
    </TextPage>
  );
}
