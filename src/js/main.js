import {themesList} from './themesList.js'
import {questionsList} from './questionsList.js'
import {questionElements} from './questionCardDOM.js'
const serverRespCode = 200
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
   init (arrQuestionsList, cardDom) {
      this.questionsList = arrQuestionsList
      this.questionElements = cardDom
      this.questionElements.topWrapper.classList.add ('question-app')
      this.questionElements.questionNumber.classList.add ('number')
      this.questionElements.questionText.classList.add ('question')
      this.questionElements.questionAnswers.classList.add ('answers')
      this.questionElements.questionAnswerGroup.classList.add ('answer_group')
      this.questionElements.questionButton.classList.add( 'answer-button', 'btn' , 'btn__default')
      this.questionElements.answerComment.classList.add ( 'answer-comment' )
      this.questionElements.questionControls.classList.add ('controls')
      this.questionElements.controlsNext.classList.add ('btn', 'btn__disabled', 'next')
      this.questionElements.controlsNext.innerHTML='Следующий'
      this.questionElements.controlsPrev.classList.add ('btn', 'btn__default', 'prev')
      this.questionElements.controlsPrev.innerHTML='Другая тема'
      this.questionElements.controlsPrev.href='index.html'

      this.questionElements.results.classList.add('results')
      this.questionElements.resultsHeader.innerText = "Ваш результат"

      //this.questionElements.questionButton.type = "button"
      this.questionElements.questionButton.name = "answer" 
   },
   // генрирует DOM списка ответов
   genAnswersList () {
      // Клонировать текущее дерево DOM формы ответов и очистить его содержимое
      const form = this.questionElements.questionAnswersForm.cloneNode(true)
      form.innerHTML = ''

      // На основе массива ответов сформировать новое дерево ответов
      this.questionsList[this.iterator].answers.forEach(answer => {
         const answerGroup = this.questionElements.questionAnswerGroup.cloneNode(true)
         answerGroup.innerHTML = ''
         const button = this.questionElements.questionButton.cloneNode(true)
         //const label = this.questionElements.questionLabel.cloneNode(true)

         button.id="answer_"+answer.id
         button.value = answer.id
         button.innerText = answer.wording
         //label.setAttribute('for', "answer_"+answer.id)
         //label.innerText=answer.wording
         answerGroup.appendChild ( button ) 
         //answerGroup.appendChild ( label ) 

         form.appendChild( answerGroup )
         // саобытие авбора ответа
         button.addEventListener('click', e => {
            e.preventDefault()
            // обработка выбранного ответа
            this.answerClickHandler(e.target)
         })
      })
      return form
   },
   nextQuestionHandler(){
      if ( !this.answered ) return false
      this.iterator++
      this.answered = false
      this.disableButton ( this.questionElements.controlsNext )
      this.renderNextQuestion()
   },
   answerClickHandler ( buttonNode ) {

      // деактивировать все кнопки ответов
      buttonNode.parentNode.parentNode.querySelectorAll('.answer-button').forEach(button => {
         button = this.disableButton (button)
      })
      this.answered = true
      this.checkAnswer (buttonNode)
      this.enableButton(this.questionElements.controlsNext)
   },
   checkAnswer(button) {
      button.className = button.className.replace(/btn__.*(?!\S)/, '')
      if (this.questionsList[this.iterator].correctAnswerID == button.value){
         this.score++
         button.classList.add('btn__correct')
         this.questionElements.answerComment.innerText = 'Верно '+this.questionsList[this.iterator].comment

      } else {
         button.classList.add('btn__not-correct')
         this.questionElements.answerComment.innerText = 'Не верно, правильный ответ "'+this.questionsList[this.iterator].answers[this.questionsList[this.iterator].correctAnswerID].wording+'" '+this.questionsList[this.iterator].comment
      }

   },
   disableButton (buttonNode) {
      buttonNode.className = buttonNode.className.replace(/btn__.*(?!\S)/, '')
      buttonNode.classList.add('btn__disabled')
      buttonNode.disabled = true
   },
   enableButton (buttonNode) {
      buttonNode.className = buttonNode.className.replace(/btn__.*(?!\S)/, '')
      buttonNode.classList.add('btn__default')
      buttonNode.disabled = true
   },

   // выводит DOM вопроса
   renderNextQuestion() {
      // Если список вопросов закончился - отобразить результаты
      if (this.iterator >= this.questionsList.length) {
         this.renderResult()
      }

      // Если список не закончился, вывести следующий вопрос
      if (this.iterator < this.questionsList.length) {
         const currentQuestion = this.questionsList[this.iterator]
         this.userAnswer = null // Обнулить ответ на предыдущий вопрос

         // внести номер вопроса
         this.questionElements.questionNumber.innerText = (this.iterator+1)+'/'+this.questionsList.length
         // внести текст вопроса
         this.questionElements.questionText.innerText = currentQuestion.wording

         // очистка контейнера ответов и комментария к ответу
         this.questionElements.questionAnswers.innerHTML = ''
         this.questionElements.answerComment.innerHTML = ''

         // Событие нажатия кнопки следующего ответа
         if ( !this.nextQuestionEventRegistered ){
            this.nextQuestionEventRegistered = true
            this.questionElements.controlsNext.addEventListener ('click', this.nextQuestionHandler.bind(this))
         }

         // Если вопрос последний - вывести кнопку "Результаты"
         if ( this.iterator+1 == this.questionsList.length )
            this.questionElements.controlsNext.innerText = "Результат"

         // Получить DOM списка ответов и вставить в контейнер ответов
         this.questionElements.questionAnswers.appendChild(this.genAnswersList())

         // вывести полностью сформированную карточку с вопросом
         document.querySelector('.question-app').replaceWith ( 
            this.questionElements.topWrapper 
         )
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

window.addEventListener('load', (evt) => {
   //  имитация загрузки данных
   const loadThemesList = () => new Promise( (resolve, reject) => {
      switch (serverRespCode) {
         case 200:
            setTimeout ( () => resolve( { code: serverRespCode, data: themesList } ), 300 )
         break
         case 500:
            setTimeout ( () => reject( { code: serverRespCode, data: null, msg: 'Error 500' } ), 2000 )
         break
      }
   })

   switch ( page ) {
      case 'themesList': //  страница со списком тем
         loadThemesList().then( responce => {
            app.init (responce.data)
            app.renderThemesList()
         }, error => {
            showError (error.msg)
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
