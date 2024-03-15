document.addEventListener("DOMContentLoaded", function() {
  const convertBtn = document.querySelector(".convert-button");
  const URLinput = document.querySelector(".URL-input");
  const linkContainer = document.querySelector(".linkContainer");
  const mediaElement = document.querySelector("video");

  convertBtn.addEventListener("click", () => {
      sendURL(URLinput.value);
  });

  function sendURL(URL) {
      const options = {
          method: "GET",
          headers: {
              accept: "application/json",
          },
      };

      fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${URL}&key=AIzaSyDUc-1UU8CUbbMIUAw0UslCbJXIUgHnfkc`,
          options
      )
          .then((response) => response.json())
          .then((data) => {
              console.log(data.items);
              links(data.items);
          })
          .catch((error) => console.error("Error:", error));
  }

  function links(linkId) {
      linkContainer.innerHTML = "";

      linkId.forEach((links) => {
          if (links.id.videoId) {
              const yt_link = `https://www.youtube.com/watch?v=${links.id.videoId}`;
              const title = links.snippet.title;
              const link = `
                  <div class="card">
                      <a href="${yt_link}" target="_blank">
                          <div class="cardConatiner">
                              <img src="${links.snippet.thumbnails.high.url}" alt="image">
                              <p>${title}</p>
                          </div>
                      </a>
                      <button class="btn_stream" data-ytlink="${yt_link}" data-title="${title}">Stream</button>
                  </div>`;
              linkContainer.innerHTML += link;
          }
      });

      // Add event listeners after adding elements to the DOM
      const streamButtons = document.querySelectorAll('.btn_stream');

      streamButtons.forEach(btn => {
          btn.addEventListener("click", () => {
              const yt_link = btn.getAttribute('data-ytlink');
              const title = btn.getAttribute('data-title');
              console.log("ytlink:", yt_link);
              streamAudio(yt_link, title); // Call streamAudio function
          });
      });
  }

  function streamAudio(URL, title) {
      mediaElement.src = `http://localhost:4000/stream?URL=${URL}&title=${encodeURIComponent(title)}`; // Set the src attribute of the <video> element to the streaming URL
      mediaElement.play(); // Play the audio stream
  }
});
