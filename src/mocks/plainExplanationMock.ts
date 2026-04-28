import type { ExplainLanguage, PlainExplanation } from '../types/explain';

const SAMPLE_IN =
  'Dear Valued Customer, this is a system-generated communication regarding your facility with us. ' +
  'In view of regulatory guidelines, you are required to visit your nearest branch with original KYC documents to complete re-KYC. ' +
  'Failure to comply by 15-MAY-2026 may result in restricted access to certain banking services as per our policy.';

const BASE_EN: PlainExplanation = {
  simpleTitle: 'Re-KYC visit before a deadline',
  summary:
    'The bank is asking you to go to a branch in person to update your KYC (identity) details. ' +
    'It says this is required by rules, and you should carry your original KYC documents.',
  whatToDo: 'Go to the nearest bank branch with original Aadhaar / PAN and ID the bank already lists for you, before the date below.',
  dueOrDate: '15 May 2026',
  watchOut:
    'If you do not finish this in time, the bank may limit some services on your account until re-KYC is done.',
};

const TRANSLATIONS: Record<ExplainLanguage, PlainExplanation> = {
  en: BASE_EN,
  hi: {
    simpleTitle: 'री-केवाईसी: समय से पहले ब्रांच जाएँ',
    summary:
      'बैंक कह रहा है कि नियमों के कारण आपको अपनी पहचान (KYC) अपडेट करनी है। इसके लिए आपको नज़दीकी ब्रांच में जाकर ' +
      'अपने KYC के असली (original) दस्तावेज़ दिखाने होंगे।',
    whatToDo: 'नज़दीकी बैंक ब्रांच जाएँ और Aadhaar / PAN जैसे KYC दस्तावेज़ (original) साथ लेकर जाएँ।',
    dueOrDate: '15 मई 2026',
    watchOut: 'समय पर नहीं किया तो बैंक कुछ सेवाएँ सीमित कर सकता है, जब तक री-केवाईसी पूरा नहीं होता।',
  },
  ta: {
    simpleTitle: 'மீண்டும் KYC: கடைசி தேதிக்கு முன் கிளைக்கு செல்லுங்கள்',
    summary:
      'விதிமுறைகளின்படி உங்கள் அடையாள விவரங்கள் (KYC) புதுப்பிக்க வேண்டும் என்று வங்கி கூறுகிறது. அதற்காக அருகிலுள்ள ' +
      'கிளைக்கு நேரில் சென்று உங்கள் original KYC ஆவணங்களை காட்ட வேண்டும்.',
    whatToDo: 'அருகிலுள்ள வங்கி கிளைக்கு சென்று Aadhaar / PAN போன்ற original KYC ஆவணங்களை எடுத்துச் செல்லுங்கள்.',
    dueOrDate: '15 மே 2026',
    watchOut: 'காலத்திற்குள் செய்யவில்லை என்றால் சில வங்கி சேவைகள் தற்காலிகமாக கட்டுப்படுத்தப்படலாம்.',
  },
  mr: {
    simpleTitle: 'री-KYC: डेडलाईनपूर्वी शाखेत जा',
    summary:
      'नियमांनुसार तुमचे KYC (ओळख) अपडेट करणे आवश्यक आहे असे बँक सांगत आहे. त्यासाठी जवळच्या शाखेत प्रत्यक्ष जाऊन ' +
      'मूळ (original) KYC कागदपत्रे दाखवावी लागतील.',
    whatToDo: 'जवळच्या बँक शाखेत जा आणि Aadhaar / PAN सारखी मूळ KYC कागदपत्रे सोबत घेऊन जा.',
    dueOrDate: '15 मे 2026',
    watchOut: 'वेळेत केले नाही तर काही बँकिंग सेवा मर्यादित होऊ शकतात, जोपर्यंत री-KYC पूर्ण होत नाही.',
  },
  te: {
    simpleTitle: 'మళ్లీ KYC: గడువు ముందు బ్రాంచ్‌కి వెళ్లండి',
    summary:
      'నియమాల ప్రకారం మీ KYC (గుర్తింపు) వివరాలు అప్డేట్ చేయాలి అని బ్యాంక్ చెబుతోంది. అందుకోసం సమీప బ్రాంచ్‌కు ' +
      'నేరుగా వెళ్లి original KYC డాక్యుమెంట్లు చూపించాలని చెబుతోంది.',
    whatToDo: 'సమీప బ్యాంక్ బ్రాంచ్‌కు వెళ్లి Aadhaar / PAN వంటి original KYC డాక్యుమెంట్లు తీసుకెళ్లండి.',
    dueOrDate: '15 మే 2026',
    watchOut: 'సమయానికి చేయకపోతే కొన్ని బ్యాంకింగ్ సేవలు తాత్కాలికంగా పరిమితం కావచ్చు.',
  },
  ml: {
    simpleTitle: 'KYC വീണ്ടും: അവസാന തീയതിക്ക് മുൻപ് ബ്രാഞ്ചിൽ പോകണം',
    summary:
      'നിയമപ്രകാരം നിങ്ങളുടെ KYC (ഐഡന്റിറ്റി) വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യണം എന്ന് ബാങ്ക് പറയുന്നു. അതിനായി സമീപമുള്ള ' +
      'ബ്രാഞ്ചിലേക്ക് നേരിട്ട് പോയി original KYC രേഖകൾ കാണിക്കണം.',
    whatToDo: 'സമീപത്തെ ബാങ്ക് ബ്രാഞ്ചിൽ പോയി Aadhaar / PAN പോലുള്ള original KYC രേഖകൾ കൊണ്ടുപോകുക.',
    dueOrDate: '15 മേയ് 2026',
    watchOut: 'സമയത്തിനകം ചെയ്തില്ലെങ്കിൽ ചില ബാങ്കിംഗ് സേവനങ്ങൾ താൽക്കാലികമായി നിയന്ത്രിക്കപ്പെടാം.',
  },
  kn: {
    simpleTitle: 'ಮತ್ತೆ KYC: ಕೊನೆಯ ದಿನಾಂಕಕ್ಕೂ ಮೊದಲು ಶಾಖೆಗೆ ಹೋಗಿ',
    summary:
      'ನಿಯಮಗಳ ಕಾರಣಕ್ಕೆ ನಿಮ್ಮ KYC (ಗುರುತು) ವಿವರಗಳನ್ನು ಅಪ್‌ಡೇಟ್ ಮಾಡಬೇಕು ಎಂದು ಬ್ಯಾಂಕ್ ಹೇಳುತ್ತಿದೆ. ಅದಕ್ಕಾಗಿ ಹತ್ತಿರದ ' +
      'ಶಾಖೆಗೆ ನೇರವಾಗಿ ಹೋಗಿ original KYC ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಬೇಕು.',
    whatToDo: 'ಹತ್ತಿರದ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಹೋಗಿ Aadhaar / PAN ಮುಂತಾದ original KYC ದಾಖಲೆಗಳನ್ನು ತೆಗೆದುಕೊಂಡು ಹೋಗಿ.',
    dueOrDate: '15 ಮೇ 2026',
    watchOut: 'ಸಮಯಕ್ಕೆ ಮಾಡದಿದ್ದರೆ ಕೆಲವು ಬ್ಯಾಂಕಿಂಗ್ ಸೇವೆಗಳು ತಾತ್ಕಾಲಿಕವಾಗಿ ನಿರ್ಬಂಧಿತವಾಗಬಹುದು.',
  },
  gu: {
    simpleTitle: 'ફરી KYC: સમયમર્યાદા પહેલાં શાખામાં જાઓ',
    summary:
      'નિયમો મુજબ તમારી KYC (ઓળખ) માહિતી અપડેટ કરવી જરૂરી છે એમ બેંક કહે છે. તેના માટે નજીકની શાખામાં જાતે જઈ ' +
      'original KYC દસ્તાવેજો બતાવવા પડશે.',
    whatToDo: 'નજીકની બેંક શાખામાં જાઓ અને Aadhaar / PAN જેવા original KYC દસ્તાવેજો સાથે લઈ જાઓ.',
    dueOrDate: '15 મે 2026',
    watchOut: 'સમયસર ન કરો તો બેંક કેટલીક સેવાઓ પર અસ્થાયી પ્રતિબંધ મૂકી શકે છે.',
  },
  bn: {
    simpleTitle: 'আবার KYC: শেষ তারিখের আগে শাখায় যান',
    summary:
      'নিয়ম অনুযায়ী আপনার KYC (পরিচয়) তথ্য আপডেট করতে হবে—ব্যাংক বলছে। এজন্য কাছের শাখায় গিয়ে original KYC নথি ' +
      'দেখাতে হবে।',
    whatToDo: 'কাছের ব্যাংক শাখায় যান এবং Aadhaar / PAN মতো original KYC নথি সঙ্গে নিন।',
    dueOrDate: '15 মে 2026',
    watchOut: 'সময়মতো না করলে, রি-KYC শেষ না হওয়া পর্যন্ত কিছু ব্যাংকিং সেবা সীমিত হতে পারে।',
  },
};

const EMPTY: PlainExplanation = {
  simpleTitle: '',
  summary: '',
  whatToDo: null,
  dueOrDate: null,
  watchOut: null,
};

function normalize(text: string) {
  return text.trim();
}

/**
 * Returns static demo content (no real AI). Replace with API call that returns PlainExplanation.
 */
export function getPlainExplanationMock(
  _text: string,
  language: ExplainLanguage
): Promise<PlainExplanation> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (!normalize(_text)) {
        resolve(EMPTY);
        return;
      }

      const picked = TRANSLATIONS[language] ?? BASE_EN;
      resolve({ ...picked });
    }, 600);
  });
}

export { SAMPLE_IN };
