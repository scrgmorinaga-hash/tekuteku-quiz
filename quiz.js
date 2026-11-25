
/* ====================================
   てくてく安全クイズ
   quiz.js
==================================== */

// ① 問題データ
const questions = [
  {
    title: "第1問",
    image: "images/1738.jpg",
    instruction: "注意したい場所を1か所探そう！",
    mode: "spots",
    spots: [
      {
        x: 70.0,
        y: 80.0,
        range: 12,
        explanation: "歩ける場所が狭くなっています。"
      }
    ]
  },

  {
    title: "第2問",
    image: "images/1735.jpg",
    instruction: "危険そうな場所をタップしよう！",
    mode: "spots",

    // 正解後に表示する別角度の写真
    explanationImage: "images/1735_2.jpg",
    explanationCaption:
      "病院側の路側帯（右下）の狭さがありました",

    spots: [
      {
        x: 48.0,
        y: 58.0,
        range: 13,
        explanation: "歩ける場所が狭くなっています。"
      },
      {
        x: 72.0,
        y: 50.0,
        range: 13,
        explanation: "ミラーも無く建物が死角になっています。"
      }
    ]
  },

  {
  title: "第3問",
  image: "images/1743.jpg",
  instruction: "危険そうな場所をタップしよう！",
  mode: "spots",
  spots: [
    {
      x: 55.0,
      y: 50.0,
      range: 15,
      explanation: "地下鉄の出入口付近です。ここでは、歩行者や自転車の往来が多く、交錯に注意が必要です。"
    },
    {
      x: 80.0,
      y: 88.0,
      range: 11,
      explanation: "右下には段差や溝があり、つまずきや足元への注意が必要です。"
    }
  ]
}
];

// ② 進行状態
let currentQuestion = 0;
let foundSpots = [];

// ③ クイズ開始
function startQuiz() {
  currentQuestion = 0;
  foundSpots = [];

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("finishScreen").style.display = "none";

  const questionScreen = document.getElementById("questionScreen");
  questionScreen.style.display = "flex";
  triggerPopIn(questionScreen);

  showQuestion();
}

// ④ 問題表示
function showQuestion() {
  const question = questions[currentQuestion];
  foundSpots = [];

  document.getElementById("questionTitle").textContent = question.title;
  document.getElementById("questionText").textContent = question.instruction;

  const quizImage = document.getElementById("quizImage");
  quizImage.src = question.image;

  // 前の問題の追加写真を非表示にする
  const extraPhoto = document.getElementById("extraPhoto");
  if (extraPhoto) {
    extraPhoto.style.display = "none";
  }

  const nextButton = document.getElementById("nextButton");

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "結果発表"
      : "次へ";

  if (question.mode === "view") {
    document.getElementById("positionResult").textContent =
      question.message || "";

    nextButton.style.display = "block";
    return;
  }

  document.getElementById("positionResult").textContent =
    "写真をタップしてみましょう！ 発見 0/" +
    question.spots.length + "か所";

  nextButton.style.display = "none";
}

// ⑤ タップ位置の判定
function checkPosition(event) {
  const question = questions[currentQuestion];

  if (question.mode === "view") {
    return;
  }

  const image = event.currentTarget;
  const rect = image.getBoundingClientRect();

  // 写真内の割合座標（0〜100%）
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  let selectedIndex = -1;
  let nearestDistance = Infinity;

  question.spots.forEach((spot, index) => {
    const dx = Math.abs(x - spot.x);
    const dy = Math.abs(y - spot.y);

    if (dx <= spot.range && dy <= spot.range) {
      const distance = dx * dx + dy * dy;

      if (distance < nearestDistance) {
        nearestDistance = distance;
        selectedIndex = index;
      }
    }
  });

  let message = "もう少し探してみましょう！";

  if (selectedIndex !== -1) {
    if (!foundSpots.includes(selectedIndex)) {
      foundSpots.push(selectedIndex);

      message =
        "発見！ " +
        question.spots[selectedIndex].explanation;
    } else {
      message = "ここは発見済みです！";
    }
  }

  const count = foundSpots.length;
  const total = question.spots.length;

  const positionResult =
    document.getElementById("positionResult");

  positionResult.textContent =
    message + "（発見 " + count + "/" + total + "か所）";

  // すべて発見したとき
  if (count === total) {

    // 〇 正解！と説明文を表示
    positionResult.innerHTML =
      '<span class="correct-title">〇 正解！</span>' +
      '<span class="correct-explanation"></span>';

    document.querySelector(".correct-explanation").textContent =
      question.spots.map(spot => spot.explanation).join("\n\n");

    // 別角度の写真が設定されていれば表示
    if (question.explanationImage) {
      const extraPhoto =
        document.getElementById("extraPhoto");

      const extraImage =
        document.getElementById("extraImage");

      const extraCaption =
        document.getElementById("extraCaption");

      if (extraPhoto && extraImage && extraCaption) {
        extraImage.src = question.explanationImage;

        extraCaption.textContent =
          question.explanationCaption || "";

        extraPhoto.style.display = "block";
      }
    }

    // 次の問題ボタンを表示
    document.getElementById("nextButton").style.display =
      "block";
  }
}

 // ⑥ 次の画面へ進む
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();

    const questionScreen =
      document.getElementById("questionScreen");

    triggerPopIn(questionScreen);

  } else {
    document.getElementById("questionScreen").style.display =
      "none";

    const finishScreen =
      document.getElementById("finishScreen");

    finishScreen.style.display = "flex";
    triggerPopIn(finishScreen);

    // クラッカー演出
    if (typeof confetti === "function") {

      // 左側から発射
      confetti({
        particleCount: 100,
        spread: 70,
        angle: 60,
        origin: { x: 0, y: 0.7 }
      });

      // 右側から発射
      confetti({
        particleCount: 100,
        spread: 70,
        angle: 120,
        origin: { x: 1, y: 0.7 }
      });

    }
  }
}

// ⑦ トップ画面へ戻る
function goToStart() {
  document.getElementById("questionScreen").style.display =
    "none";

  document.getElementById("finishScreen").style.display =
    "none";

  const startScreen =
    document.getElementById("startScreen");

  startScreen.style.display = "flex";
  startScreen.classList.remove("pop-in");
}

// ⑧ ポップインアニメーションの再発動
function triggerPopIn(element) {
  element.classList.remove("pop-in");
  void element.offsetWidth;
  element.classList.add("pop-in");
}
