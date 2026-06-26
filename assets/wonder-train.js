/* ============================================================
   Wonder Train (רכבת הפלאים) — self-contained game module.
   Extracted from adi_feldman.html so it can be developed in
   parallel without touching the shared page. It injects its own
   markup into the empty <div id="game"> placeholder, then runs
   the game engine. Relies on globals from the page: icon().
   ============================================================ */
(function(){
  var root = document.getElementById('game');
  if(!root) return;
  root.innerHTML = "    <section>\n      <div class=\"eyebrow\" style=\"text-align:center\">\u05de\u05e9\u05d7\u05e7 \u05d7\u05e9\u05d9\u05d1\u05d4 \u05d5\u05e9\u05e4\u05d4</div>\n      <h2 class=\"section-title\" style=\"text-align:center\">\u05e8\u05db\u05d1\u05ea \u05d4\u05e4\u05dc\u05d0\u05d9\u05dd</h2>\n      <p class=\"lead\" style=\"margin:18px auto 0;text-align:center\">\u05de\u05e1\u05e2 \u05de\u05e1\u05d1\u05d9\u05d1 \u05dc\u05e2\u05d5\u05dc\u05dd \u05d1-20 \u05ea\u05d7\u05e0\u05d5\u05ea \u05e7\u05e1\u05d5\u05de\u05d5\u05ea. \u05d1\u05d7\u05e8\u05d5 \u05d3\u05de\u05d5\u05ea \u05d5\u05e8\u05de\u05ea \u05d2\u05d9\u05dc, \u05d2\u05dc\u05d2\u05dc\u05d5 \u05d0\u05ea \u05d4\u05e7\u05d5\u05d1\u05d9\u05d9\u05d4, \u05d5\u05e6\u05d0\u05d5 \u05dc\u05d4\u05e8\u05e4\u05ea\u05e7\u05d4 \u2014 \u05d1\u05db\u05dc \u05ea\u05d7\u05e0\u05d4 \u05e9\u05d0\u05dc\u05ea \u05d7\u05e9\u05d9\u05d1\u05d4 \u05d7\u05d3\u05e9\u05d4. \u05d1\u05dc\u05d9 \u05d4\u05e8\u05e9\u05de\u05d4, \u05e4\u05e9\u05d5\u05d8 \u05de\u05e9\u05d7\u05e7\u05d9\u05dd.</p>\n\n      <!-- setup -->\n      <div id=\"gameSetup\" class=\"game-setup\">\n        <h3 class=\"game-h3\">1 \u00b7 \u05d1\u05d7\u05e8\u05d5 \u05d3\u05de\u05d5\u05ea</h3>\n        <div class=\"char-picker\" id=\"charPicker\">\n          <button class=\"char-card\" data-char=\"fox\" data-name=\"\u05e9\u05d5\u05e2\u05dc\u05d9\"><span class=\"char-face\" data-icon=\"fox\"></span><span class=\"char-name\">\u05e9\u05d5\u05e2\u05dc\u05d9</span></button>\n          <button class=\"char-card\" data-char=\"rabbit\" data-name=\"\u05d0\u05e8\u05e0\u05d1\u05d5\u05df\"><span class=\"char-face\" data-icon=\"rabbit\"></span><span class=\"char-name\">\u05d0\u05e8\u05e0\u05d1\u05d5\u05df</span></button>\n          <button class=\"char-card\" data-char=\"owl\" data-name=\"\u05d9\u05e0\u05e9\u05d5\u05e4\u05d9\"><span class=\"char-face\" data-icon=\"owl\"></span><span class=\"char-name\">\u05d9\u05e0\u05e9\u05d5\u05e4\u05d9</span></button>\n          <button class=\"char-card\" data-char=\"bear\" data-name=\"\u05d3\u05d5\u05d1\u05d5\u05e0\u05d9\"><span class=\"char-face\" data-icon=\"bear\"></span><span class=\"char-name\">\u05d3\u05d5\u05d1\u05d5\u05e0\u05d9</span></button>\n        </div>\n\n        <h3 class=\"game-h3\" style=\"margin-top:44px\">2 \u00b7 \u05d1\u05d7\u05e8\u05d5 \u05e8\u05de\u05ea \u05d2\u05d9\u05dc</h3>\n        <div class=\"level-cards\">\n          <button class=\"level-card lc-1\" data-level=\"1\">\n            <span class=\"lvl-emoji\" data-icon=\"seedling\"></span>\n            <span class=\"lvl-title\">\u05e8\u05de\u05d4 1</span>\n            <span class=\"lvl-age\">\u05d2\u05d9\u05dc\u05d0\u05d9 4\u20136</span>\n            <span class=\"lvl-desc\">\u05e9\u05d0\u05dc\u05d5\u05ea \"\u05dc\u05de\u05d4\" \u05de\u05d4\u05e2\u05d5\u05dc\u05dd \u05d4\u05e7\u05e8\u05d5\u05d1 \u05d5\u05d4\u05de\u05d5\u05db\u05e8</span>\n          </button>\n          <button class=\"level-card lc-2\" data-level=\"2\">\n            <span class=\"lvl-emoji\" data-icon=\"sprout\"></span>\n            <span class=\"lvl-title\">\u05e8\u05de\u05d4 2</span>\n            <span class=\"lvl-age\">\u05d2\u05d9\u05dc\u05d0\u05d9 7\u20139</span>\n            <span class=\"lvl-desc\">\u05d7\u05d5\u05e7\u05d9\u05dd, \u05e1\u05d9\u05d1\u05d4 \u05d5\u05ea\u05d5\u05e6\u05d0\u05d4, \u05d5\u05d4\u05e2\u05d5\u05dc\u05dd \u05d4\u05e8\u05d7\u05d1</span>\n          </button>\n          <button class=\"level-card lc-3\" data-level=\"3\">\n            <span class=\"lvl-emoji\" data-icon=\"tree\"></span>\n            <span class=\"lvl-title\">\u05e8\u05de\u05d4 3</span>\n            <span class=\"lvl-age\">\u05d2\u05d9\u05dc\u05d0\u05d9 10\u201312</span>\n            <span class=\"lvl-desc\">\u05d7\u05e9\u05d9\u05d1\u05d4 \u05de\u05d5\u05e8\u05db\u05d1\u05ea, \"\u05de\u05d4 \u05d4\u05d9\u05d4 \u05e7\u05d5\u05e8\u05d4 \u05d0\u05d9\u05dc\u05d5\", \u05d5\u05d8\u05d9\u05e2\u05d5\u05df</span>\n          </button>\n        </div>\n        <p class=\"setup-hint\" id=\"setupHint\">\u05d1\u05d7\u05e8\u05d5 \u05d3\u05de\u05d5\u05ea \u05d5\u05e8\u05de\u05d4 \u05db\u05d3\u05d9 \u05dc\u05d4\u05ea\u05d7\u05d9\u05dc \u05d0\u05ea \u05d4\u05d4\u05e8\u05e4\u05ea\u05e7\u05d4</p>\n      </div>\n\n      <!-- board -->\n      <div id=\"gameBoard\" class=\"game-board-wrap\" style=\"display:none\">\n        <div class=\"game-topbar\">\n          <button class=\"btn btn-ghost btn-sm\" onclick=\"resetGame()\"><span data-icon=\"back\"></span> \u05de\u05e1\u05da \u05e4\u05ea\u05d9\u05d7\u05d4</button>\n          <div class=\"progress-pill\">\u05ea\u05d7\u05e0\u05d4 <span id=\"curStation\">0</span> / 20</div>\n          <div class=\"lvl-pill\" id=\"lvlPill\">\u05e8\u05de\u05d4 1 \u00b7 \u05d2\u05d9\u05dc\u05d0\u05d9 4\u20136</div>\n        </div>\n\n        <!-- winding map scene -->\n        <div class=\"map-viewport\" id=\"mapViewport\">\n          <div class=\"map-world\" id=\"mapWorld\">\n            <svg class=\"map-rail\" id=\"mapRail\" viewBox=\"0 0 1000 1700\" preserveAspectRatio=\"xMidYMin meet\"></svg>\n            <div class=\"stations-layer\" id=\"stationsLayer\"></div>\n            <div class=\"player-token\" id=\"playerToken\" data-icon=\"fox\"></div>\n          </div>\n        </div>\n\n        <div class=\"game-main\">\n          <div class=\"station-banner\" id=\"stationBanner\">\n            <span class=\"sb-emoji\" id=\"sbEmoji\" data-icon=\"flag\"></span>\n            <div class=\"sb-text\"><span class=\"sb-num\" id=\"sbNum\">\u05ea\u05d7\u05e0\u05d4 1</span><span class=\"sb-name\" id=\"sbName\">\u05ea\u05d7\u05e0\u05ea \u05d4\u05d6\u05d9\u05e0\u05d5\u05e7</span></div>\n          </div>\n\n          <div class=\"question-card\" id=\"questionCard\">\n            <p class=\"q-text\" id=\"qText\">\u05d2\u05dc\u05d2\u05dc\u05d5 \u05d0\u05ea \u05d4\u05e7\u05d5\u05d1\u05d9\u05d9\u05d4 \u05db\u05d3\u05d9 \u05dc\u05e6\u05d0\u05ea \u05dc\u05d3\u05e8\u05da!</p>\n            <div class=\"q-hint\" id=\"qHint\"></div>\n\n            <!-- DICE -->\n            <div class=\"dice-zone\" id=\"diceZone\">\n              <div class=\"dice\" id=\"dice\">\n                <div class=\"face f1\"><span></span></div>\n                <div class=\"face f2\"><span></span><span></span></div>\n                <div class=\"face f3\"><span></span><span></span><span></span></div>\n                <div class=\"face f4\"><span></span><span></span><span></span><span></span></div>\n                <div class=\"face f5\"><span></span><span></span><span></span><span></span><span></span></div>\n                <div class=\"face f6\"><span></span><span></span><span></span><span></span><span></span><span></span></div>\n              </div>\n            </div>\n\n            <div class=\"q-actions\">\n              <button class=\"btn btn-ghost btn-sm\" id=\"hintBtn\" onclick=\"toggleHint()\" style=\"display:none\"><span data-icon=\"bulb\"></span><span>\u05e8\u05de\u05d6 \u05dc\u05d3\u05d9\u05d5\u05df</span></button>\n              <button class=\"btn btn-primary btn-roll\" id=\"rollBtn\" onclick=\"rollDice()\"><span data-icon=\"dice\"></span><span class=\"rl\">\u05d2\u05dc\u05d2\u05dc\u05d5 \u05d0\u05ea \u05d4\u05e7\u05d5\u05d1\u05d9\u05d9\u05d4</span></button>\n            </div>\n          </div>\n        </div>\n\n        <div id=\"winScreen\" class=\"win-screen\" style=\"display:none\">\n          <div class=\"win-emoji\" data-icon=\"trophy\"></div>\n          <h3>\u05db\u05dc \u05d4\u05db\u05d1\u05d5\u05d3! \u05d4\u05d2\u05e2\u05ea\u05dd \u05dc\u05d0\u05e8\u05de\u05d5\u05df \u05d4\u05e1\u05d9\u05d5\u05dd!</h3>\n          <p>\u05e1\u05d9\u05d9\u05de\u05ea\u05dd \u05de\u05e1\u05e2 \u05de\u05dc\u05d0 \u05d7\u05e9\u05d9\u05d1\u05d4 \u05d3\u05e8\u05da \u05db\u05dc 20 \u05d4\u05ea\u05d7\u05e0\u05d5\u05ea. \u05d0\u05e4\u05e9\u05e8 \u05dc\u05e6\u05d0\u05ea \u05dc\u05d4\u05e8\u05e4\u05ea\u05e7\u05d4 \u05d7\u05d3\u05e9\u05d4.</p>\n          <button class=\"btn btn-primary\" onclick=\"restartSameLevel()\">\u05e1\u05d9\u05d1\u05d5\u05d1 \u05e0\u05d5\u05e1\u05e3 <span data-icon=\"refresh\"></span></button>\n          <button class=\"btn btn-ghost\" onclick=\"resetGame()\">\u05de\u05e1\u05e2 \u05d0\u05d7\u05e8</button>\n        </div>\n      </div>\n\n      <p class=\"game-note\"><span data-icon=\"heart\"></span><span>\u05d8\u05d9\u05e4 \u05dc\u05d4\u05d5\u05e8\u05d9\u05dd \u05d5\u05dc\u05de\u05d8\u05e4\u05dc\u05d9\u05dd: \u05d0\u05d9\u05df \u05ea\u05e9\u05d5\u05d1\u05d4 \u05d0\u05d7\u05ea \u05e0\u05db\u05d5\u05e0\u05d4. \u05d4\u05de\u05d8\u05e8\u05d4 \u05d4\u05d9\u05d0 \u05dc\u05e2\u05d5\u05d3\u05d3 \u05d0\u05ea \u05d4\u05d9\u05dc\u05d3 \u05dc\u05d7\u05e9\u05d5\u05d1 \u05d1\u05e7\u05d5\u05dc, \u05dc\u05d4\u05e1\u05d1\u05d9\u05e8 \u05d5\u05dc\u05e0\u05de\u05e7. \u05d0\u05e4\u05e9\u05e8 \u05dc\u05d4\u05d9\u05e2\u05d6\u05e8 \u05d1\u05e8\u05de\u05d6 \u05dc\u05d3\u05d9\u05d5\u05df \u05db\u05d3\u05d9 \u05dc\u05d4\u05e2\u05de\u05d9\u05e7 \u05d0\u05ea \u05d4\u05e9\u05d9\u05d7\u05d4.</span></p>\n    </section>";
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

  /* ===== board-game engine ===== */
  const LEVEL_META={1:"רמה 1 · גילאי 4–6",2:"רמה 2 · גילאי 7–9",3:"רמה 3 · גילאי 10–12"};
  const TOTAL=20;
  const DICE_ROT={1:[0,0],2:[0,180],3:[0,-90],4:[0,90],5:[-90,0],6:[90,0]};

  // 20 themed stations — each its own world
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
    const cols=[180,400,620,820];          // x lanes
    const rowH=300, top=130;
    const perRow=4;
    for(let i=0;i<TOTAL;i++){
      const row=Math.floor(i/perRow);
      let idx=i%perRow;
      const ltr = row%2===0;               // alternate direction (serpentine)
      const x = ltr ? cols[idx] : cols[perRow-1-idx];
      // gentle vertical wave within the row
      const y = top + row*rowH + Math.sin(i*1.1)*26;
      PATH.push({x,y});
    }
  })();

  let gState={level:null,char:"fox",pos:0,deck:[],idx:0,rolling:false,started:false};

  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

  /* selection */
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
    if(hasChar&&hasLvl){
      hint.textContent='יוצאים לדרך…';
      setTimeout(()=>startLevel(gState.pendingLevel),350);
    }else if(hasChar){hint.textContent='עכשיו בחרו רמת גיל';}
    else if(hasLvl){hint.textContent='עכשיו בחרו דמות';}
  }

  function startLevel(lvl){
    gState.level=lvl;
    gState.deck=shuffle(QUESTIONS[lvl]);
    gState.idx=0;gState.pos=0;gState.rolling=false;gState.started=false;
    document.getElementById('gameSetup').style.display='none';
    document.getElementById('gameBoard').style.display='block';
    document.getElementById('winScreen').style.display='none';
    document.getElementById('questionCard').style.display='block';
    document.getElementById('lvlPill').textContent=LEVEL_META[lvl];
    document.getElementById('playerToken').innerHTML=icon(gState.char);
    buildMap();
    placeToken(0,false);
    cameraTo(0);
    updateBanner(0);
    document.getElementById('qText').textContent='גלגלו את הקובייה כדי לצאת לדרך!';
    document.getElementById('curStation').textContent='0';
    document.getElementById('hintBtn').style.display='none';
    document.getElementById('qHint').className='q-hint';document.getElementById('qHint').textContent='';
    const btn=document.getElementById('rollBtn');btn.disabled=false;btn.querySelector('.rl').textContent='גלגלו את הקובייה';
    const d=document.getElementById('dice');d.className='dice';d.style.transform='rotateX(-20deg) rotateY(20deg)';
  }

  function buildMap(){
    const rail=document.getElementById('mapRail');
    const layer=document.getElementById('stationsLayer');
    // build winding rail path
    let d='M '+PATH[0].x+' '+PATH[0].y;
    for(let i=1;i<TOTAL;i++){
      const p0=PATH[i-1],p1=PATH[i];
      const mx=(p0.x+p1.x)/2;
      d+=` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    rail.innerHTML=`
      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="34" stroke-linecap="round" opacity="0.55"/>
      <path d="${d}" fill="none" stroke="#C9956B" stroke-width="20" stroke-linecap="round" stroke-dasharray="2 30" opacity="0.85"/>
    `;
    // build stations
    layer.innerHTML='';
    STATIONS.forEach((s,i)=>{
      const p=PATH[i];
      const el=document.createElement('div');
      el.className='station';el.id='st'+i;
      el.style.left=(p.x/1000*100)+'%';
      el.style.top=(p.y/1700*1700)+'px';
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
      if(i<gState.pos)el.classList.add('done');
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

  function rollDice(){
    if(gState.rolling)return;
    gState.rolling=true;
    document.getElementById('rollBtn').disabled=true;
    const dice=document.getElementById('dice');
    const roll=Math.floor(Math.random()*6)+1;
    dice.classList.add('rolling');
    setTimeout(()=>{
      dice.classList.remove('rolling');
      const[rx,ry]=DICE_ROT[roll];
      dice.style.transform=`rotateX(${rx+720}deg) rotateY(${ry+720}deg)`;
    },1040);
    setTimeout(()=>{stepForward();gState.rolling=false;},1700);
  }

  function stepForward(){
    // first roll lands on station 1 (index0 question); later rolls advance one station
    if(gState.started){
      if(gState.pos>=TOTAL-1){return;}
      gState.pos++;gState.idx++;
    }else{
      gState.started=true; // stay at index 0, reveal first question
    }
    paintStations();
    placeToken(gState.pos,true);
    cameraTo(gState.pos);
    updateBanner(gState.pos);
    document.getElementById('curStation').textContent=gState.pos+1;

    if(gState.pos>=TOTAL-1){
      setTimeout(winGame,700);
      return;
    }
    showQuestion();
  }

  function showQuestion(){
    const card=gState.deck[gState.idx % gState.deck.length];
    document.getElementById('qText').textContent=card.q;
    document.getElementById('qHint').textContent=card.h;
    document.getElementById('qHint').className='q-hint';
    document.getElementById('hintBtn').style.display='inline-flex';
    const btn=document.getElementById('rollBtn');
    btn.disabled=false;
    btn.querySelector('.rl').textContent='ענו נכון? גלגלו שוב!';
    document.getElementById('questionCard').scrollIntoView({behavior:'smooth',block:'center'});
  }

  function winGame(){
    updateBanner(TOTAL-1);
    document.getElementById('questionCard').style.display='none';
    document.getElementById('winScreen').style.display='block';
    document.getElementById('curStation').textContent=TOTAL;
    fireConfetti();
    document.getElementById('winScreen').scrollIntoView({behavior:'smooth',block:'center'});
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
