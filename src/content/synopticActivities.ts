export type StudyQuestion = {
  prompt: string;
  choices: readonly { label: string; feedback: string }[];
};

export const parableQuestion: StudyQuestion = {
  prompt: 'Which Gospels place the yeast immediately after the mustard seed?',
  choices: [
    {
      label: 'Matthew and Mark',
      feedback:
        'Both describe the seed. Read the next group and look for the woman mixing flour in Luke.',
    },
    {
      label: 'Matthew and Luke',
      feedback:
        'Yes. Matthew 13:33 and Luke 13:20–21 follow the seed with the yeast. Mark ends the seed scene with the birds in its shade.',
    },
    {
      label: 'All three',
      feedback:
        'The mustard seed appears in all three. Follow each column one group further to see where the woman appears.',
    },
  ],
};

export const healingExcerpts = [
  {
    reference: 'Matthew 9:6',
    words: [
      'But so that you may know…',
      'Then He said to the paralytic',
      'Get up, pick up your mat…',
    ],
    greek: 'τότε λέγει τῷ παραλυτικῷ',
    gloss: 'then he says to the paralyzed man',
    url: 'https://ccel.org/w/westcott/gnt/matthew/matthew_9.htm',
  },
  {
    reference: 'Mark 2:10–11',
    words: [
      'But so that you may know…',
      'He said to the paralytic',
      'I tell you, get up…',
    ],
    greek: 'λέγει τῷ παραλυτικῷ',
    gloss: 'he says to the paralyzed man',
    url: 'https://ccel.org/w/westcott/gnt/mark/mark_2.htm',
  },
  {
    reference: 'Luke 5:24',
    words: [
      'But so that you may know…',
      'He said to the paralytic',
      'I tell you, get up…',
    ],
    greek: 'εἶπεν τῷ παραλελυμένῳ',
    gloss: 'he said to the man who was paralyzed',
    url: 'https://ccel.org/w/westcott/gnt/luke/luke_5.htm',
  },
];

export const speakerFeedback = [
  'Here Jesus is still speaking. Look for the words that tell you whom he addresses.',
  'Yes. The storyteller steps in here, between Jesus’ explanation and his command to get up.',
  'Jesus is speaking to the man here. Go back one phrase to find the storyteller’s interruption.',
];

export const herodReadings = [
  {
    gospel: 'Matthew',
    opening: 'Herod the tetrarch',
    first: 'Matthew 14:1',
    later: 'The king was grieved',
    last: 'Matthew 14:9',
    url: 'https://biblehub.com/bsb/matthew/14.htm',
  },
  {
    gospel: 'Mark',
    opening: 'King Herod',
    first: 'Mark 6:14',
    later: 'The king was consumed with sorrow',
    last: 'Mark 6:26',
    url: 'https://biblehub.com/bsb/mark/6.htm',
  },
];
export const herodQuestion: StudyQuestion = {
  prompt: 'Which writer changes Herod’s title as the story unfolds?',
  choices: [
    {
      label: 'Matthew',
      feedback:
        'Yes. Matthew first calls Herod a tetrarch, then uses the title that Mark uses at both points.',
    },
    {
      label: 'Mark',
      feedback:
        'In Mark, Herod is called king at both points. Trace Matthew’s title from the opening to the banquet.',
    },
  ],
};

export const storyScenes = {
  baptism: {
    title: 'Jesus is baptized',
    shortTitle: 'Baptism',
    detail:
      'The baptism comes first in all three of these sequences. Each Gospel introduces the voice from heaven before the healing or the hometown visit.',
    question:
      'What do readers already know about Jesus when he next speaks in public?',
  },
  healing: {
    title: 'The paralyzed man',
    shortTitle: 'Healing',
    detail:
      'In Matthew 9 and Mark 2 the healing comes before the hometown visit. In Luke 5 it comes after Jesus has spoken in the Nazareth synagogue.',
    question:
      'In Luke, how might a reader hear the words of forgiveness after hearing Jesus promise release?',
  },
  hometown: {
    title: 'The hometown synagogue',
    shortTitle: 'Nazareth',
    detail:
      'Luke puts Jesus in the synagogue at Nazareth in chapter 4, early in his public ministry. Matthew 13 and Mark 6 place the hometown scene later, after the healing.',
    question:
      'What do you expect Jesus to do after his words about good news for the poor?',
  },
};
export type StoryScene = keyof typeof storyScenes;
export type StoryStop = { scene: StoryScene; reference: string; url: string };
export const gospelSequences: { gospel: string; stops: StoryStop[] }[] = [
  {
    gospel: 'Matthew',
    stops: [
      {
        scene: 'baptism',
        reference: 'Matthew 3:13–17',
        url: 'https://biblehub.com/bsb/matthew/3.htm',
      },
      {
        scene: 'healing',
        reference: 'Matthew 9:1–8',
        url: 'https://biblehub.com/bsb/matthew/9.htm',
      },
      {
        scene: 'hometown',
        reference: 'Matthew 13:53–58',
        url: 'https://biblehub.com/bsb/matthew/13.htm',
      },
    ],
  },
  {
    gospel: 'Mark',
    stops: [
      {
        scene: 'baptism',
        reference: 'Mark 1:9–11',
        url: 'https://biblehub.com/bsb/mark/1.htm',
      },
      {
        scene: 'healing',
        reference: 'Mark 2:1–12',
        url: 'https://biblehub.com/bsb/mark/2.htm',
      },
      {
        scene: 'hometown',
        reference: 'Mark 6:1–6',
        url: 'https://biblehub.com/bsb/mark/6.htm',
      },
    ],
  },
  {
    gospel: 'Luke',
    stops: [
      {
        scene: 'baptism',
        reference: 'Luke 3:21–22',
        url: 'https://biblehub.com/bsb/luke/3.htm',
      },
      {
        scene: 'hometown',
        reference: 'Luke 4:16–30',
        url: 'https://biblehub.com/bsb/luke/4.htm',
      },
      {
        scene: 'healing',
        reference: 'Luke 5:17–26',
        url: 'https://biblehub.com/bsb/luke/5.htm',
      },
    ],
  },
];

export const prayerCopies = [
  {
    name: 'Papyrus 75',
    greek: 'Πάτερ',
    gloss: 'Father',
    observation:
      'The address is a single Greek word. The prayer goes straight on to the petition about God’s name.',
  },
  {
    name: 'Codex Alexandrinus',
    greek: 'Πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς',
    gloss: 'Our Father in heaven',
    observation:
      'This copy adds words meaning “our” and “in heaven.” Compare it with the address in Matthew 6:9.',
  },
];
export const prayerEvidence: StudyQuestion = {
  prompt:
    'Which evidence could tell us how often a community was taught to pray?',
  choices: [
    {
      label: 'The greeting in a copy of Luke',
      feedback:
        'The greeting gives the words that copy preserves. It leaves the frequency of prayer open.',
    },
    {
      label: 'Instructions for prayer in a community text',
      feedback:
        'Yes. A set of instructions can name both the prayer and when readers should say it. The Didache does exactly that.',
    },
  ],
};
