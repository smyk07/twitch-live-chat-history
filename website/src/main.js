const list = document.getElementById("contributors-list");

window.onload = async function getList() {
  const data = await fetch(
    "https://api.github.com/repos/samyakbambole/twitch-live-chat-history/contributors"
  );
  const json = await data.json();
  displayList(json);
};

function displayList(obj) {
  for (let i of obj) {
    list.innerHTML += `
               <div>
                    <figure>
                         <img src="${i.avatar_url}" alt="${i.login} avatar" class="avatar" />
                         <figcaption><a href="${i.html_url}" target="_blank">${i.login}</a></figcaption>
                   </figure>
               </div>
               `;
  }
}
