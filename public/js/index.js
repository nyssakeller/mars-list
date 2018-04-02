const fetchItems = async() => {
  const response = await fetch('/api/v1/items_to_pack');
  const items = await response.json();
  renderItems(items);
}

const renderItems = items => {
  items.forEach(item => {
    $('.card-container').prepend(`
      <div class='card'>
        <h1>${item.item_name}</h1>
        <button>Delete</button>
        <input type='checkbox' />
      </div>
    `)
  })
}

$(document).ready(fetchItems())
$('button').on('click', e => {
  e.preventDefault();
  const newItem = $('input').val();
})
