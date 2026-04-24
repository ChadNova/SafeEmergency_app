export type ProtocolId =
  | "cardiac_arrest"
  | "bleeding"
  | "unconscious"
  | "epilepsy"
  | "choking";

export type ProtocolStep = {
  title: string;
  description: string;
};

export const protocolSteps: Record<ProtocolId, ProtocolStep[]> = {
  cardiac_arrest: [
    {
      title: "Call emergency services immediately",
      description:
        "Dial your local emergency number right now and put the phone on speaker.",
    },
    {
      title: "Start chest compressions",
      description:
        "Push hard and fast in the center of the chest until help arrives.",
    },
    {
      title: "Use an AED if available",
      description:
        "Follow the AED voice prompts and continue compressions between shocks.",
    },
  ],
  bleeding: [
    {
      title: "Apply direct pressure",
      description: "Press firmly on the wound using a clean cloth or bandage.",
    },
    {
      title: "Raise the injured area",
      description: "If possible, elevate the bleeding area above the heart.",
    },
    {
      title: "Seek urgent medical help",
      description:
        "Get emergency care immediately if bleeding is severe or does not stop.",
    },
  ],
  unconscious: [
    {
      title: "Check breathing",
      description: "Look, listen, and feel for breathing for up to 10 seconds.",
    },
    {
      title: "Place in recovery position if breathing",
      description:
        "If the person is breathing, roll them carefully onto their side.",
    },
    {
      title: "Call emergency services",
      description:
        "If they are not breathing normally, call emergency services now.",
    },
  ],
  epilepsy: [
    {
      title: "Stay calm and time the seizure",
      description:
        "Check the clock and note how long the seizure lasts so you can tell responders.",
    },
    {
      title: "Protect the person from injury",
      description:
        "Move hard objects away, cushion the head, and loosen tight clothing around the neck.",
    },
    {
      title: "Call emergency services if needed",
      description:
        "Call right away if the seizure lasts more than 5 minutes, repeats, or the person is injured or not waking up.",
    },
  ],
  choking: [
    {
      title: "Ask if they can cough or speak",
      description: "If they can still cough, encourage them to keep coughing.",
    },
    {
      title: "Give back blows and abdominal thrusts",
      description:
        "If they cannot breathe, alternate back blows and abdominal thrusts.",
    },
    {
      title: "Call emergency services",
      description:
        "If the blockage does not clear quickly, get emergency help immediately.",
    },
  ],
};

export const triageQuestions = [
  {
    question: "Is the person conscious?",
    yes: "Is the person breathing normally?",
    no: "Check for breathing and call emergency services if needed.",
  },
  {
    question: "Is the person breathing normally?",
    yes: "Is there heavy bleeding?",
    no: "Start emergency breathing support and call emergency services.",
  },
  {
    question: "Is there heavy bleeding?",
    yes: "Apply direct pressure to the wound immediately.",
    no: "Proceed to the guidance screen for the most likely protocol.",
  },
] as const;
