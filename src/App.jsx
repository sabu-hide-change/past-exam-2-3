import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckSquare, 
  ArrowRight,
  List,
  Trophy,
  Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// --- データ定義 (全16問: 2-3 税務・結合・本支店会計) ---

const problemData = [
  {
    id: 1,
    category: "税効果会計",
    question: "税効果会計に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n将来減算一時差異とは、当該一時差異が解消されるときに課税所得を（　Ａ　）する効果を持つ。また将来加算一時差異とは、当該一時差異が解消されるときに課税所得を（　Ｂ　）する効果を持つ。将来加算一時差異では、一時的な差異を（　Ｃ　）として（　Ｄ　）の部に計上する。",
    options: [
      "Ａ：増額　Ｂ：減額　Ｃ：繰延税金負債　Ｄ：貸借対照表の負債",
      "Ａ：減額　Ｂ：増額　Ｃ：繰延税金負債　Ｄ：貸借対照表の負債",
      "Ａ：減額　Ｂ：増額　Ｃ：繰延税金資産　Ｄ：貸借対照表の資産",
      "Ａ：増額　Ｂ：減額　Ｃ：繰延税金資産　Ｄ：貸借対照表の負債"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <div class="my-3 overflow-x-auto border rounded-lg text-xs">
        <table class="min-w-full text-left">
          <thead class="bg-orange-50 font-bold border-b">
            <tr>
              <th class="p-2 border-r">一時差異</th>
              <th class="p-2 border-r">解消時の効果</th>
              <th class="p-2">仕訳科目 (区分)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="p-2 border-r">将来減算一時差異</td>
              <td class="p-2 border-r text-red-600">減額(A)</td>
              <td class="p-2">繰延税金資産 (資産)</td>
            </tr>
            <tr>
              <td class="p-2 border-r">将来加算一時差異</td>
              <td class="p-2 border-r text-blue-600">増額(B)</td>
              <td class="p-2 font-bold">繰延税金負債(C) (負債D)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mb-2"><strong>将来減算一時差異：</strong> 将来の税負担を減らす「税金の前払い」的な性格から、資産として計上します。</p>
      <p><strong>将来加算一時差異：</strong> 将来の税負担を増やす「税金の未払い」的な性格から、負債として計上します。</p>
    `
  },
  {
    id: 2,
    category: "一時差異と永久差異",
    question: "将来減算一時差異、将来加算一時差異、永久差異の説明として、最も適切なものはどれか。",
    options: [
      "将来減算一時差異の具体的な項目として、減価償却費の損金算入限度超過額、交際費の損金不算入額が挙げられる。",
      "将来減算一時差異の具体的な項目として、貸倒引当金の損金算入限度超過額、減価償却費の損金算入限度超過額が挙げられる。",
      "将来加算一時差異の具体的な項目として、貸倒引当金の損金算入限度超過額、寄付金の損金不算入額が挙げられる。",
      "永久差異の具体的な項目として、受取配当金の益金不算入額、貸倒引当金等の引当金の損金不算入額が挙げられる。"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <ul class="space-y-2 text-sm">
        <li><strong>ア ×：</strong> 「交際費の損金不算入額」は<strong>永久差異</strong>です。</li>
        <li class="text-blue-700 font-bold"><strong>イ ○：</strong> 貸倒引当金や減価償却費の超過額は、今期は認められなくても将来認められるため「一時差異」となります。</li>
        <li><strong>ウ ×：</strong> 寄付金は原則「永久差異」です。</li>
        <li><strong>エ ×：</strong> 引当金の損金不算入額は「一時差異」です。</li>
      </ul>
    `
  },
  {
    id: 3,
    category: "税務調整の計算",
    question: "当期の税引前当期純利益は 2,400,000円、受取配当金の益金不算入額が 72,000円、貸倒引当金の損金算入が 30,000円、法人税率を20%とするとき、当期の法人税額はいくらか。",
    options: [
      "459,600円",
      "480,000円",
      "493,200円",
      "500,400円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <div class="bg-blue-50 p-4 rounded text-sm">
        <p>1. 利益： 2,400,000</p>
        <p>2. 益金不算入： △72,000 (引く)</p>
        <p>3. 損金算入： △30,000 (引く)</p>
        <p class="border-t border-blue-200 mt-1 pt-1"><strong>課税所得： 2,298,000</strong></p>
        <p class="text-lg font-bold text-blue-700 mt-2">税額： 2,298,000 × 20% = 459,600円</p>
      </div>
    `
  },
  {
    id: 4,
    category: "合併会計",
    question: "合併時の会計処理に関する次の空欄に入る語句として適切なものを選べ。\n\n合併企業が取得した資産等を（　Ｂ　）で評価し、買収純資産と買収価額の差額を（　Ｃ　）という勘定に計上する。なお（　Ｃ　）は（　Ｄ　）年以内に償却する。",
    options: [
      "Ｂ：簿価　Ｃ：のれん　Ｄ：20",
      "Ｂ：時価　Ｃ：非支配株主持分　Ｄ：20",
      "Ｂ：時価　Ｃ：のれん　Ｄ：20",
      "Ｂ：簿価　Ｃ：のれん　Ｄ：10"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p>現代の企業結合会計（パーチェス法）では、資産・負債を<strong>時価</strong>で評価します。その際の差額である<strong>のれん</strong>は、<strong>20年以内</strong>に償却します。</p>
    `
  },
  {
    id: 5,
    category: "のれんの計算",
    question: "Ａ社はＢ社を吸収合併した。Ｂ社の合併時資産時価は 7,000万円、負債時価は 4,000万円であった。Ａ社が「のれん」2,000万円を計上した場合、Ａ社の支払った取得原価（対価）はいくらか。",
    options: [
      "2,000万円",
      "3,000万円",
      "4,000万円",
      "5,000万円"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <div class="space-y-2 text-sm">
        <p>1. 時価純資産 = 資産(7,000) - 負債(4,000) = 3,000万円</p>
        <p>2. のれん = 取得原価 - 時価純資産</p>
        <p class="font-bold">2,000 = 取得原価 - 3,000</p>
        <p class="text-lg text-blue-600 font-bold">取得原価 = 5,000万円</p>
      </div>
    `
  },
  {
    id: 6,
    category: "連結の範囲",
    question: "連結会計における子会社の判定について、不適切な記述はどれか。\n・P社はB社を80%保有、D社を49%保有。\n・B社はC社を70%保有、A社を30%保有。\n・P社はD社の意思決定機関を支配している。",
    options: [
      "P社にとってA社は子会社である。",
      "P社にとってC社は子会社である。",
      "P社にとってE社（P社20%・B社10%保有）は子会社でない。",
      "P社にとってD社は子会社でない。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="text-sm mb-2">「支配力基準」では、議決権が50%以下でも意思決定を支配していれば子会社となります。</p>
      <ul class="text-xs space-y-1">
        <li><strong>A社：</strong> P社(40%)+子会社B社(30%)=70%保有 → 子会社(○)</li>
        <li><strong>C社：</strong> 子会社B社が70%保有 → P社の孫会社であり子会社(○)</li>
        <li class="text-red-600 font-bold"><strong>D社：</strong> 49%でも支配の事実があるため、子会社となる。よって「子会社でない」は誤り(×)。</li>
      </ul>
    `
  },
  {
    id: 7,
    category: "連結財務諸表の作成",
    question: "I社はJ社の株式の60%を 7,000千円で取得した。J社の純資産（資本+利益）は 10,000千円である。連結B/Sにおける「のれん(A)」と「非支配株主持分(C)」の組み合わせとして正しいものはどれか。",
    options: [
      "Ａ(のれん)：1,000　/　Ｃ(非支配)：4,000",
      "Ａ(のれん)：4,000　/　Ｃ(非支配)：1,000",
      "Ａ(非支配)：1,000　/　Ｃ(のれん)：4,000",
      "Ａ(非支配)：4,000　/　Ｃ(のれん)：1,000"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <div class="bg-gray-50 p-3 rounded text-xs space-y-2">
        <p><strong>非支配株主持分：</strong> 子会社純資産(10,000) × 親会社以外(40%) = <strong>4,000</strong></p>
        <p><strong>のれん：</strong> 投資額(7,000) - 親会社持分(10,000 × 60% = 6,000) = <strong>1,000</strong></p>
      </div>
    `
  },
  {
    id: 8,
    category: "税効果会計（応用）",
    question: "期首取得の備品1,200千円（耐用年数4年、残存ゼロ）を定額法で償却したが、税法上の耐用年数は6年だった。実効税率30%のとき、計上される繰延税金資産(負債)はいくらか。",
    options: [
      "繰延税金資産：30千円",
      "繰延税金資産：70千円",
      "繰延税金負債：30千円",
      "繰延税金負債：70千円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="text-sm">1. 会計上の償却： 1,200 / 4 = 300</p>
      <p class="text-sm">2. 税法上の償却： 1,200 / 6 = 200</p>
      <p class="text-sm">3. 一時差異： 300 - 200 = 100（損金不算入 = 将来減算）</p>
      <p class="font-bold text-blue-600">繰延税金資産 = 100 × 30% = 30千円</p>
    `
  },
  {
    id: 9,
    category: "税効果会計の判定",
    question: "税効果会計に関する記述として、最も適切なものはどれか。",
    options: [
      "受取配当金のうち益金に算入されない金額は、繰延税金負債を増加させる。",
      "交際費のうち損金に算入されない金額は、繰延税金資産を増加させる。",
      "税法の損金算入限度額を超える貸倒引当金繰入額は、繰延税金資産を減少させる。",
      "税法の損金算入限度額を超える減価償却費は、繰延税金資産を増加させる。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="text-sm">限度額を超える減価償却費は「将来減算一時差異」となり、<strong>繰延税金資産</strong>を増加させます。受取配当金や交際費は「永久差異」なので税効果会計の対象外です。</p>
    `
  },
  {
    id: 10,
    category: "評価性引当額",
    question: "税効果会計における評価性引当額に関する記述として、最も適切なものはどれか。",
    options: [
      "将来における課税所得の減少は評価性引当額の増加を招く。",
      "タックスプランニングの内容は評価性引当額に影響しない。",
      "当期の業績低下は評価性引当額の増加を招く。",
      "当期の繰越欠損金の発生は評価性引当額の減少を招く。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="text-sm"><strong>評価性引当額</strong>とは、繰延税金資産のうち「回収できない」と判断された部分です。将来の所得が減ると予想されると、資産を回収できなくなるため引当額が増えます。</p>
    `
  },
  {
    id: 11,
    category: "負ののれん",
    question: "のれんに関する記述として、最も適切なものはどれか。",
    options: [
      "｢中小企業の会計に関する指針｣では、のれんの償却を行わないとしている。",
      "のれんとは、被合併会社から受け継ぐ総資産額が対価より大きいときに計上される。",
      "のれんの償却期間は最長5年である。",
      "のれんはマイナスの金額になることもあり、その場合、特別利益として計上される。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="text-sm">買収額が時価純資産を下回る場合、その差額は<strong>「負ののれん」</strong>と呼ばれ、発生した年度の<strong>特別利益</strong>として処理します。</p>
    `
  },
  {
    id: 12,
    category: "連結子会社の判定",
    question: "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "議決権が40％未満であっても、重要な影響を与えることができる場合は子会社となる。",
      "非支配株主持分は、連結貸借対照表の純資産の部に表示される。",
      "持分法による投資損益は、連結損益計算書の特別利益に表示される。",
      "連結B/Sは、親会社、子会社および関連会社の個別B/Sを合算して作成される。"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="text-sm"><strong>非支配株主持分</strong>（親会社以外の株主の持ち分）は、連結貸借対照表の<strong>純資産の部</strong>に表示するのがルールです。</p>
    `
  },
  {
    id: 13,
    category: "連結会計の実務",
    question: "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "所有割合が100%に満たない場合、負債の部に非支配株主持分が計上される。",
      "子会社との決算日の差異が3か月を超えない場合は、子会社の正規の決算を基礎にできる。",
      "負ののれんは、連結貸借対照表に固定負債として計上する。",
      "連結子会社の利益に所有割合を乗じた額は、持分法投資損益として計上する。"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="text-sm">親会社と子会社の決算日がずれていても、<strong>3ヶ月以内</strong>であれば子会社の数字をそのまま使って連結することが認められています。</p>
    `
  },
  {
    id: 14,
    category: "買収会計の計算",
    question: "Ａ社はＢ社株式の80％を 85百万円で取得した。Ｂ社の純資産（資本40 + 利益40）が 80百万円のとき、のれんと非支配株主持分はいくらか。",
    options: [
      "のれん：5　　非支配株主持分：8",
      "のれん：5　　非支配株主持分：16",
      "のれん：21　　非支配株主持分：8",
      "のれん：21　　非支配株主持分：16"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <div class="bg-blue-50 p-3 rounded text-sm space-y-1">
        <p>1. 非支配株主持分 = B社純資産(80) × 20% = <strong>16</strong></p>
        <p>2. 親会社持分 = 80 × 80% = 64</p>
        <p>3. のれん = 買収額(85) - 親持分(64) = <strong>21</strong></p>
      </div>
    `
  },
  {
    id: 15,
    category: "本支店会計の計算",
    question: "月末時点における本店の「支店勘定」の残高はいくらか。\n(1) 本店が支店の広告費 30,000円を支払った。\n(2) 支店が本店の買掛金 70,000円を支払った。\n(3) 本店が支店の売掛金 15,000円を回収した。\n(4) 本店が原価 60,000円の商品を支店に送った。",
    options: [
      "貸方残高：45,000円",
      "貸方残高：115,000円",
      "借方残高：5,000円",
      "借方残高：75,000円"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="text-sm mb-2">本店の「支店勘定（資産）」の動きを計算します。</p>
      <ul class="text-xs space-y-1">
        <li>(1) 支店に貸しができた： <strong>+30,000</strong></li>
        <li>(2) 支店が肩代わりしてくれた： <strong>-70,000</strong></li>
        <li>(3) 支店の代わりに取り立てた： <strong>-15,000</strong></li>
        <li>(4) 支店に商品を送った： <strong>+60,000</strong></li>
      </ul>
      <p class="font-bold text-blue-700 mt-2">合計： +5,000円 (借方残高)</p>
    `
  },
  {
    id: 16,
    category: "本店集中計算制度",
    question: "本店集中計算制度において、A支店がB支店の買掛金 200,000円を支払ったときの本店の仕訳として正しいものはどれか。",
    options: [
      "(借) A支店 200,000 / (貸) B支店 200,000",
      "(借) B支店 200,000 / (貸) A支店 200,000",
      "(借) 買掛金 200,000 / (貸) 当座預金 200,000",
      "(借) 現金 200,000 / (貸) 買掛金 200,000"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="text-sm">本店集中計算制度では、支店同士の取引をすべて<strong>「本店を経由した」</strong>ものとして扱います。</p>
      <p class="text-xs mt-2">本店から見ると：<br/>・B支店の借金を払ってあげた (借：B支店)<br/>・A支店にお金を出させた (貸：A支店)</p>
    `
  }
];

// --- コンポーネント実装 ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); 
  const [quizMode, setQuizMode] = useState('all'); 
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [reviewFlags, setReviewFlags] = useState({}); 
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // 初期ロード
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('app_financial_2_3_vfinal_answers')) || {};
    const savedReviews = JSON.parse(localStorage.getItem('app_financial_2_3_vfinal_reviews')) || {};
    setUserAnswers(savedAnswers);
    setReviewFlags(savedReviews);
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem('app_financial_2_3_vfinal_answers', JSON.stringify(userAnswers));
    localStorage.setItem('app_financial_2_3_vfinal_reviews', JSON.stringify(reviewFlags));
  }, [userAnswers, reviewFlags]);

  const startQuiz = (mode) => {
    let targets = [];
    if (mode === 'all') {
      targets = problemData;
    } else if (mode === 'wrong') {
      targets = problemData.filter(p => {
        const hist = userAnswers[p.id];
        return hist && !hist.isCorrect;
      });
    } else if (mode === 'review') {
      targets = problemData.filter(p => reviewFlags[p.id]);
    }

    if (targets.length === 0) {
      alert("対象となる問題がありません。");
      return;
    }

    setQuizMode(mode);
    setFilteredProblems(targets);
    setCurrentProblemIndex(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const problem = filteredProblems[currentProblemIndex];
    const isCorrect = optionIndex === problem.correctAnswer;
    
    setUserAnswers(prev => ({
      ...prev,
      [problem.id]: {
        answerIndex: optionIndex,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
      }
    }));
    
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setCurrentScreen('result');
    }
  };

  const toggleReview = (problemId) => {
    setReviewFlags(prev => {
      const newVal = !prev[problemId];
      return { ...prev, [problemId]: newVal };
    });
  };

  const stats = useMemo(() => {
    const total = problemData.length;
    const answeredCount = Object.keys(userAnswers).length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
    return { total, answeredCount, correctCount, reviewCount };
  }, [userAnswers, reviewFlags]);

  if (currentScreen === 'menu') {
    const pieData = [
      { name: '正解', value: stats.correctCount, color: '#4ade80' },
      { name: '不正解/未回答', value: stats.total - stats.correctCount, color: '#f87171' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 font-sans">
        <div className="max-w-xl mx-auto space-y-6">
          <header className="text-center py-6">
            <h1 className="text-2xl font-bold text-slate-700">税務・結合・本支店 2-3</h1>
            <p className="text-slate-500 text-sm mt-1">徹底攻略マスター</p>
          </header>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 w-full flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> 学習状況
            </h2>
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center mt-2 w-full">
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.correctCount}<span className="text-sm text-gray-400">/{stats.total}</span></p>
                <p className="text-xs text-gray-500">正解数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{stats.reviewCount}</p>
                <p className="text-xs text-gray-500">要復習</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <button 
              onClick={() => startQuiz('all')}
              className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">全ての問題を解く</div>
                  <div className="text-xs opacity-90">全{problemData.length}問</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => startQuiz('wrong')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition active:scale-95"
              >
                <RotateCcw className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">前回 × のみ</span>
              </button>
              <button 
                onClick={() => startQuiz('review')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-orange-100 text-orange-600 rounded-xl hover:bg-orange-50 transition active:scale-95"
              >
                <CheckSquare className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">要復習のみ</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex items-center gap-2">
              <List className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-700 text-sm">問題一覧</h3>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y">
              {problemData.map((p, idx) => {
                const hist = userAnswers[p.id];
                const isReview = reviewFlags[p.id];
                return (
                  <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 font-mono">
                        {p.id}
                      </span>
                      <span className="truncate max-w-[200px] text-slate-600">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isReview && <AlertCircle className="w-4 h-4 text-orange-400" />}
                      {hist ? (
                        hist.isCorrect ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quiz') {
    const problem = filteredProblems[currentProblemIndex];
    const isLast = currentProblemIndex === filteredProblems.length - 1;
    const progress = ((currentProblemIndex + 1) / filteredProblems.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="h-1 bg-gray-200 w-full">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
            <button onClick={() => setCurrentScreen('menu')} className="text-sm text-gray-500 hover:text-gray-800 font-bold">メニューへ</button>
            <span className="font-bold text-slate-700">Q. {currentProblemIndex + 1} / {filteredProblems.length}</span>
            <span className="text-[10px] text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded-full">{problem.category}</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{problem.question}</p>
          </div>

          <div className="grid gap-3">
            {problem.options.map((opt, idx) => {
              let btnClass = "p-4 text-left rounded-xl border-2 transition-all ";
              if (showExplanation) {
                if (idx === problem.correctAnswer) {
                  btnClass += "bg-green-50 border-green-500 text-green-800 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-800";
                } else {
                  btnClass += "bg-white border-transparent shadow-sm opacity-50";
                }
              } else {
                btnClass += "bg-white border-transparent shadow-sm hover:border-blue-200 active:scale-[0.99] font-medium";
              }

              return (
                <button 
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex gap-3">
                    <span className="font-bold font-mono text-gray-400">{['ア','イ','ウ','エ'][idx]}</span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`p-4 rounded-xl mb-4 text-center font-bold text-white shadow-md ${selectedOption === problem.correctAnswer ? 'bg-green-500' : 'bg-red-500'}`}>
                {selectedOption === problem.correctAnswer ? '正解！' : '不正解...'}
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm text-slate-800">
                <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold border-b border-blue-200 pb-2">
                  <BookOpen className="w-5 h-5" /> 解説
                </div>
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: problem.explanation }} 
                />
              </div>

              <label className="flex items-center gap-3 p-4 bg-white mt-4 rounded-xl shadow-sm border border-orange-100 cursor-pointer hover:bg-orange-50 transition">
                <input 
                  type="checkbox" 
                  checked={!!reviewFlags[problem.id]} 
                  onChange={() => toggleReview(problem.id)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="font-bold text-slate-700">あとで復習する（チェック）</span>
              </label>

              <button 
                onClick={nextProblem}
                className="w-full mt-6 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isLast ? '結果を見る' : '次の問題へ'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'result') {
    const sessionCorrect = filteredProblems.filter(p => userAnswers[p.id]?.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-800">お疲れ様でした！</h2>
            <p className="text-slate-500 mt-2">今回の正解率</p>
            <div className="text-5xl font-black text-blue-600 mt-2">
              {Math.round((sessionCorrect / filteredProblems.length) * 100)}%
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {sessionCorrect} / {filteredProblems.length} 問正解
            </p>
          </div>

          <button 
            onClick={() => setCurrentScreen('menu')}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition"
          >
            メニューに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}