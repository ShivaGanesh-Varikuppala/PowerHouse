import type { PrismaClient } from "@prisma/client";

type TechniqueInput = {
  slug: string;
  name: string;
  kind: "STANCE" | "PUNCH" | "DEFENSE" | "FOOTWORK" | "COMBINATION" | "DRILL";
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  description: string;
  cues: string;
};

const TECHNIQUES: TechniqueInput[] = [
  {
    slug: "orthodox-stance",
    name: "Orthodox Stance",
    kind: "STANCE",
    level: "BEGINNER",
    description: "Foundational right-handed stance. Left foot forward, weight evenly split, hands up.",
    cues: "Lead with non-dominant side|Heels off the floor|Chin tucked|Elbows in",
  },
  {
    slug: "southpaw-stance",
    name: "Southpaw Stance",
    kind: "STANCE",
    level: "BEGINNER",
    description: "Mirror stance for left-handed boxers. Right foot forward.",
    cues: "Right foot leads|Strong hand in rear|Stay long|Frame your guard",
  },
  {
    slug: "jab",
    name: "Jab",
    kind: "PUNCH",
    level: "BEGINNER",
    description: "Range-finder and most-thrown punch. Lead hand straight out and back.",
    cues: "Snap, don't push|Rotate fist on release|Return on the same line|Exhale sharply",
  },
  {
    slug: "cross",
    name: "Cross",
    kind: "PUNCH",
    level: "BEGINNER",
    description: "Power straight from the rear hand.",
    cues: "Drive from rear heel|Rotate hip and shoulder|Chin behind lead shoulder|Snap back",
  },
  {
    slug: "left-hook",
    name: "Left Hook",
    kind: "PUNCH",
    level: "INTERMEDIATE",
    description: "Lateral power shot to head or body.",
    cues: "Pivot lead foot|Elbow up at 90°|Turn the hip|Tight arc",
  },
  {
    slug: "right-uppercut",
    name: "Rear Uppercut",
    kind: "PUNCH",
    level: "INTERMEDIATE",
    description: "Vertical power shot under guard.",
    cues: "Dip knees, not waist|Drive up through legs|Palm faces you|Don't telegraph",
  },
  {
    slug: "slip",
    name: "Slip",
    kind: "DEFENSE",
    level: "BEGINNER",
    description: "Move head off centerline to evade a straight shot.",
    cues: "Bend knees not back|Eyes on opponent|Small movement|Return centered",
  },
  {
    slug: "roll",
    name: "Roll",
    kind: "DEFENSE",
    level: "INTERMEDIATE",
    description: "Duck under and roll the shoulder against hooks.",
    cues: "Hands up|Chin down|Load lead leg|Return ready to fire",
  },
  {
    slug: "parry",
    name: "Parry",
    kind: "DEFENSE",
    level: "BEGINNER",
    description: "Redirect an incoming punch with the rear hand.",
    cues: "Short motion|Catch and redirect|Stay on guard|Counter ready",
  },
  {
    slug: "pivot",
    name: "Pivot",
    kind: "FOOTWORK",
    level: "BEGINNER",
    description: "Rotate around the lead foot to change angle.",
    cues: "Stay on ball of foot|Hands up while pivoting|Reset stance immediately",
  },
  {
    slug: "lateral-step",
    name: "Lateral Step",
    kind: "FOOTWORK",
    level: "BEGINNER",
    description: "Move side to side without crossing the feet.",
    cues: "Push from opposite foot|Maintain stance width|Light on feet",
  },
  {
    slug: "combo-1-2",
    name: "1-2",
    kind: "COMBINATION",
    level: "BEGINNER",
    description: "Jab into cross. The fundamental combination.",
    cues: "Jab sets the range|Cross travels straight|Exhale on each shot|Both hands return",
  },
  {
    slug: "combo-1-2-3",
    name: "1-2-3",
    kind: "COMBINATION",
    level: "INTERMEDIATE",
    description: "Jab, cross, lead hook.",
    cues: "Plant feet after cross|Pivot for the hook|Chin tucked|Reset",
  },
  {
    slug: "combo-1-2-slip-2",
    name: "1-2, Slip, 2",
    kind: "COMBINATION",
    level: "INTERMEDIATE",
    description: "Throw, slip a counter, return cross.",
    cues: "Slip outside opponent's lead|Don't pause|Counter from defensive position",
  },
  {
    slug: "drill-3-min-round",
    name: "3-Minute Round Conditioning",
    kind: "DRILL",
    level: "INTERMEDIATE",
    description: "Continuous punching and movement for a full round.",
    cues: "Pace yourself|Breathe on every shot|Don't drop hands|Keep moving",
  },
];

export async function seedBoxing(prisma: PrismaClient) {
  for (const t of TECHNIQUES) {
    await prisma.boxingTechnique.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }
  return TECHNIQUES.length;
}
