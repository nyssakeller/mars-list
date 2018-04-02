const fetchItems = async() => {
  const response = await fetch('/api/v1/items_to_pack');
  const items = await response.json();
  renderItems(items);
}

const renderItems = items => {
  items.forEach(item => {
    $('.card-container').prepend(`
      <div class='card'>
        <section class='card-header' id=${item.id}>
          <h2>${item.item_name}</h2>
          <button class='delete-btn'>Delete</button>
        </section>
        <form class='checkbox-form'>
          <input id='checkbox'
                 type='checkbox' />
          <p>Packed</p>
        </form>
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

const deleteItem = async e => {
  const id = e.target.parentElement.id
  if (e.target.classList.contains('delete-btn')) {
    await fetch(`/api/v1/items_to_pack/${id}`, {
      method: 'DELETE'
    }) 
  }
}

const checkItem = (e) => {
  console.log(e.target)
}

$('.card-container').on('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    deleteItem(e);
  } else if (e.target.classList.contains('checkbox')) {
    checkItem(e);
  }
});

$(document).ready(fetchItems());
$('.submit').on('click', e => {
  e.preventDefault();
  postItems(e);
});

