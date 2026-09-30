/**
 * Today's first screen when the lead helps: a combine (two parts that fit,
 * asks land softly) or a trine (several parts pulling one way). Everyday words
 * only (VOICE.md rules 11 and 13): the body says how the help could show up
 * and how to use it. Each body is two sentences; the element's sentence may
 * follow it.
 */

import type { LifeArea } from "../../readings/daily/life-areas.js";

type Pool = Record<LifeArea, readonly string[]>;

export const COMBINE_BODIES: Pool = {
  work: [
    "Conversations at work may go more smoothly than usual, and asks tend to land softly. Bring up the agreement you've been waiting to propose.",
    "Someone at work may be more open to your idea than you expect. Raise it today, while the door is already ajar.",
    "Work partnerships click today: a colleague who gets it, a meeting that ends early and well. Use the ease to settle something that's been hanging.",
    "A colleague may say yes more easily than usual today. Ask for the help or sign-off you've been delaying.",
    "Work agreements come together smoothly today. Settle the detail that's been going back and forth.",
  ],
  family: [
    "Family conversations may go easier than usual today. This is a fair moment to raise something you've been careful about.",
    "Someone in your family may be quick to agree today, or to help. Let them; accepting is its own kind of closeness.",
    "Family ties feel warm today. A call or a visit is likely to be welcome, even an unplanned one.",
    "A relative may meet you halfway today without being asked. Take the olive branch.",
    "Family plans slot together easily today. Suggest the visit or call that keeps slipping.",
  ],
  home: [
    "Common ground at home comes faster than usual today. A fine evening for deciding something together.",
    "Home feels easy today: plans agree, moods match. Use it for a conversation that usually takes effort.",
    "Things at home may slot together today, the small decisions settling without fuss. Enjoy it, and make one plan you'd both like.",
    "Small decisions at home may settle without a fuss today. Save one bigger one for this evening, while the mood is easy.",
    "You and whoever you live with may be on the same wavelength today. Put that to use on a plan you both want.",
  ],
  plans: [
    "Your long game may find a willing partner today: someone who offers help, a door that opens. Say yes to the fit, even if it's not the shape you pictured.",
    "Something you're building may take a step forward with less effort than usual. Push the part that's been waiting for the right moment.",
    "Pieces of a far-off goal may line up today. Commit to the next small step while they do.",
    "Someone may offer exactly the help a bigger plan needs today. Let them know where to start.",
    "A long plan may get easier to move today. Pick the stuck piece and give it a nudge.",
  ],
};

export const COMBINE_HEADLINES: Pool = {
  work: ["Work doors open with a push today.", "A fair day to ask for things at work.", "Easy agreement at work today.", "Yes comes easier at work today.", "A smooth day for work agreements."],
  family: ["Family comes easily today.", "A warm day for family ties.", "Your people are on your side.", "A relative meets you halfway.", "Family plans fit together today."],
  home: ["Easy agreement at home.", "Home is on the same page today.", "A warm, easy day at home.", "Home settles easily today.", "In tune at home today."],
  plans: ["Your bigger plans find a helping hand.", "A long plan can move forward today.", "The long game gets easier today.", "The right help for a bigger plan.", "Nudge the stuck part of a long plan."],
};

export const COMBINE_AGENCY: Pool = {
  work: [
    "Send the work proposal you've been polishing.",
    "Ask your manager for the thing you've been saving up.",
    "Pair up with one colleague on a task you'd do alone.",
    "Ask for the sign-off you need, this morning.",
    "Thank a colleague by name for something specific.",
  ],
  family: [
    "Call the relative you've been meaning to call.",
    "Ask your family for help with one small thing.",
    "Plan one family meal or visit this week.",
    "Accept one family invitation you'd usually hedge on.",
    "Suggest a date for the next family get-together.",
  ],
  home: [
    "Plan one thing for the weekend with the person you live with.",
    "Cook or order something you both love tonight.",
    "Agree to the small plan someone at home suggests.",
    "Suggest one small outing for this week.",
    "Ask what your partner or housemate would like this weekend.",
  ],
  plans: [
    "Tell someone who could help about the goal you're chasing.",
    "Take one concrete step on your biggest goal today.",
    "Reply to the offer or lead you've been sitting on.",
    "Say yes to one offer that moves a goal forward.",
    "Schedule one move on a goal you care about.",
  ],
};

