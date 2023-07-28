import { dataFilter } from '../routingUtils.js'

let stringsArray = [
  'THE PLACE OF TRANSFORMATION',
  '72<sup>nd</sup> IN OVERALL NIRF RANKING',
  '46<sup>th</sup> IN ENGINEERING NIRF',
]

const mainSliderText = document.getElementById('main-slider-text')
let currentIndex = 0
let isPaused = false
let currentElementInside = null
let animationTimeout = null

function animateText(stringsArray) {
  if (isPaused) return
  const currentString = stringsArray[currentIndex]
  const newH2 = document.createElement('a')
  newH2.innerHTML = currentString[0]
  newH2.classList.add('enter-animation')
  newH2.href = `/template/index.html?id=${currentString[1]}?category=initiative`
  newH2.target = '_blank'
  mainSliderText.innerHTML = newH2.outerHTML

  currentElementInside = mainSliderText.childNodes[0]

  animationTimeout = setTimeout(() => {
    if (currentElementInside) {
      currentElementInside.classList.remove('enter-animation')
    }
    currentElementInside.classList.add('exit-animation')

    currentElementInside.addEventListener(
      'animationend',
      function () {
        currentElementInside.remove()

        currentIndex = (currentIndex + 1) % stringsArray.length

        animateText(stringsArray)
      },
      { once: true }
    )
  }, 2200)
}

fetch('/api/initiative')
  .then((res) => res.json())
  .then((data) => {
    data = dataFilter(data)
    stringsArray = data.map((item) => [item.title, item._id])
    console.log(stringsArray)
    animateText(stringsArray)
    mainSliderText.addEventListener('mouseenter', () => {
      isPaused = true
      clearTimeout(animationTimeout)
      currentElementInside.classList.remove('exit-animation')
      console.log('stopping animation')
    })

    mainSliderText.addEventListener('mouseleave', () => {
      isPaused = false
      animateText(stringsArray)
    })
  })
  .catch((err) => {
    console.log(err)
    animateText(stringsArray)
  })
