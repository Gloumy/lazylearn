// Syllabes françaises courantes — toutes en minuscules.
// Les combinaisons absentes de ce Set sont considérées invalides.
// Les digrammes (ou, au, eu, ai, oi) sont des graphèmes d'un seul son :
// ils peuvent être construits depuis leur propre tuile OU depuis deux tuiles voyelles.
export const SYLLABLES: Set<string> = new Set([
  // CV simples
  'ba', 'be', 'bi', 'bo', 'bu',
  'ca', 'ce', 'ci', 'co', 'cu',
  'da', 'de', 'di', 'do', 'du',
  'fa', 'fe', 'fi', 'fo', 'fu',
  'ga', 'ge', 'gi', 'go', 'gu',
  'ha', 'he', 'hi', 'ho', 'hu',
  'ja', 'je', 'ji', 'jo', 'ju',
  'la', 'le', 'li', 'lo', 'lu',
  'ma', 'me', 'mi', 'mo', 'mu',
  'na', 'ne', 'ni', 'no', 'nu',
  'pa', 'pe', 'pi', 'po', 'pu',
  'ra', 're', 'ri', 'ro', 'ru',
  'sa', 'se', 'si', 'so', 'su',
  'ta', 'te', 'ti', 'to', 'tu',
  'va', 've', 'vi', 'vo', 'vu',
  'za', 'ze', 'zi', 'zo', 'zu',

  // CV avec é
  'bé', 'cé', 'dé', 'fé', 'gé', 'hé', 'jé', 'lé',
  'mé', 'né', 'pé', 'ré', 'sé', 'té', 'vé', 'zé',

  // CV avec è
  'bè', 'cè', 'dè', 'fè', 'gè', 'hè', 'jè', 'lè',
  'mè', 'nè', 'pè', 'rè', 'sè', 'tè', 'vè', 'zè',

  // CV avec ê
  'bê', 'cê', 'dê', 'fê', 'gê', 'hê', 'jê', 'lê',
  'mê', 'nê', 'pê', 'rê', 'sê', 'tê', 'vê', 'zê',

  // CV avec à
  'bà', 'cà', 'dà', 'fà', 'gà', 'hà', 'jà', 'là',
  'mà', 'nà', 'pà', 'rà', 'sà', 'tà', 'và', 'zà',

  // Digrammes seuls
  'ou', 'au', 'eu', 'ai', 'oi',

  // C + ou
  'bou', 'cou', 'dou', 'fou', 'gou', 'hou', 'jou', 'lou',
  'mou', 'nou', 'pou', 'rou', 'sou', 'tou', 'vou', 'zou',
  // C + au
  'bau', 'cau', 'dau', 'fau', 'gau', 'hau', 'jau', 'lau',
  'mau', 'nau', 'pau', 'rau', 'sau', 'tau', 'vau', 'zau',
  // C + eu
  'beu', 'ceu', 'deu', 'feu', 'geu', 'heu', 'jeu', 'leu',
  'meu', 'neu', 'peu', 'reu', 'seu', 'teu', 'veu', 'zeu',
  // C + ai
  'bai', 'cai', 'dai', 'fai', 'gai', 'hai', 'jai', 'lai',
  'mai', 'nai', 'pai', 'rai', 'sai', 'tai', 'vai', 'zai',
  // C + oi
  'boi', 'coi', 'doi', 'foi', 'goi', 'hoi', 'joi', 'loi',
  'moi', 'noi', 'poi', 'roi', 'soi', 'toi', 'voi', 'zoi',

  // CCV — consonne + r
  'bra', 'bre', 'bri', 'bro', 'bru',
  'cra', 'cre', 'cri', 'cro', 'cru',
  'dra', 'dre', 'dri', 'dro', 'dru',
  'fra', 'fre', 'fri', 'fro', 'fru',
  'gra', 'gre', 'gri', 'gro', 'gru',
  'pra', 'pre', 'pri', 'pro', 'pru',
  'tra', 'tre', 'tri', 'tro', 'tru',
  'vra', 'vre', 'vri', 'vro', 'vru',

  // CCV — consonne + l
  'bla', 'ble', 'bli', 'blo', 'blu',
  'cla', 'cle', 'cli', 'clo', 'clu',
  'fla', 'fle', 'fli', 'flo', 'flu',
  'gla', 'gle', 'gli', 'glo', 'glu',
  'pla', 'ple', 'pli', 'plo', 'plu',

  // Cr + digrammes
  'brou', 'crou', 'drou', 'frou', 'grou', 'prou', 'trou', 'vrou',
  'brau', 'crau', 'drau', 'frau', 'grau', 'prau', 'trau', 'vrau',
  'breu', 'creu', 'dreu', 'freu', 'greu', 'preu', 'treu', 'vreu',
  'brai', 'crai', 'drai', 'frai', 'grai', 'prai', 'trai', 'vrai',
  'broi', 'croi', 'droi', 'froi', 'groi', 'proi', 'troi', 'vroi',

  // Cl + digrammes
  'blou', 'clou', 'flou', 'glou', 'plou',
  'blau', 'clau', 'flau', 'glau', 'plau',
  'bleu', 'cleu', 'fleu', 'gleu', 'pleu',
  'blai', 'clai', 'flai', 'glai', 'plai',
  'bloi', 'cloi', 'floi', 'gloi', 'ploi',

  // CCV avec é / è (formes productives)
  'bré', 'cré', 'dré', 'fré', 'gré', 'pré', 'tré', 'vré',
  'blé', 'clé', 'flé', 'glé', 'plé',
  'brè', 'crè', 'drè', 'frè', 'grè', 'prè', 'trè', 'vrè',
  'blè', 'clè', 'flè', 'glè', 'plè',
])
