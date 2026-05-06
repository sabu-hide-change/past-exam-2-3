// npm install lucide-react recharts firebase

import React, { useState, useEffect } from 'react';
import { Check, X, Home, ChevronRight, BookOpen, Clock, AlertTriangle, Play, RefreshCw, List, Save } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const APP_ID = "QuizApp_001";

// --- Quiz Data ---
const quizData = [
  {
    id: 1,
    year: "令和元年 第8問",
    theme: "税効果会計",
    question: "決算に当たり、期首に取得した備品1,200千円（耐用年数4年、残存価額ゼロ）について定額法で減価償却を行った。しかし、この備品の税法上の耐用年数は6年であった。このとき、計上される繰延税金資産または繰延税金負債の金額として、最も適切なものはどれか。なお、法人税等の実効税率は30％とする。また、期首における一時差異はないものとする。",
    options: [
      "繰延税金資産：30千円",
      "繰延税金資産：70千円",
      "繰延税金負債：30千円",
      "繰延税金負債：70千円"
    ],
    answer: 0,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <p>本問では、税効果会計と減価償却にかかわる計算について問われています。毎年の減価償却費は、決算上(4年)は300千円、税法上(6年)は200千円になります。差額100千円が発生します。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">項目</th>
                <th className="border border-gray-300 p-2">決算内容</th>
                <th className="border border-gray-300 p-2">税法上</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">利益（仮定）</td>
                <td className="border border-gray-300 p-2">1,000千円</td>
                <td className="border border-gray-300 p-2">1,000千円</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">減価償却費</td>
                <td className="border border-gray-300 p-2">300千円</td>
                <td className="border border-gray-300 p-2">200千円</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">税引前利益</td>
                <td className="border border-gray-300 p-2">700千円</td>
                <td className="border border-gray-300 p-2">800千円</td>
              </tr>
              <tr className="font-bold text-red-600">
                <td className="border border-gray-300 p-2">法人税等(30%)</td>
                <td className="border border-gray-300 p-2">210千円</td>
                <td className="border border-gray-300 p-2">240千円</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>税法上の法人税等が30千円高くなっています。これは「税法上の限度額を超える減価償却（損金不算入）」であり「将来減算一時差異」となります。法人税等の前払い的性質を持つため、「繰延税金資産」30千円が計上されます。</p>
      </div>
    )
  },
  {
    id: 2,
    year: "平成29年 第6問",
    theme: "税効果会計",
    question: "税効果会計に関する記述として、最も適切なものはどれか。",
    options: [
      "受取配当金のうち益金に算入されない金額は、繰延税金負債を増加させる。",
      "交際費のうち損金に算入されない金額は、繰延税金資産を増加させる。",
      "税法の損金算入限度額を超える貸倒引当金繰入額は、繰延税金資産を減少させる。",
      "税法の損金算入限度額を超える減価償却費は、繰延税金資産を増加させる。"
    ],
    answer: 3,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">分類</th>
                <th className="border border-gray-300 p-2">内容</th>
                <th className="border border-gray-300 p-2">具体例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">将来減算一時差異</td>
                <td className="border border-gray-300 p-2">将来の課税所得を減額。繰延税金資産を増加。</td>
                <td className="border border-gray-300 p-2">貸倒引当金の限度額超過、減価償却費の限度額超過</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">将来加算一時差異</td>
                <td className="border border-gray-300 p-2">将来の課税所得を増額。繰延税金負債を増加。</td>
                <td className="border border-gray-300 p-2">圧縮記帳の損金算入額</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">永久差異</td>
                <td className="border border-gray-300 p-2">永久に解消されない差異。税効果会計は適用外。</td>
                <td className="border border-gray-300 p-2">受取配当金の益金不算入、交際費の損金不算入</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>ア、イは永久差異です。ウは将来減算一時差異であり、繰延税金資産を「増加」させます。エの減価償却費の超過額も将来減算一時差異であり、繰延税金資産を増加させるため適切です。</p>
      </div>
    )
  },
  {
    id: 3,
    year: "平成26年 第3問",
    theme: "税効果会計",
    question: "税効果会計における評価性引当額に関する記述として、最も適切なものはどれか。ただし、スケジューリング不能な一時差異に係る繰延税金資産は存在しない。",
    options: [
      "他の条件が一定のとき、将来における課税所得の減少は評価性引当額の増加を招く。",
      "他の条件が一定のとき、タックスプランニングの内容は評価性引当額に影響しない。",
      "他の条件が一定のとき、当期の業績低下は評価性引当額の増加を招く。",
      "他の条件が一定のとき、当期の繰越欠損金の発生は評価性引当額の減少を招く。"
    ],
    answer: 0,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="font-bold">評価性引当額</p>
          <p>税効果会計において、繰延税金資産のうち回収可能性がないと会社が判断した金額のことです。</p>
        </div>
        <p>ア：課税所得が減少すると、繰延税金資産の回収可能性が下がり、評価性引当額の増加に繋がります（適切）。<br/>イ：タックスプランニングは将来の法人税発生の計画であり、影響します。<br/>ウ：当期の業績低下が直接評価性引当額を増加させるとは言えません。<br/>エ：繰越欠損金の発生事象と評価性引当額の減少は直接的には無関係です。</p>
      </div>
    )
  },
  {
    id: 4,
    year: "平成28年 第3問",
    theme: "のれん",
    question: "のれんに関する記述として最も適切なものはどれか。",
    options: [
      "｢中小企業の会計に関する指針｣では、のれんの償却を行わないとしている。",
      "のれんとは、被合併会社から受け継ぐ総資産額が被合併会社の株主に交付される金額よりも大きいときに計上される。",
      "のれんの償却期間は最長5年である。",
      "のれんはマイナスの金額になることもあり、その場合、発生時の損益計算書に特別利益として計上される。"
    ],
    answer: 3,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <p>ア：「中小企業の会計に関する指針」で償却を行わないという規定はありません。<br/>イ：総資産額ではなく「時価評価純資産額」と比較します。また、受け継ぐ純資産が交付金額より大きい場合は「負ののれん」になります。<br/>ウ：のれんの償却期間は「20年以内」です。<br/>エ：負ののれんは発生時の損益計算書に「特別利益」として計上されます（適切）。</p>
      </div>
    )
  },
  {
    id: 5,
    year: "令和元年 第3問",
    theme: "連結会計",
    question: "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "Ａ社によるＢ社の議決権の所有割合が40％未満であっても、Ｂ社の財務および営業または事業の方針決定に対して重要な影響を与えることができる場合には、Ｂ社は子会社と判定される。",
      "非支配株主持分は、連結貸借対照表の純資産の部に表示される。",
      "持分法による投資利益（または損失）は、連結損益計算書の特別利益（または特別損失）の区分に表示される。",
      "連結貸借対照表は、親会社、子会社および関連会社の個別貸借対照表を合算し、必要な調整を加えて作成される。"
    ],
    answer: 1,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">議決権の所有割合</th>
                <th className="border border-gray-300 p-2">実質的な支配とされる場合</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">50%超(過半数)</td>
                <td className="border border-gray-300 p-2">過半数を自己の計算において所有している場合。</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">40%〜50%</td>
                <td className="border border-gray-300 p-2">一定の条件（緊密者との合計など）を満たす場合。</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">0%〜40%未満</td>
                <td className="border border-gray-300 p-2">緊密者と合わせて過半数かつ一定の条件を満たす場合。</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>ア：40%未満の場合、緊密者の議決権と合わせて過半数が必要です。重要な影響のみでは「関連会社」となります。<br/>イ：非支配株主持分は純資産の部に表示されます（適切）。<br/>ウ：持分法投資損益は「営業外損益」として処理されます。<br/>エ：関連会社の個別貸借対照表は合算しません。</p>
      </div>
    )
  },
  {
    id: 6,
    year: "令和5年 第4問",
    theme: "連結会計",
    question: "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "親会社による子会社株式の所有割合が100%に満たない場合、連結貸借対照表の負債の部に非支配株主持分が計上される。",
      "子会社の決算日と連結決算日の差異が3か月を超えない場合は、子会社の正規の決算を基礎として連結決算を行うことができる。",
      "負ののれんは、連結貸借対照表に固定負債として計上する。",
      "連結子会社の当期純損益に株式の所有割合を乗じた額は、持分法による投資損益として連結損益計算書に計上する。"
    ],
    answer: 1,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <p>ア：非支配株主持分は「純資産の部」に計上されます。<br/>イ：決算日の差異が3ヶ月を超えない場合、子会社の正規の決算を基礎として連結決算を行えます（適切）。<br/>ウ：負ののれんは損益計算書の「特別利益」に計上されます。<br/>エ：持分法による投資損益が計上されるのは「関連会社」など持分法適用会社です。連結子会社は全て合算されます。</p>
      </div>
    )
  },
  {
    id: 7,
    year: "平成30年 第4問",
    theme: "買収会計",
    question: "Ａ社は、20X1年12月31日にＢ社株式の80％を85百万円で取得した。取得時のＡ社およびＢ社の貸借対照表は以下のとおりである。なお、Ｂ社の諸資産および諸負債の簿価は、時価と一致している。取得時におけるのれんと非支配株主持分の金額の組み合わせとして、最も適切なものを下記の解答群から選べ。",
    options: [
      "のれん：5百万円　　非支配株主持分：8百万円",
      "のれん：5百万円　　非支配株主持分：16百万円",
      "のれん：21百万円　　非支配株主持分：8百万円",
      "のれん：21百万円　　非支配株主持分：16百万円"
    ],
    answer: 3,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-300 p-2">
            <p className="font-bold text-center border-b pb-1 mb-1">A社貸借対照表</p>
            <div className="flex justify-between"><span>諸資産: 415</span><span>諸負債: 150</span></div>
            <div className="flex justify-between"><span>B社株式: 85</span><span>資本金: 200</span></div>
            <div className="flex justify-between"><span></span><span>利益剰余金: 150</span></div>
          </div>
          <div className="border border-gray-300 p-2">
            <p className="font-bold text-center border-b pb-1 mb-1">B社貸借対照表</p>
            <div className="flex justify-between"><span>諸資産: 200</span><span>諸負債: 120</span></div>
            <div className="flex justify-between"><span></span><span>資本金: 40</span></div>
            <div className="flex justify-between"><span></span><span>利益剰余金: 40</span></div>
          </div>
        </div>
        <p>B社の純資産 = 資本金(40) + 利益剰余金(40) = 80百万円。<br/>
        A社取得分(80%) = 80 × 0.8 = 64百万円。<br/>
        のれん = 取得金額(85) - 取得分(64) = 21百万円。<br/>
        非支配株主持分(20%) = 80 × 0.2 = 16百万円。</p>
      </div>
    )
  },
  {
    id: 8,
    year: "平成30年 第3問",
    theme: "本支店会計",
    question: "当社は本店のほかに支店があり、本支店間の債権債務は支店勘定および本店勘定により処理している。当月は、本支店間で以下の資料に記載された取引が生じた。月末時点における本店の支店勘定の残高として、最も適切なものを下記の解答群から選べ。なお、月初の支店勘定および本店勘定の残高はゼロであり、月末における未達事項はないものとする。\n\n【資　料】\n（1） 本店は支店の広告宣伝費30,000円を現金で支払った。\n（2） 支店は本店の買掛金70,000円を現金で支払った。\n（3） 本店は支店の売掛金15,000円を現金で回収した。\n（4） 本店は原価60,000円の商品を支店に送付した。",
    options: [
      "貸方残高：45,000円",
      "貸方残高：115,000円",
      "借方残高：5,000円",
      "借方残高：75,000円"
    ],
    answer: 2,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <p>本店側の仕訳を考えます。<br/>
        (1) (借) 支店 30,000 / (貸) 現金 30,000<br/>
        (2) (借) 買掛金 70,000 / (貸) 支店 70,000<br/>
        (3) (借) 現金 15,000 / (貸) 支店 15,000<br/>
        (4) (借) 支店 60,000 / (貸) 商品 60,000<br/>
        本店の支店勘定（借方）の残高：30,000 - 70,000 - 15,000 + 60,000 = 5,000円。<br/>
        借方残高5,000円となります。</p>
      </div>
    )
  },
  {
    id: 9,
    year: "令和3年 第2問",
    theme: "本支店会計",
    question: "本支店会計において本店集中計算制度を採用している場合、A支店がB支店の買掛金200,000円について小切手を振り出して支払ったときの本店の仕訳として、最も適切なものはどれか。",
    options: [
      "(借)　A支店 200,000 (貸)　B支店 200,000",
      "(借)　B支店 200,000 (貸)　A支店 200,000",
      "(借)　買掛金 200,000 (貸)　当座預金 200,000",
      "(借)　現金 200,000 (貸)　買掛金 200,000"
    ],
    answer: 1,
    explanation: () => (
      <div className="space-y-4 text-sm">
        <p>本店集中計算制度では、支店間取引は「本店」を経由したとみなして処理します。<br/>
        B支店（買掛金減少）： (借) 買掛金 200,000 / (貸) 本店 200,000<br/>
        A支店（当座預金減少）： (借) 本店 200,000 / (貸) 当座預金 200,000<br/>
        本店： B支店から見て本店は貸方なので、本店の帳簿ではB支店を借方に。A支店から見て本店は借方なので、本店の帳簿ではA支店を貸方にします。<br/>
        (借) B支店 200,000 / (貸) A支店 200,000</p>
      </div>
    )
  }
];

