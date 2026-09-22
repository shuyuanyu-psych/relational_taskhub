
Prompts to chatgpt

Code a psychology experiment using jspsych. The task asks participants to categorize rocks into three groups. For each trial, participants are first asked to describe what they noticed about the way the rocks were arranged. After typing their description to a response box, participants are asked to make a decision to categorize rocks into one of three categories: besod, makif, and tolar. They receive corrective feedback.

Instructions:

[cover story about architecture]

"In this task, you will learn to categorize rocks into three categories."


Instruction for each trial: 
Show the picture.

Ask participants to describe what they noticed about the way the rocks were arranged

"What is this?"

Options: besod, makif, and tolar.

Participants click on one of the response, get corrective feedback, and move on to the next trial.

There are 24 trials in total, refer to the stimuli folder. 

Randomize the order of trials, and the position (left, right) of the relation match.

Ask for participant id at the start of the experiment.

Record data file as
ID, TrialID, ItemID, Correct Category (b, m, or t), Description (participants' texts response), Response (participants' response, b, m, or t), choice_score (choice_score = 1 when choice == correct_choice, otherwise choice_score = 0)

Name the data file as 'S(id)_Rock_dateandtime.csv'

Download the datafile automatically when experiment ends

Picture folder 'stimuli' contains stimuli b1.png ... b8.png belongs to besod, m1.png..., m8.png,  belongs to makif, t1.png, ..., t8.png belongs to tolar

Version 8
The Version pilot tested in lab in February 2026

Version 9
1. Remove the text input


Version 10
1. Double trial Number -- 48 trials [not done]
2. Add an end survey description [not done]

Version 10.1
1.  Add an end survey description after 24 trials, automatically download two files at the end

Version 11
1. Try to code with codex [done]
2. Add an end survey description [not done] after 24 trials and after 48 trials, [done]
3. Double trial Number -- 48 trials [done]
4. Automatically download one file in one xlsx sheet

