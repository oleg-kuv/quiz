const Button = class {
   buttonNode = null
   handlersList = []
   defaultHandler = (event) => {event.preventDefault()}
   lastHandler = null
   className = 'btn__default'
   id = null
   value = null
   constructor (name, buttonNode = null) {
      if (buttonNode == null)
         buttonNode = document.createElement('button')
      buttonNode.innerText = name
      buttonNode.classList.add ('btn', this.className)
      this.buttonNode = buttonNode
      this.buttonNode.addEventListener('click', this.defaultHandler)
   }
   setName (name) { this.buttonNode.innerText = name }
   setID (id) { this.buttonNode.id = id; this.id = id }
   setValue ( value ) { this.buttonNode.value = value; this.value = value }
   getDOM() {return this.buttonNode}
   addClass (...classNames) {this.buttonNode.classList.add(...classNames)}
   removeClass (...classNames) {this.buttonNode.classList.remove(...classNames)}
   resetClassList () {this.buttonNode.className="btn"}
   enable () {
      this.applyActions()
      this.buttonNode.classList.remove('btn__disabled')
   }
   disable () {
      this.removeActions()
      this.buttonNode.classList.add('btn__disabled')
   }
   setAction (eventType, handler) {
      this.buttonNode.removeEventListener('click', this.defaultHandler)
      this.handlersList.push({eventType: eventType, action: handler})
      this.buttonNode.addEventListener(eventType, handler)
   }
   applyActions () {
      this.handlersList.forEach (handler => {
         this.buttonNode.addEventListener(handler.eventType, handler.action)
      })
      this.buttonNode.removeEventListener('click', this.defaultHandler)
   }
   removeActions () {
      this.handlersList.forEach (handler => {
         this.buttonNode.removeEventListener(handler.eventType, handler.action)
         this.buttonNode.addEventListener('click', this.defaultHandler)
      })
   }
   remove () {this.buttonNode.remove()}
}
const AnswerButton = class extends Button {
   correctAnswer () { 
      this.resetClassList()
      this.addClass('btn__correct')
   }
   notCorrectAnswer () {
      this.resetClassList()
      this.addClass('btn__not-correct')
   }

}

export {Button, AnswerButton}
