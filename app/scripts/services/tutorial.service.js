/**
 * This is an angular service that provides access to BOSS web services
 *
 * <p>Copyright: Copyright (c) 2015</p>
 *
 * <p>Company: Decisive Analytics Corporation</p>
 *
 */

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').service('TutorialService', function($http) {

  // tutorial messages for each step
  this.messages = [];

  this.messages[0] = "This is a topic model of 10 topics for 2,225 documents from the BBC news corpus.";

  this.messages[1] = "The 10 topics are listed on the left panel, each represented by their first three words. Clicking on any of these topics shows the full topic on the right. The first topic is automatically selected, and you can see the top 20 words associated with that topic and the top 20 documents that contain that topic.";

  this.messages[2] = "You can click the <span class='tutorial-element'  ng-mouseleave='unhighlight()'>show more button</span> for each of the documents to view the full document text. If you hover over one of the topic words, that word is shown as it appears in the documents. You can also click to select a topic word so that it will remain highlighted as you scroll through the documents. Remember, though, that you’re only seeing a few of the many documents that are associated with this topic, because there are 2,225 documents total.";

  this.messages[3] = "Topic models are not always perfect. Sometimes we find issues like words or documents that don’t make sense with the rest of the topic or see places where some words might be missing. We might even find that a topic seems like it’s talking about two distinct things or that multiple topics seem to be talking about the same thing.";

  this.messages[4] = "To fix these problems, the interface lets you make changes to the model. Let’s walk through each of the ways you can update the topics.<span class='tutorial-command '>Try clicking on Topic 7</span>, which appears to be a topic about films and music.";

  this.messages[5] = "These 20 words provide the meaning of the topic. You can add words you feel are missing from the topic by clicking in the <span class='tutorial-element add-word'>input area that says 'add new word'</span> and typing a word then selecting the match from the drop down menu. <span class='tutorial-command'>Try adding the word 'oscar'</span> to this topic about films and music awards."

  this.messages[6] = "See how the new word is shown underlined in the topic words list? If you change your mind, you can undo this refinement by clicking the <span class='tutorial-element add-word-undo'>undo button</span>. Refinements are not immediately incorporated into the model. It’s not until you click the <span class='tutorial-element save-button'>save button</span> that the model actually incorporates the refinements. When using the tool, you can click the <span class='tutorial-element save-button'>save button</span> after each refinement or after multiple refinements if you’d prefer. Let’s continue.";

  this.messages[7] = "You can remove words you feel don’t belong in the topic by clicking the <span class='tutorial-element remove-word'>x button</span> next to the word. <span class='tutorial-command'>Try removing the word 'including'</span> from the topic.";

  this.messages[8] = "See how the word is shown crossed out in the topic words list? If you change your mind, you can undo this operation by clicking the <span class='tutorial-element remove-word-undo'>undo button</span> next to the word. Let's continue.";

  this.messages[9] = "You can change a word’s order to make a word more or less important to the topic, by dragging it. <span class='tutorial-command'>Try dragging the word 'award' so that it’s the third most important word in the topic</span> behind 'music' and before 'show'.";

  this.messages[10] = "The re-ordered word is now shown with italics. If you change your mind, you can undo the operation by clicking the <span class='tutorial-element change-order-undo'>undo button</span> next to the word. Let's continue. ";

  this.messages[11] = "Now we’ve performed 3 refinements. Prior to saving, you could undo all of them by clicking the <span class='tutorial-element clear-refinements'>x button</span>. But, for now let’s update our model with these refinements. <span class='tutorial-command'>Try clicking the save button</span> now."

  this.messages[12] = "Now the algorithm is working to come up with an updated model based on your fixes. Please wait while it finishes updating.";

  this.messages[13] = "Now you can see the updated model after all of your refinements. Ok, let’s continue.";

  this.messages[14] = "You can remove documents you feel don't belong with the topic by clicking the <span class='tutorial-element remove-document'>x button</span> next to the document. <span class='tutorial-command'>Let's go to Topic 6</span> which appears to be about government and laws and <span class='tutorial-command'>try removing the fourth document about terror suspects from the topic</span>.";

  this.messages[15] = "The removed document is shown struckthrough in the document list. If you change your mind, you can undo this refinement by clicking the <span class='tutorial-element remove-doc-undo'>undo button</span> next to the document. Let's continue.";

  this.messages[16] = "Remember how we removed a word from a specific topic by clicking the <span class='tutorial-element remove-word'>x button</span> next to it? Sometimes there are words that don’t belong in any of the topics of the model. We call these trash words. For example, the words 'the' and 'is' are already on the trash words list. You can choose to add any other words to the trash words list by clicking on the word and then clicking the <span class='tutorial-element trash-can'>trash can</span>. Try adding the word 'year' to the trash words. First <span class='tutorial-command'>click Topic 3</span> and then <span class='tutorial-command'>select the word 'year'</span>. Finally, <span class='tutorial-command'>click the trash can in the top right</span>."

  this.messages[17] = "The word is now shown with a large X through it to indicate that it's been added to the trash words list. If you change your mind, you can undo this refinement by clicking the <span class='tutorial-element trash-word-undo'>undo button</span> next to the word. Remember, that if you want to remove a word just from a single topic, you click the <span class='tutorial-element remove-word'>x button</span> next to the word, and if you want to remove a word from all topics (i.e. add it to the trash word list), you click to select the word and then click the <span class='tutorial-element trash-can'>trash can</span>. Let's continue.";

  this.messages[18] = "You can merge topics in cases where multiple distinct topics are better combined into one. You perform a merge by clicking on the <span class='tutorial-element merge-button'>merge button</span> next to a topic in the list and then selecting the additional topics you’d like to merge with it. First <span class='tutorial-command'>click to select Topic 6</span> and then <span class='tutorial-command'>click the merge button next to it in the list</span>. Now, <span class='tutorial-command'>click to select Topic 5</span> to merge with it as both appear to be about government. <span class='tutorial-command'>Once you have selected the topics to merge, press the <span class='tutorial-element merge-checkmark'>checkmark</span></span>.";

  this.messages[19] = "The merged topics are now shown together in the list. If you change your mind, you can undo this refinement by clicking the <span class='tutorial-element merge-undo'>undo button</span> next to the topics in the list. Let's continue.";

  this.messages[20] = "You can split a topic in cases where a topic seems to contain more than one distinct subtopic. Let’s try splitting Topic 7 into two topics. First <span class='tutorial-command'>click to select Topic 7</span> then <span class='tutorial-command'>click the <span class='tutorial-element split-button'>split button</span> next to the topic</span>. Now you can drag words to each sub topic. <span class='tutorial-command'>Try dragging the words about music into sub topic B and leave the words more about films in sub topic A</span>. <span class='tutorial-command'>When you are done splitting the topic, press the <span class=tutorial-element split-checkmark'>checkmark</span></span>.";

  this.messages[21] = "The split topic is shown in the list. If you change your mind, you can undo this refinement by clicking the <span class='tutorial-element split-undo'>undo button</span> next to the topic in the list. Let's continue.";

  this.messages[22] = "Finally, you can add a brand new topic by <span class='tutorial-command'>clicking the <span class='tutorial-element add-topic'>+ button</span> at the bottom of the topic list</span>. Then you can add a few seed words to your new topic by typing into the <span class='tutorial-element add-word'>input area that says 'add new word'</span> and selecting the matching word from the drop-down. <span class='tutorial-command'>Try adding the words 'football', 'game', and 'sport' to your topic and then clicking the <span class='tutorial-element add-topic-checkmark'>checkmark</span></span>";

  this.messages[23] = "See how the new topic is shown near the bottom of the list with the words that you added? If you change your mind, you can undo this refinement by clicking the <span class='tutorial-element split-undo'>undo button</span> next to the topic in the list. Let's continue";

  this.messages[24] = "Now let's go ahead and <span class='tutorial-command'>save</span> the model with our specified refinements.";

  this.messages[25] = "Now the algorithm is working to come up with an updated model based on your fixes. Please wait while it finishes updating.";

  this.messages[26] = "Ok, you've now seen how all of the different refinements work in the ITM interface. Remember that the interface shows the topics with your specified the refinements; however, it’s not until you click this save button that the model actually incorporates the refinements. Make sure that you remember to press save as often as you prefer while you’re refining the model. It may take many rounds of updating before you are happy with the model."

});
