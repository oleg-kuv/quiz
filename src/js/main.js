import {themesList} from './themesList.js'
import {questionsList} from './questionsList.js'
import {questionElements} from './questionCardDOM.js'
import * as Controls from './controls.js'
import {QuestionCard} from './classQuestionCard.js'
/*const questionCard = new QuestionCard
window.questionCard = questionCard
questionCard.countAnswers = 12
questionCard.numberAnswer = 0
questionCard.questionText = 'Question text'
questionCard.addAnswer ('ans1', 0)
questionCard.addAnswer ('ans2', 1)
questionCard.addAnswer ('ans3', 2)
*/
const serverRespCode = 200
/*const myBtn = new Button ('Кнопка')
window.myBtn = myBtn 
document.querySelector('body').appendChild(myBtn.getDOM())
*/
const app = {
   themesList: null,
   init ( arrThemesList ) {
      this.themesList = arrThemesList
   },
   // Сгенерировать DOM карточки
   genItem (title, href, imgSrc) {
      // создание элеметов карточки
      const itemObj = document.createElement('div') 
      itemObj.classList.add ('themes__item', 'item')

      const linkObj = document.createElement('a')
      linkObj.href=href
      
      const itemInnerObj = document.createElement('div')
      itemInnerObj.classList.add('item__inner') 

      const itemImgWrapper = document.createElement('div')
      itemImgWrapper.classList.add('item__image')
      
      const itemImg = document.createElement('img')
      itemImg.setAttribute('src', imgSrc)

      const itemDescObj = document.createElement('div')
      itemDescObj.classList.add('item__desc')

      const itemTitleObj = document.createElement('h2')
      itemTitleObj.innerHTML = title
      
      // компоновка
      itemObj.appendChild(linkObj)
      linkObj.appendChild(itemInnerObj)
      itemInnerObj.appendChild(itemImgWrapper)
      itemImgWrapper.appendChild(itemImg)
      itemInnerObj.appendChild(itemDescObj)
      itemDescObj.appendChild(itemTitleObj)

      linkObj.addEventListener('click', evt => {
         //evt.preventDefault()
         //history.pushState(null, null, href);
      })

      return itemObj
   },

   // Сгенерировать DOM списка карточек
   genList() {
      const listObj = document.createElement('div')
      listObj.classList.add('themes')
      this.themesList.forEach( item => {
         listObj.appendChild(this.genItem(item.name, 'questions.html?id='+item.id, item.imageSrc))
      } )

      return listObj
   },
   // Вывести карточки тем
   renderThemesList () {
      document.querySelector('.themes').replaceWith(this.genList())
   }
}

const questionsApp = {
   iterator: 0,
   score: 0,
   answered: false,
   nextQuestionEventRegistered: false,
   questionsList: [],
   questionElements: {},
   answersButtons: {},
   nextButton: null,
   questionCardsList: [],
   init (arrQuestionsList) {
      arrQuestionsList.forEach( (question, i) => {
         const questionCard = new QuestionCard (arrQuestionsList.length)

         questionCard.numberAnswer = i+1
         questionCard.questionText = question.wording
         questionCard.answerAnnotation = ''
         questionCard.trueAnswerID = question.correctAnswerID
         // Добавление кнопок ответа
         question.answers.forEach (answer => {
            // Добавление кнопки и события при выборе ответа
            questionCard.addAnswer(answer.wording, answer.id, e => {
               e.preventDefault()
               const userAnswer = e.target.value
               questionCard.userAnswer = userAnswer 

               // Деактивировать все кнопки ответа
               questionCard.answerList.forEach( answerButton => answerButton.disable())

               // Отметить выбранный ответ как правильный/неправильный
               this.checkAnswer(questionCard, question.comment)

               // Активировать  кнопкку Далее
               questionCard.nextButton.enable()
               questionCard.nextButton.setAction('click', e => this.renderNextQuestion( ) )
            })

         })

         this.questionCardsList.push(questionCard)
      } )
      window.myQuestionList = this.questionCardsList
   },
   checkAnswer(questionCard, comment) {
      const correctAnswerText = questionCard.answerList[questionCard.trueAnswerID].buttonNode.textContent
      if (questionCard.userAnswer == questionCard.trueAnswerID){
         questionCard.answerList[questionCard.userAnswer].correctAnswer()
         questionCard.answerAnnotation = 'Верно' + comment
         this.score++
      } else {
         questionCard.answerList[questionCard.userAnswer].notCorrectAnswer()
         questionCard.answerAnnotation = 'Неверно, правильный ответ "' + correctAnswerText + '"' + comment
      }
   },

   // выводит DOM вопроса
   renderNextQuestion() {
      // Если список не закончился, вывести следующий вопрос
      console.log ( this.iterator, this.questionCardsList.length, this.iterator < this.questionCardsList.length )
      if (this.iterator < this.questionCardsList.length) {
         const questionCard = this.questionCardsList[this.iterator]

         // Если вопрос последний - вывести кнопку "Результаты"
         //if ( this.iterator+1 == this.questionCardsList.length )
         //   this.questionElements.controlsNext.innerText = "Результат"

         // вывести полностью сформированную карточку с вопросом
         document.querySelector('.question-app').replaceWith (questionCard.getDOM()) 
         this.iterator++
      } else {
         console.log (this.score)
         const resultCard = new QuestionCard ()
         resultCard.score = Math.floor( ( this.score * 100 ) / this.questionCardsList.length )+'% правильных ответов'
         document.querySelector('.question-app').replaceWith (resultCard.getResultsDOM()) 
      }
   },

   renderResult() {
      this.questionElements.questionNumber.replaceWith(this.questionElements.results)
      this.questionElements.resultsPersent.innerHTML = Math.floor( ( this.score * 100 ) / this.questionsList.length )+'% правильных ответов'
      this.questionElements.questionText.remove()
      this.questionElements.answerComment.remove()
      this.questionElements.questionAnswers.remove()
      this.questionElements.controlsNext.remove()
      this.questionElements.controlsPrev.innerText = 'Пройти опрос заново'
      document.querySelector('.question-app').replaceWith ( this.questionElements.topWrapper )
   },
}

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`)
window.addEventListener('resize', () => {
})

const showError = errMsg => {
   console.error ( errMsg )
   document.querySelector( '.main' ).innerText = errMsg
}


window.addEventListener('load', (evt) => {
   window.myButtons = {}
   //  имитация загрузки данных
   const loadThemesList = () => new Promise( (resolve, reject) => {
      if ( serverRespCode == 200 )
         setTimeout ( () => resolve( { code: serverRespCode, data: themesList } ), 700 )
      else
         setTimeout ( () => reject( new Error ( serverRespCode ) ), 2000 )
   })

   switch ( page ) {
      case 'themesList': //  страница со списком тем
         loadThemesList().then( responce => {
            app.init (responce.data)
            app.renderThemesList()
         }).catch( error => {
            showError(error)
         })
      break
      case 'questions': // страница вопросов
         const url = new URLSearchParams(window.location.search)
         const themeID = url.get('id')
         const currentThemeQuestions = JSON.parse(questionsList)
         questionsApp.init(currentThemeQuestions[themeID], questionElements)
         setTimeout ( () => questionsApp.renderNextQuestion(), 700 )
         
      break
   }
})
