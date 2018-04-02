const fetchItems = async() => {
  const response = await fetch('/api/v1/items_to_pack');
  const items = await response.json();
  renderItems(items);
}

const renderItems = items => {
  items.forEach(item => {
    $('.card-container').prepend(`
      <div class='card'>
        <section class='card-header'>
          <h2>${item.item_name}</h2>
          <button class='delete-btn'>Delete</button>
        </section>
        <input type='checkbox' />
      </div>
    `)
  })
}

const postItems = async(e) => {
  const itemInput = $('input').val();
  const postItem = await fetch('/api/v1/items_to_pack', {
    method: 'POST',
    body: JSON.stringify({ item_name: itemInput}), 
    headers: new Headers({ 'Content-Type': 'application/json' })
  })
  const newItem = await postItem.json();
  await renderItems([newItem]);
}

$(document).ready(fetchItems())
$('button').on('click', e => {
  e.preventDefault();
  postItems(e);
})
