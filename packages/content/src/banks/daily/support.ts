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
    "Conversations at work may go more smoothly than usual, and requests [land softly|get a fair hearing]. Bring up the agreement you've been waiting to propose.",
    "A colleague may be more open to your idea than you expect. Raise it [now|this morning], while the door is already ajar.",
    "Work partnerships click: a colleague who gets it, a meeting that ends [early|on time] and well. Use the ease to settle [a question|an issue] that's been hanging.",
    "Your manager or a colleague may say yes more easily than usual. [Request|Go after] the help or sign-off you've been delaying.",
    "Work agreements [fall into place|line up] smoothly. Settle the detail that's been going back and forth.",
  ],
  family: [
    "Family conversations may go easier than usual. This is a fair moment to raise [a topic|the subject] you've been careful about.",
    "A relative may be quick to agree, or to help. Let them; accepting is its own kind of closeness.",
    "Family ties feel warm. A call or a visit is likely to be welcome, even [an unplanned one|on short notice].",
    "A relative may meet you halfway [unprompted|without being asked]. Accept the olive branch.",
    "Family [arrangements|schedules] slot together easily. Suggest the visit or call [that has slipped for weeks|you've been putting off].",
  ],
  home: [
    "Common ground at home [arrives|appears] faster than usual. A fine evening for a joint decision.",
    "Home feels easy: [schedules|plans] agree, moods match. Use it for a conversation that usually [costs|needs] effort.",
    "Life at home may slot together, the minor decisions settling without fuss. Enjoy it, and [make|hatch] one plan you'd both like.",
    "The mood at home looks [relaxed|warm] and easy. Save one bigger decision for this evening, while it lasts.",
    "Everyone under your roof may be on the same wavelength. Put that to use on [a plan|an outing] you both want.",
  ],
  plans: [
    "Your bigger aim may find a willing partner: [an offer of help|a helper], a door that opens. Say yes to the fit, even if it's not the shape you pictured.",
    "A project you're building may [move|step] forward with less effort than usual. Push the part that's been waiting for the right moment.",
    "Pieces of a far-off goal may line up. Commit to the next [step|move] while they do.",
    "[A friend|A colleague] may offer exactly the help a bigger plan needs. Let them know where to start.",
    "A [slow|stalled] plan may get easier to move. Pick the stuck piece and give it a nudge.",
  ],
};

export const COMBINE_HEADLINES: Pool = {
  work: ["Work doors open with a push.", "A fair moment for [requests|proposals] at work.", "[Smooth|Easy] agreement at work.", "A yes is easier to get at work.", "Smooth going for work agreements."],
  family: ["Family [feels|is] easy company.", "A warm [stretch|spell] for family ties.", "Your relatives are on your side.", "A relative meets you halfway.", "Family [arrangements|schedules] fit together."],
  home: ["[Easy|Ready] agreement at home.", "Home is on the same page.", "A warm, easy [evening|mood] at home.", "Home settles [easily|without fuss].", "In tune at home."],
  plans: ["Your bigger plans find a helping hand.", "A [stalled|slow] plan can move forward.", "The bigger aim gets easier.", "The right help for a bigger [plan|goal].", "Nudge the stuck part of a [big|major] plan."],
};

export const COMBINE_AGENCY: Pool = {
  work: [
    "Send the [proposal|pitch] you've been polishing.",
    "Bring your manager the request you've been saving up.",
    "Pair up with one colleague on a task you'd [do|tackle] alone.",
    "[Request|Chase] the sign-off you need, this morning.",
    "Thank a colleague by name for one specific [favour|win].",
  ],
  family: [
    "[Ring|Phone] the relative you haven't spoken to in a while.",
    "Let your family help with one [errand|chore].",
    "[Book|Arrange] one family meal or visit this week.",
    "Accept one family invitation you'd usually hedge on.",
    "Suggest a date for the next family get-together.",
  ],
  home: [
    "[Book|Choose] one weekend outing as a household.",
    "Cook or order [a dish|a meal] you both love tonight.",
    "Agree to the next idea someone at home suggests.",
    "Suggest one [short|nearby] outing for this week.",
    "Find out what your partner or housemate would like this weekend.",
  ],
  plans: [
    "Describe the goal you're chasing to [a friend|a contact] who could help.",
    "[Make|Complete] one concrete move on your biggest goal.",
    "Reply to the offer or lead you've been sitting on.",
    "Say yes to one offer that moves a goal forward.",
    "Schedule one [move|step] on a goal that matters to you.",
  ],
};

