Match to sample numerical relations 
2026/2/17
V1
Prompts to chatgpt

Code a psychology experiment using jspsych

Instructions:

"In this task, you will see a picture at the top and two pictures at the bottom.
        Your job is to choose which bottom picture goes best with the top picture."


Instruction for each trial: 
"Look at the picture at the top. Which of the two paragraphs at the bottom goes with it?"

Participants click on one of the picture to move on to the next trial.

There are 5 trials in total, refer to the stimuli. In each trial, the top picture (target) appears on the middle top of the screen. The Relation Match and the object Match at the bottom part of the screen on the left and right.

Randomize the order of trials, and the position (left, right) of the relation match.

Ask for participant id at the start of the experiment.

Record data file as
ID, TrialID, ItemID, Top, Relation_Match, Object_Match, Relation_Match _Position (left =1, right =2), Correct_Choice (same as Relation_Match_Position), Choice (participants' response, left = 1, right = 2), RT (Reaction time for each trial: time elapsed between the appearance of the paragraphs and mouse click), choice_score (choice_score = 1 when choice == correct_choice, otherwise choice_score = 0)

Name the data file as 'S(id)_MatN_dateandtime.csv'

Download the datafile automatically when experiment ends

Picture folder 'stimuli' contains stimuli object_1.png ... object_5.png, relation_1.png..., relation_5.png, target_1.png, ..., target_5.png


Future updates:
Contain 6 trials, 3 relational match on the left, 3 relational match on the right



2026/4/15
N7
1. Add more trials -- now we have 24 trials

Code in vs + codex
Prompt: keep the same task structure. but update the pictures. first, read data from sti_trial_0403.xlsx. for each item id, you can find the corresponding pictures for the target, relational match, and object match saved in stimuli_output_v3. For example, when itemID==1, you will present target_1 (stimuli_output_v3/target/item_1_target.png), relation_1 (stimuli_output_v3/relational_match/item_1_relational_match), object_1 (stimuli_output_v3/perceptual_match/item_1_perceptual_match.png)