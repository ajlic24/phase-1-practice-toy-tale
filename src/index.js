let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const cardBox = document.getElementById(`toy-collection`)
  const makeElement = (el) => document.createElement(el)

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const makeCard = ({name, id, image, likes}) => {
    let div = makeElement(`div`)
    let h2 = makeElement(`h2`)
    let img = makeElement(`img`)
    let p = makeElement(`p`)
    let button = makeElement(`button`)

    div.className = `card`
    h2.textContent = name
    img.src = image
    img.className = `toy-avatar`
    p.textContent = likes
    button.className = `like-btn`
    button.id = id
    button.textContent = `like`
    button.addEventListener(`click`, () => {
      fetch(`http://localhost:3000/toys/${id}`, {
        method: `PATCH`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'likes': likes++
        })
      })
      .then(resp => resp.json())
      .then(obj => {
        p.textContent = obj.likes
      })
    })
    div.append(h2, img, p, button)  
    cardBox.appendChild(div) 
  }

  fetch(`http://localhost:3000/toys`)
  .then(resp => resp.json())
  .then(data => data.forEach(makeCard))

  document.querySelector(`.submit`).addEventListener(`click`, e => {
    const nameInput = document.getElementsByClassName(`add-toy-form`)[0][0].value
    const imgInput = document.getElementsByClassName(`add-toy-form`)[0][1].value
    e.preventDefault()
    fetch(`http://localhost:3000/toys`, {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'name': nameInput,
        'image': imgInput,
        'likes': 0
      })
    })
    .then(resp => resp.json())
    .then(data => {
      makeCard(data)
      document.getElementsByClassName(`add-toy-form`)[0].reset()
    })
  })

  
});
