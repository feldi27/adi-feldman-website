/* ============================================================
   Wonder Train (רכבת הפלאים) — self-contained game module.
   Lives in its own file so it can evolve in parallel with the
   rest of the page. Injects its markup into the empty
   <div id="game"> placeholder, then runs the game engine.
   Relies on page globals: icon(), and (optional) playChime().
   ------------------------------------------------------------
   PHASE 1 mechanic: no dice. Each station shows a thinking
   question; tapping "ענינו!" earns a spark that flies into the
   lantern meter; then the player CHOOSES which station to visit
   next (next step or a leap). Fill the lantern, reach the castle.
   ============================================================ */
(function(){
  var root = document.getElementById('game');
  if(!root) return;
  root.innerHTML = `
    <section>
      <div class="eyebrow" style="text-align:center">משחק חשיבה ושפה</div>
      <h2 class="section-title" style="text-align:center">רכבת הפלאים</h2>
      <p class="lead" style="margin:18px auto 0;text-align:center">מסע מסביב לעולם ב-20 תחנות קסומות. בחרו דמות ורמת גיל — בכל תחנה שאלת חשיבה, ואתם בוחרים לאן ממשיכים. על כל תחנה אוספים ניצוץ שמדליק את הפנס. בלי הרשמה, פשוט משחקים.</p>

      <!-- setup -->
      <div id="gameSetup" class="game-setup">
        <h3 class="game-h3">1 · בחרו דמות</h3>
        <div class="char-picker" id="charPicker">
          <button class="char-card" data-char="fox" data-name="שועלי"><span class="char-face" data-icon="fox"></span><span class="char-name">שועלי</span></button>
          <button class="char-card" data-char="rabbit" data-name="ארנבון"><span class="char-face" data-icon="rabbit"></span><span class="char-name">ארנבון</span></button>
          <button class="char-card" data-char="owl" data-name="ינשופי"><span class="char-face" data-icon="owl"></span><span class="char-name">ינשופי</span></button>
          <button class="char-card" data-char="bear" data-name="דובוני"><span class="char-face" data-icon="bear"></span><span class="char-name">דובוני</span></button>
        </div>

        <h3 class="game-h3" style="margin-top:44px">2 · בחרו רמת גיל</h3>
        <div class="level-cards">
          <button class="level-card lc-1" data-level="1">
            <span class="lvl-emoji" data-icon="seedling"></span>
            <span class="lvl-title">רמה 1</span>
            <span class="lvl-age">גילאי 4–6</span>
            <span class="lvl-desc">שאלות "למה" מהעולם הקרוב והמוכר</span>
          </button>
          <button class="level-card lc-2" data-level="2">
            <span class="lvl-emoji" data-icon="sprout"></span>
            <span class="lvl-title">רמה 2</span>
            <span class="lvl-age">גילאי 7–9</span>
            <span class="lvl-desc">חוקים, סיבה ותוצאה, והעולם הרחב</span>
          </button>
          <button class="level-card lc-3" data-level="3">
            <span class="lvl-emoji" data-icon="tree"></span>
            <span class="lvl-title">רמה 3</span>
            <span class="lvl-age">גילאי 10–12</span>
            <span class="lvl-desc">חשיבה מורכבת, "מה היה קורה אילו", וטיעון</span>
          </button>
        </div>
        <p class="setup-hint" id="setupHint">בחרו דמות ורמה כדי להתחיל את ההרפתקה</p>
      </div>

      <!-- board -->
      <div id="gameBoard" class="game-board-wrap" style="display:none">
        <div class="game-topbar">
          <button class="btn btn-ghost btn-sm" id="backBtn"><span data-icon="back"></span> מסך פתיחה</button>
          <div class="lantern-meter" id="lanternMeter" title="הניצוצות שאספתם">
            <span class="lantern-ico"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3h4"/><path d="M9 6h6l-1 2v8a2 2 0 0 1-4 0V8Z"/><path d="M12 9.5c1.2 1 1.8 2 1.8 3a1.8 1.8 0 0 1-3.6 0c0-1 .6-2 1.8-3Z"/></svg></span>
            <div class="lantern-bar"><div class="lantern-fill" id="lanternFill"></div></div>
            <span class="lantern-count"><span id="sparkCount">0</span>/<span id="sparkTarget">10</span></span>
          </div>
          <div class="lvl-pill" id="lvlPill">רמה 1 · גילאי 4–6</div>
        </div>

        <!-- winding map scene -->
        <div class="map-viewport" id="mapViewport">
          <div class="map-world" id="mapWorld">
            <svg class="map-rail" id="mapRail" viewBox="0 0 1000 1700" preserveAspectRatio="xMidYMin meet"></svg>
            <div class="stations-layer" id="stationsLayer"></div>
            <div class="player-token" id="playerToken" data-icon="fox"></div>
          </div>
        </div>

        <div class="game-main">
          <div class="station-banner" id="stationBanner">
            <span class="sb-emoji" id="sbEmoji" data-icon="flag"></span>
            <div class="sb-text"><span class="sb-num" id="sbNum">תחנה 1</span><span class="sb-name" id="sbName">תחנת הזינוק</span></div>
          </div>

          <div class="question-card" id="questionCard">
            <p class="q-text" id="qText">בחרו דמות ורמה — וצאו לדרך!</p>
            <div class="q-hint" id="qHint"></div>
            <div class="q-actions" id="qActions">
              <button class="btn btn-ghost btn-sm" id="hintBtn" style="display:none"><span data-icon="bulb"></span><span>רמז לדיון</span></button>
              <button class="btn btn-primary btn-roll" id="answerBtn"><span data-icon="sparkle"></span><span class="rl">ענינו! אספו ניצוץ</span></button>
            </div>
            <div class="choice-zone" id="choiceZone" style="display:none">
              <p class="choice-label">יופי! לאן ממשיכים?</p>
              <div class="choice-options" id="choiceOptions"></div>
            </div>
          </div>
        </div>

        <div id="winScreen" class="win-screen" style="display:none">
          <div class="win-emoji" data-icon="trophy"></div>
          <h3>כל הכבוד! הגעתם לארמון הסיום!</h3>
          <p>סיימתם מסע מלא חשיבה.</p>
          <button class="btn btn-primary" id="againBtn">סיבוב נוסף <span data-icon="refresh"></span></button>
          <button class="btn btn-ghost" id="otherBtn">מסע אחר</button>
        </div>
      </div>

      <p class="game-note"><span data-icon="heart"></span><span>טיפ להורים ולמטפלים: אין תשובה אחת נכונה. המטרה היא לעודד את הילד לחשוב בקול, להסביר ולנמק. אפשר להיעזר ברמז לדיון כדי להעמיק את השיחה.</span></p>
    </section>`;
  /* hydrate the injected [data-icon] spans (page hydrator already ran) */
  root.querySelectorAll('[data-icon]').forEach(function(el){ el.innerHTML = icon(el.dataset.icon); });
})();

  const QUESTIONS = {
    1: [ // גילאי 4-6
      {q:"למה אנחנו מצחצחים שיניים?", h:"חשבו מה קורה לשיניים אם לא מנקים אותן."},
      {q:"למה אנחנו נועלים נעליים?", h:"מה מרגישים כשהולכים יחפים בחוץ?"},
      {q:"למה אנשים פותחים מטרייה כשיורד גשם?", h:"מה היה קורה בלי המטרייה?"},
      {q:"למה אנחנו צריכים לישון בלילה?", h:"איך מרגישים כשעייפים מאוד?"},
      {q:"למה אנחנו אוכלים פירות וירקות?", h:"מה הם נותנים לגוף שלנו?"},
      {q:"למה חובשים קסדה ברכיבה על אופניים?", h:"מה הקסדה מגינה עליו?"},
      {q:"למה לחיות יש זנב?", h:"חשבו על חתול או כלב — מה הם עושים עם הזנב?"},
      {q:"למה אנחנו חוגגים ימי הולדת?", h:"מה אנחנו מציינים ביום הזה?"},
      {q:"למה אנחנו שמים כרית כשישנים?", h:"איך זה מרגיש בלי כרית?"},
      {q:"למה אנחנו צריכים לשתות מים?", h:"מה קורה לגוף כשצמאים?"},
      {q:"למה ציפורים עפות?", h:"איך זה עוזר להן למצוא אוכל או לברוח?"},
      {q:"למה אנחנו הולכים לגן או לבית הספר?", h:"מה לומדים שם?"},
      {q:"למה אנחנו שוטפים ידיים?", h:"מה מסתתר על הידיים שאי אפשר לראות?"},
      {q:"למה צריך לשמור על שקט בספרייה?", h:"מה אנשים עושים שם?"},
      {q:"למה לובשים מעיל בחורף?", h:"איך המעיל עוזר לנו?"},
      {q:"למה מורחים קרם הגנה בים?", h:"ממה הקרם שומר על העור?"},
      {q:"למה לאנשים יש חיות מחמד?", h:"מה כיף בלגדל חיה?"},
      {q:"למה יש עונות שונות בשנה?", h:"מה משתנה בין קיץ לחורף?"},
      {q:"למה אנשים שותלים עצים?", h:"מה עצים נותנים לנו?"},
      {q:"למה אנחנו צריכים תמרורים בכביש?", h:"מה היה קורה בלעדיהם?"},
      {q:"למה שמים אוכל במקרר?", h:"מה קורה לאוכל שנשאר בחוץ?"},
      {q:"למה משתמשים בסבון באמבטיה?", h:"מה הסבון מנקה?"},
      {q:"למה צריך לחכות לאור הירוק לפני שחוצים?", h:"מה האור האדום אומר לנו?"},
      {q:"למה לובשים בגדים שונים לאירועים שונים?", h:"מה לובשים למסיבה ומה לשינה?"},
      {q:"למה יש חיות שחיות במים?", h:"איך הן נושמות ושוחות שם?"},
      {q:"למה מפעילים מאוורר או מזגן בקיץ?", h:"איך זה עוזר כשחם מאוד?"},
      {q:"למה אנחנו לובשים בגדים?", h:"ממה הבגדים שומרים עלינו?"},
      {q:"למה אנשים מגדלים פרחים בגינה?", h:"מה יפה או טוב בפרחים?"},
      {q:"למה צריך לזרוק זבל לפח?", h:"מה היה קורה אם כולם זרקו על הרצפה?"},
      {q:"למה אנחנו צריכים שעונים?", h:"איך יודעים מתי הזמן לעשות דברים?"}
    ],
    2: [ // גילאי 7-9
      {q:"למה אנשים ממחזרים?", h:"מה קורה לאשפה שאפשר להשתמש בה שוב?"},
      {q:"למה אנחנו צריכים לעקוב אחרי כללים?", h:"מה היה קורה אם לכל אחד היו כללים אחרים?"},
      {q:"מה היה קורה אם לא היו בתי ספר?", h:"איך ילדים היו לומדים דברים?"},
      {q:"למה אנחנו צריכים רופאים ובתי חולים?", h:"מי עוזר לנו כשחולים?"},
      {q:"למה יש שפות שונות בעולם?", h:"איך זה קשור למקומות שבהם אנשים גרים?"},
      {q:"למה יש אזורי זמן שונים בעולם?", h:"חשבו על השמש — היא זורחת בכל מקום באותו רגע?"},
      {q:"למה אנשים מתעמלים?", h:"מה זה עושה לגוף ולבריאות?"},
      {q:"למה יש חיות שנכנסות לתרדמת חורף?", h:"מה קשה למצוא בחורף?"},
      {q:"מה היה קורה אם לא היו עצים?", h:"חשבו על אוויר, צל ובעלי חיים."},
      {q:"למה אנשים משתמשים בכסף כדי לקנות דברים?", h:"איך היה אפשר אחרת לקבל מה שצריך?"},
      {q:"למה אנחנו צריכים כבאים?", h:"מתי קוראים להם?"},
      {q:"למה יש פנסי רחוב?", h:"מה הם עוזרים לנו לעשות בלילה?"},
      {q:"למה יש חיות שנודדות ממקום למקום?", h:"מה הן מחפשות במקום אחר?"},
      {q:"למה חשוב לחסוך בחשמל?", h:"מאיפה החשמל מגיע ומה זה עולה?"},
      {q:"למה יש לנו סופי שבוע?", h:"למה טוב לנוח אחרי כמה ימים?"},
      {q:"מה היה קורה אם לא היו דבורים?", h:"חשבו איך פרחים ופירות גדלים."},
      {q:"למה יש חוקים?", h:"איך הם שומרים על כולנו?"},
      {q:"למה אנשים משתמשים במפה או בניווט כשנוסעים?", h:"איך מוצאים את הדרך למקום חדש?"},
      {q:"למה יש אנשים שמרכיבים משקפיים?", h:"במה המשקפיים עוזרים?"},
      {q:"למה אנחנו צריכים חקלאים?", h:"מאיפה מגיע האוכל שלנו?"},
      {q:"למה חשוב להגן על חיות בסכנת הכחדה?", h:"מה קורה כשמין חיה נעלם לגמרי?"},
      {q:"למה אנשים משתמשים בתחבורה ציבורית?", h:"מה היתרון על פני נסיעה לבד?"},
      {q:"למה יש סוגים שונים של בתים?", h:"איך אקלים ומקום משפיעים על זה?"},
      {q:"למה חשוב לשמור על הסביבה?", h:"איך זה משפיע על העתיד שלנו?"},
      {q:"למה יש מוזיאונים?", h:"מה אפשר ללמוד ולראות בהם?"},
      {q:"למה יש מאכלים שצריך לבשל לפני האכילה?", h:"מה הבישול עושה לאוכל?"},
      {q:"למה יש מזג אוויר שונה?", h:"מה גורם לגשם, שמש או רוח?"},
      {q:"מה היה קורה אם לא היו מכוניות?", h:"איך אנשים היו מגיעים למקומות רחוקים?"},
      {q:"למה אנשים כותבים ספרים?", h:"מה אפשר להעביר לאחרים דרך ספר?"},
      {q:"למה יש שמורות טבע וגנים לאומיים?", h:"על מה הם שומרים?"}
    ],
    3: [ // גילאי 10-12
      {q:"למה יש בחירות ושיטה דמוקרטית?", h:"איך אנשים בוחרים מי יוביל אותם?"},
      {q:"מה היה קורה אם לא היו אוקיינוסים?", h:"חשבו על מים, אקלים ובעלי חיים."},
      {q:"למה יש מטבעות שונים במדינות שונות?", h:"איך זה קשור לכלכלה של כל מדינה?"},
      {q:"מה היה קורה אם לא היה חשמל במשך שבוע?", h:"חשבו על בית, אוכל ותקשורת."},
      {q:"למה חשוב לחסוך במים?", h:"כמה מהמים בעולם מתאימים לשתייה?"},
      {q:"מה היה קורה אם כל הרי הגעש בעולם היו מתפרצים בבת אחת?", h:"חשבו על האוויר ועל האקלים."},
      {q:"למה חשוב לשמר אתרים היסטוריים?", h:"מה אפשר ללמוד מהעבר?"},
      {q:"למה חשוב ללמוד היסטוריה?", h:"איך טעויות העבר עוזרות לעתיד?"},
      {q:"מה היה קורה אם דלקי המאובנים היו נגמרים?", h:"חשבו על אנרגיה חלופית."},
      {q:"למה חשוב להפחית זיהום?", h:"איך זיהום משפיע על בריאות ועל הטבע?"},
      {q:"למה יש מדינות שבהן יוקר המחיה גבוה יותר?", h:"מה משפיע על מחירים במקום מסוים?"},
      {q:"מה היה קורה אם האינטרנט היה מפסיק לעבוד ליום שלם?", h:"על מה בחיים שלנו הוא משפיע?"},
      {q:"למה מגוון ביולוגי חשוב למערכת אקולוגית?", h:"מה קורה כשמין אחד נעלם משרשרת המזון?"},
      {q:"מה היה קורה אם כל העולם היה הופך לצמחוני?", h:"חשבו על חקלאות, סביבה וכלכלה."},
      {q:"למה חשוב להגן על שכבת האוזון?", h:"ממה היא מגינה עלינו?"},
      {q:"איך ההתחממות הגלובלית משפיעה על כדור הארץ?", h:"חשבו על קרחונים, מזג אוויר וים."},
      {q:"מה היה קורה אם כל הקרח בעולם היה נמס?", h:"מה יקרה למפלס הים ולחופים?"},
      {q:"למה חשובה תזונה מאוזנת?", h:"מה הגוף צריך כדי לתפקד היטב?"},
      {q:"מה היה קורה אם לא היו יותר אנטיביוטיקות?", h:"איך מטפלים בזיהומים בלעדיהן?"},
      {q:"למה לומדים מקצועות שונים בבית הספר?", h:"איך כל תחום עוזר בחיים?"},
      {q:"למה אנרגיה מתחדשת חשובה לעתיד?", h:"במה היא שונה מדלק רגיל?"},
      {q:"מה היה קורה אם כל שוניות האלמוגים בעולם היו מתות?", h:"חשבו על החיים בים."},
      {q:"איך דיג יתר משפיע על המערכת הימית?", h:"מה קורה כשתופסים יותר מדי דגים?"},
      {q:"מה היה קורה אם הקטבים המגנטיים של כדור הארץ היו מתהפכים?", h:"חשבו על מצפנים ועל ניווט."},
      {q:"למה חשוב חופש הביטוי?", h:"למה חשוב שאנשים יוכלו להביע דעה?"},
      {q:"מה היה קורה אם כל העולם היה מדבר באותה שפה?", h:"מה היה משתפר ומה אולי היה הולך לאיבוד?"},
      {q:"למה למדינות יש גבולות?", h:"מה הם מסמנים ולמה הם נחוצים?"},
      {q:"איך אסונות טבע משפיעים על קהילות?", h:"חשבו על בתים, אנשים ושיקום."},
      {q:"מה היה קורה אם לא היו יותר מים מתוקים על כדור הארץ?", h:"על מה בחיים שלנו זה ישפיע?"},
      {q:"למה חשוב להשקיע במחקר מדעי ובטכנולוגיה?", h:"איך זה משנה את החיים שלנו?"}
    ]
  };

  /* ===== engine ===== */
  const LEVEL_META={1:"רמה 1 · גילאי 4–6",2:"רמה 2 · גילאי 7–9",3:"רמה 3 · גילאי 10–12"};
  const TOTAL=20;
  const SPARK_TARGET=10;   // lantern fills after this many sparks

  const STATIONS=[
    {n:"תחנת הזינוק", e:"flag", c1:"#8FD694", c2:"#5BB368"},
    {n:"יער הלחישות", e:"pine", c1:"#4F9E6A", c2:"#2F7048"},
    {n:"אגם הבדולח", e:"droplet", c1:"#7FD3E8", c2:"#3FA9CC"},
    {n:"גבעת הפרפרים", e:"butterfly", c1:"#F4A6C8", c2:"#E66BA0"},
    {n:"מערת הגבישים", e:"gem", c1:"#B79CE6", c2:"#8763C9"},
    {n:"חוף הזהב", e:"umbrella", c1:"#FBE0A6", c2:"#F4B95E"},
    {n:"אי האוצר", e:"map", c1:"#5FD3B8", c2:"#2DA88C"},
    {n:"הר הגעש", e:"volcano", c1:"#F2925E", c2:"#D9532E"},
    {n:"מדבר הזהב", e:"dunes", c1:"#ECC579", c2:"#C99A3C"},
    {n:"נווה המדבר", e:"palm", c1:"#7FCBA0", c2:"#3F9E78"},
    {n:"עיר האורות", e:"city", c1:"#6E84C9", c2:"#3F4E9E"},
    {n:"גשר הקשת", e:"rainbow", c1:"#F2A6D6", c2:"#9C7BE6"},
    {n:"יער הפטריות", e:"mushroom", c1:"#E08AB5", c2:"#B05598"},
    {n:"אגם הברבורים", e:"swan", c1:"#BFE3F2", c2:"#7FB8D9"},
    {n:"מבצר העננים", e:"cloud", c1:"#CFE0F2", c2:"#9CB8E0"},
    {n:"שדה הכוכבים", e:"star", c1:"#8C8CE6", c2:"#5151B0"},
    {n:"תחנת החלל", e:"rocket", c1:"#7E6BC9", c2:"#4A3F8C"},
    {n:"כוכב הירח", e:"moon", c1:"#C9CEDC", c2:"#8C93AB"},
    {n:"שביל הזהב", e:"sparkle", c1:"#F7D98C", c2:"#E0B04E"},
    {n:"ארמון הסיום", e:"trophy", c1:"#F4C95E", c2:"#D99A2E"}
  ];

  // winding path positions in viewBox coords (1000 x 1700), serpentine
  const PATH=[];
  (function buildPath(){
    const cols=[180,400,620,820];
    const rowH=300, top=130, perRow=4;
    for(let i=0;i<TOTAL;i++){
      const row=Math.floor(i/perRow);
      let idx=i%perRow;
      const ltr = row%2===0;
      const x = ltr ? cols[idx] : cols[perRow-1-idx];
      const y = top + row*rowH + Math.sin(i*1.1)*26;
      PATH.push({x,y});
    }
  })();

  let gState={level:null,char:"fox",pos:0,deck:[],qi:0,sparks:0,completed:new Set(),busy:false,pendingLevel:null};
  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

  /* ---- setup selection ---- */
  document.querySelectorAll('.char-card').forEach(c=>{
    c.addEventListener('click',()=>{
      document.querySelectorAll('.char-card').forEach(x=>x.classList.remove('sel'));
      c.classList.add('sel');
      gState.char=c.dataset.char;
      maybeStart();
    });
  });
  document.querySelectorAll('.level-card').forEach(c=>{
    c.addEventListener('click',()=>{
      document.querySelectorAll('.level-card').forEach(x=>x.classList.remove('sel'));
      c.classList.add('sel');
      gState.pendingLevel=parseInt(c.dataset.level);
      maybeStart();
    });
  });
  function maybeStart(){
    const hasChar=document.querySelector('.char-card.sel');
    const hasLvl=document.querySelector('.level-card.sel');
    const hint=document.getElementById('setupHint');
    if(hasChar&&hasLvl){hint.textContent='יוצאים לדרך…';setTimeout(()=>startLevel(gState.pendingLevel),350);}
    else if(hasChar){hint.textContent='עכשיו בחרו רמת גיל';}
    else if(hasLvl){hint.textContent='עכשיו בחרו דמות';}
  }

  function startLevel(lvl){
    gState.level=lvl;
    gState.deck=shuffle(QUESTIONS[lvl]);
    gState.qi=0;gState.pos=0;gState.sparks=0;gState.completed=new Set();gState.busy=false;
    document.getElementById('gameSetup').style.display='none';
    document.getElementById('gameBoard').style.display='block';
    document.getElementById('winScreen').style.display='none';
    document.getElementById('questionCard').style.display='block';
    document.getElementById('lvlPill').textContent=LEVEL_META[lvl];
    document.getElementById('playerToken').innerHTML=icon(gState.char);
    document.getElementById('sparkTarget').textContent=SPARK_TARGET;
    buildMap();
    placeToken(0,false);
    cameraTo(0);
    updateLantern();
    showStation(0);
  }

  /* ---- map building ---- */
  function buildMap(){
    const rail=document.getElementById('mapRail');
    const layer=document.getElementById('stationsLayer');
    let d='M '+PATH[0].x+' '+PATH[0].y;
    for(let i=1;i<TOTAL;i++){
      const p0=PATH[i-1],p1=PATH[i];
      const mx=(p0.x+p1.x)/2;
      d+=` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    rail.innerHTML=`
      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="34" stroke-linecap="round" opacity="0.55"/>
      <path d="${d}" fill="none" stroke="#C9956B" stroke-width="20" stroke-linecap="round" stroke-dasharray="2 30" opacity="0.85"/>`;
    layer.innerHTML='';
    STATIONS.forEach((s,i)=>{
      const p=PATH[i];
      const el=document.createElement('div');
      el.className='station';el.id='st'+i;
      el.style.left=(p.x/1000*100)+'%';
      el.style.top=p.y+'px';
      el.innerHTML=`<div class="st-num">${i+1}</div>
        <div class="st-pin" style="background:linear-gradient(150deg,${s.c1},${s.c2})"><span>${icon(s.e)}</span></div>
        <div class="st-label">${s.n}</div>`;
      layer.appendChild(el);
    });
    paintStations();
  }
  function paintStations(){
    for(let i=0;i<TOTAL;i++){
      const el=document.getElementById('st'+i);if(!el)continue;
      el.classList.remove('cur','done');
      if(gState.completed.has(i))el.classList.add('done');
      if(i===gState.pos)el.classList.add('cur');
    }
  }
  function placeToken(i,hop){
    const p=PATH[i];
    const tok=document.getElementById('playerToken');
    tok.style.left=(p.x/1000*100)+'%';
    tok.style.top=p.y+'px';
    if(hop){tok.classList.remove('hop');void tok.offsetWidth;tok.classList.add('hop');}
  }
  function cameraTo(i){
    const vp=document.getElementById('mapViewport');
    const world=document.getElementById('mapWorld');
    const vh=vp.clientHeight;
    const py=PATH[i].y;
    let offset=py-vh/2;
    const maxOffset=1700-vh;
    offset=Math.max(0,Math.min(offset,maxOffset));
    world.style.transform=`translateY(${-offset}px)`;
  }
  function updateBanner(i){
    const s=STATIONS[i];
    document.getElementById('sbEmoji').innerHTML=icon(s.e);
    document.getElementById('sbNum').textContent='תחנה '+(i+1);
    document.getElementById('sbName').textContent=s.n;
  }

  /* ---- reward loop ---- */
  function updateLantern(){
    const pct=Math.min(100,Math.round(gState.sparks/SPARK_TARGET*100));
    document.getElementById('lanternFill').style.width=pct+'%';
    document.getElementById('sparkCount').textContent=gState.sparks;
    document.getElementById('lanternMeter').classList.toggle('lit',gState.sparks>=SPARK_TARGET);
  }
  function flySpark(){
    const card=document.getElementById('questionCard');
    const lantern=document.getElementById('lanternMeter');
    if(!card||!lantern)return;
    const cr=card.getBoundingClientRect(),lr=lantern.getBoundingClientRect();
    const sx=cr.left+cr.width/2,sy=cr.top+34;
    const tx=lr.left+lr.width/2,ty=lr.top+lr.height/2;
    const SP='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.7 5 1.5 5.8 6.5 6.5-5 .7-5.8 1.5-6.5 6.5-.7-5-1.5-5.8-6.5-6.5C10.5 7.8 11.3 7 12 2Z"/></svg>';
    for(let k=0;k<5;k++){
      const s=document.createElement('div');s.className='spark-fly';s.innerHTML=SP;
      s.style.left=(sx-11)+'px';s.style.top=(sy-11)+'px';
      document.body.appendChild(s);
      const jx=(Math.random()-.5)*70,jy=(Math.random()-.5)*30;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{s.style.transform='translate('+(tx-sx+jx)+'px,'+(ty-sy+jy)+'px) scale(1)';s.style.opacity='0';}));
      setTimeout(()=>s.remove(),1000+k*30);
    }
    if(typeof playChime==='function'){try{playChime();}catch(e){}}
  }

  /* ---- station flow ---- */
  function showStation(i){
    gState.pos=i;
    paintStations();
    updateBanner(i);
    clearPicks();
    document.getElementById('choiceZone').style.display='none';
    document.getElementById('choiceOptions').innerHTML='';
    if(i>=TOTAL-1){winGame();return;}
    const card=gState.deck[gState.qi % gState.deck.length];gState.qi++;
    document.getElementById('qText').textContent=card.q;
    const qh=document.getElementById('qHint');qh.textContent=card.h;qh.className='q-hint';
    document.getElementById('hintBtn').style.display='inline-flex';
    const ab=document.getElementById('answerBtn');ab.style.display='inline-flex';ab.disabled=false;
    document.getElementById('questionCard').scrollIntoView({behavior:'smooth',block:'center'});
  }
  function answerStation(){
    const ab=document.getElementById('answerBtn');
    if(gState.busy||ab.disabled)return;
    ab.disabled=true;
    if(!gState.completed.has(gState.pos)){
      gState.completed.add(gState.pos);
      gState.sparks++;
      flySpark();
      setTimeout(updateLantern,600);
    }
    offerChoices();
  }
  function offerChoices(){
    const i=gState.pos;
    const opts=[];
    if(i+1<=TOTAL-1)opts.push({t:i+1,leap:false});
    if(i+2<=TOTAL-1 && i+1!==TOTAL-1)opts.push({t:i+2,leap:true});
    const wrap=document.getElementById('choiceOptions');wrap.innerHTML='';
    opts.forEach(o=>{
      const s=STATIONS[o.t];const isCastle=o.t===TOTAL-1;
      const b=document.createElement('button');b.className='choice-btn';
      b.innerHTML='<span class="ci">'+icon(s.e)+'</span><span class="cb-meta"><span class="cb-name">'+(isCastle?'אל הארמון!':s.n)+'</span><span class="cb-sub">'+(o.leap?'דילוג קדימה':'התחנה הבאה')+'</span></span>';
      b.addEventListener('click',()=>moveTo(o.t));
      wrap.appendChild(b);
    });
    document.getElementById('answerBtn').style.display='none';
    document.getElementById('hintBtn').style.display='none';
    document.getElementById('choiceZone').style.display='block';
    clearPicks();
    opts.forEach(o=>{const el=document.getElementById('st'+o.t);if(el){el.classList.add('pick');el.onclick=()=>moveTo(o.t);}});
  }
  function clearPicks(){document.querySelectorAll('.station.pick').forEach(el=>{el.classList.remove('pick');el.onclick=null;});}
  function moveTo(t){
    if(gState.busy)return;gState.busy=true;
    clearPicks();
    document.getElementById('choiceZone').style.display='none';
    gState.pos=t;
    paintStations();
    placeToken(t,true);
    cameraTo(t);
    setTimeout(()=>{gState.busy=false;showStation(t);},1000);
  }

  function winGame(){
    updateBanner(TOTAL-1);
    document.getElementById('questionCard').style.display='none';
    const ws=document.getElementById('winScreen');ws.style.display='block';
    const lit=gState.sparks>=SPARK_TARGET;
    ws.querySelector('h3').textContent=lit?'כל הכבוד! הדלקתם את הפנס והגעתם לארמון!':'כל הכבוד! הגעתם לארמון הסיום!';
    ws.querySelector('p').textContent='אספתם '+gState.sparks+' ניצוצות במסע.'+(lit?' הפנס מאיר באור מלא!':' אפשר לשחק שוב ולאסוף עוד ניצוצות.');
    fireConfetti();
    ws.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function fireConfetti(){
    const colors=['#F4A93C','#E06B9E','#6FBE7D','#6171C9','#FFD36B','#D9A98C','#7FD3E8'];
    for(let i=0;i<110;i++){
      const c=document.createElement('div');c.className='confetti';
      c.style.left=Math.random()*100+'vw';
      c.style.background=colors[Math.floor(Math.random()*colors.length)];
      c.style.animationDuration=(2+Math.random()*2)+'s';
      c.style.animationDelay=Math.random()*0.7+'s';
      c.style.width=c.style.height=(7+Math.random()*9)+'px';
      if(Math.random()>.5)c.style.borderRadius='50%';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),4400);
    }
  }

  function toggleHint(){document.getElementById('qHint').classList.toggle('show')}
  function resetGame(){
    document.getElementById('gameBoard').style.display='none';
    document.getElementById('gameSetup').style.display='block';
    document.querySelectorAll('.char-card,.level-card').forEach(x=>x.classList.remove('sel'));
    document.getElementById('setupHint').textContent='בחרו דמות ורמה כדי להתחיל את ההרפתקה';
    document.getElementById('gameSetup').scrollIntoView({behavior:'smooth',block:'center'});
  }
  function restartSameLevel(){startLevel(gState.level)}

  /* ---- wire up board buttons ---- */
  document.getElementById('backBtn').addEventListener('click',resetGame);
  document.getElementById('answerBtn').addEventListener('click',answerStation);
  document.getElementById('hintBtn').addEventListener('click',toggleHint);
  document.getElementById('againBtn').addEventListener('click',restartSameLevel);
  document.getElementById('otherBtn').addEventListener('click',resetGame);
