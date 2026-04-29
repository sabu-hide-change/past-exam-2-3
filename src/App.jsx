import { useState } from "react";

const questions = [
  {
    id: 1,
    topic: "税効果会計",
    year: "令和元年 第8問",
    question:
      "決算に当たり、期首に取得した備品1,200千円（耐用年数4年、残存価額ゼロ）について定額法で減価償却を行った。しかし、この備品の税法上の耐用年数は6年であった。このとき、計上される繰延税金資産または繰延税金負債の金額として、最も適切なものはどれか。なお、法人税等の実効税率は30％とする。また、期首における一時差異はないものとする。",
    options: [
      "繰延税金資産：30千円",
      "繰延税金資産：70千円",
      "繰延税金負債：30千円",
      "繰延税金負債：70千円",
    ],
    correctIndex: 0,
    explanation: `本問では、税効果会計と減価償却にかかわる計算について問われています。

【減価償却費の比較】
・決算（耐用年数4年）：1,200 ÷ 4 = 300千円/年
・税法（耐用年数6年）：1,200 ÷ 6 = 200千円/年
・差額：300 − 200 = 100千円

この差額100千円は「税法上の限度額を超える減価償却（損金不算入）」であり、「将来減算一時差異」に該当します。

【税効果の計算】
繰延税金資産 = 一時差異 × 実効税率
= 100千円 × 30% = 30千円

将来減算一時差異 → 繰延税金資産として計上

よって、繰延税金資産：30千円（選択肢ア）が正解です。`,
  },
  {
    id: 2,
    topic: "税効果会計",
    year: "平成29年 第6問",
    question:
      "税効果会計に関する記述として、最も適切なものはどれか。",
    options: [
      "受取配当金のうち益金に算入されない金額は、繰延税金負債を増加させる。",
      "交際費のうち損金に算入されない金額は、繰延税金資産を増加させる。",
      "税法の損金算入限度額を超える貸倒引当金繰入額は、繰延税金資産を減少させる。",
      "税法の損金算入限度額を超える減価償却費は、繰延税金資産を増加させる。",
    ],
    correctIndex: 3,
    explanation: `税効果会計には「一時差異」と「永久差異」があります。

【永久差異】収益または費用として計上するが、永久に益金・損金として扱われない差異。税効果会計は適用されない。
　→ 受取配当金の益金不算入（ア）、損金不算入の交際費（イ）

【将来減算一時差異】将来、税金負担を軽減できる差異 → 繰延税金資産を増加させる。
　→ 貸倒引当金繰入超過額（ウ）：増加させる（ウは「減少」と述べており不適切）
　→ 損金算入限度額を超える減価償却費（エ）：増加させる ✓

各選択肢の判定：
・ア：受取配当金の益金不算入 → 永久差異 → 税効果会計不適用（不適切）
・イ：交際費の損金不算入 → 永久差異 → 税効果会計不適用（不適切）
・ウ：貸倒引当金繰入超過額 → 将来減算一時差異 → 繰延税金資産「増加」（"減少"は不適切）
・エ：減価償却超過額 → 将来減算一時差異 → 繰延税金資産「増加」（適切）✓

よって、選択肢エが正解です。`,
  },
  {
    id: 3,
    topic: "税効果会計",
    year: "平成26年 第3問",
    question:
      "税効果会計における評価性引当額に関する記述として、最も適切なものはどれか。ただし、スケジューリング不能な一時差異に係る繰延税金資産は存在しない。",
    options: [
      "他の条件が一定のとき、将来における課税所得の減少は評価性引当額の増加を招く。",
      "他の条件が一定のとき、タックスプランニングの内容は評価性引当額に影響しない。",
      "他の条件が一定のとき、当期の業績低下は評価性引当額の増加を招く。",
      "他の条件が一定のとき、当期の繰越欠損金の発生は評価性引当額の減少を招く。",
    ],
    correctIndex: 0,
    explanation: `【評価性引当額とは】
繰延税金資産のうち回収可能性がないと会社が判断した金額のこと。将来減算一時差異または税務上の繰越欠損金等に対応させる十分な将来加算一時差異や課税所得がないことを指す。

各選択肢の判定：
・ア：将来の課税所得の減少 → 繰延税金資産の回収可能性が低下 → 評価性引当額「増加」（適切）✓
・イ：タックスプランニングは将来の法人税発生計画 → 評価性引当額に「影響する」（不適切）
・ウ：当期の業績低下は将来課税所得の減少を"可能性として示唆"するが、直接「評価性引当額が増加する」とは言えない（不適切）
・エ：繰越欠損金の発生と評価性引当額の「減少」は直接的に無関係（不適切）

よって選択肢アが正解です。`,
  },
  {
    id: 4,
    topic: "のれん",
    year: "平成28年 第3問",
    question:
      "のれんに関する記述として最も適切なものはどれか。",
    options: [
      "「中小企業の会計に関する指針」では、のれんの償却を行わないとしている。",
      "のれんとは、被合併会社から受け継ぐ総資産額が被合併会社の株主に交付される金額よりも大きいときに計上される。",
      "のれんの償却期間は最長5年である。",
      "のれんはマイナスの金額になることもあり、その場合、発生時の損益計算書に特別利益として計上される。",
    ],
    correctIndex: 3,
    explanation: `各選択肢の判定：

・ア：「中小企業の会計に関する指針」において、のれんの償却を行わないとする規定はない（不適切）

・イ：のれんは「買収価額 > 被買収企業の時価評価純資産」のときに計上される。
　　　設問は「総資産額」と記述しているが正しくは「時価評価純資産額」（不適切）

・ウ：「企業結合に関する会計基準」第32項より、のれんは「20年以内」に償却する。
　　　最長5年ではない（不適切）

・エ：負ののれん（買収価額 < 時価評価純資産）が生じることがある。
　　　「企業結合に関する会計基準」第48項により、負ののれんは発生時に損益計算書の「特別利益」として計上する（適切）✓

よって選択肢エが正解です。`,
  },
  {
    id: 5,
    topic: "連結会計",
    year: "令和元年 第3問",
    question:
      "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "Ａ社によるＢ社の議決権の所有割合が40％未満であっても、Ｂ社の財務および営業または事業の方針決定に対して重要な影響を与えることができる場合には、Ｂ社は子会社と判定される。",
      "非支配株主持分は、連結貸借対照表の純資産の部に表示される。",
      "持分法による投資利益（または損失）は、連結損益計算書の特別利益（または特別損失）の区分に表示される。",
      "連結貸借対照表は、親会社、子会社および関連会社の個別貸借対照表を合算し、必要な調整を加えて作成される。",
    ],
    correctIndex: 1,
    explanation: `各選択肢の判定：

・ア：40%未満での子会社判定には、A社以外の「緊密者」の議決権が必要。
　　　重要な影響力があるだけでは「関連会社」にはなるが「子会社」にはならない（不適切）
　　　※40〜50%の場合に、他の株主と合わせて支配力があれば子会社となる。

・イ：非支配株主持分は「連結B/Sの純資産の部」に計上する（適切）✓
　　　連結財務諸表の基本の流れ：①単純合算→②時価評価→③相殺消去→④非支配株主持分計上

・ウ：持分法投資損益は「営業外損益」として処理（経常損益の変動要因）。
　　　「特別利益・特別損失」ではない（不適切）

・エ：連結B/Sは「親会社＋子会社」の合算が基本。
　　　「関連会社」は合算せず持分法を適用する（不適切）

よって選択肢イが正解です。`,
  },
  {
    id: 6,
    topic: "連結会計",
    year: "令和5年 第4問",
    question:
      "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "親会社による子会社株式の所有割合が100%に満たない場合、連結貸借対照表の負債の部に非支配株主持分が計上される。",
      "子会社の決算日と連結決算日の差異が3か月を超えない場合は、子会社の正規の決算を基礎として連結決算を行うことができる。",
      "負ののれんは、連結貸借対照表に固定負債として計上する。",
      "連結子会社の当期純損益に株式の所有割合を乗じた額は、持分法による投資損益として連結損益計算書に計上する。",
    ],
    correctIndex: 1,
    explanation: `【重要用語の整理】
・非支配株主持分：連結子会社の資本のうち、親会社の持分に属しない部分
・負ののれん：発生事業年度の損益計算書において「特別利益」として計上

各選択肢の判定：

・ア：非支配株主持分は「負債の部」ではなく「純資産の部」に計上（不適切）

・イ：子会社の決算日が連結決算日と異なる場合、原則「仮決算」を行う。
　　　ただし、差異が3カ月を超えない場合は子会社の正規の決算を基礎として連結可能（適切）✓

・ウ：負ののれんは「固定負債」ではなく「損益計算書の特別利益」として計上（不適切）

・エ：持分法を適用するのは「関連会社」。設問は「連結子会社」としており不適切。
　　　連結子会社は全額連結で取り込む（不適切）

よって正解はイです。`,
  },
  {
    id: 7,
    topic: "買収会計",
    year: "平成30年 第4問",
    question:
      "Ａ社は、20X1年12月31日にＢ社株式の80％を85百万円で取得した。取得時のＢ社の貸借対照表は、資本金40百万円・利益剰余金40百万円（純資産合計80百万円）である。なお、Ｂ社の諸資産および諸負債の簿価は時価と一致している。取得時におけるのれんと非支配株主持分の金額の組み合わせとして、最も適切なものはどれか。",
    options: [
      "のれん：5百万円　　非支配株主持分：8百万円",
      "のれん：5百万円　　非支配株主持分：16百万円",
      "のれん：21百万円　　非支配株主持分：8百万円",
      "のれん：21百万円　　非支配株主持分：16百万円",
    ],
    correctIndex: 3,
    explanation: `【計算手順】

B社の純資産 = 資本金40百万円 + 利益剰余金40百万円 = 80百万円

■ のれんの計算
A社が取得したB社の価値（80%分）= 80百万円 × 80% = 64百万円
のれん = 取得金額 − A社持分の純資産
     = 85百万円 − 64百万円 = 21百万円

■ 非支配株主持分の計算
非支配株主持分 = 純資産 × （1 − 80%）
           = 80百万円 × 20% = 16百万円

【まとめ】
・のれん：21百万円
・非支配株主持分：16百万円

よって選択肢エが正解です。`,
  },
  {
    id: 8,
    topic: "本支店会計",
    year: "平成30年 第3問",
    question:
      "当社は本店のほかに支店があり、本支店間の債権債務は支店勘定および本店勘定により処理している。当月は以下の取引が生じた。月末時点における本店の支店勘定の残高として、最も適切なものを選べ。なお、月初の支店勘定および本店勘定の残高はゼロであり、月末における未達事項はない。\n\n（1）本店は支店の広告宣伝費30,000円を現金で支払った。\n（2）支店は本店の買掛金70,000円を現金で支払った。\n（3）本店は支店の売掛金15,000円を現金で回収した。\n（4）本店は原価60,000円の商品を支店に送付した。",
    options: [
      "貸方残高：45,000円",
      "貸方残高：115,000円",
      "借方残高：5,000円",
      "借方残高：75,000円",
    ],
    correctIndex: 2,
    explanation: `本店側の仕訳を確認します（「支店」勘定の動きに注目）：

（1）本店が支店の広告宣伝費30,000円を支払った
　→（本店）支店 30,000 ／ 現金 30,000　　【支店勘定 借方 +30,000】

（2）支店が本店の買掛金70,000円を支払った
　→（本店）買掛金 70,000 ／ 支店 70,000　【支店勘定 貸方 +70,000】

（3）本店が支店の売掛金15,000円を回収した
　→（本店）現金 15,000 ／ 支店 15,000　　【支店勘定 貸方 +15,000】

（4）本店が支店に商品60,000円を送付した
　→（本店）支店 60,000 ／ 商品 60,000　　【支店勘定 借方 +60,000】

【本店の支店勘定の合計】
借方：30,000 + 60,000 = 90,000円
貸方：70,000 + 15,000 = 85,000円
差引：90,000 − 85,000 = 5,000円（借方残高）

よって選択肢ウの借方残高：5,000円が正解です。`,
  },
  {
    id: 9,
    topic: "本支店会計",
    year: "令和3年 第2問",
    question:
      "本支店会計において本店集中計算制度を採用している場合、A支店がB支店の買掛金200,000円について小切手を振り出して支払ったときの本店の仕訳として、最も適切なものはどれか。",
    options: [
      "（借）A支店 200,000　（貸）B支店 200,000",
      "（借）B支店 200,000　（貸）A支店 200,000",
      "（借）買掛金 200,000　（貸）当座預金 200,000",
      "（借）現金 200,000　（貸）買掛金 200,000",
    ],
    correctIndex: 1,
    explanation: `【本店集中計算制度とは】
支店間の取引が「本店を経由して行われた」と考えて処理する方法。

今回の取引を本店経由で分解すると：

①B支店の仕訳（A支店の買掛金を本店経由で受け取った）
　（借）買掛金 200,000　（貸）本店 200,000

②A支店の仕訳（B支店へ小切手を本店経由で振り出した）
　（借）本店 200,000　（貸）当座預金 200,000

③本店の仕訳（上記取引を本店経由で処理）
　→ B支店が本店に対して貸しを持ち、A支店が本店に対して借りを持つ
　（借）B支店 200,000　（貸）A支店 200,000

よって選択肢イが正解です。`,
  },
];

