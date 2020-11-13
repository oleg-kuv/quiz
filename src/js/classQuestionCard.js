import {questionsList} from './questionsList.js'
import * as Controls from './controls.js'
const QuestionCard = class {

   answerList = []
   nextButton = new Controls.Button ('Далее')
   nextButtonClickHandler = null
   goToTemes = new Controls.Button ('Другая тема')
   constructor ( countAnswers = 0 ) {
      this.countAnswers = countAnswers
      this.nextButton.disable()
      this.goToTemes.setAction('click', e => window.location.href='/')
   }
   set countAnswers ( value ) { this._countAnswers = value }
   get countAnswers() {return this._countAnswers}
   set numberAnswer (value) {
      if ( typeof ( this.numberAnswer ) === 'undefined' || !(this.numberAnswer instanceof HTMLElement))
         this._numberAnswer = document.createElement('div')

      this._numberAnswer.classList.add ('number')
      this._numberAnswer.innerText = value + '/' + this.countAnswers
   }
   get numberAnswer() {return this._numberAnswer}

   set questionText (text)  {
      if ( typeof ( this.questionText ) === 'undefined' || !(this.questionText instanceof HTMLElement))
         this._questionText = document.createElement('div')

      this._questionText.classList.add ('question')
      this._questionText.innerText = text
   }
   get questionText() {return this._questionText}
   
   set trueAnswerID(value)  {this._trueAnswerID = value}
   get trueAnswerID() {return this._trueAnswerID}

   set answerAnnotation(text) {
      if ( typeof ( this.answerAnnotation ) === 'undefined' || !(this.answerAnnotation instanceof HTMLElement))
         this._answerAnnotation = document.createElement('div')
      this._answerAnnotation.classList.add ('answer-comment')
      this._answerAnnotation.innerText = text
   }
   get answerAnnotation() {return this._answerAnnotation}

   set userAnswer (value)   {this._userAnswer = value}
   get userAnswer() {return this._userAnswer}

   set score (score) {
      if ( typeof ( this.score ) === 'undefined' || !(this.score instanceof HTMLElement))
         this._score = document.createElement ('div')
      this._score.innerText = score 
   }
   get score () {return this._score}

   addAnswer (answerText, answerID, handler) {
      const answerButton = new Controls.AnswerButton (answerText)
      answerButton.setID("answer_"+answerID)
      answerButton.setValue(answerID)
      answerButton.setAction('click', handler)
      this.answerList.push (answerButton)
   }
   getAndwersListDOM () {
      const answersDOM = document.createElement('div')
      answersDOM.classList.add('answers')

      const formDOM = document.createElement('form')
      answersDOM.appendChild(formDOM)

      this.answerList.forEach(button => {
         formDOM.appendChild(button.getDOM())}
      )

      return answersDOM
   }
   getControlsDOM () {
      const controls = document.createElement('div')
      controls.classList.add('controls')

      controls.appendChild(this.goToTemes.getDOM())

      controls.appendChild(this.nextButton.getDOM())

      return controls
   }

   getDOM () {
      const questionDom = document.createElement('div')
      questionDom.classList.add ('question-app')

      questionDom.appendChild(this.numberAnswer)
      questionDom.appendChild(this.questionText)
      questionDom.appendChild(this.getAndwersListDOM())
      questionDom.appendChild(this.answerAnnotation)
      questionDom.appendChild(this.getControlsDOM())


      return questionDom
   }

   getResultsDOM () {
      const resultDOM = document.createElement( 'div' )
      resultDOM.classList.add ('question-app')

      const header = document.createElement('h1')
      header.innerText = 'Ваш результат'
      resultDOM.appendChild(header)

      resultDOM.appendChild(this.score)
      resultDOM.appendChild(this.getControlsDOM())
      this.goToTemes.setName = 'Пройти опрос еще раз'
      this.nextButton.disable()

      return resultDOM
   }
}

export {QuestionCard}