export const TRINE_BODIES: Pool = {
  work: [
    "At work, pieces may line up without you arranging them: colleagues agree faster. Bring others in [and spread the load|rather than carrying it alone].",
    "Colleagues may be leaning your way, more than usual. Start the [task|project] that needs more than one pair of hands.",
    "Work has a following wind. Group efforts move quickly, so use it for the task that stalls when you [go solo|fly solo].",
    "Help at work may arrive from more than one direction. [Share|Split] the load and the credit alike.",
    "A group task at work may move faster than you expect. Accept the meeting that [gathers|assembles] the right team.",
  ],
  family: [
    "Support from your relatives is easier to find. Lean on them for [a task|an errand] you'd normally handle alone.",
    "Family members may [rally|unite] without much effort. Suggest the shared plan or group call you've been thinking about.",
    "Your relatives may offer help unprompted. [Accept it|Say yes], and let them feel useful.",
    "Relatives may line up behind you. [Request|Ask for] the favour you'd normally hesitate over.",
    "Your family [acts|moves] as one. A shared plan made now [often sticks|usually holds].",
  ],
  home: [
    "At home, everyone pulls in one direction without needing to talk it through. [Arrangements|Plans] you make [as a household|jointly] now [often hold|usually stick].",
    "Your household [hums|moves] like a [practised|well-drilled] team. Split the chores and share the wins.",
    "Your household may be more ready to help than you think. [Speak up|Ask], and let the load spread.",
    "The whole household may be after one outcome, for once. Use it to settle [a debate|the matter] you've all been circling.",
    "Help at home may [arrive|turn up] unasked. Accept it, and return the favour [soon|later in the week].",
  ],
  plans: [
    "Your bigger plans and the [friends|allies] around you pull the same way. Let that support carry you instead of pushing harder on your own.",
    "Several pieces of a larger aim may fall into place [at once|in one go]. Notice which ones are ready and move those first.",
    "Help for [your project|what you're building] may [arrive|turn up] from an unexpected side. Say what you're aiming for, and listen for who leans in.",
    "Backing for a goal you care about may gather. [Approach|Invite] two [allies|friends] instead of one.",
    "A [distant|big] goal feels lighter. Push the part that usually drags.",
  ],
};

export const TRINE_HEADLINES: Pool = {
  work: ["Work pulls in your direction.", "Support at work is closer than it feels.", "[Team spirit|Shared purpose] at work.", "Help at work from several sides.", "Group projects move quickly."],
  family: ["Family is on your side.", "Your relatives rally round.", "Help from family [arrives|flows] easily.", "The family backs you.", "Family acts like a team."],
  home: ["Home feels like a team.", "Everyone at home pulls the same way.", "[Decide|Settle] household questions as a group.", "A team evening at home.", "Home [rallies|pulls as one]."],
  plans: ["What you're building and who you build it with line up.", "Your bigger aim has company.", "A bigger plan gets a following wind.", "Allies gather around your [biggest goal|big project].", "More hands for the big goal."],
};

export const TRINE_AGENCY: Pool = {
  work: [
    "Invite one colleague to join you on the [hardest job|toughest problem].",
    "Call the meeting you've been holding off on; [the team is|everyone's] ready.",
    "Share credit for [a win|a result] at work, out loud.",
    "Hand one piece of your [workload|project] to [a keen colleague|someone who's keen].",
    "Bring the quiet colleague into [the afternoon's|this week's] plan.",
  ],
  family: [
    "Get advice from a relative on [a question|an issue] you'd usually handle alone.",
    "Start a group chat or call with your family about one plan.",
    "Thank one relative for [a kindness|a favour] from years ago.",
    "Call a relative and find out how they could help this month.",
    "[Arrange|Organise] one family get-together with two others.",
  ],
  home: [
    "Pick one weekend plan [as a household|with everyone at home] tonight.",
    "Hand one job off your list to someone at home.",
    "Settle one shared decision tonight that's been waiting.",
    "Cook or tidy [side by side|as a pair] tonight.",
    "Split tonight's jobs in two [ahead of time|at the start].",
  ],
  plans: [
    "Tell the person closest to you one aim you're [chasing|pursuing].",
    "Invite one [friend|ally] into a plan you've kept to yourself.",
    "Write the next three steps of your biggest goal and share them.",
    "Share your plan's next step with [an ally|a friend] who cares about it.",
    "Write the plan's next milestone where you'll see it [daily|every morning].",
  ],
};