export const TRINE_BODIES: Pool = {
  work: [
    "At work, pieces may line up without you arranging them: people agree faster. Bring others in rather than carrying it alone.",
    "Colleagues may be leaning your way today, more than usual. Start the thing that needs more than one pair of hands.",
    "Work has a following wind today. Group efforts move quickly, so use it for the task that stalls when you work solo.",
    "Help at work may arrive from more than one direction today. Share the load and the credit alike.",
    "A group task at work may move faster than you expect today. Accept the meeting that brings the right people together.",
  ],
  family: [
    "Support from the people you come from is easier to find today. Lean on them for something you'd normally handle alone.",
    "Family members may pull together today without much effort. Suggest the shared plan or group call you've been thinking about.",
    "Your relatives may offer help before you ask today. Take it, and let them feel useful.",
    "Relatives may line up behind you today. Ask for the favour you'd normally hesitate over.",
    "Your people act as one today. A shared plan made now tends to stick.",
  ],
  home: [
    "At home, people pull in one direction today without needing to talk it through. Plans you make together now tend to hold.",
    "Things at home run like a good team today. Split the work and share the wins.",
    "The people you live with may be more ready to help than you think. Ask, and let the load spread.",
    "Everyone at home may want the same thing today, for once. Use it to settle something you've all been circling.",
    "Help at home may come without asking today. Accept it, and return it tomorrow.",
  ],
  plans: [
    "Your long-term plans and the people around you pull the same way today. Let that support carry you instead of pushing harder on your own.",
    "Several pieces of a larger aim may fall into place together today. Notice which ones are ready and move those first.",
    "Help for something you're building may come from an unexpected side today. Say what you're aiming for, and listen for who leans in.",
    "Support for something you're building may gather today. Ask two people instead of one.",
    "A long goal feels lighter today. Push the part that usually drags.",
  ],
};

export const TRINE_HEADLINES: Pool = {
  work: ["Work pulls in your direction today.", "Support at work is closer than it feels.", "A team day at work.", "Help at work from several sides.", "Group work moves quickly today."],
  family: ["Family is on your side today.", "Your relatives pull together today.", "Help from family comes easily.", "The family backs you today.", "Family feels like a team."],
  home: ["Home feels like a team today.", "Everyone at home pulls the same way.", "A good day to decide things together at home.", "A team evening at home.", "Home pulls together today."],
  plans: ["What you're building and who you build it with line up.", "The long game has company today.", "A bigger plan gets a following wind.", "Allies gather around your long game.", "More hands for a bigger goal."],
};

export const TRINE_AGENCY: Pool = {
  work: [
    "Ask one colleague to join you on the hardest task today.",
    "Call the meeting you've been holding off on; people are ready.",
    "Share credit for something at work, out loud.",
    "Hand one piece of your work to someone who's keen.",
    "Invite the quiet colleague into today's plan.",
  ],
  family: [
    "Ask a family member for advice you'd usually skip asking for.",
    "Start a group chat or call with your family about one plan.",
    "Thank one relative for something they did years ago.",
    "Call a relative and ask how they could help this month.",
    "Plan one family get-together with two others.",
  ],
  home: [
    "Pick one weekend plan together tonight.",
    "Ask someone at home to take one job off your list.",
    "Settle one shared decision tonight that's been waiting.",
    "Cook or tidy together tonight rather than alone.",
    "Split tonight's jobs in two before anyone starts.",
  ],
  plans: [
    "Tell the person closest to you one thing you're working toward.",
    "Invite one person into a plan you've kept to yourself.",
    "Write the next three steps of your biggest goal and share them.",
    "Share your plan's next step with someone who cares about it.",
    "Write the plan's next milestone where you'll see it daily.",
  ],
};