const LABELS = ["ア", "イ", "ウ", "エ"];

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 4 }}>
        <span>進捗</span>
        <span>{current} / {total} 問</span>
      </div>
      <div style={{ background: "#e5e7eb", borderRadius: 8, height: 8 }}>
        <div
          style={{
            background: "linear-gradient(90deg, #3b82f6, #6366f1)",
            borderRadius: 8,
            height: 8,
            width: `${pct}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function Badge({ text, color }) {
  const colors = {
    blue: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    purple: { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
    green: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    red: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
    gray: { bg: "#f9fafb", text: "#374151", border: "#e5e7eb" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        marginRight: 6,
      }}
    >
      {text}
    </span>
  );
}

function QuestionCard({ q, index, total, onAnswer, answered, selected }) {
  const [showExplanation, setShowExplanation] = useState(false);

  const topicColor = {
    "税効果会計": "blue",
    "のれん": "purple",
    "連結会計": "green",
    "買収会計": "red",
    "本支店会計": "gray",
  }[q.topic] || "gray";

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", maxWidth: 780, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <Badge text={q.topic} color={topicColor} />
        <Badge text={q.year} color="gray" />
      </div>

      <ProgressBar current={index} total={total} />

      {/* Question */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <p style={{ fontSize: 15, color: "#1f2937", lineHeight: 1.8, whiteSpace: "pre-line", margin: 0 }}>
          <strong>問題 {q.id}</strong>　{q.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {q.options.map((opt, i) => {
          let bg = "#fff";
          let border = "1px solid #d1d5db";
          let color = "#1f2937";
          let icon = null;

          if (answered) {
            if (i === q.correctIndex) {
              bg = "#f0fdf4";
              border = "2px solid #22c55e";
              color = "#15803d";
              icon = "✓";
            } else if (i === selected && selected !== q.correctIndex) {
              bg = "#fef2f2";
              border = "2px solid #ef4444";
              color = "#b91c1c";
              icon = "✗";
            }
          } else if (selected === i) {
            bg = "#eff6ff";
            border = "2px solid #3b82f6";
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(i)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: bg,
                border,
                borderRadius: 10,
                padding: "14px 16px",
                cursor: answered ? "default" : "pointer",
                textAlign: "left",
                color,
                fontSize: 14,
                lineHeight: 1.7,
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  minWidth: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: answered && i === q.correctIndex ? "#22c55e" : answered && i === selected ? "#ef4444" : "#e5e7eb",
                  color: answered && (i === q.correctIndex || i === selected) ? "#fff" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {icon || LABELS[i]}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Result message */}
      {answered && (
        <div
          style={{
            background: selected === q.correctIndex ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${selected === q.correctIndex ? "#86efac" : "#fca5a5"}`,
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
            fontSize: 15,
            fontWeight: 600,
            color: selected === q.correctIndex ? "#15803d" : "#b91c1c",
          }}
        >
          {selected === q.correctIndex
            ? "🎉 正解！"
            : `❌ 不正解 （正解：${LABELS[q.correctIndex]}）`}
        </div>
      )}

      {/* Explanation toggle */}
      {answered && (
        <div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            style={{
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
              marginBottom: showExplanation ? 12 : 0,
              fontWeight: 600,
            }}
          >
            {showExplanation ? "▲ 解説を閉じる" : "▼ 解説を見る"}
          </button>
          {showExplanation && (
            <div
              style={{
                background: "#fafafa",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 20,
                fontSize: 14,
                lineHeight: 1.9,
                color: "#1f2937",
                whiteSpace: "pre-line",
              }}
            >
              {q.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultScreen({ answers, onRestart }) {
  const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 40,
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 56 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}</div>
        <h2 style={{ fontSize: 24, color: "#1f2937", margin: "12px 0 4px" }}>演習完了！</h2>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>過去問セレクト演習 2-3　税務・結合会計</p>

        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626",
            marginBottom: 8,
          }}
        >
          {correct} <span style={{ fontSize: 24, fontWeight: 400, color: "#6b7280" }}>/ {total}</span>
        </div>
        <div style={{ fontSize: 18, color: "#6b7280", marginBottom: 32 }}>正答率 {pct}%</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32, textAlign: "left" }}>
          {questions.map((q, i) => {
            const ok = answers[i] === q.correctIndex;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: ok ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                <span style={{ fontSize: 18 }}>{ok ? "✅" : "❌"}</span>
                <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>
                  問題{q.id}　{q.topic}（{q.year}）
                </span>
                <span style={{ fontSize: 12, color: ok ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                  {ok ? "正解" : `不正解（正解：${LABELS[q.correctIndex]}）`}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onRestart}
          style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "14px 40px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (i) => {
    setSelected(i);
    setAnswered(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = i;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setSelected(null);
    setAnswered(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "32px 16px" }}>
        <ResultScreen answers={answers} onRestart={handleRestart} />
      </div>
    );
  }

  const q = questions[currentIndex];
  const isLast = currentIndex + 1 >= questions.length;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "32px 16px" }}>
      {/* App header */}
      <div style={{ maxWidth: 780, margin: "0 auto 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: 0 }}>
          📝 過去問セレクト演習 2-3
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>税務・結合会計</p>
      </div>

      <QuestionCard
        q={q}
        index={currentIndex}
        total={questions.length}
        onAnswer={handleAnswer}
        answered={answered}
        selected={selected}
      />

      {/* Navigation */}
      {answered && (
        <div style={{ maxWidth: 780, margin: "20px auto 0", textAlign: "right" }}>
          <button
            onClick={handleNext}
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isLast ? "結果を見る →" : "次の問題 →"}
          </button>
        </div>
      )}
    </div>
  );
}