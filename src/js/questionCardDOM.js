const questionElements = {
      topWrapper: document.createElement ('div'),
      questionNumber: document.createElement ('div'),
      questionText: document.createElement ('div'),
      questionAnswers: document.createElement ('div'),
         questionAnswersForm: document.createElement ('form'),
            questionAnswerGroup: document.createElement ('div'),
               questionButton: document.createElement ('button'),
               //questionLabel: document.createElement ('label'),
      results: document.createElement('div'),
         resultsHeader: document.createElement('h1'),
         resultsPersent: document.createElement('div'),
      answerComment: document.createElement ('div'),
      questionControls: document.createElement ('div'),
         controlsPrev: document.createElement ('a'),
         controlsNext: document.createElement ('a'),
      
}
// Компоновка элементов
questionElements.topWrapper.appendChild(questionElements.questionNumber)
questionElements.topWrapper.appendChild(questionElements.questionText)
questionElements.topWrapper.appendChild(questionElements.questionAnswers)
   questionElements.questionAnswers.appendChild(questionElements.questionAnswersForm)
      questionElements.questionAnswersForm.appendChild(questionElements.questionAnswerGroup)
         //questionElements.questionAnswerGroup.appendChild(questionElements.questionButton)
         //questionElements.questionAnswerGroup.appendChild(questionElements.questionLabel)
questionElements.topWrapper.appendChild(questionElements.answerComment)
questionElements.topWrapper.appendChild(questionElements.questionControls)
   questionElements.questionControls.appendChild(questionElements.controlsPrev)
   questionElements.questionControls.appendChild(questionElements.controlsNext)


questionElements.results.appendChild(questionElements.resultsHeader)
questionElements.results.appendChild(questionElements.resultsPersent)
export {questionElements}