// --- Components ---

export default function App() {
  const [screen, setScreen] = useState('login'); // login, resume_prompt, menu, quiz, explanation, result, history
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  
  // App State
  const [userHistory, setUserHistory] = useState({});
  const [progressMode, setProgressMode] = useState(null);
  const [progressIndex, setProgressIndex] = useState(0);
  
  // Quiz State
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    // Authenticate anonymously on mount
    signInAnonymously(auth).catch(err => console.error("Auth error:", err));
  }, []);

  const loadUserData = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, APP_ID, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserHistory(data.history || {});
        
        if (data.progressIndex > 0 && data.progressMode) {
          setProgressIndex(data.progressIndex);
          setProgressMode(data.progressMode);
          setScreen('resume_prompt');
        } else {
          setScreen('menu');
        }
      } else {
        setUserHistory({});
        setProgressIndex(0);
        setProgressMode(null);
        setScreen('menu');
      }
      console.log("Data loaded for user:", id);
    } catch (error) {
      console.error("Failed to load user data", error);
      setUserHistory({});
      setScreen('menu');
    }
    setLoading(false);
  };

  const saveUserData = async (newHistory, newIndex, newMode) => {
    try {
      const docRef = doc(db, APP_ID, userId);
      await setDoc(docRef, {
        history: newHistory || userHistory,
        progressIndex: newIndex !== undefined ? newIndex : progressIndex,
        progressMode: newMode !== undefined ? newMode : progressMode,
        lastAccessed: new Date().toISOString()
      }, { merge: true });
      console.log("Data saved:", { newIndex, newMode });
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      loadUserData(userId.trim());
    }
  };

  const startQuiz = (mode, startIndex = 0) => {
    let filtered = [];
    if (mode === 'all') {
      filtered = [...quizData];
    } else if (mode === 'wrong') {
      filtered = quizData.filter(q => userHistory[q.id]?.isCorrect === false);
    } else if (mode === 'review') {
      filtered = quizData.filter(q => userHistory[q.id]?.isReview === true);
    }

    if (filtered.length === 0) {
      alert("該当する問題がありません。");
      return;
    }

    setCurrentQuestions(filtered);
    setCurrentIndex(startIndex);
    setProgressMode(mode);
    setProgressIndex(startIndex);
    setSelectedOption(null);
    setIsCorrect(null);
    setScreen('quiz');
    saveUserData(userHistory, startIndex, mode);
  };

  const handleResume = () => {
    startQuiz(progressMode, progressIndex);
  };

  const handleStartFresh = () => {
    setProgressIndex(0);
    setProgressMode(null);
    saveUserData(userHistory, 0, null);
    setScreen('menu');
  };

  const handleOptionClick = (index) => {
    const question = currentQuestions[currentIndex];
    const correct = index === question.answer;
    setSelectedOption(index);
    setIsCorrect(correct);
    
    // Update history
    const newHistory = { ...userHistory };
    if (!newHistory[question.id]) {
      newHistory[question.id] = { isReview: false };
    }
    newHistory[question.id].isCorrect = correct;
    setUserHistory(newHistory);
    
    setScreen('explanation');
    saveUserData(newHistory, currentIndex, progressMode);
  };

  const toggleReview = async () => {
    const question = currentQuestions[currentIndex];
    const newHistory = { ...userHistory };
    if (!newHistory[question.id]) {
      newHistory[question.id] = { isCorrect: false };
    }
    newHistory[question.id].isReview = !newHistory[question.id].isReview;
    setUserHistory(newHistory);
    await saveUserData(newHistory, currentIndex, progressMode);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < currentQuestions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setIsCorrect(null);
      setScreen('quiz');
      saveUserData(userHistory, nextIndex, progressMode);
    } else {
      setScreen('result');
      saveUserData(userHistory, 0, null); // Reset progress on completion
    }
  };

  const goHome = () => {
    saveUserData(userHistory, currentIndex, progressMode);
    setScreen('menu');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl text-gray-600 animate-pulse">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2"><BookOpen size={24} /> 過去問ドリル</h1>
          {screen !== 'login' && (
            <div className="flex gap-4">
              <button onClick={() => setScreen('history')} className="hover:text-blue-200"><List size={24} /></button>
              <button onClick={goHome} className="hover:text-blue-200"><Home size={24} /></button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* LOGIN SCREEN */}
          {screen === 'login' && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-6">学習を開始する</h2>
              <p className="mb-6 text-gray-600">ユーザーID（合言葉）を入力して、データを同期しましょう。</p>
              <form onSubmit={handleLogin} className="max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="ユーザーIDまたは合言葉"
                  className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
                  ログイン・はじめる
                </button>
              </form>
            </div>
          )}

          {/* RESUME PROMPT SCREEN */}
          {screen === 'resume_prompt' && (
            <div className="text-center py-10">
              <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4">前回の続きから再開しますか？</h2>
              <p className="mb-8 text-gray-600">
                前回は <strong>{progressMode === 'all' ? 'すべての問題' : progressMode === 'wrong' ? '前回不正解のみ' : '要復習のみ'}</strong> モードで、<br/>
                <strong>{progressIndex + 1}問目</strong> まで進んでいます。
              </p>
              <div className="space-y-4 max-w-sm mx-auto">
                <button onClick={handleResume} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">
                  <Play size={20} /> 続きから再開する
                </button>
                <button onClick={handleStartFresh} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded font-bold hover:bg-gray-300">
                  <RefreshCw size={20} /> 最初から始める
                </button>
              </div>
            </div>
          )}

          {/* MENU SCREEN */}
          {screen === 'menu' && (
            <div className="py-6">
              <h2 className="text-xl font-bold mb-6">モード選択</h2>
              <div className="space-y-4">
                <button onClick={() => startQuiz('all')} className="w-full text-left p-4 border rounded hover:bg-blue-50 flex justify-between items-center group transition">
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">すべての問題</h3>
                    <p className="text-sm text-gray-500">収録されている全{quizData.length}問を出題します。</p>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                </button>
                <button onClick={() => startQuiz('wrong')} className="w-full text-left p-4 border rounded hover:bg-blue-50 flex justify-between items-center group transition">
                  <div>
                    <h3 className="font-bold text-lg text-red-700">前回不正解の問題のみ</h3>
                    <p className="text-sm text-gray-500">過去に間違えた問題に再挑戦します。</p>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                </button>
                <button onClick={() => startQuiz('review')} className="w-full text-left p-4 border rounded hover:bg-blue-50 flex justify-between items-center group transition">
                  <div>
                    <h3 className="font-bold text-lg text-yellow-700">要復習の問題のみ</h3>
                    <p className="text-sm text-gray-500">チェックをつけた問題だけを出題します。</p>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                </button>
              </div>
            </div>
          )}

          {/* QUIZ SCREEN */}
          {screen === 'quiz' && currentQuestions[currentIndex] && (
            <div>
              <div className="flex justify-between items-end mb-4 border-b pb-2">
                <span className="text-sm text-gray-500 font-bold">{progressMode} mode</span>
                <span className="text-sm font-bold text-blue-600">問題 {currentIndex + 1} / {currentQuestions.length}</span>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-bold">{currentQuestions[currentIndex]?.year}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">{currentQuestions[currentIndex]?.theme}</span>
                </div>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{currentQuestions[currentIndex]?.question}</p>
              </div>
              <div className="space-y-3">
                {currentQuestions[currentIndex]?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className="w-full text-left p-4 border rounded hover:bg-blue-50 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* EXPLANATION SCREEN */}
          {screen === 'explanation' && currentQuestions[currentIndex] && (
            <div>
              <div className={`p-4 rounded mb-6 flex items-center gap-3 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isCorrect ? <Check size={32} /> : <X size={32} />}
                <span className="text-2xl font-bold">{isCorrect ? '正解！' : '不正解'}</span>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2 border-b pb-1">解説</h3>
                <div className="bg-gray-50 p-4 rounded border">
                  {currentQuestions[currentIndex]?.explanation()}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={userHistory[currentQuestions[currentIndex]?.id]?.isReview || false}
                    onChange={toggleReview}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="font-bold text-gray-700">要復習リストに入れる</span>
                </label>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  次の問題へ <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* RESULT SCREEN */}
          {screen === 'result' && (
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold mb-4">お疲れ様でした！</h2>
              <p className="mb-8 text-gray-600">選択したモードの全問題を終了しました。</p>
              <button
                onClick={goHome}
                className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
              >
                <Home size={20} /> ホームに戻る
              </button>
            </div>
          )}

          {/* HISTORY SCREEN */}
          {screen === 'history' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><List /> 学習履歴</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">問題</th>
                      <th className="border border-gray-300 p-2 text-center">前回結果</th>
                      <th className="border border-gray-300 p-2 text-center">要復習</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizData.map(q => {
                      const hist = userHistory[q.id];
                      return (
                        <tr key={q.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2 text-sm">
                            <span className="text-xs text-gray-500 block">{q.year} - {q.theme}</span>
                            {q.question.substring(0, 30)}...
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hist?.isCorrect === true ? (
                              <Check className="text-green-600 inline" size={20} />
                            ) : hist?.isCorrect === false ? (
                              <X className="text-red-600 inline" size={20} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hist?.isReview ? (
                              <AlertTriangle className="text-yellow-500 inline" size={20} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}