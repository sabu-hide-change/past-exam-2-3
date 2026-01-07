import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Calculator, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Home,
  BookOpen,
  XCircle,
  Bookmark
} from 'lucide-react';

const QuizApp = () => {
  // --- State ---
  const [screen, setScreen] = useState('menu'); // menu, quiz, result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState([]); // 現在出題中の問題リスト
  const [selectedAnswers, setSelectedAnswers] = useState({}); // 今の回の回答
  const [showExplanation, setShowExplanation] = useState(false);
  
  // 履歴データ（ローカルストレージから読み込み）
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('quizHistory_2_3');
    return saved ? JSON.parse(saved) : {};
  });

  // --- Data ---
  const originalQuizData = [
    {
      id: 1,
      year: "令和元年 第8問",
      category: "税効果会計",
      question: "期首に取得した備品1,200千円（耐用4年、残存0、定額法）について、税法上の耐用年数は6年であった。このとき計上される繰延税金資産または負債はいくらか。なお実効税率は30％とする。",
      data: [
        "・取得原価：1,200千円",
        "・会計上の償却：耐用4年",
        "・税法上の償却：耐用6年",
        "・期首の一時差異：なし"
      ],
      options: [
        "繰延税金資産：30千円",
        "繰延税金資産：70千円",
        "繰延税金負債：30千円",
        "繰延税金負債：70千円"
      ],
      correctAnswer: 0, // ア
      explanation: {
        important: "「会計上の償却費 ＞ 税法上の償却費」の場合、その差額（損金不算入額）は「将来減算一時差異」となり、繰延税金資産（税金の前払い）を計上します。",
        content: `
          1. 会計上の減価償却費
             1,200 ÷ 4年 ＝ 300千円

          2. 税法上の減価償却費（限度額）
             1,200 ÷ 6年 ＝ 200千円

          3. 一時差異（損金不算入額）
             300 － 200 ＝ 100千円
             ※会計の方が費用を多く計上している＝税金を前払いしている状態。

          4. 繰延税金資産の計算
             一時差異 100千円 × 税率 30% ＝ 30千円
        `
      }
    },
    {
      id: 2,
      year: "平成29年 第6問",
      category: "税効果会計の記述",
      question: "税効果会計に関する記述として、最も適切なものはどれか。",
      options: [
        "受取配当金のうち益金に算入されない金額は、繰延税金負債を増加させる。",
        "交際費のうち損金に算入されない金額は、繰延税金資産を増加させる。",
        "税法の損金算入限度額を超える貸倒引当金繰入額は、繰延税金資産を減少させる。",
        "税法の損金算入限度額を超える減価償却費は、繰延税金資産を増加させる。"
      ],
      correctAnswer: 3, // エ
      explanation: {
        important: "「永久差異（交際費や受取配当金など）」は税効果会計の対象外です。「一時差異」のみが対象となります。",
        content: `
          ア・イ：誤り。交際費の損金不算入や受取配当金の益金不算入は「永久差異」であり、将来解消されないため税効果会計は適用されません。
          ウ：誤り。限度額を超える引当金繰入（損金不算入）は「将来減算一時差異」であり、繰延税金資産を「増加」させます。
          エ：正しい。限度額を超える償却費は「将来減算一時差異」となり、繰延税金資産を増加させます。
        `
      }
    },
    {
      id: 3,
      year: "平成26年 第3問",
      category: "評価性引当額",
      question: "税効果会計における評価性引当額に関する記述として、最も適切なものはどれか。",
      options: [
        "他の条件が一定のとき、将来における課税所得の減少は評価性引当額の増加を招く。",
        "他の条件が一定のとき、タックスプランニングの内容は評価性引当額に影響しない。",
        "他の条件が一定のとき、当期の業績低下は評価性引当額の増加を招く。",
        "他の条件が一定のとき、当期の繰越欠損金の発生は評価性引当額の減少を招く。"
      ],
      correctAnswer: 0, // ア
      explanation: {
        important: "評価性引当額とは、「繰延税金資産のうち、回収できない（将来の税金減額に使えない）と判断された金額」のことです。",
        content: `
          ア：正しい。将来の課税所得（黒字）が減ると、税金を減らすメリットが享受できなくなるため、回収不能（評価性引当額）が増加します。
          イ：誤り。タックスプランニング（節税計画等）は将来の課税所得に影響するため、評価性引当額にも影響します。
          ウ：誤り。当期の業績低下だけでは直ちに将来の回収可能性がないとは言えません。
          エ：誤り。繰越欠損金の発生は、むしろ回収可能性への懸念（評価性引当額の増加）要因となり得ます。
        `
      }
    },
    {
      id: 4,
      year: "平成28年 第3問",
      category: "のれん",
      question: "のれんに関する記述として最も適切なものはどれか。",
      options: [
        "｢中小企業の会計に関する指針｣では、のれんの償却を行わないとしている。",
        "のれんとは、被合併会社から受け継ぐ総資産額が被合併会社の株主に交付される金額よりも大きいときに計上される。",
        "のれんの償却期間は最長5年である。",
        "のれんはマイナスの金額になることもあり、その場合、発生時の損益計算書に特別利益として計上される。"
      ],
      correctAnswer: 3, // エ
      explanation: {
        important: "負ののれん（安く買えた場合のお得額）は、一括して「特別利益」に計上します。",
        content: `
          ア：誤り。中小企業の指針でも償却は行います。
          イ：誤り。総資産ではなく「純資産（時価）」と比較します。また、交付金額の方が大きい場合に計上されます。
          ウ：誤り。日本の会計基準では「20年以内」の定額法償却です。
          エ：正しい。取得原価が純資産を下回る場合（負ののれん）は、発生益として特別利益に計上します。
        `
      }
    },
    {
      id: 5,
      year: "令和元年 第3問",
      category: "連結会計の基礎",
      question: "連結会計に関する記述として、最も適切なものはどれか。",
      options: [
        "Ａ社によるＢ社の議決権の所有割合が40％未満であっても、実質的な支配力があれば子会社と判定される。",
        "非支配株主持分は、連結貸借対照表の純資産の部に表示される。",
        "持分法による投資利益（または損失）は、連結損益計算書の特別利益（または特別損失）の区分に表示される。",
        "連結貸借対照表は、親会社、子会社および関連会社の個別貸借対照表を合算し、必要な調整を加えて作成される。"
      ],
      correctAnswer: 1, // イ
      explanation: {
        important: "非支配株主持分（親会社以外の株主の持ち分）は、負債ではなく「純資産」の一部です。",
        content: `
          ア：誤り。40%未満の場合は、原則として子会社とは判定されません（40%以上50%以下なら要件次第で子会社）。
          イ：正しい。純資産の部に「非支配株主持分」として表示されます。
          ウ：誤り。持分法投資損益は「営業外損益」に表示されます。
          エ：誤り。「関連会社」は連結の合算対象ではなく、持分法適用の対象（一行連結）です。
        `
      }
    },
    {
      id: 6,
      year: "令和5年 第4問",
      category: "連結会計のルール",
      question: "連結会計に関する記述として、最も適切なものはどれか。",
      options: [
        "親会社による子会社株式の所有割合が100%に満たない場合、連結貸借対照表の負債の部に非支配株主持分が計上される。",
        "子会社の決算日と連結決算日の差異が3か月を超えない場合は、子会社の正規の決算を基礎として連結決算を行うことができる。",
        "負ののれんは、連結貸借対照表に固定負債として計上する。",
        "連結子会社の当期純損益に株式の所有割合を乗じた額は、持分法による投資損益として連結損益計算書に計上する。"
      ],
      correctAnswer: 1, // イ
      explanation: {
        important: "実務上の配慮として、決算日のズレが3ヶ月以内なら、子会社の決算書をそのまま使って連結して良いとされています。",
        content: `
          ア：誤り。負債の部ではなく「純資産の部」です。
          イ：正しい。3ヶ月以内ならそのまま合算可能です（重要な取引は調整が必要）。
          ウ：誤り。負ののれんは「特別利益」としてＰ/Ｌ計上します。負債ではありません。
          エ：誤り。連結子会社の損益は合算後に非支配株主分を控除します。持分法投資損益を使うのは「関連会社」などです。
        `
      }
    },
    {
      id: 7,
      year: "平成30年 第4問",
      category: "買収会計（のれん計算）",
      question: "A社はB社株式の80％を85百万円で取得した。取得時における「のれん」と「非支配株主持分」の金額の組み合わせとして、最も適切なものはどれか。",
      data: [
        "・A社取得額：85百万円",
        "・B社資産：200, B社負債：120",
        "・B社資本金：40, B社利益剰余金：40",
        "※資産負債の時価は簿価と一致"
      ],
      table: {
        headers: ["B社BS", "金額"],
        rows: [
          ["諸資産", "200"],
          ["諸負債", "120"],
          ["純資産計", "80 (40+40)"]
        ]
      },
      options: [
        "のれん：5百万円 / 非支配：8百万円",
        "のれん：5百万円 / 非支配：16百万円",
        "のれん：21百万円 / 非支配：8百万円",
        "のれん：21百万円 / 非支配：16百万円"
      ],
      correctAnswer: 3, // エ -> 21, 16
      explanation: {
        important: "のれん ＝ 取得対価 － 取得した純資産持分\n非支配株主持分 ＝ 子会社純資産 × 非支配株主比率",
        content: `
          1. B社の純資産（時価）
             200(資産) － 120(負債) ＝ 80百万円
             （または資本金40 ＋ 剰余金40）

          2. A社の持分（80%）
             80百万円 × 80% ＝ 64百万円

          3. のれんの計算
             取得額 85 － 持分 64 ＝ 21百万円

          4. 非支配株主持分（残り20%）
             80百万円 × 20% ＝ 16百万円
        `
      }
    },
    {
      id: 8,
      year: "平成30年 第3問",
      category: "本支店会計（未達なし）",
      question: "月末時点における「本店」の帳簿上の「支店勘定」の残高はいくらか。なお、月初の残高はゼロとする。",
      data: [
        "(1) 本店は支店の広告費30,000円を現金で支払った。",
        "(2) 支店は本店の買掛金70,000円を現金で支払った。",
        "(3) 本店は支店の売掛金15,000円を現金で回収した。",
        "(4) 本店は原価60,000円の商品を支店に送付した。"
      ],
      options: [
        "貸方残高：45,000円",
        "貸方残高：115,000円",
        "借方残高：5,000円",
        "借方残高：75,000円"
      ],
      correctAnswer: 2, // ウ -> 借方5000
      explanation: {
        important: "本店の仕訳において、「支店」勘定が借方（プラス）か貸方（マイナス）かを追っていきます。",
        content: `
          (1) 本店が立替払い → 支店への債権発生
              (借) 支店 30,000

          (2) 支店が本店の借金を返済 → 支店への債務発生（債権減少）
              (貸) 支店 70,000

          (3) 本店が支店の売上を回収 → 支店への債務発生（債権減少）
              (貸) 支店 15,000

          (4) 本店が商品を発送 → 支店への債権発生
              (借) 支店 60,000

          ★集計（借方＋、貸方－）
          30,000 － 70,000 － 15,000 ＋ 60,000 
          ＝ ＋5,000円 （借方残高）
        `
      }
    },
    {
      id: 9,
      year: "令和3年 第2問",
      category: "本店集中計算制度",
      question: "A支店がB支店の買掛金200,000円を小切手で支払ったとき、本店集中計算制度における「本店」の仕訳はどれか。",
      options: [
        "(借) A支店 200,000 / (貸) B支店 200,000",
        "(借) B支店 200,000 / (貸) A支店 200,000",
        "(借) 買掛金 200,000 / (貸) 当座預金 200,000",
        "(借) 現金 200,000 / (貸) 買掛金 200,000"
      ],
      correctAnswer: 1, // イ
      explanation: {
        important: "本店集中制度では、支店間の取引もすべて「本店を経由した」とみなして処理します。",
        content: `
          取引の実態：A支店が、B支店の借金を肩代わりした。

          1. 本店から見たB支店
             B支店の借金が減ったので、本店はB支店に対して「債権」を持つ（貸しができる）。
             → (借) B支店 200,000

          2. 本店から見たA支店
             A支店にお金を払ってもらったので、本店はA支店に対して「債務」を持つ（借りができる）。
             → (貸) A支店 200,000

          よって、仕訳は「(借) B支店 / (貸) A支店」となります。
        `
      }
    }
  ];

  // --- Effects ---
  // 履歴更新時にローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('quizHistory_2_3', JSON.stringify(history));
  }, [history]);

  // --- Logic ---
  
  // クイズ開始処理
  const startQuiz = (mode) => {
    let questions = [];
    if (mode === 'all') {
      questions = originalQuizData;
    } else if (mode === 'wrong') {
      questions = originalQuizData.filter(q => history[q.id]?.lastResult === 'incorrect');
    } else if (mode === 'review') {
      questions = originalQuizData.filter(q => history[q.id]?.reviewNeeded);
    }

    if (questions.length === 0) {
      alert("該当する問題がありません！");
      return;
    }

    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setScreen('quiz');
  };

  const handleAnswerSelect = (optionIndex) => {
    const currentQ = activeQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIndex
    });

    // 履歴更新（回答した瞬間に正誤を記録）
    setHistory(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        lastResult: isCorrect ? 'correct' : 'incorrect',
        lastAnsweredAt: new Date().toISOString()
      }
    }));
    
    setShowExplanation(true);
  };

  const toggleReview = (questionId) => {
    setHistory(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        reviewNeeded: !prev[questionId]?.reviewNeeded
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setScreen('result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // 前の問題に戻るとき、すでに回答済みなら解説を表示
      const prevQId = activeQuestions[currentQuestionIndex - 1].id;
      setShowExplanation(selectedAnswers[prevQId] !== undefined);
    }
  };

  const calculateScore = () => {
    let score = 0;
    activeQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  // --- Render Helpers ---
  const renderTable = (tableData) => {
    if (!tableData) return null;
    return (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {tableData.headers.map((header, idx) => (
                <th key={idx} className="border border-gray-300 p-2 text-center">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-gray-50">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="border border-gray-300 p-2 text-center">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // --- Screens ---

  // 1. Menu Screen
  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">過去問セレクト演習 2-3</h1>
            <p className="opacity-90">税務・結合会計</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button 
                onClick={() => startQuiz('all')}
                className="flex flex-col items-center justify-center p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-bold text-lg">全問チャレンジ</span>
                <span className="text-sm text-gray-500 mt-1">全{originalQuizData.length}問</span>
              </button>

              <button 
                onClick={() => startQuiz('wrong')}
                className="flex flex-col items-center justify-center p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-8 h-8 text-red-600 mb-2" />
                <span className="font-bold text-lg">前回不正解のみ</span>
                <span className="text-sm text-gray-500 mt-1">
                  対象: {originalQuizData.filter(q => history[q.id]?.lastResult === 'incorrect').length}問
                </span>
              </button>

              <button 
                onClick={() => startQuiz('review')}
                className="flex flex-col items-center justify-center p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors"
              >
                <Bookmark className="w-8 h-8 text-yellow-600 mb-2" />
                <span className="font-bold text-lg">要復習のみ</span>
                <span className="text-sm text-gray-500 mt-1">
                  対象: {originalQuizData.filter(q => history[q.id]?.reviewNeeded).length}問
                </span>
              </button>
            </div>

            <h3 className="font-bold text-lg mb-4 text-gray-700 border-l-4 border-blue-600 pl-3">問題一覧・履歴</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 w-12 text-center">No</th>
                    <th className="border p-2">問題カテゴリ / 出題年度</th>
                    <th className="border p-2 w-24 text-center">前回</th>
                    <th className="border p-2 w-24 text-center">要復習</th>
                  </tr>
                </thead>
                <tbody>
                  {originalQuizData.map((q, idx) => {
                    const h = history[q.id] || {};
                    return (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center font-bold text-gray-600">{idx + 1}</td>
                        <td className="border p-2">
                          <div className="font-bold text-gray-800">{q.category}</div>
                          <div className="text-xs text-gray-500">【{q.year}】</div>
                        </td>
                        <td className="border p-2 text-center">
                          {h.lastResult === 'correct' && <span className="text-green-600 font-bold">〇</span>}
                          {h.lastResult === 'incorrect' && <span className="text-red-500 font-bold">×</span>}
                          {!h.lastResult && <span className="text-gray-300">-</span>}
                        </td>
                        <td className="border p-2 text-center">
                          <button 
                            onClick={() => toggleReview(q.id)}
                            className="focus:outline-none"
                          >
                            {h.reviewNeeded ? (
                              <Bookmark className="w-5 h-5 text-yellow-500 fill-current mx-auto" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Quiz Screen
  if (screen === 'quiz') {
    const currentQ = activeQuestions[currentQuestionIndex];
    const isAnswered = selectedAnswers[currentQ.id] !== undefined;
    const isCorrect = selectedAnswers[currentQ.id] === currentQ.correctAnswer;
    const reviewNeeded = history[currentQ.id]?.reviewNeeded || false;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b sticky top-0 z-10 p-4 shadow-sm flex justify-between items-center">
            <button onClick={() => setScreen('menu')} className="text-gray-500 hover:text-gray-700">
              <Home className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                問 {currentQuestionIndex + 1} / {activeQuestions.length}
              </span>
            </div>
            <div className="w-5" /> {/* Spacer */}
          </div>
          <div className="w-full bg-gray-200 h-1">
            <div 
              className="bg-blue-600 h-1 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-6">
            {/* Question */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2 leading-relaxed">
                <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded mr-2 align-middle">
                  {currentQ.year}
                </span>
                {currentQ.question}
              </h2>
              
              {currentQ.data && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 text-sm text-gray-700 mt-4">
                  <h3 className="font-bold mb-2">【資 料】</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentQ.data.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {renderTable(currentQ.table)}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${!isAnswered ? 'hover:bg-blue-50 hover:border-blue-200' : ''}
                    ${selectedAnswers[currentQ.id] === index 
                      ? (index === currentQ.correctAnswer 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-red-50 border-red-500')
                      : (isAnswered && index === currentQ.correctAnswer 
                        ? 'bg-green-50 border-green-500' 
                        : 'border-gray-200 bg-white')
                    }
                  `}
                >
                  <input 
                    type="radio" 
                    name={`question-${currentQ.id}`} 
                    checked={selectedAnswers[currentQ.id] === index}
                    onChange={() => !isAnswered && handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className="sr-only" 
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium w-full">{option}</span>
                      {isAnswered && index === currentQ.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 ml-2" />
                      )}
                      {isAnswered && selectedAnswers[currentQ.id] === index && index !== currentQ.correctAnswer && (
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 ml-2" />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`mb-4 p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {isCorrect ? <CheckCircle className="h-6 w-6 text-green-600" /> : <AlertCircle className="h-6 w-6 text-red-600" />}
                    <div>
                      <h4 className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? '正解！' : '不正解...'}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        正解は <strong>{currentQ.options[currentQ.correctAnswer]}</strong> です。
                      </p>
                    </div>
                  </div>
                  
                  {/* Review Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300 hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      checked={reviewNeeded}
                      onChange={() => toggleReview(currentQ.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-gray-700">要復習リストに入れる</span>
                  </label>
                </div>

                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-200 pb-2">
                    <Calculator className="h-5 w-5" />
                    解説
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded mb-2">
                      ここが重要
                    </span>
                    <p className="text-sm text-gray-700 font-medium">{currentQ.explanation.important}</p>
                  </div>
                  <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed font-mono bg-white p-3 rounded border border-gray-100">
                    {currentQ.explanation.content}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between p-6 bg-gray-50 border-t">
            <button 
              onClick={handlePrevious} 
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
            </button>
            <button 
              onClick={handleNext} 
              disabled={!isAnswered}
              className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === activeQuestions.length - 1 ? '結果へ' : '次へ'} <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Result Screen
  if (screen === 'result') {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              結果発表
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">{score} / {activeQuestions.length}</h2>
              <p className="text-gray-600">正解率: {Math.round((score / activeQuestions.length) * 100)}%</p>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {activeQuestions.map((q, index) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">【{q.year}】</div>
                      <span className="font-medium text-sm text-gray-700 line-clamp-1">問{index + 1}: {q.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <span className="text-green-600 font-bold flex items-center shrink-0"><CheckCircle className="h-4 w-4 mr-1" />正解</span>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center shrink-0"><AlertCircle className="h-4 w-4 mr-1" />不正解</span>
                      )}
                      
                      {/* Result Screen Review Toggle */}
                      <button onClick={() => toggleReview(q.id)} className="focus:outline-none" title="要復習リストに追加/解除">
                         {history[q.id]?.reviewNeeded ? (
                            <Bookmark className="w-5 h-5 text-yellow-500 fill-current" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-gray-300" />
                          )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center p-6 bg-gray-50 border-t">
            <button 
              onClick={() => setScreen('menu')} 
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> メニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default QuizApp;