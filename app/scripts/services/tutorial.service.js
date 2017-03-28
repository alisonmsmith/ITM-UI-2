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

  this.messages[1] = "The 10 topics are listed on the left panel, each represented by their first three words. Clicking on any of these topics, shows the full topic on the right. The first topic is automatically selected, and you can see the top 20 words associated with the topic and the top 20 documents that contain the topic.";

  this.messages[2] = "You can click the ‘show more’ button for each of the documents to view the full document text. If you hover over one of the topic words, that word is shown as it appears in the documents. You can also click on a topic word so that it will remain highlighted as you scroll through the documents. Remember, though, that you’re only seeing a few of the many documents that are associated with this topic, because there are 2,225 documents total.";

  this.messages[3] = "Topic models are not always perfect. Sometimes we find issues like words or documents that don’t make sense with the rest of the topic or see places where some words might be missing. We might even find that a topic seems like it’s talking about two distinct things or that multiple topics seem to be talking about the same thing.";

  this.messages[4] = "To fix these problems, the interface lets you make changes to the model. Let’s walk through each of the ways you can update the topics. Please click on Topic 7 which appears to be a topic about films and music. These 20 words provide the meaning of the topic.";

  this.messages[5] = "You can add words you feel are missing from the topic by clicking in the input area that says “add word” and typing a word then pressing enter. Try adding the word 'Oscar' to this topic."

  this.messages[6] = "See how the new word is shown in the topic words list? Don’t do so now, but if you change your mind, you can undo this operation by clicking the undo button next to the word. Also, refinements are not immediately incorporated into the model. It’s not until you click the save button that the model actually incorporates the refinements. Don’t do so now, but you can click the save button after each refinement or after multiple refinements if you’d prefer. Let’s continue.";

  this.messages[7] = "You can remove words you feel don’t belong in the topic by clicking the x button next to the word. Try removing the word 'including' from this topic.";

  this.messages[8] = "See how the word is shown crossed out in the topic words list? Don’t do so now, but you can undo this operation by clicking the undo button next to the word.";

  this.messages[9] = "You can change a  word’s order to make a word more or less important to the topic, by dragging it. Try moving the word 'award' so that it’s the third most important word in the topic behind 'music' and before 'show'.";

  this.messages[10] = "The re-ordered word is now shown with italics. Don’t do so now, but you can undo the operation by clicking the undo button next to the word. ";

});
