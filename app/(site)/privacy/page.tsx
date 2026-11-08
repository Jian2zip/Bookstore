import type { Metadata } from "next";
import { ClearLocalData } from "@/components/ClearLocalData";
import { TextPage, TextSection } from "@/components/TextPage";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "減屋如何處理訂購時提供的個人資料，以及本站使用的瀏覽器儲存。",
  alternates: { canonical: "/privacy" },
};

// Draft copy — review before launch.
export default async function PrivacyPage() {
  const s = await getSiteSettings();
  return (
    <TextPage title="隱私權政策">
      <TextSection id="data" title="我們收集的資料">
        <p>只有在你訂購時，才會收到你主動提供的資料：姓名、Email、電話、取貨門市與備註。</p>
      </TextSection>

      <TextSection id="use" title="用途與保存">
        <p>這些資料只用於確認訂單、聯絡與寄送，保存在店家信箱與訂單紀錄表中。除了寄送所需（超商物流），不會提供給第三方。</p>
        <p>
          想查詢或刪除你的資料，請寄信到{" "}
          <a href={`mailto:${s.email}`} className="underline underline-offset-4">
            {s.email}
          </a>
          。
        </p>
      </TextSection>

      <TextSection id="cookies" title="Cookie 設定">
        <p>本站不使用追蹤或廣告 Cookie，也沒有第三方分析工具。</p>
        <p>只會在你的瀏覽器裡記住兩件事：深色或淺色主題，以及訂購清單。這些資料不會傳到伺服器。</p>
        <ClearLocalData label="清除本站在此瀏覽器儲存的資料" doneLabel="已清除" />
      </TextSection>
    </TextPage>
  );
}
